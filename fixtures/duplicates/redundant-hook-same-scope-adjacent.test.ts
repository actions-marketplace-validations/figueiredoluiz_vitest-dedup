// The immediate-duplicate form: `beforeEach(x); beforeEach(x)` registered TWICE in ONE scope.
// `emit_redundant_hook`'s own doc comment claims to catch exactly this ("the same check also
// catches an immediate duplicate ... in one scope"), yet every other fixture in this corpus
// nests the repeat inside a child suite -- the claim had no test. The body is the idempotent
// pair this corpus standardised on after the 2026-09-27 idempotence audit: `reset()` then
// `migrate()`, both safe to run twice, so the `redundant` verdict is true of the work repeated.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L14 "beforeEach"
// @vitest-dedup:participant L18 "beforeEach"
import { describe, test, expect, beforeEach, vi } from 'vitest'

describe('reporting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  test('totals the day', () => {
    const rows = 3
    expect(rows).toBe(3)
  })
})
