// RECALL negative -- `expect.poll` is not a plain assertion, and a custom matcher used twice the
// same way IS a duplicate. Two claims, both correct today, neither previously covered.
//
// `expect.poll(fn).toBe(x)` re-invokes `fn` until it matches or the timeout expires; `expect(x)`
// evaluates once. A test that waits for a value to settle and a test that demands it already has
// are different tests, and the first is the only one that catches a race. They are kept apart by
// the awaited call and the chain, which is what this half pins.
//
// The second pair is the counterweight, and the reason this case is not just an assertion about
// silence: the same custom matcher applied to the same value twice really is a duplicate, and is
// reported at error severity. Registering a matcher does not make the tests that use it
// incomparable -- only DIVERGENT registrations do, which is the separate known false positive in
// `cross-file-duplicate-module-scope-custom-matcher`. Read together the two cases say where the
// line is.
//
// Named weakening: drop `await expect.poll(...)` to a plain `expect(...)` and the first pair
// becomes a duplicate-test; change one matcher argument in the second pair and it stops being one.
import { expect, test } from 'vitest'
import { fetchStatus, parseRange } from './api'

expect.extend({
  toBeWithin(received: number, low: number, high: number) {
    return { pass: received >= low && received <= high, message: () => 'out of range' }
  },
})

test('eventually reports ready', async () => {
  await expect.poll(() => fetchStatus()).toBe('ready')
})

test('reports ready immediately', () => {
  expect(fetchStatus()).toBe('ready')
})

test('parses a range low', () => {
  expect(parseRange('1-9').start).toBeWithin(1, 9)
})

test('parses a range high', () => {
  expect(parseRange('1-9').start).toBeWithin(1, 9)
})
