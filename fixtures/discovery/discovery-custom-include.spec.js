// Non-default glob (.spec.js). Matches custom include config only, not default.
// Needs vitest.config.ts with custom include override
const { test, expect } = require('vitest')

test('matches custom include', () => {
  expect(1).toBe(1)
})
