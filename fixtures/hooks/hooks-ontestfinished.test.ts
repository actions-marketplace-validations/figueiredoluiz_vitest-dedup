// onTestFinished hook called inside test body, runs after afterEach.
import { test, expect, onTestFinished } from 'vitest'

test('with onTestFinished', () => {
  onTestFinished(() => {})
  expect(1).toBe(1)
})
