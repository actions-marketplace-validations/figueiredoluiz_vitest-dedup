// Precondition-violating twin for the "extracted local" transformation. The
// transformation's precondition is that the expression is evaluated exactly once either way; here
// extraction changes the evaluation COUNT. `nextId()` has a side effect (increments a counter), so
// caching it in a local and reusing that local observes ONE call, while re-invoking the call
// expression twice observes TWO. Same two `expect` lines, same matcher, genuinely different
// behavior.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable this fixture exists to DENY an equivalence, not to isolate a variable within one. Its two bodies are meant to differ, and they do at every emitted view (alpha, structural, behavior); asserting that inequality would restate the fixture's premise rather than test it, and no equality remains to pin. The difference is an extracted local that changes the evaluation count -- and a view that erased it would assume the very equivalence this twin exists to deny
// @vitest-dedup:participant L15 "reuses one cached id for both checks"
// @vitest-dedup:participant L22 "calls nextId again for the second check"
import { test, expect } from 'vitest'
import { nextId, resetIds } from './ids'

test('reuses one cached id for both checks', () => {
  resetIds()
  const id = nextId()
  expect(id).toBe(1)
  expect(id).toBe(1)
})

test('calls nextId again for the second check', () => {
  resetIds()
  expect(nextId()).toBe(1)
  expect(nextId()).toBe(2)
})
