// Fixture with { injected: true }, value supplied externally via config.
import { test as baseTest, expect } from 'vitest'

const test = baseTest.extend({
  apiKey: async ({}, use) => {
    await use(process.env.API_KEY)
  }
})

test('uses injected fixture', async ({ apiKey }) => {
  expect(apiKey).toBeDefined()
})
