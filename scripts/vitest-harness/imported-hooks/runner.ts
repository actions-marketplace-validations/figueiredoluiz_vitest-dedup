import { beforeEach, describe, test, expect } from 'vitest'

/** Registers a hook in the calling scope and one test that depends on it. */
export function withHook() {
  beforeEach(() => { (globalThis as any).hooked = true })
  test('inside', () => { expect((globalThis as any).hooked).toBe(true) })
}

/** Registers a hook inside a helper-owned suite, which must not leak to the caller. */
export function suiteWithHook() {
  describe('helper suite', () => {
    beforeEach(() => { (globalThis as any).inner = true })
    test('sees inner', () => { expect((globalThis as any).inner).toBe(true) })
  })
}

/** Registers a test through a fixture-extended test function. */
export function fixtureRunner() {
  const extended = test.extend({ value: 3 })
  extended('fixture test', ({ value }) => { expect(value).toBe(3) })
}
