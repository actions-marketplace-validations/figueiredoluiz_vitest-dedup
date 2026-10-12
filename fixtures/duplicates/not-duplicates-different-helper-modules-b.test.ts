// Pair with not-duplicates-different-helper-modules-a.test.ts. Same body, helper from ./utils-b.
// Expected verdict: NOT a duplicate.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates binding
// @vitest-dedup:participant not-duplicates-different-helper-modules-a.test.ts#L12 "formats a date"
// @vitest-dedup:participant L11 "formats a date"
import { test, expect } from 'vitest'
import { format } from './utils-b'

test('formats a date', () => {
  expect(format('2024-01-01')).toBe('01/01/2024')
})
