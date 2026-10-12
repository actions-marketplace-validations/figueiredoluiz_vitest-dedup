// Parameterized suite using describe.each. 2 generated suites, each with nested tests.
import { describe, test, expect } from 'vitest'

describe.each([{ name: 'Suite A' }, { name: 'Suite B' }])('$name', ({ name }) => {
  test('nested test', () => {
    expect(name).toBeDefined()
  })
})
