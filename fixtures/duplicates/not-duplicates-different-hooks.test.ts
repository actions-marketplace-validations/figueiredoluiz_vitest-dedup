// Two tests with identical bodies under DIFFERENT beforeEach hooks.
// Expected verdict: NOT a duplicate. The hook chain is part of effective behavior.
// NOTE: the hook bodies must differ in CODE, not in comments. Comments are stripped during
// fingerprinting, so comment-only hooks would compare equal and this fixture would assert nothing.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant L19 "group 1 > computation one"
// @vitest-dedup:participant L29 "group 2 > computation two"
import { test, expect, describe, beforeEach } from 'vitest'

let total = 0

describe('group 1', () => {
  beforeEach(() => {
    total = 1
  })

  test('computation one', () => {
    expect(total + 1).toBe(2)
  })
})

describe('group 2', () => {
  beforeEach(() => {
    total = 99
  })

  test('computation two', () => {
    expect(total + 1).toBe(2)
  })
})
