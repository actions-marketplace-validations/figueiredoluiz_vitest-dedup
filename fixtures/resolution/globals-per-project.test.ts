// Ambient test/describe (no import). Resolvable only via project-specific globals: true config.
// Needs vitest.config.ts with test.projects where only one project has globals: true

describe('Project-specific globals', () => {
  test('ambient test in specific project', () => {
    expect(2 + 2).toBe(4)
  })
})
