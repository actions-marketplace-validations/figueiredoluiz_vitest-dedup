// RECALL variant -- redundant-hook over `afterEach`.
//
// `HookKind` has four members and the rule pairs hooks of the SAME kind. Teardown duplicated
// between an ancestor and a nested suite is the same waste as duplicated setup, and it is the
// commoner slip in practice: cleanup gets copied into a nested block by someone who did not read
// the file-level hook.
//
// Every other `redundant-hook` case in this corpus uses `beforeEach`. A rule narrowed to that one
// kind -- or an extractor that only recognized `beforeEach`/`beforeAll` as hook registrations --
// would keep them all green while teardown duplication went unreported.
import { afterEach, describe, expect, test, vi } from 'vitest'
import { rowCount } from './db'

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe('queries', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  test('counts the rows', () => {
    expect(rowCount()).toBe(0)
  })
})
