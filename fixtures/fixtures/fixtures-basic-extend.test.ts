// test.extend with 1 fixture (db), object-syntax. Returns new test-like object with extended fixture.
import { test as baseTest, expect } from 'vitest'

const test = baseTest.extend({
  db: async ({}, use) => {
    await use({ connected: true })
  }
})

test('uses db fixture', async ({ db }) => {
  expect(db.connected).toBe(true)
})
