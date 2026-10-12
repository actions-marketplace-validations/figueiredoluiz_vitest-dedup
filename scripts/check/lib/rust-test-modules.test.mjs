// Unit tests for the `#[cfg(test)]` splitter that `check-duplication.mjs` measures through.
//
// The splitter decides what the Rust duplication percentage is *about*. If it silently kept a
// test module in the production half, the gate would report a number for the wrong scope and
// nothing downstream would notice -- the percentage would just be higher and the ratchet would be
// set to it. These tests are the only thing standing between that and a recorded threshold, so
// they assert the split on the shapes this repository actually contains plus the shapes that
// would break a naive brace matcher.
import assert from 'node:assert/strict'
import test from 'node:test'

import { masked, splitRustTestModules } from './rust-test-modules.mjs'

const lines = (half) => half.text.split('\n').filter((line) => line !== '')

test('an inline test module goes to the test half and nothing else moves', () => {
  const source = ['fn prod() -> u8 {', '    1', '}', '', '#[cfg(test)]', 'mod tests {', '    #[test]', '    fn t() {}', '}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(lines(production), ['fn prod() -> u8 {', '    1', '}'])
  assert.deepEqual(lines(tests), ['#[cfg(test)]', 'mod tests {', '    #[test]', '    fn t() {}', '}'])
  assert.deepEqual(production.lineMap, [1, 2, 3, 4])
  assert.deepEqual(tests.lineMap, [5, 6, 7, 8, 9])
})

test('the halves partition the file, so no line is counted twice or dropped', () => {
  const source = ['a', '#[cfg(test)]', 'mod tests {', '}', 'b', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  const all = [...production.lineMap, ...tests.lineMap].sort((x, y) => x - y)
  assert.deepEqual(all, [1, 2, 3, 4, 5])
})

test('a brace inside a string or comment does not end the module early', () => {
  const source = [
    '#[cfg(test)]',
    'mod tests {',
    '    fn t() {',
    '        let s = "}";',
    '        let r = r#"} not the end "#;',
    '        // }',
    '        /* } /* nested } */ */',
    "        let c = '}';",
    '    }',
    '}',
    'fn after() {}',
    '',
  ].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(lines(production), ['fn after() {}'])
  assert.equal(tests.lineMap.length, 10)
})

test('a lifetime is not mistaken for an unterminated char literal', () => {
  const source = ["fn keep<'a>(x: &'a str) -> &'a str {", '    x', '}', '#[cfg(test)]', 'mod tests {}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(production.lineMap, [1, 2, 3])
  assert.deepEqual(tests.lineMap, [4, 5])
})

test('`#[cfg(test)]` named in a doc comment is not a test module', () => {
  // `src/analysis.rs` opens with exactly this, and a splitter that regexed the raw source would
  // treat the prose as an item and then brace-match into the first production function.
  const source = ['//! every rule is exercised in `#[cfg(test)]` from hand-built values', 'fn prod() {}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(production.lineMap, [1, 2])
  assert.deepEqual(tests.lineMap, [])
})

test('`#[cfg(test)] mod tests;` declares an out-of-line module and is removed as a declaration', () => {
  // `src/analysis.rs` again: the test body lives in `src/analysis/tests.rs`, which the gate
  // excludes as a whole file. Only the two-line declaration is here.
  const source = ['fn prod() {}', '', '#[cfg(test)]', 'mod tests;', '', 'fn more() {}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(lines(production), ['fn prod() {}', 'fn more() {}'])
  assert.deepEqual(tests.lineMap, [3, 4])
})

test('stacked attributes between `#[cfg(test)]` and `mod` are still recognized', () => {
  const source = ['#[cfg(test)]', '#[allow(clippy::too_many_lines)]', 'mod tests {', '}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(production.lineMap, [])
  assert.deepEqual(tests.lineMap, [1, 2, 3, 4])
})

test('`#[cfg(test)]` on a non-mod item stays in the production half', () => {
  // `fingerprint.rs`'s depth instrumentation. Counting it as production is the documented
  // decision, not an oversight: it is a dozen lines and it is not test setup.
  const source = ['#[cfg(test)]', 'const BUDGET: usize = 1024;', '', 'fn prod() {}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(production.lineMap, [1, 2, 3, 4])
  assert.deepEqual(tests.lineMap, [])
})

test('adjacencyJoins counts the removals that made production code newly adjacent', () => {
  const trailing = ['#[cfg(test)]', 'mod tests {}', 'fn after() {}', ''].join('\n')
  assert.equal(splitRustTestModules(trailing).adjacencyJoins, 1)
  const last = ['fn before() {}', '#[cfg(test)]', 'mod tests {}', ''].join('\n')
  assert.equal(splitRustTestModules(last).adjacencyJoins, 0)
})

test('an unbalanced test module fails loudly rather than swallowing the rest of the file', () => {
  assert.throws(
    () => splitRustTestModules('#[cfg(test)]\nmod tests {\n    fn t() {\n'),
    /unbalanced braces/,
  )
})

test('an astral character earlier in the file does not slide the mask', () => {
  // The real bug this caught: `masked` built its output with `Array.from`, which iterates by code
  // point, so the emoji in `reporters/jsonl.rs`'s adversarial tests desynchronized every later
  // array index from the string index the scanner computes. The mask slid by one per astral
  // character and a brace inside a string literal survived 800 lines further down, which made the
  // brace matcher run off the end of the module. Symptom was a hard failure, but it could as
  // easily have been a plausible-looking wrong split.
  const source = ['fn prod() {', '    let e = "😀😀";', '}', '#[cfg(test)]', 'mod tests {', '    let s = "}";', '}', 'fn after() {}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(lines(production), ['fn prod() {', '    let e = "😀😀";', '}', 'fn after() {}'])
  assert.deepEqual(tests.lineMap, [4, 5, 6, 7])
})

test('masked preserves length and newlines so indices stay usable against the source', () => {
  const source = 'let s = "a{b}c"; // }\nfn f() {}\n'
  const view = masked(source)
  assert.equal(view.length, source.length)
  assert.deepEqual(
    [...view].map((c, i) => (c === '\n' ? i : -1)).filter((i) => i >= 0),
    [...source].map((c, i) => (c === '\n' ? i : -1)).filter((i) => i >= 0),
  )
  assert.ok(!view.includes('{b}'), 'the string body should be blanked')
  assert.ok(view.includes('fn f() {}'), 'code outside literals should survive verbatim')
})

test('a raw-identifier module name is still a test module', () => {
  // `mod r#tests { … }` is legal Rust. The item regex used to spell the name `\w+`, which cannot
  // match the `#`, so the module was silently left in the production half -- a wrong scope that
  // reads as a lower duplication percentage rather than as a failure. No tracked source declares
  // one today; this is the gap, pinned before an input arrives that has it.
  const source = ['fn prod() {}', '#[cfg(test)]', 'mod r#tests {', '    #[test]', '    fn t() {}', '}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(lines(production), ['fn prod() {}'])
  assert.deepEqual(tests.lineMap, [2, 3, 4, 5, 6])
})

test('a raw-identifier module declaration without a body is a test module too', () => {
  const source = ['#[cfg(test)]', 'mod r#match;', 'fn after() {}', ''].join('\n')
  const { production, tests } = splitRustTestModules(source)
  assert.deepEqual(lines(production), ['fn after() {}'])
  assert.deepEqual(tests.lineMap, [1, 2])
})
