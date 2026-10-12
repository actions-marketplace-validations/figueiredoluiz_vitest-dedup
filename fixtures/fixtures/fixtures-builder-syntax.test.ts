// Fixture using builder syntax (v4.1+): .extend('name', async (deps, { onCleanup }) => value)
import { test as baseTest, expect } from 'vitest'

const test = baseTest.extend({
  resource: async ({}, { onCleanup }) => {
    const res = 'initialized'
    onCleanup(() => {})
    return res
  }
})

test('builder syntax fixture', async ({ resource }) => {
  expect(resource).toBe('initialized')
})
