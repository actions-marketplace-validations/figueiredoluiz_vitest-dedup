// REGRESSION: a `duplicate-test` false positive at ERROR severity, found by review on PR #11 and
// reproduced exactly as reported. The two rows below folded to the same value and were reported
// as identical tests.
//
// CAUSE: constant folding reused Vitest's `%s` title renderer for JavaScript's `+`. The two
// coercions are not the same function. Vitest prints a plain object with its inspect form
// (`{ a: 1 }`, because an object has no own `toString`), while `'x' + { a: 1 }` evaluates to
// `x[object Object]`. So the concatenation folded to `x{ a: 1 }` and collided with the unrelated
// literal on the second row, which really is that text.
//
// The same conflation was wrong in two more places, both now covered by the folding contract in
// registry.rs: `` `${1n}` `` is `1` under ToString and `1n` under `%s`, and `'x' + -0` is `x0`
// while `%s` of `-0` prints `-0`.
//
// WHAT IT MUST DO: tell them apart. They differ only in the value bound to the single row cell,
// so `literal` is the isolated dimension; everything else about the two tests is identical by
// construction. The remaining `parameterization-candidate` is correct and declared below -- two
// tests of the same shape differing in a literal are exactly that.
//
// ONE EDIT FROM FIRING: change the second row to `'x[object Object]'` and the two become genuine
// duplicates, because then they really do carry the same string.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L28 "case x[object Object]"
// @vitest-dedup:participant L32 "case x{ a: 1 }"
import { test, expect } from 'vitest'

test.each([['x' + { a: 1 }]])('case %s', (value) => {
  expect(String(value)).toBeTruthy()
})

test.each([['x{ a: 1 }']])('case %s', (value) => {
  expect(String(value)).toBeTruthy()
})
