// Pair with not-duplicates-different-helper-modules-b.test.ts.
// Identical bodies calling a same-named helper imported from a DIFFERENT module in each file.
// Expected verdict: NOT a duplicate. `format` from ./utils-a is not `format` from ./utils-b.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates binding
// @vitest-dedup:participant L12 "formats a date"
// @vitest-dedup:participant not-duplicates-different-helper-modules-b.test.ts#L11 "formats a date"
import { test, expect } from 'vitest'
import { format } from './utils-a'

test('formats a date', () => {
  expect(format('2024-01-01')).toBe('01/01/2024')
})
