// 1 test with .sequential modifier (pre-v5 syntax, removed in v5 but must parse)
import { test, expect } from 'vitest'

test.sequential('legacy sequential test', () => {
  expect(1).toBe(1)
})
