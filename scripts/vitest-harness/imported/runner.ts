import { describe, test, expect } from 'vitest'
import type { Token } from './erased-only-types'
import { type InlineToken } from './erased-inline-types'
export { type InlineToken } from './erased-inline-types'

type LocalToken = Token
interface Marker { value: LocalToken }
export type ExportedToken = LocalToken
export interface ExportedMarker { value: Marker }

/** Registers the shared static suite once for each caller invocation. */
export function declareTests() {
  type RegistrationMarker = 'static'
  describe('shared runner', () => {
    test('first', () => { expect(1 + 1).toBe(2) })
    test('second', () => { expect(1 + 1).toBe(2) })
  })
}

/** Declares an uncalled negative control that must never become a registration. */
export function unused() {
  test('never registered', () => { expect(false).toBe(true) })
}

/** Returns an inert value without registering tests. */
export function ordinary() { return 2 }

/** Calls a local shadow instead of the Vitest test binding. */
export function shadowed() {
  /** An inert local shadow that must never resolve to the Vitest binding. */
  const test = (_title: string, _callback: () => void) => {}
  test('not Vitest', () => { expect(false).toBe(true) })
}
