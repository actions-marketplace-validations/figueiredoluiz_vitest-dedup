// RECALL positive -- duplicate-test-name.
//
// Two tests in one file share a full title while doing different things. The verdict is
// `name-collision`, not `redundant`: nothing is duplicated behaviorally, but `vitest -t` cannot
// address either test individually and one of the two is almost certainly mistitled.
//
// The bodies are deliberately unrelated -- different callee, different matcher, different argument
// shape -- so the ONLY finding this directory may produce is the name collision. A case whose
// participants were also body-duplicates would pass while the name rule was dead, masked by
// `duplicate-test`.
import { expect, test } from 'vitest'
import { place, refund } from './orders'

test('handles a rejected card', () => {
  expect(place({ card: 'rejected' }).status).toBe('declined')
})

test('handles a rejected card', () => {
  expect(refund('order-1')).rejects.toThrow('already refunded')
})
