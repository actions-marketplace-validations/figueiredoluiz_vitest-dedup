// Three nested suites, each registering the SAME idempotent `beforeEach` (`reset(); migrate()`).
// `emit_redundant_hook` compares every hook against every LATER hook in the chain
// (`for inner in &hooks[offset + 1..]`), so a chain of three must yield THREE findings:
// outer<->mid, outer<->inner, mid<->inner. `fixtures/recall/redundant-hook-non-adjacent` covers
// one repeating pair across a hook-free middle scope; nothing pinned the all-later-pairs
// semantics at arity three, where an implementation comparing only adjacent chain neighbours
// would report two findings instead of three and stay green everywhere else.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L21 "beforeEach"
// @vitest-dedup:participant L27 "beforeEach"
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L21 "beforeEach"
// @vitest-dedup:participant L33 "beforeEach"
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L27 "beforeEach"
// @vitest-dedup:participant L33 "beforeEach"
import { describe, test, expect, beforeEach, vi } from 'vitest'

describe('outer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('mid', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.resetModules()
    })

    describe('inner', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        vi.resetModules()
      })

      test('sees migrated state', () => {
        expect(state().schema).toBe('current')
      })
    })
  })
})
