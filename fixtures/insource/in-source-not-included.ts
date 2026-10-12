// In-source code with import.meta.vitest block, but FILE NOT MATCHED by includeSource glob.
// Must be skipped by analyzer (never scanned).

export function multiply(a: number, b: number) {
  return a * b
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('multiply works', () => {
    expect(multiply(2, 3)).toBe(6)
  })
}
