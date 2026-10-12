// Fixture with { auto: true }, initialized unconditionally even if not used by test.
import { test as baseTest, expect } from 'vitest'

const test = baseTest.extend({
  autoInit: async ({}, use) => {
    await use('initialized')
  }
})

test('unused fixture with auto:true', () => {
  expect(true).toBe(true)
})
