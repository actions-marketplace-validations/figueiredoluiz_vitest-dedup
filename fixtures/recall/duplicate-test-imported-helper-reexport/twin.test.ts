// RECALL positive -- duplicate-test, re-export-chain variant.
//
// The helper bodies sit one named re-export hop (`export { x } from './inner'`) behind the
// modules the tests import. Helper-body resolution has to follow the chain to find the
// declaration; if it stopped at the re-exporting barrel, the exports would stay opaque
// identities and the pair would go unrecognized.
import { test } from 'vitest'
import { checkActive } from './helpers-a'
import { assertNonEmpty } from './helpers-b'

test('accepts a plain label', () => {
  checkActive('dashboard')
})

test('accepts a plain label, again', () => {
  assertNonEmpty('dashboard')
})
