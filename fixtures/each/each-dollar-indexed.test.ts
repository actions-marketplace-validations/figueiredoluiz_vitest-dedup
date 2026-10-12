// Parameterized test using $0, $1 positional interpolation and $field.nested dotted-path interpolation.
import { test, expect } from 'vitest'

test.each([{ a: { val: 5 }, b: 3 }, { a: { val: 7 }, b: 2 }])('test $0 vs $a.val', ({ a, b }) => {
  expect(a.val > b).toBe(true)
})
