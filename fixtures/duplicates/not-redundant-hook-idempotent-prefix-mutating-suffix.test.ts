// Variant guarding the GRANULARITY of the S5 fix: the repeated body is `reset(); seed()` -- the
// FIRST statement is idempotent, the SECOND is not (`seed()` inserts rows; seeding twice doubles
// them). A fix that declares a whole body idempotent because its first statement is, or that
// checks only the leading statement, would wrongly report this pair as redundant setup.
// `redundant-hook` links these hooks today (S5), so the expectation is pending until the fix
// lands. Named weakening: delete `seed()` from BOTH hooks, leaving the idempotent `reset()`
// alone, and the finding returns.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical, so idempotence is a property of the one shared body rather than a relation between participants -- no dimension could fail (D1); the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L16 "beforeEach"
// @vitest-dedup:participant L27 "beforeEach"
import { describe, it, expect, beforeEach } from 'vitest'

describe('reporting', () => {
  beforeEach(() => {
    reset()
    seed()
  })

  it('totals the seeded day', () => {
    const rows = 3
    expect(rows).toBe(3)
  })

  describe('per region', () => {
    beforeEach(() => {
      reset()
      seed()
    })

    it('totals the seeded region', () => {
      const regions = ['north', 'south']
      expect(regions).toHaveLength(2)
    })
  })
})
