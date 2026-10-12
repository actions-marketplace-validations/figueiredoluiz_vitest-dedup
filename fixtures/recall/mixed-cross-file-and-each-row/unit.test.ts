// RECALL mixed -- a repeated table row and a cross-file copy in one run.
//
// duplicate-each-row only ever pairs rows of one table declaration, in one file;
// cross-file-duplicate only ever pairs alpha-equal declarations in different files. The two
// populations are disjoint by every dimension the analyzer keys on, and both findings must
// appear in one run without either rule reaching into the other's population.
//
// Expected, independently:
//   duplicate-each-row   warning, rows 1 and 3 of the table carry the same case
//   cross-file-duplicate warning, the integration copy against the email declaration
//
// Named weakening: give row 3 a third distinct value and duplicate-each-row must go while cross-file-duplicate
// stays; delete the integration file and the reverse.
import { expect, test } from 'vitest'
// The specifier of the copied declaration's import must MATCH the integration file's: free
// identifiers keep the identity of the binding they resolve to, and two unresolvable specifiers
// that differ spell two different bindings -- which would correctly keep cross-file-duplicate
// silent and defeat this case. Both files import `normalizeEmail` from './email'.
import { normalizeEmail } from './email'
import { parseFlag } from './flags'

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
