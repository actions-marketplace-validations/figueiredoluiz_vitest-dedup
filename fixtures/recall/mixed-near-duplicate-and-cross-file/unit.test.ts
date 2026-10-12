// RECALL mixed -- a reordered pair and a cross-file copy in one run.
//
// near-duplicate-test is same-file; cross-file-duplicate spans files and keys on `alpha`. The
// copied declaration is alpha-equal to its original, which a reorder never is, so the two
// populations cannot trade places; the mixed claim is that both findings appear in one run and
// neither rule reaches across the other's boundary.
//
// Expected, independently:
//   near-duplicate-test warning, the two setup bodies perform the same events reordered
//   cross-file-duplicate warning, the integration copy against the email declaration
//
// Named weakening: restore the statement order of one setup body and near-duplicate-test must go
// while cross-file-duplicate stays; delete the integration file and the reverse.
import { expect, test } from 'vitest'
import { configure, isReady, seed } from './setup'
import { normalizeEmail } from './email'

test('configures then seeds', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})

test('seeds then configures', () => {
  seed({ users: 3 })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
