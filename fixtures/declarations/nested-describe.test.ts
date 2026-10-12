// Nested suites: root > level1 > level2, tests at each level. Suite path identity ['Utils', 'Math', 'Arithmetic']
import { describe, test, expect } from 'vitest'

describe('Utils', () => {
  test('utility 1', () => {
    expect(true).toBe(true)
  })

  describe('Math', () => {
    test('math 1', () => {
      expect(1).toBe(1)
    })

    describe('Arithmetic', () => {
      test('arithmetic 1', () => {
        expect(2 + 2).toBe(4)
      })
    })
  })
})
