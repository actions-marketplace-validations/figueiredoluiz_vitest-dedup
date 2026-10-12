// RECALL positive -- duplicate-suite.
//
// A whole `describe` block copied within one file. The block's fingerprint covers titles, hooks
// and children, so a wholesale copy is alpha-equal to its original by the same proof
// `duplicate-test` rests on -- hence verdict `redundant`, at Warning severity because reporting a
// whole block at Error would dominate a report.
//
// The expectation is ONE `duplicate-suite` finding and NOTHING ELSE. That second half is the
// interesting one: the two copies contain pairwise-identical tests, which `duplicate-test` would
// otherwise report at Error severity as well, and `suppress_cross_copy_findings` removes those
// per-test findings once the suite-level claim is made. A case that only declared the suite
// finding would pass while the suppression regressed and buried the block-level claim under
// per-test noise.//
// The two children inside a copy are deliberately structurally UNLIKE each other (a property read
// against a thrown error), so no `parameterization-candidate` arises within a copy and the only
// finding this directory can produce is the suite-level one.
import { describe, expect, test } from 'vitest'
import { login } from './auth'

describe('login', () => {
  test('accepts valid credentials', () => {
    expect(login('ada', 'secret').ok).toBe(true)
  })

  test('rejects a bad password', () => {
    expect(() => login('ada', 'wrong')).toThrow('invalid credentials')
  })
})

describe('login', () => {
  test('accepts valid credentials', () => {
    expect(login('ada', 'secret').ok).toBe(true)
  })

  test('rejects a bad password', () => {
    expect(() => login('ada', 'wrong')).toThrow('invalid credentials')
  })
})
