// Twin of not-redundant-hook-non-idempotent-event.test.ts: byte-identical to it except that the
// repeated statement is `setPressed(false)` -- an idempotent write -- instead of
// `fireEvent.click(two)`. The pair MUST fire, today and after the S5 idempotence fix: a precision
// fix and a deleted rule produce identical silence, so the negative above is only meaningful
// beside a positive that proves the rule still reports genuinely-idempotent repetition. This is
// also the shipped form of that fixture's named weakening.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L14 "beforeEach"
// @vitest-dedup:participant L23 "beforeEach"
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('toggle group', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('clears the pressed state', () => {
    expect(pressed()).toBe(false)
  })

  describe('and clearing `Two` again', () => {
    beforeEach(() => {
      vi.restoreAllMocks()
    })

    it('stays clear when re-read', () => {
      const state = pressed()
      expect(state).toBe(false)
    })
  })
})
