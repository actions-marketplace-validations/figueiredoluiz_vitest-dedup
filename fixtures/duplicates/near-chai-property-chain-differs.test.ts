// OBSERVED IN REAL CODE: a public test framework's own chai-compatibility suite --
// `expect(spy).to.not.have.been.calledOnce` against `expect(spy).to.have.been.calledTwice`:
// opposite polarity AND a different assertion, reported by `near-duplicate-test` as "the same
// behavior events in the same order". A chai property chain has no call node, so only the shared
// `vi.fn(); spy(); spy()` setup was compared -- the assertion itself contributed nothing to
// behavior identity (S9). Fixed: `BehaviorCollector::property_chain_event` records a chain as one
// `assert:chain:` event, verbatim, so the differing links -- `not` included -- reach the trace and
// the two bodies no longer produce the same behavior events.
// Named weakening: make both chains identical (`expect(spy).to.have.been.calledTwice` on both
// sides) -- the pair then really is a near-duplicate and fires, which is
// near-chai-property-chain-same.test.ts.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier
// @vitest-dedup:participant L19 "records two calls"
// @vitest-dedup:participant L26 "records the pair"
import { test, expect, vi } from 'vitest'

test('records two calls', () => {
  const spy = vi.fn()
  spy()
  spy()
  expect(spy).to.not.have.been.calledOnce
})

test('records the pair', () => {
  const spy = vi.fn()
  spy()
  spy()
  expect(spy).to.have.been.calledTwice
})
