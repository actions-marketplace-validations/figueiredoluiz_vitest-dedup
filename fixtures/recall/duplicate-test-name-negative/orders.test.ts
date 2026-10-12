// RECALL negative -- duplicate-test-name.
//
// The same LEAF title under two sibling `describe` blocks. `DuplicateNameKey` uses
// `TestCase::full_title` -- the suite path joined with the leaf -- so these two are
// `place > handles a rejected card` and `refund > handles a rejected card`: different addresses,
// and `vitest -t` can reach each one. No finding.
//
// Load-bearing: delete either `describe` wrapper and the pair becomes one `duplicate-test-name`
// warning. A key that used the leaf title instead of the full title -- the obvious simplification
// -- would report this pair, which is the precision half this rule needs.
//
// The bodies stay unrelated so nothing else can fire, and both contexts resolve, so the run is not
// incomplete and the silence is a real `distinct` verdict rather than a skipped comparison.
import { describe, expect, test } from 'vitest'
import { place, refund } from './orders'

describe('place', () => {
  test('handles a rejected card', () => {
    expect(place({ card: 'rejected' }).status).toBe('declined')
  })
})

describe('refund', () => {
  test('handles a rejected card', () => {
    expect(refund('order-1')).rejects.toThrow('already refunded')
  })
})
