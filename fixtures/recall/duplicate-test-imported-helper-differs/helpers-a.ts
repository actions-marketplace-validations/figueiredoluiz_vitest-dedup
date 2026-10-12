// Helper module, side A. Identical in shape to helpers-b.ts except for ONE literal: the boundary
// is 0 here and 1 there. One edit away from the positive case, which is what makes the negative
// meaningful -- if the comparison ignored the helper bodies, or erased their literals, this pair
// would collapse.
import { expect } from 'vitest'

export function checkActive(label: string) {
  const trimmed = label.trim()
  expect(trimmed.length).toBeGreaterThan(0)
  expect(trimmed.toUpperCase()).toBe(trimmed)
}
