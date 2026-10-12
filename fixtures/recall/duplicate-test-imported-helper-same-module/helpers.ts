// One helper module exporting BOTH names of the equivalent pair. The two tests' contexts were
// already equal here (same resolved module in both import lists), so this case isolates the
// fingerprint half of helper-body resolution alone: same import list, different export names,
// equivalent bodies. Before the fix the two exports carried different `free:import` identities
// and the bodies could never match despite everything else agreeing.
import { expect } from 'vitest'

export function checkActive(label: string) {
  const trimmed = label.trim()
  expect(trimmed.length).toBeGreaterThan(0)
  expect(trimmed.toUpperCase()).toBe(trimmed)
}

export function assertNonEmpty(text: string) {
  const cleaned = text.trim()
  expect(cleaned.length).toBeGreaterThan(0)
  expect(cleaned.toUpperCase()).toBe(cleaned)
}
