// Fixture dependency: second fixture depends on first. .extend().extend() chain.
import { test as baseTest, expect } from 'vitest'

const test1 = baseTest.extend({
  a: async ({}, use) => {
    await use('valueA')
  }
})

const test2 = test1.extend({
  b: async ({ a }, use) => {
    await use(`${a}+B`)
  }
})

test2('uses dependent fixtures', async ({ a, b }) => {
  expect(b).toBe('valueA+B')
})
