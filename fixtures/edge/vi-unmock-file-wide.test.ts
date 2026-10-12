// vi.mock() followed by vi.unmock() for the SAME specifier. Both calls are hoisted to the top of
// the file and keep their relative order among hoisted calls, so the net effect for the whole
// file is "unmocked" -- every test sees the real module, not the mock factory below.
//
// `collect_mocked_modules` (src/frontend/extract.rs) models exactly this: module-top-level
// `vi.mock`/`vi.unmock` calls with literal specifiers become registration events folded in source
// order, last one winning per specifier. This file's fold is therefore EMPTY, which is a
// different context from a file that leaves './module' mocked, and the file stays comparable
// rather than being excluded. Reverse the two lines and the mock wins instead -- the ordering is
// load-bearing, verified against a real Vitest 5 run. See hazard 11 and docs/vitest-surface.md's
// "The `vi` module-mocking family". `[status: current]` -- matches `collect_mocked_modules` as of 2026-09-17.
import { test, expect, vi } from 'vitest'

vi.mock('./module', () => ({ value: 'mocked' }))
vi.unmock('./module')

test('sees the real module, not the mock', async () => {
  const { value } = await import('./module')
  expect(value).not.toBe('mocked')
})
