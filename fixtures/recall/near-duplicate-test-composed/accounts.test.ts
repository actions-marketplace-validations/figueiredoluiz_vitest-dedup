// RECALL variant -- near-duplicate-test under three composed transformations: renamed locals,
// reordered independent setup, and a single-use extracted member read. This guards the boundary
// where an effectful initializer feeds another inlined local: its call remains a standalone
// behavior event, allowing the reordering multiset to compose with extraction normalization while
// pure initializer chains can still inline transitively.
import { expect, test } from 'vitest'
import { grantAccess, loadProfile } from './accounts'

test('grants access after loading the profile', () => {
  const user = loadProfile(1)
  grantAccess(1)
  expect(user.email).toContain('@')
})

test('grants access after loading the profile, reordered and renamed', () => {
  grantAccess(1)
  const record = loadProfile(1)
  const email = record.email
  expect(email).toContain('@')
})
