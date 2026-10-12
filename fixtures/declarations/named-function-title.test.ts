// 1 test where title is derived from function name (not called), title is 'myTestName'
import { test, expect } from 'vitest'

test(function myTestName() {
  expect(true).toBe(true)
})
