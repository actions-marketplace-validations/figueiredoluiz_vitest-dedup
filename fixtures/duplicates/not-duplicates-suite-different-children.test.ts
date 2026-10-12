// Two `describe` blocks with the same title whose contents are NOT copies: one child performs
// an extra behavior step. Expected verdict: silence from `duplicate-suite` -- the suites are
// structurally different, so no suite-level claim can be made. The child pairs below still
// produce findings of their own rules, declared at the end of this file: silence from
// `duplicate-suite` must not silence anything else.
// @vitest-dedup:extracted 4
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates suite-children
// @vitest-dedup:participant L13 "summary"
// @vitest-dedup:participant L26 "summary"
import { describe, test, expect } from 'vitest'

describe('summary', () => {
  test('rounds the total', () => {
    const cart = buildCart()
    cart.refresh()
    expect(cart.total).toBe(90)
  })

  test('lists the items', () => {
    const cart = { items: 2 }
    expect(cart.items).toBe(2)
  })
})

describe('summary', () => {
  test('rounds the total', () => {
    const cart = buildCart()
    cart.refresh()
    expect(cart.total).toBe(90)
    expect(cart.tax).toBe(9)
  })

  test('lists the items', () => {
    const cart = { items: 3 }
    expect(cart.items).toBe(3)
  })
})

// Child-pair expectations, appended after the code so the participant line numbers above stay
// stable. The suites are not copies, but their same-titled children still collide on names, the
// literal-varied pair is still a consolidation candidate, and the extra-statement pair's behavior
// is still a strict subset of its twin's.
// @vitest-dedup:expect rule=duplicate-test-name verdict=name-collision severity=warning
// @vitest-dedup:participant L14 "summary > rounds the total"
// @vitest-dedup:participant L27 "summary > rounds the total"
// @vitest-dedup:expect rule=duplicate-test-name verdict=name-collision severity=warning
// @vitest-dedup:participant L20 "summary > lists the items"
// @vitest-dedup:participant L34 "summary > lists the items"
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L20 "summary > lists the items"
// @vitest-dedup:participant L34 "summary > lists the items"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L14 "summary > rounds the total"
// @vitest-dedup:participant L27 "summary > rounds the total"
