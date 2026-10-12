// Two tests that are NOT the same shape read twice with different data -- one is a bare call and
// assertion, the other branches on a condition before asserting. Expected verdict: no finding
// under any rule, and specifically not parameterization-candidate: `body.structural` must differ,
// since collapsing literals to their kind never erases the presence of an `if` statement.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable this negative asserts a coarse structural difference rather than isolating one NAMED variable; there is nothing finer for its participants to agree on, and a dimension meaning only "structural differs" would be claimable by every twin in this corpus, which is how an assertion that cannot fail gets shipped
// @vitest-dedup:participant L13 "doubles a positive number"
// @vitest-dedup:participant L17 "rejects negative input instead of doubling it"
import { test, expect } from 'vitest'
import { double } from './math'

test('doubles a positive number', () => {
  expect(double(2)).toBe(4)
})

test('rejects negative input instead of doubling it', () => {
  const input = -1
  if (input < 0) {
    expect(() => double(input)).toThrow()
  } else {
    expect(double(input)).toBeGreaterThan(0)
  }
})
