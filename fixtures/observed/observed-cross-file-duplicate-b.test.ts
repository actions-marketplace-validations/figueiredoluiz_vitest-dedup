// Pair with observed-cross-file-duplicate-a.test.ts -- see its header for why this pair exists.
// Same body, same context, a different file and a different title. The expectation is declared on
// both halves so that reading either file tells you the whole claim.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant observed-cross-file-duplicate-a.test.ts#L29 "totals the line items"
// @vitest-dedup:participant L11 "adds the line items up"
import { test, expect } from 'vitest'
import { computeTotal } from './cart'

test('adds the line items up', () => {
  const total = computeTotal([10, 20, 30])
  expect(total).toBe(60)
})
