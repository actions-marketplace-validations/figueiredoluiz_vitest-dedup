// A composable-library shape, recorded from the external corpus: the SAME helper called via two different
// overloads -- positional arguments vs a single options object. Same helper, same intent, but the
// call shapes are not structurally comparable (different argument count and node kind), so this
// must stay distinct rather than being forced into a false match.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable this fixture exists to DENY an equivalence, not to isolate a variable within one. Its two bodies are meant to differ, and they do at every emitted view (alpha, structural, behavior); asserting that inequality would restate the fixture's premise rather than test it, and no equality remains to pin. The difference IS the argument form (positional vs options object), which cannot be set aside without setting aside the arguments entirely
// @vitest-dedup:participant L13 "debounces with positional arguments"
// @vitest-dedup:participant L17 "debounces with an options object"
import { test, expect } from 'vitest'
import { useDebounce } from './debounce'

test('debounces with positional arguments', () => {
  expect(useDebounce(() => {}, 300)).toBeDefined()
})

test('debounces with an options object', () => {
  expect(useDebounce({ fn: () => {}, wait: 300 })).toBeDefined()
})
