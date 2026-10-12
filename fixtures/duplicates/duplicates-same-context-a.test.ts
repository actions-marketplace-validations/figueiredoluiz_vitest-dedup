// Two tests with identical bodies and an identical hook context in one file.
// Expected verdict: duplicate-test. The baseline positive case.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L14 "adds two numbers"
// @vitest-dedup:participant L18 "sums one and one"
import { test, expect, beforeEach } from 'vitest'
import { reset, add } from './calculator'

beforeEach(() => {
  reset()
})

test('adds two numbers', () => {
  expect(add(1, 1)).toBe(2)
})

test('sums one and one', () => {
  expect(add(1, 1)).toBe(2)
})
