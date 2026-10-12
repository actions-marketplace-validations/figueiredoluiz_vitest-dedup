// RECALL negative -- duplicate-test.
//
// Same assertion shape, same literals, same locals; the SUBJECT differs (`total` vs `subtotal`,
// two different imported functions). `duplicate-test` claims redundancy -- "deleting one loses no
// coverage" -- which is false here: each test covers a different function.
//
// Load-bearing: replace `subtotal` with `total` in the second test and the pair becomes one
// error-severity `duplicate-test`. The negative is one identifier away from the positive, which is
// what makes its silence mean something.
//
// Nothing else may fire either: the two bodies differ in an identifier, not a literal, so
// `parameterization-candidate` (same structure, differing literals) must stay silent as well -- a
// structural key that erased callee identity would report a `test.each` table over two unrelated
// functions.
import { expect, test } from 'vitest'
import { subtotal, total } from './cart'

test('totals a two-line cart', () => {
  const lines = [{ price: 250, quantity: 2 }]
  const sum = total(lines)
  expect(sum).toBe(500)
})

test('subtotals a two-line cart', () => {
  const lines = [{ price: 250, quantity: 2 }]
  const sum = subtotal(lines)
  expect(sum).toBe(500)
})
