// onTestFinished imported directly from 'vitest' (not destructured from TestContext) and called
// from inside a test body. Contrast with hooks-ontestfinished.test.ts, which uses the
// context-bound form. Both forms are legal Vitest API surface, but per the Vitest docs the
// imported/global form relies on shared module state to find "the currently running test", which
// is documented as unsound under `.concurrent` -- Vitest's own guidance is to always use the
// context-bound form for concurrent tests. See the "Hooks" section of docs/vitest-surface.md.
import { test, expect, onTestFinished } from 'vitest'

test('registers cleanup via the imported onTestFinished', () => {
  onTestFinished(() => {})
  expect(true).toBe(true)
})
