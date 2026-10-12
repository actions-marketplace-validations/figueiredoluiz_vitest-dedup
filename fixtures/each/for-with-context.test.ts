// Parameterized concurrent test using .for with TestContext as 2nd param for ctx.expect().
import { test } from 'vitest'

test.concurrent.for([[1, 2, 3]])('concurrent for', ([a, b, expected], ctx) => {
  ctx.expect(a + b).toBe(expected)
})
