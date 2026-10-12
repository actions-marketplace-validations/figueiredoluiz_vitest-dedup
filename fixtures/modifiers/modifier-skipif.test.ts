// 1 test with .skipIf(cond). Conditional skip evaluated at collection time.
import { test, expect } from 'vitest'

test.skipIf(true)('conditionally skipped', () => {
  expect(1).toBe(1)
})
