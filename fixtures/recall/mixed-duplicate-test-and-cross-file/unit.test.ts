// RECALL mixed -- a same-file duplicate pair and a cross-file copy of it, in one run.
//
// All three declarations are alpha-equal under an equivalent context. duplicate-test must pair
// the two that share a file; cross-file-duplicate must pair one representative per file with the
// copy -- and never the same-file pair, which is what `representative_per_file` exists to keep.
// A change in either rule's grouping that let one rule absorb the other's participants is only
// observable in this arrangement.
//
// Expected, independently:
//   duplicate-test       error, the two unit-file bodies are identical
//   cross-file-duplicate warning, the integration copy against one unit-file representative
//
// Named weakening: delete the integration file and cross-file-duplicate must go while
// duplicate-test stays; make the two unit-file bodies differ in one literal and the reverse.
import { expect, test } from 'vitest'
import { normalizeEmail } from './email'

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})

test('lowercases the domain again', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
