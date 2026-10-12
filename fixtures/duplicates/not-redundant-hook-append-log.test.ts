// OBSERVED IN REAL CODE: a public test framework's own UI fixtures -- nested `beforeAll` hooks
// that each `console.log('beforeAll')`, in a fixture tree whose console OUTPUT IS THE ARTIFACT
// (the harness snapshots what was printed). An append is not idempotent: the second log line is
// an observable difference, not a wasted repeat. `redundant-hook` links these hooks today (S5,
// 0/10 precision), so the expectation is pending until the idempotence fix lands. Named
// weakening: replace `console.log('beforeAll')` with `setLevel('info')` (an idempotent config
// write) in BOTH hooks and the finding returns -- shipped as
// redundant-hook-pure-config-twin.test.ts.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical, so idempotence is a property of the one shared body rather than a relation between participants -- no dimension could fail (D1); the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L16 "beforeAll"
// @vitest-dedup:participant L25 "beforeAll"
import { describe, it, expect, beforeAll } from 'vitest'

beforeAll(() => {
  console.log('beforeAll')
})

it('writes the banner once', () => {
  expect(logLines()).toEqual(['beforeAll'])
})

describe('nested', () => {
  beforeAll(() => {
    console.log('beforeAll')
  })

  it('writes the banner twice', () => {
    expect(logLines()).toEqual(['beforeAll', 'beforeAll'])
  })
})
