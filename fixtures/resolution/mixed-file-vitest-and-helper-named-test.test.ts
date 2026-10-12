// Vitest test file with local variable named 'test' that shadows the import.
// Must not be misidentified as test via name-matching alone.
import { test as t, expect } from 'vitest'

const test = { name: 'helper object' }

t('uses vitest import not shadowed test', () => {
  expect(test.name).toBe('helper object')
})
