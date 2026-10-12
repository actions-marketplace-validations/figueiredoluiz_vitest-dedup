// OBSERVED IN REAL CODE: a public Vue composable library -- `it.each([1, 'a', [1, 2], { a: 1 },
// new Map(...), new Set(...)])`, one table mixing scalars, arrays, and objects.
//
// SHAPE: a `.each` table whose rows are NOT all arrays. Vitest spreads a row into several
// callback arguments only when EVERY row is an array; in a mixed table each row is bound whole to
// the single parameter, so the row `[1, 2]` runs with the array itself, never with `1`.
//
// WHAT THE ANALYZER DID WRONG: it spread the array row anyway, so the scalar row `1` and the
// array row `[1, 2]` both bound `value = 1` and were reported as the same case. The extractor now
// applies Vitest's uniformity rule.
//
// WHAT IT MUST DO NOW: compare all four rows and find them distinct. This fixture has now held
// three different expectations, and the progression is the point. It began as `not-compared`
// because the whole-bound array row did not const-fold, so its case was excluded from comparison
// and the silence proved nothing. Composite cells then became readable, but the `%s` title could
// not be rendered, so the row stayed unresolved for a *different* reason. Both are now fixed:
// every row is read, every title renders, and the silence is a real `distinct` verdict earned by
// the `array`/`number` kind tags telling the scalar row and the array row apart.
//
// Measured against Vitest 5.0.1 rather than assumed, and one half of the original note was wrong:
// a mixed table really does BIND each row whole (`(...args) => args` reports `[[1, 2]]`, one
// argument), but the TITLE formatter spreads the array anyway, so `%s` on that row prints `1`.
// Binding and title formatting disagree in Vitest itself. Both are modelled, separately, which is
// why the row `[1, 2]` is named `serializes 1` -- the same name as the scalar row -- while
// remaining a different case. Identical names, different bodies: exactly the situation this
// project exists to judge by body rather than by name.
//
// Its true-positive twin is observed-uniform-each-table.test.ts, where every row IS an array,
// Vitest really does spread, and two rows really do collapse to the same case.
// ISOLATION: the two participants share the title `serializes 1` and an identical context, and
// differ only in what is bound to `value` -- `<number:1>` against the whole array. Verified with
// --emit-test-fingerprints: alpha and structural differ, contextKey and modifierKey are
// identical. Weakening run against this binary: wrap every row in an array (`[[1], ['a'], [1, 2],
// [{ a: 1 }]]`) so the table becomes uniform, Vitest spreads, rows `[1]` and `[1, 2]` both bind
// `value = 1`, and duplicate-each-row fires between them at exactly the two participants below.
// @vitest-dedup:extracted 4
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates literal-kind
// @vitest-dedup:participant L44 "serializes 1"
// @vitest-dedup:participant L44 "serializes 1"
import { it, expect } from 'vitest'
import { useStorage } from './use-storage'

it.each([1, 'a', [1, 2], { a: 1 }])('serializes %s', (value) => {
  const store = useStorage('key', value)
  expect(store.value).toEqual(value)
})
