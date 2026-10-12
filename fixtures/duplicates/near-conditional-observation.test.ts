// One test's assertion sits inside a branch that may not execute at runtime; the other asserts the
// same shape unconditionally. Even if the branch happens to be taken every time today, the static
// bodies are not equivalent: the conditional one carries a code path where nothing is observed at
// all, so it cannot be treated as duplicate coverage of the unconditional one.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable this fixture exists to DENY an equivalence, not to isolate a variable within one. Its two bodies are meant to differ, and they do at every emitted view (alpha, structural, behavior); asserting that inequality would restate the fixture's premise rather than test it, and no equality remains to pin. The difference is a conditional wrapper around the assertion plus the local it needs
// @vitest-dedup:participant L13 "reports the queue length unconditionally"
// @vitest-dedup:participant L17 "reports the queue length only when non-empty"
import { test, expect } from 'vitest'
import { queueLength } from './queue'

test('reports the queue length unconditionally', () => {
  expect(queueLength([1, 2])).toBe(2)
})

test('reports the queue length only when non-empty', () => {
  const items = [1, 2]
  if (items.length > 0) {
    expect(queueLength(items)).toBe(2)
  }
})
