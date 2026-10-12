// Helper module, side A of the equivalent-helper pair. The exported function is deliberately
// spelled with entirely different names than helpers-b.ts's counterpart: different export name,
// different parameter name, different local. Only the structure matches. That is the point -- the
// compared fingerprint must see what the call DOES, not which export it names.
import { expect } from 'vitest'

export function checkActive(label: string) {
  const trimmed = label.trim()
  expect(trimmed.length).toBeGreaterThan(0)
  expect(trimmed.toUpperCase()).toBe(trimmed)
}
