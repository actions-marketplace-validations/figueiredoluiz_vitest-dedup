// The single most informative fixture for tuning a similarity threshold, because it isolates
// the one variable that breaks one: the SAME differing pair (one test submits a
// payment, the other cancels it -- opposite, non-interchangeable operations) surrounded by 0, 5,
// 20, and 50 textually IDENTICAL setup calls. A naive "fraction of shared events/lines" similarity
// measure scores the 50-call pair near 1.0, because boilerplate dominates the signal. Every level
// below MUST stay `distinct`: shared setup, however large, never makes submitting a payment the
// same behavior as cancelling one. This is a superset of polarity inversion (see
// near-opposite-polarity.test.ts): here the two tests aren't even opposite-flavored versions of the
// same assertion, they're two different real operations that happen to share a preamble.
//
// @vitest-dedup:extracted 8
// @vitest-dedup:expect rule=none verdict=distinct severity=none reason=boilerplate-0
// @vitest-dedup:isolates identifier,literal
// @vitest-dedup:participant L33 "submits order with 0 shared setup call(s)"
// @vitest-dedup:participant L38 "cancels order with 0 shared setup call(s)"
// @vitest-dedup:expect rule=none verdict=distinct severity=none reason=boilerplate-5
// @vitest-dedup:isolates identifier,literal
// @vitest-dedup:participant L43 "submits order with 5 shared setup call(s)"
// @vitest-dedup:participant L53 "cancels order with 5 shared setup call(s)"
// @vitest-dedup:expect rule=none verdict=distinct severity=none reason=boilerplate-20
// @vitest-dedup:isolates identifier,literal
// @vitest-dedup:participant L63 "submits order with 20 shared setup call(s)"
// @vitest-dedup:participant L88 "cancels order with 20 shared setup call(s)"
// @vitest-dedup:expect rule=none verdict=distinct severity=none reason=boilerplate-50
// @vitest-dedup:isolates identifier,literal
// @vitest-dedup:participant L113 "submits order with 50 shared setup call(s)"
// @vitest-dedup:participant L168 "cancels order with 50 shared setup call(s)"
import { test, expect } from 'vitest'
import { seedOrder, submitPayment, cancelPayment } from './orders'

const order = { status: 'pending' }

test('submits order with 0 shared setup call(s)', () => {
  submitPayment(order)
  expect(order.status).toBe('submitted')
})

test('cancels order with 0 shared setup call(s)', () => {
  cancelPayment(order)
  expect(order.status).toBe('cancelled')
})

test('submits order with 5 shared setup call(s)', () => {
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  submitPayment(order)
  expect(order.status).toBe('submitted')
})

test('cancels order with 5 shared setup call(s)', () => {
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  cancelPayment(order)
  expect(order.status).toBe('cancelled')
})

test('submits order with 20 shared setup call(s)', () => {
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  submitPayment(order)
  expect(order.status).toBe('submitted')
})

test('cancels order with 20 shared setup call(s)', () => {
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  cancelPayment(order)
  expect(order.status).toBe('cancelled')
})

test('submits order with 50 shared setup call(s)', () => {
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  submitPayment(order)
  expect(order.status).toBe('submitted')
})

test('cancels order with 50 shared setup call(s)', () => {
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  seedOrder(order)
  cancelPayment(order)
  expect(order.status).toBe('cancelled')
})

// Subsumption expectations, appended after the code so participant line numbers stay
// stable. The gradient's leaner tests are, by construction, strict ordered subsets of the
// richer ones on the same subject -- the exact shape subsumed-test exists to name. They are
// declared rather than suppressed: a boilerplate-heavy corpus will produce these pairs, and
// the verdict stays similar-uncertain precisely because 'the extra setup makes the lean
// test worthless' is a human call, not an analyzer fact.
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L33 "submits order with 0 shared setup call(s)"
// @vitest-dedup:participant L43 "submits order with 5 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L33 "submits order with 0 shared setup call(s)"
// @vitest-dedup:participant L63 "submits order with 20 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L33 "submits order with 0 shared setup call(s)"
// @vitest-dedup:participant L113 "submits order with 50 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L43 "submits order with 5 shared setup call(s)"
// @vitest-dedup:participant L63 "submits order with 20 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L43 "submits order with 5 shared setup call(s)"
// @vitest-dedup:participant L113 "submits order with 50 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L63 "submits order with 20 shared setup call(s)"
// @vitest-dedup:participant L113 "submits order with 50 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L38 "cancels order with 0 shared setup call(s)"
// @vitest-dedup:participant L53 "cancels order with 5 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L38 "cancels order with 0 shared setup call(s)"
// @vitest-dedup:participant L88 "cancels order with 20 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L38 "cancels order with 0 shared setup call(s)"
// @vitest-dedup:participant L168 "cancels order with 50 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L53 "cancels order with 5 shared setup call(s)"
// @vitest-dedup:participant L88 "cancels order with 20 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L53 "cancels order with 5 shared setup call(s)"
// @vitest-dedup:participant L168 "cancels order with 50 shared setup call(s)"
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L88 "cancels order with 20 shared setup call(s)"
// @vitest-dedup:participant L168 "cancels order with 50 shared setup call(s)"
