import { describe, test, expect } from 'vitest'

/** Registers one suite and test whose titles read the caller's arguments. */
export function declareCase(label: string, expected: number) {
  describe(`suite ${label}`, () => {
    test(`case ${label}`, () => { expect(expected).toBe(expected) })
  })
}

/** Registers a test whose title reads only its first parameter. */
export function declareOne(label: string) {
  test(label, () => { expect(1 + 1).toBe(2) })
}
