// Parameterized test with .each(getCases()) — table is not a literal, must degrade to unresolved parameterization.
import { test, expect } from 'vitest'

function getCases() {
  return [[1, 2], [3, 4]]
}

test.each(getCases())('with nonliteral table', (a, b) => {
  expect(a).toBeDefined()
})
