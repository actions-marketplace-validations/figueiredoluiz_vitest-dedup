// Parameterized test demonstrating all printf directives: %s %d %i %f %j %o %# %$ %%
import { test, expect } from 'vitest'

test.each([[1, 2, 3]])('Test %# with %d, %i, %s, %j, %o, %%, %$', (a, b, c) => {
  expect(a).toBe(1)
})
