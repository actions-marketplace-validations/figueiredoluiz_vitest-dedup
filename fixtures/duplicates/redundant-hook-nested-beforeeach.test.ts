// A nested `beforeEach` whose body repeats what an ancestor `beforeEach` already performs: every
// test under the nested suite pays for the same setup twice. Expected verdict: redundant-hook --
// deleting the nested hook loses nothing the ancestor does not already provide. The two tests
// themselves are deliberately unrelated so nothing else fires.
//
// The repeated body is an IDEMPOTENT pair (`reset(); migrate('primary')`), matching the recall
// corpus's own choice: `redundant` claims deleting one side loses no coverage, and that claim is
// only true of work that is safe to run twice. An earlier version of this fixture repeated
// `connect('primary'); db.seed()` -- a second run doubles the rows or throws -- so this positive
// asserted `redundant` over exactly the non-idempotent repetition the 2026-09-27 scan showed this
// rule must not report (S5). Corrected in the sweep that pins that defect. The outer hook is
// byte-identical to the outer hook in not-redundant-hook-different-body.test.ts, because the two
// files' `reporting > monthly totals` tests share a context through it (see the collision note).
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L29 "beforeEach"
// @vitest-dedup:participant L39 "beforeEach"
// CROSS-FILE COLLISION (declared, not dodged): `reporting > monthly totals` below shares its
// body and its whole hook context with its namesake in not-redundant-hook-different-body.test.ts,
// so `cross-file-duplicate` links them. `regional totals` is not linked, because that file's
// nested `beforeEach` seeds a different replica -- the contrast the other fixture exists for.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant not-redundant-hook-different-body.test.ts#L31 "reporting > monthly totals"
// @vitest-dedup:participant L33 "reporting > monthly totals"
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
      audit.mode = 'primary'
    })

    test('regional totals', () => {
      const regions = ['north', 'south']
      expect(regions).toHaveLength(2)
      expect(regions[0]).toBe('north')
    })
  })
})
