// RECALL positive -- duplicate-test.
//
// Two tests differing only by calling equivalent helpers imported from two different modules.
// Before helper-body resolution the call sites rendered as two different `free:import` identities
// (different resolved modules, different export names), so the bodies never matched and each
// test's context carried a different resolved import. With the helper bodies participating in the
// compared fingerprint, both sides render the helper's own statements with the argument
// substituted for the parameter, the helper modules drop out of the compared context (their
// content is now compared directly), and the pair is recognized as the duplicate it is.
import { test } from 'vitest'
import { checkActive } from './helpers-a'
import { assertNonEmpty } from './helpers-b'

test('accepts a plain label', () => {
  checkActive('dashboard')
})

test('accepts a plain label, again', () => {
  assertNonEmpty('dashboard')
})
