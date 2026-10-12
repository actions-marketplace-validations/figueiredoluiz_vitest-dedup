// Standard test file matching default include glob '**/*.{test,spec}.?(c|m)[jt]s?(x)'
import { test, expect } from 'vitest'

test('matches default include', () => {
  expect(true).toBe(true)
})
