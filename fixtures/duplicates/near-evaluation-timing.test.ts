// Same read expression, same matcher -- but one test reads the value BEFORE a mutation and the
// other reads it AFTER. The call shapes line up almost line for line; only the position of the
// mutating statement relative to the read differs, and that position is the entire point of each
// test.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates statement-order,identifier,literal
// @vitest-dedup:participant L13 "reads the counter before incrementing"
// @vitest-dedup:participant L20 "reads the counter after incrementing"
import { test, expect } from 'vitest'
import { Counter } from './counter'

test('reads the counter before incrementing', () => {
  const counter = new Counter()
  const before = counter.value
  counter.increment()
  expect(before).toBe(0)
})

test('reads the counter after incrementing', () => {
  const counter = new Counter()
  counter.increment()
  const after = counter.value
  expect(after).toBe(1)
})
