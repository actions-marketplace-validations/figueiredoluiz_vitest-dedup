// RECALL mixed -- a duplicated suite pair whose copies EACH contain a redundant nested hook.
//
// redundant-hook is not in the suite-level suppression's rule list, and its participants are
// hooks rather than tests, so a within-copy hook redundancy must survive next to the suite
// finding -- once per copy, since both copies carry the same nested hook pair. An
// over-broad suppression (any finding inside a twin span) would swallow both hook findings, and
// is only observable in this arrangement.
//
// Expected, independently:
//   duplicate-suite warning, the two `billing` blocks -- and the two nested `orders` blocks,
//                        which are a second alpha-equal suite pair of their own (identical
//                        copies duplicate at every level they exist at)
//   redundant-hook  warning, one finding per copy, over that copy's nested beforeEach pair
//
// Named weakening: change one copy's nested hook body and that copy's redundant-hook finding
// must go while the other copy's and both duplicate-suite findings stay.
import { describe, expect, test, beforeEach } from 'vitest'
import { readMeter } from './billing'

describe('billing', () => {
  beforeEach(() => {
    process.env.METER = '1'
  })

  describe('orders', () => {
    beforeEach(() => {
      process.env.METER = '1'
    })

    test('reads the meter', () => {
      expect(readMeter()).toBe(1)
    })
  })
})

describe('billing', () => {
  beforeEach(() => {
    process.env.METER = '1'
  })

  describe('orders', () => {
    beforeEach(() => {
      process.env.METER = '1'
    })

    test('reads the meter', () => {
      expect(readMeter()).toBe(1)
    })
  })
})
