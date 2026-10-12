// RECALL variant -- duplicate-test inside an `import.meta.vitest` in-source block.
//
// In-source tests are not in a `.test.ts` file and their `it`/`expect` bindings come off the
// injected `import.meta.vitest` object rather than from a `'vitest'` import specifier
// (docs/vitest-surface.md, "In-source testing"). Discovery only reaches this file because the
// `vitest.config.ts` here sets `includeSource`, so the case pins the whole path: config parsing,
// in-source discovery, extraction, and the duplicate-test rule over what it extracted.
//
// The two `it`s have alpha-equal bodies under one context, so the expectation is ONE
// error-severity `duplicate-test`. Every other duplicate-test case in this corpus lives in a
// `.test.ts` file; if in-source discovery collapsed to zero, all of them would stay green -- which
// is the worst silent-extraction-failure shape there is: a gate reporting success over zero work.
// That is why this case also pins an exact extracted-test count.
export function toCelsius(f: number) {
  return ((f - 32) * 5) / 9
}

export function fromFahrenheit(f: number) {
  return ((f - 32) * 5) / 9
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('converts freezing point', () => {
    const celsius = toCelsius(32)
    expect(celsius).toBe(0)
  })

  it('converts the freezing threshold', () => {
    const degrees = toCelsius(32)
    expect(degrees).toBe(0)
  })
}
