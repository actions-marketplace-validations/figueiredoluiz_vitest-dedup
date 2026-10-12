// 1 test with .concurrent.skip chain (opposite order). Same semantics as order-a.
import { test, expect } from 'vitest'

test.concurrent.skip('skipped concurrent test', () => {
  expect(1).toBe(1)
})
