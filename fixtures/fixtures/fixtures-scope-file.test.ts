// Fixture with { scope: 'file' }, shared across all tests in file.
import { test as baseTest, expect } from 'vitest'

const test = baseTest.extend({
  counter: async ({}, use) => {
    let count = 0
    await use({ increment: () => ++count })
  },
})

test('first test', async ({ counter }) => {
  expect(counter.increment()).toBe(1)
})

test('second test', async ({ counter }) => {
  expect(counter.increment()).toBe(2)
})
