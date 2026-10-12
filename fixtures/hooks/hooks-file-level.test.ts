// Top-level hooks with no describe: beforeAll, afterAll, beforeEach, afterEach, 1 test.
import { test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

beforeAll(() => {})
beforeEach(() => {})
afterEach(() => {})
afterAll(() => {})

test('file level test', () => {
  expect(1).toBe(1)
})
