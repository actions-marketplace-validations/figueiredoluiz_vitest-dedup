// Jest test: import from @jest/globals, not 'vitest'. Must NOT be extracted as Vitest.
import { test, describe, expect } from '@jest/globals'

describe('Jest suite', () => {
  test('jest test', () => {
    expect(1 + 1).toBe(2)
  })
})
