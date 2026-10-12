// Twin of near-chai-property-chain-differs.test.ts: the SAME chai property chain
// (`expect(spy).to.have.been.calledTwice`) on both sides, with the bodies differing only in a
// reordered independent setup call. The `near-duplicate-test` finding must survive the S9 fix --
// teaching behavior identity about property-chain assertions must not blind the rule on every
// file that uses chai style, which is what deleting the rule or over-suppressing it would do.
// The corpus gate's textual-distinctness check applies to this positive: the two participants'
// raw token streams differ (the reordered setup), as required.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=near-duplicate-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L14 "counts the calls after loading"
// @vitest-dedup:participant L22 "after loading, counts the calls"
import { test, expect, vi } from 'vitest'

test('counts the calls after loading', () => {
  const spy = vi.fn()
  loadConfig()
  spy()
  spy()
  expect(spy).to.have.been.calledTwice
})

test('after loading, counts the calls', () => {
  loadConfig()
  const spy = vi.fn()
  spy()
  spy()
  expect(spy).to.have.been.calledTwice
})
