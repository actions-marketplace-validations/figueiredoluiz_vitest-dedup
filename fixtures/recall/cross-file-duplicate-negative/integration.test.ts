// RECALL negative -- cross-file-duplicate (side B). See `unit.test.ts` for the claim.
import { expect, test } from 'vitest'
import { normalizePhone } from './contact'

test('normalizes a phone number end to end', () => {
  const normalized = normalizePhone('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
