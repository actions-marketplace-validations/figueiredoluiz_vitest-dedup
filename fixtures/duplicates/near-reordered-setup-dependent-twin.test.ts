// Precondition-violating twin for the "reordered setup" transformation -- every
// equivalence-preserving transformation needs one. Its precondition is that the reordered
// statements are INDEPENDENT; here they share state, so swapping their order changes the result.
// Test A resets the total before multiplying; test B multiplies first, so the reset wipes out the
// multiplication instead of preceding it. Same two statements, same final assertion shape, opposite
// outcome once actually run -- these are not a reordering-equivalent pair and must stay distinct.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates statement-order,literal
// @vitest-dedup:participant L16 "resets before multiplying"
// @vitest-dedup:participant L22 "multiplies before resetting"
import { test, expect } from 'vitest'

let total = 1

test('resets before multiplying', () => {
  total = 1
  total = total * 5
  expect(total).toBe(5)
})

test('multiplies before resetting', () => {
  total = total * 5
  total = 1
  expect(total).toBe(1)
})
