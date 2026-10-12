// RECALL positive -- duplicate-test, same-module variant.
//
// Both helpers come from ONE module, so `Context::imports` agreed even before helper-body
// resolution; only the `alpha` fingerprint separated the pair (two different export identities).
// With the helper bodies participating, the calls render their bodies and the pair matches.
import { test } from 'vitest'
import { assertNonEmpty, checkActive } from './helpers'

test('accepts a plain label', () => {
  checkActive('dashboard')
})

test('accepts a plain label, again', () => {
  assertNonEmpty('dashboard')
})
