// RECALL mixed -- cross-file-duplicate side of mixed-cross-file-and-suite. See ledger.test.ts in
// this directory for the claim and the named weakening.
import { expect, test } from 'vitest'
import { stampLedger } from './ledger'

test('stamps the ledger page', () => {
  expect(stampLedger('page-1')).toBe('page-1/stamped')
})
