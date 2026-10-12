// MIXED: S5 (non-idempotent repeated hook) x S6 (cross-file duplicate), in one pair of files.
//
// Both files hold the same test body under an equivalent context, so `cross-file-duplicate`
// fires between them -- a finding this fixture asserts as a real positive. Each file ALSO has a
// nested `beforeEach` repeating its ancestor's non-idempotent work (`audit.push(...)`, which
// appends), which `redundant-hook` links today and must not.
//
// WHY THE PAIRING: an S5 fix that suppresses findings per FILE rather than per HOOK PAIR would
// take the cross-file finding with it. This file is what notices. Read the other way, an S6 fix
// that starts distinguishing these two files by their hook chain would delete the cross-file
// positive -- the hooks are identical across the pair, so they cannot be the discriminator.
//
// Named weakening for the pending half: change both `audit.push('open')` calls to
// `audit.length = 0` (idempotent) and `redundant-hook` fires beside the cross-file finding,
// which is the state this fixture is waiting for.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L36 "audited > reads the ledger"
// @vitest-dedup:participant mixed-nonidempotent-hook-cross-file-b.test.ts#L28 "audited > reads the ledger"
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical, so idempotence is a property of the one shared body rather than a relation between participants -- no dimension could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L27 "beforeEach"
// @vitest-dedup:participant L32 "beforeEach"
import { describe, test, expect, beforeEach } from 'vitest'
import { audit, ledgerTotal } from './shared-ledger'

beforeEach(() => {
  audit.push('open')
})

describe('audited', () => {
  beforeEach(() => {
    audit.push('open')
  })

  test('reads the ledger', () => {
    const total = ledgerTotal([5, 10, 15])
    expect(total).toBe(30)
  })
})
