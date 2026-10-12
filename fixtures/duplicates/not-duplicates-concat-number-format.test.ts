// REGRESSION: a `duplicate-test` false positive at ERROR severity, found while re-reviewing PR
// #11 after its first coercion fix. Rust and JavaScript can choose different shortest decimal
// strings for the same binary float: Rust prints this number with a final `3`, while JavaScript
// prints it with a final `2`.
//
// CAUSE: JavaScript ToString delegated to Rust's `f64::to_string`. The concatenation therefore
// folded to the second row's literal text even though its runtime value is different.
//
// WHAT IT MUST DO: tell the rows apart. They differ only in the value bound to the single cell,
// so the remaining `parameterization-candidate` is correct.
//
// ONE EDIT FROM FIRING: change the second row's final digit to `2`; then both runtime strings are
// genuinely equal.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L20 "case x201562347225087.62"
// @vitest-dedup:participant L24 "case x201562347225087.63"
import { test, expect } from 'vitest'

test.each([['x' + 201562347225087.63]])('case %s', (value) => {
  expect(String(value)).toBeTruthy()
})

test.each([['x201562347225087.63']])('case %s', (value) => {
  expect(String(value)).toBeTruthy()
})
