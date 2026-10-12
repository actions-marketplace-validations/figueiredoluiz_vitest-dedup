// Parameterized test using .each with tagged template literal. 2 rows, column headers become field names.
import { test, expect } from 'vitest'

test.each`
  a    | b    | expected
  ${1} | ${1} | ${2}
  ${2} | ${3} | ${5}
`('returns $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
