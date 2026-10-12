// Parameterized test using .for with array rows. Rows not spread, whole row is 1st param; TestContext is 2nd param.
import { test, expect } from 'vitest'

test.for([[1, 1, 2], [2, 3, 5]])('add via for', ([a, b, expected]) => {
  expect(a + b).toBe(expected)
})
