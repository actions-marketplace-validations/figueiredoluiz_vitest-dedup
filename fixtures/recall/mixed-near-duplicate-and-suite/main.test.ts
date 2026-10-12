// RECALL mixed -- a duplicated suite pair and a reordered pair OUTSIDE the copies.
//
// Like mixed-parameterization-and-suite but for the behavior-keyed rule: the suite-level
// suppression must not reach a near-duplicate finding whose participants both live outside the
// copied describes, and the copies' own cross-copy duplicate-test restatement must stay
// suppressed while the suite finding and the reorder finding coexist.
//
// Expected, independently:
//   duplicate-suite     warning, the two `taxes` blocks
//   near-duplicate-test warning, the two top-level setup bodies perform the same events reordered
//
// Named weakening: move one setup test inside a copy (keeping its twin outside) and the
// near-duplicate finding must go -- a cross-copy finding -- while the suite finding stays.
import { describe, expect, test } from 'vitest'
import { applyTax, configure, isReady, seed } from './setup'

describe('taxes', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
})

describe('taxes', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
})

test('configures then seeds', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})

test('seeds then configures', () => {
  seed({ users: 3 })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})
