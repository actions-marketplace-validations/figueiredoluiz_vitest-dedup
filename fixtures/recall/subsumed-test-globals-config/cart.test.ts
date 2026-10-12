// Ambient globals only. The second test does everything the first does and then one thing more,
// so the first adds no coverage the second lacks.
import { applyCoupon, recalculate, total } from './cart'

describe('cart', () => {
  test('applies the coupon', () => {
    applyCoupon('SAVE10')
    expect(total()).toBe(90)
  })

  test('applies the coupon and recalculates', () => {
    applyCoupon('SAVE10')
    expect(total()).toBe(90)
    recalculate()
    expect(total()).toBe(90)
  })
})
