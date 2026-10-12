// RECALL mixed -- cross-file-duplicate side of mixed-near-duplicate-and-cross-file. See
// unit.test.ts in this directory for the claim and the named weakening.
import { expect, test } from 'vitest'
import { normalizeEmail } from './email'

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
