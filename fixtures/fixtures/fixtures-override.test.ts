// test.override() called at top of describe block (v4.1+), overrides fixture values.
import { test as baseTest, describe, test } from 'vitest'

const myTest = baseTest.extend({
  value: async ({}, use) => {
    await use('original')
  }
})

describe('override example', () => {
  myTest.override({ value: 'overridden' })

  myTest('uses overridden fixture', async ({ value }) => {
    // fixture value is 'overridden' in this suite
  })
})
