import assert from 'node:assert/strict'
import test from 'node:test'

import {
  clauseRule,
  parseLocationRefs,
  supplementalFindingsForRule,
  supplementalRetentionRules,
  uncoveredKnownTruePositives,
  validateAnalysisRecords,
} from './external-corpus-retention.mjs'

const rules = new Set(['duplicate-test', 'subsumed-test'])
const entries = [
  'src/cart.test.ts:5 and :15 are a strict subset (subsumed-test, similar-uncertain)',
  'src/user.test.ts:9 and :13 are identical (duplicate-test, redundant)',
]
const defaultFindings = [
  {
    rule: 'duplicate-test',
    locations: [
      { path: '/repo/src/user.test.ts', line: 9 },
      { path: '/repo/src/user.test.ts', line: 13 },
    ],
  },
]

test('a missing off-rule entry selects one targeted supplemental run', () => {
  const missing = uncoveredKnownTruePositives(entries, defaultFindings, rules)
  assert.deepEqual(missing, [entries[0]])
  assert.deepEqual(supplementalRetentionRules(missing), ['subsumed-test'])
})

test('a missing default-enabled rule is never retried with an override', () => {
  assert.deepEqual(supplementalRetentionRules([entries[1]]), [])
})

test('supplemental findings cover the off-rule entry without changing default findings', () => {
  const supplemental = [
    {
      rule: 'subsumed-test',
      locations: [
        { path: '/repo/src/cart.test.ts', line: 5 },
        { path: '/repo/src/cart.test.ts', line: 15 },
      ],
    },
  ]
  assert.deepEqual(uncoveredKnownTruePositives([entries[0]], supplemental, rules), [])
  assert.equal(defaultFindings.length, 1)
})

test('an interior line does not stand in for the finding declaration location', () => {
  const wrongLine = 'src/cart.test.ts:6 and :16 are a strict subset (subsumed-test, similar-uncertain)'
  assert.deepEqual(
    uncoveredKnownTruePositives(
      [wrongLine],
      [
        {
          rule: 'subsumed-test',
          locations: [
            { path: '/repo/src/cart.test.ts', line: 5 },
            { path: '/repo/src/cart.test.ts', line: 15 },
          ],
        },
      ],
      rules,
    ),
    [wrongLine],
  )
})

test('an unknown rule clause is rejected instead of retried or ignored', () => {
  assert.throws(
    () => uncoveredKnownTruePositives(['src/cart.test.ts:5 and :15 (imaginary-rule, redundant)'], [], rules),
    /does not implement/,
  )
})

test('a filename suffix without a path-component boundary does not cover the reference', () => {
  const entry = 'cart.test.ts:5 is retained (subsumed-test, similar-uncertain)'
  assert.deepEqual(
    uncoveredKnownTruePositives(
      [entry],
      [{ rule: 'subsumed-test', locations: [{ path: '/repo/src/notcart.test.ts', line: 5 }] }],
      rules,
    ),
    [entry],
  )
})

test('a malformed later reference is rejected instead of silently checking the first', () => {
  assert.throws(
    () =>
      uncoveredKnownTruePositives(
        ['src/cart.test.ts:5 and :oops are a strict subset (subsumed-test, similar-uncertain)'],
        [],
        rules,
      ),
    /malformed location reference/,
  )
})

test('a parenthesized later path remains part of the required finding', () => {
  const entry =
    'src/cart.test.ts:5 and (src/user.test.ts:13) are a strict subset (subsumed-test, similar-uncertain)'
  const firstLocationOnly = [
    { rule: 'subsumed-test', locations: [{ path: '/repo/src/cart.test.ts', line: 5 }] },
  ]
  assert.deepEqual(uncoveredKnownTruePositives([entry], firstLocationOnly, rules), [entry])
  assert.deepEqual(
    uncoveredKnownTruePositives(
      [entry],
      [
        {
          rule: 'subsumed-test',
          locations: [
            { path: '/repo/src/cart.test.ts', line: 5 },
            { path: '/repo/src/user.test.ts', line: 13 },
          ],
        },
      ],
      rules,
    ),
    [],
  )
})

test('a wrapped same-path line remains part of the required finding', () => {
  const entry = 'src/cart.test.ts:5 and (:15) are a strict subset (subsumed-test, similar-uncertain)'
  const firstLocationOnly = [
    { rule: 'subsumed-test', locations: [{ path: '/repo/src/cart.test.ts', line: 5 }] },
  ]
  assert.deepEqual(uncoveredKnownTruePositives([entry], firstLocationOnly, rules), [entry])
  assert.deepEqual(
    uncoveredKnownTruePositives(
      [entry],
      [
        {
          rule: 'subsumed-test',
          locations: [
            { path: '/repo/src/cart.test.ts', line: 5 },
            { path: '/repo/src/cart.test.ts', line: 15 },
          ],
        },
      ],
      rules,
    ),
    [],
  )
})

test('wrapped shorthand is rejected when malformed or missing a preceding path', () => {
  assert.throws(
    () => uncoveredKnownTruePositives(['src/cart.test.ts:5 and (:oops)'], [], rules),
    /malformed location reference/,
  )
  assert.throws(
    () => uncoveredKnownTruePositives(['(:15) then src/cart.test.ts:5'], [], rules),
    /no preceding path/,
  )
})

test('a bare colon after a path is rejected as an incomplete location reference', () => {
  assert.throws(
    () =>
      uncoveredKnownTruePositives(
        ['src/cart.test.ts:5 and : (subsumed-test, similar-uncertain)'],
        [],
        rules,
      ),
    /malformed location reference/,
  )
})

test('a trailing clause accepts prose punctuation but rejects malformed clause syntax', () => {
  assert.equal(clauseRule('src/cart.test.ts:5 (subsumed-test, similar-uncertain).'), 'subsumed-test')
  assert.equal(clauseRule('src/cart.test.ts:5 verified manually (upstream behavior).'), undefined)
  assert.equal(
    clauseRule('src/cart.test.ts:5 verified manually (manual review, not analyzed).'),
    undefined,
  )
  assert.throws(
    () => clauseRule('src/cart.test.ts:5 (subsumed-test similar-uncertain).'),
    /malformed trailing rule clause/,
  )
  assert.throws(
    () => clauseRule('src/cart.test.ts:5 (subsumed-test,similar-uncertain).'),
    /malformed trailing rule clause/,
  )
  assert.throws(
    () => clauseRule('src/cart.test.ts:5 (subsumed-test, similar uncertain).'),
    /malformed trailing rule clause/,
  )
})

test('location grammar accepts punctuation and wrapping but rejects ranges and zero lines', () => {
  const accepted = [
    [
      'packages/@scope/[feature]+cart.test.ts:12',
      [{ path: 'packages/@scope/[feature]+cart.test.ts', line: 12 }],
    ],
    [
      '(src/cart.test.ts:5), then (:15).',
      [
        { path: 'src/cart.test.ts', line: 5 },
        { path: 'src/cart.test.ts', line: 15 },
      ],
    ],
    ['src\\windows\\cart.test.ts:7', [{ path: 'src\\windows\\cart.test.ts', line: 7 }]],
  ]
  for (const [text, expected] of accepted) assert.deepEqual(parseLocationRefs(text), expected, text)

  for (const text of ['src/cart.test.ts:5-10', 'src/cart.test.ts:0', ':5-10']) {
    assert.throws(() => parseLocationRefs(text), /malformed location reference/, text)
  }
})

test('path comparison normalizes separators and leading dot without weakening boundaries', () => {
  const entry = './src\\cart.test.ts:5 (subsumed-test, similar-uncertain)'
  assert.deepEqual(
    uncoveredKnownTruePositives(
      [entry],
      [{ rule: 'subsumed-test', locations: [{ path: '/repo/src/cart.test.ts', line: 5 }] }],
      rules,
    ),
    [],
  )
})

const validSummary = {
  type: 'summary',
  incomplete: false,
  testsAnalyzed: 1,
  filesAnalyzed: 1,
  errors: 0,
  warnings: 1,
  unresolvedTests: 0,
  incompleteCauses: { filesGlobalsUndetermined: 0 },
}

test('default and supplemental record validation share one successful summary contract', () => {
  const wanted = { type: 'finding', rule: 'subsumed-test', locations: [] }
  const other = { type: 'finding', rule: 'duplicate-test', locations: [] }
  const records = [wanted, other, validSummary]
  assert.deepEqual(validateAnalysisRecords(records), {
    summary: validSummary,
    findings: [wanted, other],
  })
  assert.deepEqual(supplementalFindingsForRule(records, 'subsumed-test'), [wanted])
})

test('a broken supplemental retry cannot supply findings without a valid summary', () => {
  const finding = { type: 'finding', rule: 'subsumed-test', locations: [] }
  const invalidRuns = [
    [finding],
    [finding, validSummary, validSummary],
    [finding, { ...validSummary, incomplete: 'false' }],
    [finding, { ...validSummary, incomplete: true }],
    [finding, { ...validSummary, testsAnalyzed: -1 }],
    [finding, { ...validSummary, incompleteCauses: {} }],
  ]
  for (const records of invalidRuns) {
    assert.throws(
      () => supplementalFindingsForRule(records, 'subsumed-test'),
      /summary|expected exactly one/,
    )
  }
})
