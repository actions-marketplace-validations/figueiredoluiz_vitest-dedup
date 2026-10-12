// 1 skipped test, 1 skipped suite. Modifier::Skip on each.
import { test, describe, expect } from 'vitest'

test.skip('skipped test', () => {
  expect(true).toBe(true)
})

describe.skip('skipped suite', () => {
  test('test in skipped suite', () => {
    expect(1).toBe(1)
  })
})
