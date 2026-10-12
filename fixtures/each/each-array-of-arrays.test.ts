// Parameterized test using .each with array of arrays. 3 test cases generated, titles interpolated with %i, %i, %i.
import { test, expect } from 'vitest'

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])('add(%i, %i) = %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})
