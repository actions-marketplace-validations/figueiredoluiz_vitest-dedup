// RECALL variant -- duplicate-test-name under dynamic titles: `not-compared`, not `distinct`.
//
// Both titles are template literals interpolating the same runtime value, so their normalized
// shapes are identical (`Title::Dynamic` keeps a shape such as `` `tenant ${_} is isolated` ``).
// Two dynamic titles built the same way would very likely collide at runtime -- but "very likely"
// is not the claim this rule makes, and a `Dynamic` title marks the test's `Context` unresolved,
// which removes it from grouping.
//
// The expectation has two halves and both are asserted:
//   - no `duplicate-test-name` finding links the pair, AND
//   - the run is `incomplete`.
//
// Recording only the first would let this case pass as a precision success identical in shape to
// the `distinct` negative next door, when in fact nothing was ever compared. The silence is
// correct, and the reason it is correct is what the second half pins.
import { expect, test } from 'vitest'
import { isolate } from './tenants'

const tenant = process.env.TENANT ?? 'default'

test(`tenant ${tenant} is isolated`, () => {
  expect(isolate(tenant).shared).toBe(false)
})

test(`tenant ${tenant} is isolated`, () => {
  expect(isolate(tenant).namespace).toBe(tenant)
})
