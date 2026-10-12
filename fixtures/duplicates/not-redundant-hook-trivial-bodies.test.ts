// Guards `emit_redundant_hook`'s own `!outer.body.trivial && !inner.body.trivial` guard: both
// hooks are EMPTY bodies, the recognized trivial stub, so neither is ever compared and no pair
// can be reported -- reporting "redundant setup" about a hook with no body would be a claim
// about nothing. No fixture in this corpus relied on triviality before this one, which is why
// the corpus gate could not tell "trivial, never compared" from "compared, found different";
// it now reads `Fingerprints::trivial` off the `--emit-test-fingerprints` stream, and this
// expectation's `not-compared` verdict rests on that signal (the solo run completes cleanly --
// triviality is not an unresolved context). Named weakening: give both hooks the corpus's
// standard non-trivial idempotent body (`reset(); migrate()`) and the finding returns.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=not-compared severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical (both empty), so no relation between the participants can fail; the guard is the corpus gate's triviality-eligibility assertion plus the named weakening in the header
// @vitest-dedup:participant L18 "beforeEach"
// @vitest-dedup:participant L26 "beforeEach"
import { describe, test, expect, beforeEach } from 'vitest'

describe('reporting', () => {
  beforeEach(() => {})

  test('totals the day', () => {
    const rows = 3
    expect(rows).toBe(3)
  })

  describe('per region', () => {
    beforeEach(() => {})

    test('totals the region', () => {
      const regions = ['north', 'south']
      expect(regions).toHaveLength(2)
    })
  })
})
