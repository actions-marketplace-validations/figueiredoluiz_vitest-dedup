import { expect, test } from 'vitest'

test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5)
})

test('sums the same pair again', () => {
  expect(add(2, 3)).toBe(5)
})
