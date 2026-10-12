// Pair with not-duplicates-different-mocks-b.test.ts.
// Identical test bodies, but each file mocks the SAME module with a DIFFERENT factory.
// Expected verdict: NOT a duplicate. Mocked behavior is part of the effective context.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant L14 "reads the mocked value"
// @vitest-dedup:participant not-duplicates-different-mocks-b.test.ts#L13 "reads the mocked value"
import { test, expect, vi } from 'vitest'
import { value } from './module-a'

vi.mock('./module-a', () => ({ value: 1 }))

test('reads the mocked value', () => {
  expect(value).toBeGreaterThan(0)
})
