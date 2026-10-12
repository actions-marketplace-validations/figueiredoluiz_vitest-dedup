// A nested `beforeEach` that looks like the ancestor's but targets different state: the bodies
// differ in a literal, so the nested hook is additional setup, not repeated setup (both bodies are
// idempotent -- a constant overwrite, so re-running either is a no-op -- which keeps this
// negative about the LITERAL and not about non-idempotent work; see S5). Expected verdict: silence
// from redundant-hook -- alpha-normalized equality of hook bodies is the whole
// claim, and these two bodies are not alpha-equal. Isolation claim: the two `beforeEach` bodies
// agree at `structural` (same shape -- one assignment of a string literal) and differ at `alpha`
// (the migration target is a different string literal), which is exactly the pair
// `redundant-hook`'s alpha-only comparison must still tell apart.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates hook-literal
// @vitest-dedup:participant L27 "beforeEach"
// @vitest-dedup:participant L37 "beforeEach"
// CROSS-FILE COLLISION (declared, not dodged): `reporting > monthly totals` below sits under the
// same `describe` and the same ancestor `beforeEach` as its namesake in
// redundant-hook-nested-beforeeach.test.ts, with the same body, so `cross-file-duplicate` links
// them. `regional totals` is NOT linked: the nested hooks differ, which is this fixture's claim
// and is now also asserted across a file boundary.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L31 "reporting > monthly totals"
// @vitest-dedup:participant redundant-hook-nested-beforeeach.test.ts#L33 "reporting > monthly totals"
import { describe, test, expect, beforeEach, vi } from 'vitest'

describe('reporting', () => {
  beforeEach(() => {
    audit.mode = 'primary'
  })

  test('monthly totals', () => {
    const rows = 4
    expect(rows).toBe(4)
  })

  describe('per region', () => {
    beforeEach(() => {
      audit.mode = 'replica'
    })

    test('regional totals', () => {
      const regions = ['north', 'south']
      expect(regions).toHaveLength(2)
      expect(regions[0]).toBe('north')
    })
  })
})
