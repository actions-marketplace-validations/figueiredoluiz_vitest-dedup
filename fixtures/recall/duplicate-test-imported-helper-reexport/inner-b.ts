// The actual helper body behind side B's re-export. Alpha-equivalent to inner-a.ts's export
// after renaming.
import { expect } from 'vitest'

export function assertNonEmpty(text: string) {
  const cleaned = text.trim()
  expect(cleaned.length).toBeGreaterThan(0)
  expect(cleaned.toUpperCase()).toBe(cleaned)
}
