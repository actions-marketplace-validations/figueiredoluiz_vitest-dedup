// vi.hoisted(() => { ... }) used to define shared mocks referenced inside later vi.mock().
import { test, expect, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fn: vi.fn()
}))

vi.mock('./module', () => mocks)

test('with hoisted and shared', () => {
  expect(mocks.fn).toBeDefined()
})
