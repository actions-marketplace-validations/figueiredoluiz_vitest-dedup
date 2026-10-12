// OBSERVED IN REAL CODE: a public React primitives library's toggle-group suite -- the nested
// `describe('and clicking `Two` again')`, whose `beforeEach` repeats the enclosing scope's
// `fireEvent.click(two)`. The second click is the BEHAVIOUR under test (a toggle returning to its
// unpressed state), not repeated setup: deleting either hook changes what every test below it
// observes. `redundant-hook` reports this pair today -- the 0/10 exhaustive precision result
// (2026-09-27 adjudication, S5) -- so the expectation below is pending until the idempotence fix
// lands; after it does, the named weakening proves the pair still discriminates: replace
// `fireEvent.click(two)` with `setPressed(false)` (an idempotent write) in BOTH hooks and the
// finding returns -- that edit is shipped as redundant-hook-idempotent-event-twin.test.ts.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical, so idempotence is a property of the one shared body rather than a relation between participants -- no dimension could fail (D1); the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L19 "beforeEach"
// @vitest-dedup:participant L28 "beforeEach"
import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent } from './testing'

describe('toggle group', () => {
  beforeEach(() => {
    fireEvent.click(two)
  })

  it('activates Two', () => {
    expect(two.getAttribute('aria-pressed')).toBe('true')
  })

  describe('and clicking `Two` again', () => {
    beforeEach(() => {
      fireEvent.click(two)
    })

    it('deactivates Two', () => {
      expect(two.getAttribute('aria-pressed')).toBe('false')
    })
  })
})
