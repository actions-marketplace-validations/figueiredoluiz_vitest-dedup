// vi.mock() call placed after other statements. Must understand it executes logically before imports (hoisting).
import { test, expect, vi } from 'vitest'

const x = 1

vi.mock('./module', () => ({
  default: { value: 42 }
}))

test('with hoisted mock', () => {
  expect(true).toBe(true)
})
