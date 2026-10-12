// test.beforeEach/afterEach hung off an extended test binding, with fixture types.
import { test as baseTest } from 'vitest'

const test = baseTest.extend({
  db: async ({}, use) => {
    await use({ conn: true })
  }
})

test.beforeEach(({ db }) => {})
test.afterEach(({ db }) => {})

test('with scoped hooks', ({ db }) => {
  // hooks above only apply to tests using 'test' binding
})
