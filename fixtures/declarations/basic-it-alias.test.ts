// 1 test case using 'it' alias (same as 'test'), verifying interchangeability
import { it, expect } from 'vitest'

it('multiplies two numbers', () => {
  expect(2 * 3).toBe(6)
})
