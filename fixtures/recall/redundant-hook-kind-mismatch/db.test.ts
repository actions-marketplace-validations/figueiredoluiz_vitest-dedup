// RECALL negative variant -- redundant-hook must not pair hooks of DIFFERENT kinds.
//
// The outer `beforeAll` and the inner `beforeEach` have byte-identical bodies, so an
// implementation that compared hook bodies without comparing `HookKind` would report this as
// redundant. It is not: `beforeAll` runs the reset once for the whole suite, `beforeEach` runs it
// before every test. Deleting either one changes what the tests see, and deleting the
// `beforeEach` in particular would leave the second test running against state the first mutated.
//
// This is the most dangerous negative for this rule, because the bodies are identical -- the only
// discriminating fact is the kind, and it is a single `inner.kind == outer.kind` comparison.
//
// Two tests exist so the per-test semantics of `beforeEach` are visibly load-bearing rather than
// merely asserted in prose; their bodies are structurally unlike each other so no test-level rule
// can fire.
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { insertRow, migrate, reset, rowCount } from './db'

beforeAll(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe('queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('starts from an empty table', () => {
    expect(rowCount()).toBe(0)
  })

  test('sees a row after inserting one', () => {
    insertRow({ id: 1 })
    expect(rowCount()).toBe(1)
  })
})
