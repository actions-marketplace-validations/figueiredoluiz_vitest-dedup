// RECALL mixed -- a duplicated suite pair and a cross-file copy of a test INSIDE one copy.
//
// The suite-level suppression is scoped to same-file twin spans -- a suite's span cannot contain
// a location in another file -- so a cross-file-duplicate finding with one participant inside a
// copied suite must SURVIVE alongside the suite finding, while the same-file cross-copy
// duplicate-test restatement between the copies is suppressed. This is the one arrangement that
// pins both halves of that boundary against real output.
//
// Expected, independently:
//   duplicate-suite      warning, the two `audit` blocks
//   cross-file-duplicate warning, the report-file copy against one in-suite declaration
//
// Named weakening: delete the report file and cross-file-duplicate must go while duplicate-suite
// stays; make the report copy's body differ in one literal and cross-file-duplicate must go
// while duplicate-suite stays.
import { describe, expect, test } from 'vitest'
import { stampLedger } from './ledger'

describe('audit', () => {
  test('stamps the ledger page', () => {
    expect(stampLedger('page-1')).toBe('page-1/stamped')
  })
})

describe('audit', () => {
  test('stamps the ledger page', () => {
    expect(stampLedger('page-1')).toBe('page-1/stamped')
  })
})
