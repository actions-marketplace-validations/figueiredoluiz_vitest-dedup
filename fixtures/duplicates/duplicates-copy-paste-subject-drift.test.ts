// A test copy-pasted and re-titled for a different subject, where the CALL was never updated.
// Expected verdict: duplicate-test.
//
// This is the highest-value shape the rule detects, because the duplicate body is only the
// symptom. The actual defect is a silent coverage gap: the function named in the second title is
// never exercised by anything, and the suite looks complete while it is not.
//
// The remedy is to point the second test at the subject its title names. Deleting one of the pair
// would cement the coverage gap, so a report on this shape must not be read as "remove a
// redundant test".
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L18 "fetchData returns rows"
// @vitest-dedup:participant L23 "safeFetchData returns rows"
import { test, expect } from 'vitest'
import { fetchData, safeFetchData } from './api'

test('fetchData returns rows', () => {
  expect(fetchData()).toHaveLength(2)
})

// Re-titled for `safeFetchData`, but still calls `fetchData`. Nothing tests `safeFetchData`.
test('safeFetchData returns rows', () => {
  expect(fetchData()).toHaveLength(2)
})
