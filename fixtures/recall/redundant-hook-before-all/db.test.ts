// RECALL variant -- redundant-hook over `beforeAll`.
//
// `beforeAll` runs once per suite, so a nested copy runs the same one-time setup a second time
// when the inner suite starts -- redundant on the same terms as a repeated `beforeEach`, and
// usually a sign that the inner block was written without reading the outer one.
//
// The repeated body is one genuinely re-runnable statement, `await ensureSchema()` (a migration
// runner that no-ops when current). `redundant` claims deleting one side loses no coverage, and
// that claim is only true of setup that is safe to run twice; the earlier body here did
// `await connect(); await loadSchema()`, whose second run opens a second handle or errors -- the
// exact non-idempotent repetition the 2026-09-27 scan showed this rule must not report.
//
// This is the second of the four `HookKind` members this corpus covers with its own case (see
// `redundant-hook-after-each` and `-after-all`). The variants exist because the rule's kind
// equality check is one line, and one line is enough to silently narrow the rule to a single kind.
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { rowCount } from './db'

beforeAll(() => {
  vi.resetModules()
})

describe('queries', () => {
  beforeAll(() => {
    vi.resetModules()
  })

  test('counts the rows', () => {
    expect(rowCount()).toBe(0)
  })
})
