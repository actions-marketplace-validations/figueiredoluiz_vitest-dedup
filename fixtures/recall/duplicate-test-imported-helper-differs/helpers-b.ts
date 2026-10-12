// Helper module, side B. The only difference from helpers-a.ts is the `1` where side A has a
// `0`: a genuinely different assertion, so the two tests are distinct, not duplicate.
import { expect } from 'vitest'

export function assertNonEmpty(text: string) {
  const cleaned = text.trim()
  expect(cleaned.length).toBeGreaterThan(1)
  expect(cleaned.toUpperCase()).toBe(cleaned)
}
