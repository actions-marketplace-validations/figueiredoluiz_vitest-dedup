// Same-file context preservation, `vi.mock` variant. Pair with
// near-context-vimock-differs-b.test.ts. The existing mock negative
// (not-duplicates-different-mocks-a/b.test.ts) uses textually identical bodies; this pair uses
// NEAR-duplicate bodies (differently named local, differently phrased comparison) under two
// DIFFERENT `vi.mock` factories for the same module -- the case a future near-duplication rule must
// also refuse.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates unstateable the claim is "bodies equivalent modulo phrasing, contexts different", and its equal half has no view in --emit-test-fingerprints: alpha, structural and behavior are each phrasing-sensitive by design, this pair differs in all three, and the only field it shares is modifierKey -- too thin an agreement to be a check, since any two modifier-less tests satisfy it. No relation over the current stream can require these participants to agree on anything body-level. MISSING VIEW: a phrasing-insensitive body normalization. PRODUCED BY: near-duplicate normalization equating the two phrasings; when it lands and behavior agrees, restate this expectation as plain `context`
// @vitest-dedup:participant L17 "reads the configured limit"
// @vitest-dedup:participant near-context-vimock-differs-b.test.ts#L13 "reads the configured limit"
import { test, expect, vi } from 'vitest'
import { limit } from './limits'

vi.mock('./limits', () => ({ limit: 10 }))

test('reads the configured limit', () => {
  const currentLimit = limit
  expect(currentLimit).toBeGreaterThan(0)
})
