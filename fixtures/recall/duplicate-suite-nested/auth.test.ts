// RECALL variant -- duplicate-suite between NESTED describes.
//
// The duplicated block is two levels deep, and the key includes the suite PATH, so both copies
// must be found under the same parent for the relation to hold at all. Every other
// `duplicate-suite` case in this corpus duplicates a file-level block; an implementation that
// keyed on the own title alone (ignoring the path), or that only walked top-level describes, would
// keep those green.
//
// Expected: ONE `duplicate-suite` warning naming the two inner `credentials` blocks, and nothing
// else -- the per-test cross-copy findings inside them are suppressed by the suite-level claim.
// The outer `auth` block is NOT duplicated: it appears once.//
// The two children inside a copy are deliberately structurally UNLIKE each other (a property read
// against a thrown error), so no `parameterization-candidate` arises within a copy and the only
// finding this directory can produce is the suite-level one.
import { describe, expect, test } from 'vitest'
import { login } from './auth'

describe('auth', () => {
  describe('credentials', () => {
    test('accepts valid credentials', () => {
      expect(login('ada', 'secret').ok).toBe(true)
    })

    test('rejects a bad password', () => {
      expect(() => login('ada', 'wrong')).toThrow('invalid credentials')
    })
  })

  describe('credentials', () => {
    test('accepts valid credentials', () => {
      expect(login('ada', 'secret').ok).toBe(true)
    })

    test('rejects a bad password', () => {
      expect(() => login('ada', 'wrong')).toThrow('invalid credentials')
    })
  })
})
