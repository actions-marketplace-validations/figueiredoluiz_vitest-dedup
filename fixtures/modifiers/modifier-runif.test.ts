// 1 suite with .runIf(cond). Inverse of skipIf.
import { describe, test, expect } from 'vitest'

describe.runIf(false)('conditionally skipped suite', () => {
  test('test in conditional suite', () => {
    expect(1).toBe(1)
  })
})
