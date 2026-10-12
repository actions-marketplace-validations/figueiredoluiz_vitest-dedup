// beforeEach that returns a cleanup function (runs after afterEach in scope).
import { test, expect, beforeEach } from 'vitest'

beforeEach(() => {
  return () => {
    // cleanup runs here
  }
})

test('with cleanup hook', () => {
  expect(1).toBe(1)
})
