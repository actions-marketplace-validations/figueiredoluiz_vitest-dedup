// Helper module, side B. Alpha-equivalent to helpers-a.ts's `checkActive` after renaming, and
// reaching it requires resolving `./helpers-b`, finding the export, and serializing its body --
// which is what makes this pair unrecognizable without helper-body resolution.
import { expect } from 'vitest'

export function assertNonEmpty(text: string) {
  const cleaned = text.trim()
  expect(cleaned.length).toBeGreaterThan(0)
  expect(cleaned.toUpperCase()).toBe(cleaned)
}
