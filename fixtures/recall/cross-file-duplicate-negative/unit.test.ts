// RECALL negative -- cross-file-duplicate, WITH THE RULE LIVE (side A).
//
// This is the case the design review named as missing: every existing negative for this rule used
// to pin its silence under the then-shipped `Off` default, which is indistinguishable from the
// rule having been deleted. The manifest used to pass `--rule cross-file-duplicate=warning` to
// make the rule live; since the default flip it passes nothing, and the rule is live because it
// ships `Warning`. Either way the silence below is a verdict about these two files rather than
// about the config.
//
// The two bodies differ in their subject: `normalizeEmail` here, `normalizePhone` next door. Same
// shape, same literal count, different function. Load-bearing: change `normalizePhone` to
// `normalizeEmail` with the same argument and the pair becomes one `cross-file-duplicate` warning
// -- the positive case in `cross-file-duplicate-positive` is that edit, already made.
//
// Also relevant to this rule specifically: enabling a cross-file rule over a directory measures
// that directory's own uniformity as much as the rule. Each recall case is its own
// directory and its own run, so nothing outside these two files can contribute a collision.
import { expect, test } from 'vitest'
import { normalizeEmail } from './contact'

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
