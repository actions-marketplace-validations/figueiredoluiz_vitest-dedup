// RECALL mixed -- a literal-variant pair and a redundant nested hook in one file.
//
// parameterization-candidate compares test bodies under an ambient context the hook chain is
// part of, so the redundant hook sits inside the very context the pair is compared under -- the
// arrangement most likely to make one analysis disturb the other. Both findings must appear
// independently.
//
// Expected, independently:
//   parameterization-candidate warning, the two `charges` bodies differ only in literals
//   redundant-hook               warning, the inner beforeEach repeats the outer one verbatim
//
// Named weakening: equalize the two `charges` literals and parameterization-candidate must go
// while redundant-hook stays; change the inner hook body and the reverse.
import { beforeEach, describe, expect, test } from 'vitest'
import { charge } from './pricing'

beforeEach(() => {
  process.env.PRICING_MODE = 'net'
})

describe('pricing', () => {
  beforeEach(() => {
    process.env.PRICING_MODE = 'net'
  })

  test('charges nothing for an empty basket', () => {
    expect(charge(0)).toBe(0)
  })

  test('charges the bulk price for ten items', () => {
    expect(charge(10)).toBe(85)
  })
})
