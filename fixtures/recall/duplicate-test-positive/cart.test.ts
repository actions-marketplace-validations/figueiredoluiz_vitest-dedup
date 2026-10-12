// RECALL positive -- duplicate-test.
//
// Two tests observe the same behavior with every local renamed and the setup spelled differently.
// `duplicate-test` compares the alpha-normalized body, so renaming every binding is invisible to
// it: the expectation is ONE error-severity finding linking both tests.
//
// Load-bearing in the other direction too: a token-level copy-paste detector cannot link these two
// bodies, because they share almost no token sequence. This is the recall claim the product rests
// on, stated as a case rather than as prose.
import { expect, test } from 'vitest'
import { total } from './cart'

test('totals a two-line cart', () => {
  const lines = [{ price: 250, quantity: 2 }]
  const sum = total(lines)
  expect(sum).toBe(500)
})

test('adds up the basket', () => {
  const entries = [{ price: 250, quantity: 2 }]
  const amount = total(entries)
  expect(amount).toBe(500)
})
