// node:test: import from 'node:test', not 'vitest'. Must NOT be extracted as Vitest.
import { test } from 'node:test'
import assert from 'assert'

test('node test', () => {
  assert.strictEqual(1 + 1, 2)
})
