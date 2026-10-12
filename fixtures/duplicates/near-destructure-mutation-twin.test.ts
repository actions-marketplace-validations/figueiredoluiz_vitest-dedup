// Precondition-violating twin for the "destructure vs member access" transformation. The
// transformation's precondition is that the object is NOT mutated between binding and use; here a
// mutation happens in between, so the destructured snapshot and the live member access observe
// different values. Same shape (bind, mutate, assert) but the destructure captures the OLD value
// while the member access reflects the NEW one.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable this fixture exists to DENY an equivalence, not to isolate a variable within one. Its two bodies are meant to differ, and they do at every emitted view (alpha, structural, behavior); asserting that inequality would restate the fixture's premise rather than test it, and no equality remains to pin. The difference is a destructuring binding whose presence changes what the body does
// @vitest-dedup:participant L13 "destructured binding is unaffected by the later mutation"
// @vitest-dedup:participant L20 "member access reflects the mutation"
import { test, expect } from 'vitest'

test('destructured binding is unaffected by the later mutation', () => {
  const state = { count: 1 }
  const { count } = state
  state.count = 2
  expect(count).toBe(1)
})

test('member access reflects the mutation', () => {
  const state = { count: 1 }
  state.count = 2
  expect(state.count).toBe(2)
})
