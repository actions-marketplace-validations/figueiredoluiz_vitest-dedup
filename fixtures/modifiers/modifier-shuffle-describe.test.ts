// 1 suite with .shuffle modifier. Randomizes execution order of nested tests.
import { describe, test, expect } from 'vitest'

describe.shuffle('shuffled suite', () => {
  test('test 1', () => {
    expect(1).toBe(1)
  })
  test('test 2', () => {
    expect(2).toBe(2)
  })
})
