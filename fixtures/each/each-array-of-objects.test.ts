// Parameterized test using .each with array of objects. 2 test cases, titles use $field interpolation.
import { test, expect } from 'vitest'

test.each([{ a: 1, b: 1, expected: 2 }, { a: 2, b: 3, expected: 5 }])('add($a, $b) = $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
