// Boundary probe for the S5 idempotence work, placed JUST PAST the edge the fix draws. The
// repeated body is `if (!db) db = connect()`: the CALLEE is not idempotent (a bare second
// `connect()` would open a second handle), but the STATEMENT is guarded, so on the second run
// the guard is false and nothing happens. This pair must keep firing: an implementation that
// keyed idempotence on the callee's NAME (a `connect()`-shaped denylist) would go silent here,
// over-correcting the 0/10 precision defect into a recall defect. It does fire -- shape (ii),
// "guarded initialization", in `extract::hook_body_is_idempotent`, which never looks at what the
// callee is called.
//
// CORRECTED: this header used to say "the guard makes re-running it a no-op", flatly. That
// overstates it, and the overstatement is load-bearing enough to fix rather than leave. `!db` is
// falsy again whenever `connect()` returns `''`, `0`, `null` or `undefined`, so such a body
// re-runs the call on every pass and is NOT idempotent. The same hole applies to `x ||= f()` and
// `x ??= f()`. The fix treats these as `Guarded` rather than unconditionally safe and refuses the
// body when any other statement writes the guarded binding -- it does not, and cannot, prove the
// initializer returns something truthy.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L24 "beforeEach"
// @vitest-dedup:participant L34 "beforeEach"
import { describe, test, expect, beforeEach } from 'vitest'

describe('reporting', () => {
  beforeEach(() => {
    if (!db) db = connect()
  })

  test('totals the day', () => {
    const rows = 3
    expect(rows).toBe(3)
  })

  describe('per region', () => {
    beforeEach(() => {
      if (!db) db = connect()
    })

    test('totals the region', () => {
      const regions = ['north', 'south']
      expect(regions).toHaveLength(2)
    })
  })
})
