// One test's assertion runs directly; the other's identical-looking assertion is wrapped in a
// callback handed to a function that may never invoke it (an event listener that may never fire).
// A body that only counts "an expect() call exists in the source" would treat these as duplicate
// coverage even though one of them can pass having observed nothing.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable this fixture exists to DENY an equivalence, not to isolate a variable within one. Its two bodies are meant to differ, and they do at every emitted view (alpha, structural, behavior); asserting that inequality would restate the fixture's premise rather than test it, and no equality remains to pin. The difference is a deferred-callback wrapper plus the call that arms it
// @vitest-dedup:participant L13 "emits a ready event synchronously"
// @vitest-dedup:participant L18 "emits a ready event, observed via a callback"
import { test, expect } from 'vitest'
import { Emitter } from './emitter'

test('emits a ready event synchronously', () => {
  const emitter = new Emitter()
  expect(emitter.readyNow()).toBe(true)
})

test('emits a ready event, observed via a callback', () => {
  const emitter = new Emitter()
  emitter.on('ready', () => {
    expect(emitter.readyNow()).toBe(true)
  })
  emitter.arm()
})
