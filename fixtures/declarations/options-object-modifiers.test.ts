// 1 test with options object containing modifier flags { skip: true }, unioned with chained modifiers
import { test, expect } from 'vitest'

test('name', { skip: true, retry: 1 }, () => {
  expect(1).toBe(1)
})
