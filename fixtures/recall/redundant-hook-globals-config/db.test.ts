// Ambient declarators with an IMPORTED `vi`. Deliberate, and its own shape: this repository's
// `docs/vitest-surface.md` lists the ambient set as "test/describe/it/suite/expect/hooks/etc.",
// which does not settle whether `vi` is among them, and a fixture must not rest on an unsettled
// fact. Many real suites import `vi` for clarity while leaving declarators ambient, so the mixed
// form is the realistic one regardless.
//
// The inner hook repeats the outer one verbatim, and the outer already runs before every test the
// inner one covers.
import { vi } from 'vitest'
import { rowCount } from './db'

beforeEach(() => {
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
})
