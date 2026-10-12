// 1 test with const-foldable expression in template literal, statically resolvable to 'title with 2'
import { test, expect } from 'vitest'

test(`title with ${1 + 1}`, () => {
  expect(1 + 1).toBe(2)
})
