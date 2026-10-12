// OBSERVED IN REAL CODE: a public test framework's OWN test that nested hooks
// accumulate: a file-level `beforeEach(() => { count += 1 })` and a nested copy of it, with a
// test asserting `count === 2`. The nested increment is load-bearing -- deleting either hook
// changes the count every test below observes -- so `count += 1` is the canonical non-idempotent
// statement: running it twice is not the same as running it once. `redundant-hook` links these
// hooks today (S5, 0/10 precision), so the expectation is pending until the idempotence fix
// lands. Named weakening, runtable in seconds: change `count += 1` to `count = 1` in BOTH hooks
// (an idempotent assignment) and the finding returns -- shipped as
// redundant-hook-assignment-twin.test.ts.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical, so idempotence is a property of the one shared body rather than a relation between participants -- no dimension could fail (D1); the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L19 "beforeEach"
// @vitest-dedup:participant L28 "beforeEach"
import { describe, it, expect, beforeEach } from 'vitest'

let count = 0

beforeEach(() => {
  count += 1
})

it('runs the file-level hook once', () => {
  expect(count).toBe(1)
})

describe('nested', () => {
  beforeEach(() => {
    count += 1
  })

  it('accumulates the nested hook too', () => {
    expect(count).toBe(2)
    expect(count).toBeGreaterThan(1)
  })
})
