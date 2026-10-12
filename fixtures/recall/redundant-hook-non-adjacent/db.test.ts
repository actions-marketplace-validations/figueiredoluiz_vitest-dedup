// RECALL variant -- redundant-hook across NON-ADJACENT chain depth.
//
// Three levels: a file-level `beforeEach`, a middle `describe` that registers no hook at all, and
// a grandchild `describe` whose `beforeEach` repeats the file-level one. The repetition is two
// scopes apart with an unrelated scope between them.
//
// `emit_redundant_hook` walks each test's chain and compares every hook against every LATER hook
// in it (`for inner in &hooks[offset + 1..]`), so distance is irrelevant by construction. The
// variant exists because the obvious cheaper implementation -- compare each hook with its
// immediate predecessor -- passes `redundant-hook-positive` and fails only here, and nesting two
// levels deep with a hook-free scope in the middle is exactly how this slip survives review in
// real code.
//
// Expected: ONE `redundant-hook` warning between the file-level hook and the grandchild's. The
// middle suite contributes no hook, so there is no second pair to report.
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { rowCount } from './db'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe('queries', () => {
  describe('counts', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.resetModules()
    })

    test('starts from an empty table', () => {
      expect(rowCount()).toBe(0)
    })
  })
})
