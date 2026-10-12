// Positive half of the "extracted local" transformation.
//
// Adjusted from the original draft of this fixture, which read the local twice ("asserts it
// twice via a local") and justified convergence by asserting `computeTotal()` is pure. That
// assumed exactly what `near-duplicate-test`'s dataflow canonicalization refuses to assume: this
// module has no cheap way to tell a pure initializer from an impure one (see
// `near-extracted-local-evaluation-twin.test.ts` in this same directory, where the same shape with
// an impure initializer, `nextId()`, must NOT converge), so "single-use local inlining" only ever
// substitutes a local read **exactly once**, never a local read twice -- purity of the callee is
// never assumed, only the read count is checked. This version reads `total` once, which is the
// precondition the transformation actually verifies.
//
// Precondition: the local is read exactly once, with no side-effecting statement between its
// declaration and that read. `near-extracted-local-evaluation-twin.test.ts` is the
// precondition-violating twin -- the same local read twice, so inlining would silently change a
// side-effecting call's evaluation count from one to two.
//
// Verified against the pre-canonicalization binary: NO finding. The extracted-local body and the
// inlined body are not alpha-equivalent (a local-variable read vs a call expression), and
// `parameterization-candidate` does not fire because the difference isn't a literal.
//
// The `expect(cart).toHaveLength(2)` line in both bodies exists only to clear
// `MIN_BEHAVIOR_EVENTS_FOR_NEAR_DUPLICATE`'s substance floor -- inlining collapses the pair to a
// single assertion event otherwise, which is below the floor regardless of how well the bodies
// match. It sits before `total`'s own declaration in both bodies, so it cannot count as an
// intervening effect between `total`'s declaration and its one read.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=near-duplicate-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L34 "computes the total via a local and asserts it"
// @vitest-dedup:participant L41 "computes the total inline"
import { test, expect } from 'vitest'
import { computeTotal } from './cart'

test('computes the total via a local and asserts it', () => {
  const cart = [10, 20]
  expect(cart).toHaveLength(2)
  const total = computeTotal(cart)
  expect(total).toBe(30)
})

test('computes the total inline', () => {
  const cart = [10, 20]
  expect(cart).toHaveLength(2)
  expect(computeTotal(cart)).toBe(30)
})
