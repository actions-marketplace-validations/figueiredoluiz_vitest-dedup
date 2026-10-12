// vi.doUnmock() -- the non-hoisted counterpart of vi.unmock(). Only affects dynamic imports
// evaluated after this call runs; does not reevaluate a module already imported earlier in the
// same test. Scoped the same way vi.doMock() is scoped (see vi-domock-scoped.test.ts) -- not
// file-wide, not hoisted.
//
// This is the half that is NOT modelled, and the contrast with vi-unmock-file-wide.test.ts is the
// point: because the call takes effect where it runs rather than at the top of the file, there is
// no file-wide answer to fold it into, so `collect_mocked_modules` marks the whole file unresolved
// and its tests are excluded from comparison. Note that being inside a test body is NOT what
// taints this file: `doMock`/`doUnmock` are meant to be called there, and would taint at top level
// too. The separate top-level rule applies to the hoisted pair, which Vitest 5 refuses to run at
// all when nested. See docs/vitest-surface.md's "The `vi` module-mocking family" and hazard 11.
// `[status: current]` -- matches `collect_mocked_modules` as of 2026-09-17.
import { test, expect, vi } from 'vitest'

vi.mock('./module', () => ({ value: 'mocked' }))

test('reverts to the real module for imports after doUnmock', async () => {
  vi.doUnmock('./module')
  const { value } = await import('./module')
  expect(value).not.toBe('mocked')
})
