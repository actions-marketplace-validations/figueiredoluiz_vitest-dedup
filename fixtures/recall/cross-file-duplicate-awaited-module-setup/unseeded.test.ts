// The sibling of `seeded.test.ts`: same body, a different awaited module-scope setup call.
import { expect, test } from 'vitest'
import { loadSeed, rowCount } from './seed'

await loadSeed('orders')

test('counts the seeded rows', () => {
  expect(rowCount()).toBe(3)
})
