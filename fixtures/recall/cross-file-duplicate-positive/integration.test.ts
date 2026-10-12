// RECALL positive -- cross-file-duplicate (side B). See `unit.test.ts` for the claim.
//
// Renamed local, different title, same behavior: alpha normalization is what lets the rule link
// these, so a token-level comparison of the two files would not.
import { expect, test } from 'vitest'
import { normalizeEmail } from './email'

test('normalizes a mixed-case address end to end', () => {
  const address = normalizeEmail('User@Example.COM')
  expect(address).toBe('user@example.com')
})
