// Same-file context preservation, `test.extend` variant. Uses NEAR-duplicate bodies
// (differently named local, differently phrased assertion) bound to two `test.extend` fixtures
// whose factories produce genuinely different values -- the case a future near-duplication rule
// must also refuse, distinct from not-duplicates-fixture-literal-kind.test.ts (which guards a kind-
// erasure regression with textually identical bodies, not near-duplicate ones).
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates unstateable the claim is "bodies equivalent modulo phrasing, contexts different", and its equal half has no view in --emit-test-fingerprints: alpha, structural and behavior are each phrasing-sensitive by design, this pair differs in all three, and the only field it shares is modifierKey -- too thin an agreement to be a check, since any two modifier-less tests satisfy it. No relation over the current stream can require these participants to agree on anything body-level. MISSING VIEW: a phrasing-insensitive body normalization. PRODUCED BY: near-duplicate normalization equating the two phrasings; when it lands and behavior agrees, restate this expectation as plain `context`
// @vitest-dedup:participant L16 "reads the free-tier quota"
// @vitest-dedup:participant L21 "reads the pro-tier quota"
import { test, expect } from 'vitest'

const withFreeQuota = test.extend({ quota: 100 })
const withProQuota = test.extend({ quota: 100000 })

withFreeQuota('reads the free-tier quota', ({ quota }) => {
  const value = quota
  expect(value).toBeGreaterThan(0)
})

withProQuota('reads the pro-tier quota', ({ quota }) => {
  const remaining = quota
  expect(remaining > 0).toBe(true)
})
