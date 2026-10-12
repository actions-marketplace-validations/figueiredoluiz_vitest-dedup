// Pair with cross-file-duplicate-would-fire-a.test.ts -- see its header for the full rationale.
// Same body, same title, a different file, and since `cross-file-duplicate` began shipping
// `Warning` this is an asserted POSITIVE under the default config rather than the policy-silenced
// placeholder the file name still remembers. The expectation is declared on both halves so that
// reading either file tells you the whole claim.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant cross-file-duplicate-would-fire-a.test.ts#L39 "computes the order total"
// @vitest-dedup:participant L13 "computes the order total"
import { test, expect } from 'vitest'
import { computeTotal } from './shared-cart'

test('computes the order total', () => {
  const total = computeTotal([10, 20, 30])
  expect(total).toBe(60)
})
