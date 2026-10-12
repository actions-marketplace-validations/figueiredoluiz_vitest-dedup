// Hooks at file level and 2 nested describe levels. Verifies outer-to-inner beforeEach, inner-to-outer afterEach.
import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from 'vitest'

beforeAll(() => {})
beforeEach(() => {})

describe('Level1', () => {
  beforeEach(() => {})

  describe('Level2', () => {
    test('nested test', () => {
      expect(1).toBe(1)
    })
  })

  afterEach(() => {})
})

afterEach(() => {})
afterAll(() => {})
