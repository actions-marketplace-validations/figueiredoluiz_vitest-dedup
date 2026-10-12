// Twin of not-redundant-hook-accumulator.test.ts: the same shape with `count = 1` -- an
// idempotent assignment -- in place of `count += 1`. The pair MUST fire, today and after the S5
// fix: re-running an assignment to the same literal is a no-op, so the nested registration truly
// is repeated setup. Without this positive beside it, the accumulator negative above could not
// distinguish an idempotence-aware rule from a deleted one.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L14 "beforeEach"
// @vitest-dedup:participant L23 "beforeEach"
import { describe, it, expect, beforeEach } from 'vitest'

let count = 0

beforeEach(() => {
  count = 1
})

it('sees the file-level assignment', () => {
  expect(count).toBe(1)
})

describe('nested', () => {
  beforeEach(() => {
    count = 1
  })

  it('sees the same value after the nested copy', () => {
    expect(count).toBe(1)
    expect(count).not.toBe(2)
  })
})
