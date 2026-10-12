// An entire test pasted twice verbatim, adjacent in the file: same title, same body.
// Expected verdict: duplicate-test AND duplicate-test-name.
//
// The simplest true positive, and useful as a canary: if this ever stops being reported, grouping
// is broken at its most basic level.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L16 "formats yen"
// @vitest-dedup:participant L20 "formats yen"
// @vitest-dedup:expect rule=duplicate-test-name verdict=name-collision severity=warning
// @vitest-dedup:participant L16 "formats yen"
// @vitest-dedup:participant L20 "formats yen"
import { test, expect } from 'vitest'
import { formatCurrency } from './format'

test('formats yen', () => {
  expect(formatCurrency(1200, 'JPY')).toBe('¥1,200')
})

test('formats yen', () => {
  expect(formatCurrency(1200, 'JPY')).toBe('¥1,200')
})
