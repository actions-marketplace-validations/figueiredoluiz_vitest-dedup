// Two tests with the SAME title but different bodies.
// Expected verdict: duplicate-test-name only. NOT duplicate-test.
// Bodies are deliberately unique to this fixture so a whole-directory corpus run does not
// accidentally match another fixture's bodies and contaminate the baseline.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test-name verdict=name-collision severity=warning
// @vitest-dedup:participant L12 "computation"
// @vitest-dedup:participant L16 "computation"
import { test, expect } from 'vitest'
import { parseName } from './names'

test('computation', () => {
  expect(parseName('Ada Lovelace').first).toBe('Ada')
})

test('computation', () => {
  expect(parseName('Grace Hopper').last).toBe('Hopper')
})
