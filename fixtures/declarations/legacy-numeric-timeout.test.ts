// 1 test with legacy 3-arg form: test('name', fn, timeoutMs)
import { test, expect } from 'vitest'

test('name', () => {
  expect(1).toBe(1)
}, 5000)
