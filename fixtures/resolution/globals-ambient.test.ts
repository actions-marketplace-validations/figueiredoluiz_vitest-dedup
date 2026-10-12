// No import; bare test/describe/expect identifiers. Resolvable only via globals: true config.
// Needs accompanying vitest.config.ts with globals: true

describe('Ambient globals', () => {
  test('no explicit imports', () => {
    expect(1).toBe(1)
  })
})
