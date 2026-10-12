// MIXED: the twin of mixed-nonidempotent-hook-cross-file-a.test.ts. See that file's header for
// the S5 x S6 interaction; the declarations below are the same pair stated from this side, as
// `fixtures/duplicates/` requires of every cross-file collision.
//
// This file differs from its twin only in a leading comment and one unrelated local test, so the
// shared body and the hook chain are identical across the pair. That is deliberate: it is what
// makes the hooks unusable as a discriminator for any S6 fix.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant mixed-nonidempotent-hook-cross-file-a.test.ts#L36 "audited > reads the ledger"
// @vitest-dedup:participant L28 "audited > reads the ledger"
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical, so idempotence is a property of the one shared body rather than a relation between participants -- no dimension could fail; the guard is the corpus gate's silence assertion plus the named weakening in the twin's header
// @vitest-dedup:participant L19 "beforeEach"
// @vitest-dedup:participant L24 "beforeEach"
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

  test('reports an empty ledger as zero', () => {
    expect(ledgerTotal([])).toBe(0)
  })
})
