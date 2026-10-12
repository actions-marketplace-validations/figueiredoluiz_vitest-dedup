import { expect, test } from 'vitest'

test('multiplies two numbers', () => {
  expect(mul(2, 3)).toBe(6)
})

test('multiplies the same pair again', () => {
  expect(mul(2, 3)).toBe(6)
})
