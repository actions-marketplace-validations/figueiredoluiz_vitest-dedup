// A mixed table: Vitest spreads a row into several *arguments* only when EVERY row is an array,
// so here each row is bound whole to the single parameter -- row `[1, 2]` runs with the array
// itself, not with `1`. Verified against Vitest 5.0.1 with a rest-parameter callback, which
// receives `[[1, 2]]`. Expected verdict: the scalar row and the array row are never the same
// case.
//
// This fixture used to assert `not-compared`, because the array row did not const-fold and was
// excluded from comparison entirely -- silence that proved nothing. Both rows are now read, so
// the silence is a real `distinct` verdict: the analyzer compares them and tells them apart, on
// the strength of the kind tag (`<number:1>` against `<array:[<number:1>,<number:2>]>`) rather
// than on a refusal to look. That is the stronger claim, and it is the one this file was always
// trying to make.
//
// Note the two titles Vitest produces here: `accepts 1` for BOTH the scalar row and the array
// row, because the title formatter spreads an array even where the binding does not, so `%s`
// takes its first element. Identical names, different cases -- which is precisely why this
// project keys a test's identity on its body and not its name.
// ISOLATION: the two participants share the title `accepts 1` and an identical context, and
// differ only in what is bound to `value` -- `<number:1>` against the whole array. Verified with
// --emit-test-fingerprints: alpha and structural both differ, contextKey and modifierKey are
// identical, so the dimension isolated is the literal's KIND. Weakening run: drop the kind tag
// from a composite cell and the two collapse, which is the collision this fixture exists to
// catch.
// @vitest-dedup:extracted 3
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates literal-kind
// @vitest-dedup:participant L31 "accepts 1"
// @vitest-dedup:participant L31 "accepts 1"
import { it, expect } from 'vitest'

it.each([1, 'a', [1, 2]])('accepts %s', (value) => {
  expect(String(value)).toBeTruthy()
})
