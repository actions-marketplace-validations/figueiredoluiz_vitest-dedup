// A `describe.each` whose generated suites each inherit the SAME two `beforeEach`
// registrations written inside the callback. Both hooks share one declaration site across every
// generated suite, and `emit_redundant_hook` deduplicates pairs by `(outer location, inner
// location)` before emitting -- so the answer here is exactly ONE finding, not one per generated
// suite. Nothing else pinned the interaction of `describe.each` expansion with hook-pair dedup;
// an implementation that keyed the pair map per suite would report two findings here and pass
// every other fixture in this corpus.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L18 "beforeEach"
// @vitest-dedup:participant L22 "beforeEach"
import { describe, test, expect, beforeEach, vi } from 'vitest'

describe.each([
  { role: 'admin', scope: ['read', 'write'] },
  { role: 'viewer', scope: ['read'] },
])('$role permissions', ({ scope }) => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('grants its scope', () => {
    expect(scope.length).toBeGreaterThan(0)
  })
})
