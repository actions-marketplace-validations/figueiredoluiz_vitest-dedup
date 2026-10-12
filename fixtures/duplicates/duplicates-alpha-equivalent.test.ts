// Two tests whose bodies are alpha-equivalent: same structure, different local variable names.
// Expected verdict: duplicate-test. This is exactly what alpha-normalization exists to catch.
// Titles are deliberately distinct so this fixture isolates duplicate-test from duplicate-test-name.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L11 "processes result via value"
// @vitest-dedup:participant L16 "processes result via num"
import { test, expect } from 'vitest'
import { compute } from './compute'

test('processes result via value', () => {
  const value = compute(42)
  expect(value).toBe(42)
})

test('processes result via num', () => {
  const num = compute(42)
  expect(num).toBe(42)
})
