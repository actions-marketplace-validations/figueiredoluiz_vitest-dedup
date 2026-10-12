// 1 suite with .concurrent.only chain. Modifiers: Concurrent, Only on suite.
import { describe, test, expect } from 'vitest'

describe.concurrent.only('concurrent only suite', () => {
  test('concurrent test 1', () => {
    expect(1).toBe(1)
  })
  test('concurrent test 2', () => {
    expect(2).toBe(2)
  })
})
