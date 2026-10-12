// 1 test with template literal title (no substitutions), statically resolvable
import { test, expect } from 'vitest'

test(`static template literal title`, () => {
  expect(1).toBe(1)
})
