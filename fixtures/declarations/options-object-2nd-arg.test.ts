// 1 test with options object as 2nd arg (timeout, retry), fn as 3rd
import { test, expect } from 'vitest'

test('name', { timeout: 1000, retry: 2 }, () => {
  expect(1).toBe(1)
})
