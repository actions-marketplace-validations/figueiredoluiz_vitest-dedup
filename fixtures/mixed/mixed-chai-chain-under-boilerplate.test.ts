// MIXED: S9 (chai-style property assertions contributed nothing to behavior identity) x the
// boilerplate-gradient class (`docs/testing-and-corpus-plan.md` 1d), which that document calls
// the most dangerous shape in the corpus.
//
// OBSERVED IN REAL CODE: a public test framework's own chai-compatibility suite --
// `expect(spy).to.not.have.been.calledOnce` against `expect(spy).to.have.been.calledTwice`.
// Opposite polarity AND a different assertion, reported as executing the same behavior events
// in the same order, because a chai property chain carries no call node: only the shared setup
// was compared. Fixed: `BehaviorCollector::property_chain_event` records the chain as one
// `assert:chain:` event, so the two bodies' behavior traces differ where the assertions do.
//
// The boilerplate gradient is what made it dangerous rather than merely wrong. Here the shared
// setup is long and the distinguishing part is one property chain at the end, so the ratio of
// agreement to disagreement is exactly the one 1d warns about -- a similarity score computed
// over statements will call these twins no matter how the threshold is tuned. Nothing about that
// ratio changed; what changed is that the distinguishing part is now one of the events being
// compared instead of being erased before the comparison.
//
// Named weakening: replace both chains with `expect(spy).toHaveBeenCalledOnce()` and
// `expect(spy).toHaveBeenCalledTimes(2)`. Those are CALLS, they always reached behavior identity,
// and the pair separates there too -- the shape the S9 fix brought property chains up to.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the distinguishing chain is visible at `behavior` since the S9 fix -- and `behavior` is the view near-duplicate-test keys on and the only one the fix moved -- but no dimension in the vocabulary has `behavior` alone as its DIFFER set. The nearest, `identifier`, constrains `alpha` and `structural`: measured against this binary both ALREADY differed before the fix (alpha cfd783c4aceb2c2f vs 3b808550efbce763, structural e585de75ddbbc474 vs 61b2b3c764ceac14, while behavior was EQUAL at f3add2e5d101f2f4), so declaring it would assert something reverting the fix leaves green. Load-bearing instead: revert `property_chain_event` and this expectation fails, reporting near-duplicate-test between exactly these two participants
// @vitest-dedup:participant L31 "spy accounting > counts one call"
// @vitest-dedup:participant L43 "spy accounting > counts two calls"
import { describe, it, expect, vi } from 'vitest'
import { createHarness, seedRegistry, attachLogger, resetClock } from './shared-harness'

describe('spy accounting', () => {
  it('counts one call', () => {
    const harness = createHarness({ mode: 'strict' })
    seedRegistry(harness, ['alpha', 'beta'])
    attachLogger(harness)
    resetClock(harness)
    const spy = vi.fn()
    harness.register(spy)
    harness.dispatch('alpha')
    harness.flush()
    expect(spy).to.have.been.calledOnce
  })

  it('counts two calls', () => {
    const harness = createHarness({ mode: 'strict' })
    seedRegistry(harness, ['alpha', 'beta'])
    attachLogger(harness)
    resetClock(harness)
    const spy = vi.fn()
    harness.register(spy)
    harness.dispatch('alpha')
    harness.flush()
    expect(spy).to.not.have.been.calledOnce
  })
})
