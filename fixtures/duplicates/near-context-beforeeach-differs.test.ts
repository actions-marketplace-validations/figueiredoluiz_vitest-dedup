// Same-file context preservation. Context compatibility is the single
// biggest precision lever, and the existing hook negative (not-duplicates-different-hooks.test.ts)
// uses textually IDENTICAL bodies -- exact duplicate-test already refuses that pair for free. This
// fixture instead uses NEAR-duplicate bodies (same shape, differently named locals and a
// differently phrased but equivalent read) under two DIFFERENT `beforeEach` hooks, which is the
// case a future near-duplication rule must also refuse: similar bodies plus incompatible context is
// still not redundant.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates unstateable the claim is "bodies equivalent modulo phrasing, contexts different", and its equal half has no view in --emit-test-fingerprints: alpha, structural and behavior are each phrasing-sensitive by design, this pair differs in all three, and the only field it shares is modifierKey -- too thin an agreement to be a check, since any two modifier-less tests satisfy it. No relation over the current stream can require these participants to agree on anything body-level. MISSING VIEW: a phrasing-insensitive body normalization. PRODUCED BY: near-duplicate normalization equating the two phrasings; when it lands and behavior agrees, restate this expectation as plain `context`
// @vitest-dedup:participant L22 "starter tier > reports the seat count"
// @vitest-dedup:participant L33 "enterprise tier > reports the seat count"
import { test, expect, describe, beforeEach } from 'vitest'

let seats = 0

describe('starter tier', () => {
  beforeEach(() => {
    seats = 5
  })

  test('reports the seat count', () => {
    const currentSeats = seats
    expect(currentSeats).toBeGreaterThan(0)
  })
})

describe('enterprise tier', () => {
  beforeEach(() => {
    seats = 500
  })

  test('reports the seat count', () => {
    const total = seats
    expect(total > 0).toBe(true)
  })
})
