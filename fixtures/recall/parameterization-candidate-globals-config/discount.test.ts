// Ambient globals only. Three tests with one shape and three literal values -- the table that
// wants to be a `test.each`.
import { discountFor } from './discount'

test('applies no discount at zero items', () => {
  expect(discountFor(0)).toBe(0)
})

test('applies no discount at one item', () => {
  expect(discountFor(1)).toBe(0)
})

test('applies the bulk discount at ten items', () => {
  expect(discountFor(10)).toBe(15)
})
