// RECALL mixed -- two DIFFERENT rules must fire on one file, on different things.
//
// A rule that suppresses another is the failure this case exists to catch, and it is invisible to
// single-rule cases by construction: every `-positive` in this corpus contains exactly one kind of
// defect, so nothing there can observe interference. Here the redundant hook sits in the same
// describe as the duplicated pair, which is the arrangement most likely to make one finding eat
// the other -- the hook is part of the context both tests are compared under.
//
// Expected, independently:
//   redundant-hook   the inner beforeEach repeats the outer one verbatim
//   duplicate-test   the two `settles the balance` bodies are identical under that same context
//
// Named weakening: delete the inner beforeEach and the redundant-hook finding must go while the
// duplicate-test finding stays; change one literal in the second test and the reverse must hold.
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { balance, settle } from './checkout'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('settles the balance', () => {
    settle('order-1')
    expect(balance('order-1')).toBe(0)
  })

  test('settles the balance again', () => {
    settle('order-1')
    expect(balance('order-1')).toBe(0)
  })
})
