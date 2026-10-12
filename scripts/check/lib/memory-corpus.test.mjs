// The corpus generator's two claims, made executable.
//
// **Determinism**, because the bytes-per-test ratchet is only a measurement if its denominator is
// fixed. The gates pin `digest`, so this asserts the property the pin relies on rather than
// re-asserting the pin.
//
// **The mix**, because the header makes specific claims about what the corpus contains -- nesting,
// hooks, `vi.mock`, `.each` rows, a long body tail, four title forms, modifiers, repeated bodies
// -- and every one of them is a template that could silently stop firing. A weight edited to zero,
// or a `random() < 0.12` that became `< 0.012`, would still produce a valid corpus, still produce
// a stable digest, and still produce a plausible bytes-per-test number measured over a corpus that
// no longer resembles the thing it claims to model. Nothing else in this repository would notice.
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import * as fs from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { CORPUS_SCALES, DEFAULT_SEED, corpusRoot, generateCorpus } from './memory-corpus.mjs'

const work = mkdtempSync(join(tmpdir(), 'vitest-dedup-corpus-test-'))
after(() => rmSync(work, { recursive: true, force: true }))

const at = (name) => join(work, name)

/** Every generated test file's text, concatenated, for the mix assertions below. */
function sources(root) {
  return fs
    .globSync('packages/**/*.test.ts', { cwd: root })
    .sort()
    .map((path) => readFileSync(join(root, path), 'utf8'))
}

test('the same seed and size produce a byte-identical tree', () => {
  const first = generateCorpus({ root: at('a'), tests: 800 })
  const second = generateCorpus({ root: at('b'), tests: 800 })
  assert.equal(first.digest, second.digest)
  assert.equal(first.files, second.files)
  assert.equal(first.bytes, second.bytes)
  // The digest must be over content, not just counts: two trees agreeing on file and byte counts
  // while differing in content is exactly what a content hash is for.
  assert.deepEqual(sources(at('a')), sources(at('b')))
})

test('a different seed produces a different tree, or the seed is not doing anything', () => {
  const seeded = generateCorpus({ root: at('c'), tests: 800, seed: DEFAULT_SEED + 1 })
  assert.notEqual(seeded.digest, generateCorpus({ root: at('d'), tests: 800 }).digest)
})

test('the pinned digests still describe what the generator produces', () => {
  // The gates assert this too, but only with a release binary available. Here it is a plain unit
  // test, so a generator change that moves the corpus is caught by `npm test` rather than by a
  // CI job that needs cargo.
  for (const [scale, pinned] of Object.entries(CORPUS_SCALES)) {
    if (Number(scale) > 1_000) continue // 10k and 100k are too slow for a unit test; the gates pin them.
    const corpus = generateCorpus({ root: at(`pin-${scale}`), tests: Number(scale) })
    assert.equal(corpus.digest, pinned.digest, `the ${scale}-test corpus moved`)
  }
})

test('the requested test count is produced exactly, including .each rows', () => {
  // `.each` rows are separate test cases sharing one declaration, so a generator that counted
  // declarations would overshoot -- and the gate asserts `testsAnalyzed` as an EQUALITY.
  for (const tests of [1, 7, 64, 500]) {
    const corpus = generateCorpus({ root: at(`n-${tests}`), tests })
    assert.equal(corpus.tests, tests)
    assert.ok(corpus.files > 0)
  }
})

test('the corpus contains the mix its header claims', () => {
  generateCorpus({ root: at('mix'), tests: 4_000 })
  const text = sources(at('mix')).join('\n')
  const count = (pattern) => (text.match(pattern) ?? []).length

  const present = {
    'nested describes': count(/^\s*describe\(/gm),
    'depth-3 nesting': count(/^ {4}describe\(/gm),
    'beforeEach hooks': count(/\bbeforeEach\(/g),
    'afterEach hooks': count(/\bafterEach\(/g),
    'beforeAll hooks': count(/\bbeforeAll\(/g),
    'afterAll hooks': count(/\bafterAll\(/g),
    'vi.mock with a factory': count(/vi\.mock\('[^']+', \(\) => \(\{/g),
    'bare vi.mock': count(/vi\.mock\('[^']+'\)/g),
    'test.each tables': count(/test\.each\(\[/g),
    'test.for tables': count(/test\.for\(\[/g),
    '.skip': count(/\btest\.skip\(/g),
    '.todo': count(/\btest\.todo\(/g),
    '.concurrent': count(/\btest\.concurrent\(/g),
    'template-literal titles': count(/test[^(]*\(`/g),
    'concatenated titles': count(/\('[^']*' \+ '/g),
    'printf titles': count(/handles %s for case/g),
  }
  for (const [what, found] of Object.entries(present)) {
    assert.ok(found > 0, `the corpus contains no ${what}; that part of the mix stopped firing`)
  }

  // The body-size tail, which is the part a mean would hide: the largest body must be several
  // times the smallest. A corpus of uniformly small bodies measures uniformly small bodies.
  const bodies = [...text.matchAll(/=> \{\n([\s\S]*?)\n\s*\}\)/g)].map((match) =>
    match[1].split('\n').length)
  assert.ok(bodies.length > 100, `only ${bodies.length} bodies matched; the probe is broken`)
  assert.ok(Math.max(...bodies) > 40, `longest body is ${Math.max(...bodies)} lines, no tail`)
  assert.ok(Math.min(...bodies) < 5, `shortest body is ${Math.min(...bodies)} lines`)

  // Repeated bodies, the deliberate 10%. Without them the corpus is unrepresentatively hostile;
  // this asserts they survive, since a duplicate-detection tool's memory corpus containing no
  // duplicates would be its own kind of joke.
  const normalized = [...text.matchAll(/=> \{\n([\s\S]*?)\n\s*\}\)/g)]
    .map((match) => match[1].trim())
  assert.ok(
    normalized.length - new Set(normalized).size > 10,
    'no repeated bodies; the duplicate-body path stopped firing',
  )
})

test('every generated token is width-invariant, so paths do not grow with N', () => {
  // The first measurement of this corpus grew 8.1% per decade purely because `case-9.test.ts`
  // became `case-7866.test.ts` and those paths are retained. Asserted rather than remembered.
  const small = generateCorpus({ root: at('w-small'), tests: 500 })
  const large = generateCorpus({ root: at('w-large'), tests: 20_000 })
  assert.ok(large.files > small.files * 10)
  const widths = (root) => new Set(
    fs.globSync('packages/**/*.test.ts', { cwd: root }).map((path) => path.length),
  )
  assert.deepEqual(widths(at('w-small')), widths(at('w-large')))
})

test('corpusRoot pads every corpus to one constant absolute length', () => {
  // Retained bytes include canonical absolute paths, so an unpadded root would make the ratchet
  // depend on where the repository is checked out.
  const shallow = corpusRoot(mkdtempSync(join(tmpdir(), 'a-')), 1_000)
  const deep = corpusRoot(mkdtempSync(join(tmpdir(), 'a-longer-base-name-by-far-')), 100_000)
  assert.equal(shallow.length, deep.length)
  rmSync(shallow, { recursive: true, force: true })
  rmSync(deep, { recursive: true, force: true })
})

test('corpusRoot fails loudly when it cannot pad, rather than measuring at another length', () => {
  let base = mkdtempSync(join(tmpdir(), 'deep-'))
  while (base.length < 160) base = join(base, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  assert.throws(() => corpusRoot(base, 1_000), /no room to pad/)
})

test('a non-positive test count is refused rather than producing an empty corpus', () => {
  for (const tests of [0, -1, 1.5, 'many', undefined]) {
    assert.throws(
      () => generateCorpus({ root: at('bad'), tests }),
      /positive integer test count/,
      `tests = ${JSON.stringify(tests)} was accepted`,
    )
  }
})

test('no generated scope redeclares a const, so the gate measures IR and not diagnostics', () => {
  // A file with a redeclared `const` is a semantic error, and the analyzer reports it as a
  // diagnostic and degrades the file -- so the gate would be measuring the error path. This
  // caught exactly that twice while the generator was being written: once from body templates
  // reusing a binding name, once from two hook lines drawing the same word. Scoped per callback
  // body, not per file: two different tests declaring `value` are different scopes and fine.
  const root = at('parse')
  generateCorpus({ root, tests: 1_500 })
  let scopes = 0
  for (const path of fs.globSync('packages/**/*.test.ts', { cwd: root })) {
    const source = readFileSync(join(root, path), 'utf8')
    for (const match of source.matchAll(/=> \{\n([\s\S]*?)\n\s*\}\)/g)) {
      const declared = [...match[1].matchAll(/^\s*const (\w+) =/gm)].map((name) => name[1])
      assert.equal(
        declared.length,
        new Set(declared).size,
        `${path} redeclares a const inside one callback body: ${declared.join(', ')}`,
      )
      scopes += 1
    }
  }
  assert.ok(scopes > 500, `only ${scopes} scopes were probed; the probe is broken, not the corpus`)
})
