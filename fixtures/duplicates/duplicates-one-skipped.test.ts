// Two tests with identical bodies where one is `.skip`.
// Expected verdict: duplicate-test, with the report noting that one participant is inert.
// NOTE: bodies must be non-trivial, or the triviality guard excludes them from comparison.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L11 "validates input"
// @vitest-dedup:participant L16 "validates input again" [inert]
import { test, expect } from 'vitest'
import { validate } from './validate'

test('validates input', () => {
  const outcome = validate('abc')
  expect(outcome.ok).toBe(true)
})

test.skip('validates input again', () => {
  const outcome = validate('abc')
  expect(outcome.ok).toBe(true)
})
