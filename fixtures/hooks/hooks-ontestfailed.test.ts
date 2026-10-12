// onTestFailed hook called inside test body, runs only if test fails.
import { test, expect, onTestFailed } from 'vitest'

test('with onTestFailed', () => {
  onTestFailed((ctx) => {})
  expect(1).toBe(1)
})
