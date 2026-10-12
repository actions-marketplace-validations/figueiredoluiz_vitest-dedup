// vi.doMock() called inside a single test body. Unlike vi.mock(), this call is NOT hoisted and
// only affects dynamic imports evaluated after it runs -- a static import of './module' earlier
// in the file, or a sibling test that never calls doMock, remains unmocked. This extractor cannot
// soundly attribute a doMock call to just the one test that made it, so it conservatively marks
// the whole file's mocks unresolved (see F4 in src/frontend/extract.rs) rather than risk treating
// this test's substitution as if it applied file-wide the way vi.mock() does.
import { test, expect, vi } from 'vitest'

test('uses doMock scoped to this test', async () => {
  vi.doMock('./module', () => ({ value: 1 }))
  const { value } = await import('./module')
  expect(value).toBe(1)
})

test('does not use doMock', () => {
  expect(true).toBe(true)
})
