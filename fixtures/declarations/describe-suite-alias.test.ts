// 1 suite using 'describe', 1 suite using 'suite' (alias), verifying interchangeability
import { describe, suite, test, expect } from 'vitest'

describe('Math', () => {
  test('addition works', () => {
    expect(1 + 1).toBe(2)
  })
})

suite('Geometry', () => {
  test('square area', () => {
    expect(2 * 2).toBe(4)
  })
})
