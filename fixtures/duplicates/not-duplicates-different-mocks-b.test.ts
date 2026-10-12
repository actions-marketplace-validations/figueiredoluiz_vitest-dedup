// Pair with not-duplicates-different-mocks-a.test.ts. Same body, different mock factory.
// Expected verdict: NOT a duplicate.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant not-duplicates-different-mocks-a.test.ts#L14 "reads the mocked value"
// @vitest-dedup:participant L13 "reads the mocked value"
import { test, expect, vi } from 'vitest'
import { value } from './module-a'

vi.mock('./module-a', () => ({ value: 2 }))

test('reads the mocked value', () => {
  expect(value).toBeGreaterThan(0)
})
