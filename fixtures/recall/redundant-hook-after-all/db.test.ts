// RECALL variant -- redundant-hook over `afterAll`.
//
// The fourth `HookKind`, completing the set this corpus asserts a case for. A duplicated
// `afterAll` repeats teardown the nested block need not register; the body is an IDEMPOTENT
// pair (`clearTables`; `flushLogs`) safe to run twice, as the `redundant` verdict requires (S5).
import { afterAll, describe, expect, test, vi } from 'vitest'
import { rowCount } from './db'

afterAll(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe('queries', () => {
  afterAll(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('counts the rows', () => {
    expect(rowCount()).toBe(0)
  })
})
