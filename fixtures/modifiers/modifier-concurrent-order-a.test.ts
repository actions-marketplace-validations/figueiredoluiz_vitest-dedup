// 1 test with .skip.concurrent chain. Modifiers: Skip, Concurrent.
import { test, expect } from 'vitest'

test.skip.concurrent('skipped concurrent test', () => {
  expect(1).toBe(1)
})
