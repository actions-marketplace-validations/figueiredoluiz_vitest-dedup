// Helper module for the arity guard: both exports take TWO parameters. The tests call each with
// ONE argument, so parameter-to-argument binding is not exactly knowable and helper-body
// resolution must refuse -- the calls keep their identity rendering and the pair stays distinct
// even though the helper bodies are equivalent.
import { expect } from 'vitest'

export function checkActive(label: string, minimum: number) {
  const trimmed = label.trim()
  expect(trimmed.length).toBeGreaterThan(minimum)
  expect(trimmed.toUpperCase()).toBe(trimmed)
}

export function assertNonEmpty(text: string, floor: number) {
  const cleaned = text.trim()
  expect(cleaned.length).toBeGreaterThan(floor)
  expect(cleaned.toUpperCase()).toBe(cleaned)
}
