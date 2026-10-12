// RECALL positive -- cross-file-duplicate (side A).
//
// The same normalized body under an equivalent context, in two different files. `duplicate-test`
// is same-file by construction, so this relation is only reachable through this rule.
//
// The rule ships `Severity::Warning`, so this case carries no `arguments` in the manifest: it is
// run under the plain default config and the expected finding IS the default. It was written when
// the rule still shipped `Off` and needed `--rule cross-file-duplicate=warning` to say anything at
// all; that override was removed with the default flip, because an override would keep this case
// green even if the shipped default were reverted.
//
// The unit/integration file names are not decoration. They name the shape the old `Off` default
// was justified by -- a case deliberately mirrored across two layers -- which the six pinned
// corpora contain no instance of. This case says what the rule does to that shape: it reports it,
// at Warning, for a human to accept or delete.
import { expect, test } from 'vitest'
import { normalizeEmail } from './email'

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
