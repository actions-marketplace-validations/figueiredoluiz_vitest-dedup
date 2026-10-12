// In-source test: export const add = ..., then if (import.meta.vitest) { ... } with test/expect destructured from import.meta.vitest
// Needs vitest.config.ts with includeSource glob

export function add(a: number, b: number) {
  return a + b
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add works', () => {
    expect(add(1, 1)).toBe(2)
  })
}
