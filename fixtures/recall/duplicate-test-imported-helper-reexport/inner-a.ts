// The actual helper body behind side A's re-export.
import { expect } from 'vitest'

export function checkActive(label: string) {
  const trimmed = label.trim()
  expect(trimmed.length).toBeGreaterThan(0)
  expect(trimmed.toUpperCase()).toBe(trimmed)
}
