// 1 only test, 1 only suite. Modifier::Only on each.
import { test, describe, expect } from 'vitest'

test.only('only test', () => {
  expect(1).toBe(1)
})

describe.only('only suite', () => {
  test('test in only suite', () => {
    expect(1).toBe(1)
  })
})
