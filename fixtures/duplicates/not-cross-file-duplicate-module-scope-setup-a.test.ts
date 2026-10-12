// OBSERVED IN REAL CODE: a public i18n module -- two spec files that each open with a module-scope
// `await setup({ rootDir: './fixtures/<different>' })` booting a DIFFERENT fixture application,
// then run one identical test. The awaited setup call runs before every test in its file, so the
// two tests execute against different applications -- exactly the arrangement
// `cross-file-duplicate` must not collapse. It does today: a module-scope awaited setup call
// does not reach `ContextKey` at all, so the two contexts compare equal and the finding fires
// (S6, mechanism 3 of 3; 7 of that rule's 14 false positives are per-directory-config or
// module-scope-setup shapes). The expectation is pending until the S6 fix lands.
// Named weakening: make the two `rootDir` literals equal -- the contexts genuinely match and the
// finding returns for a real reason. That edit ships as
// cross-file-duplicate-same-module-scope-setup-{a,b}.test.ts.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant L21 "renders the locale picker"
// @vitest-dedup:participant not-cross-file-duplicate-module-scope-setup-b.test.ts#L15 "renders the locale picker"
import { test, expect } from 'vitest'

await setup({ rootDir: './fixtures/alpha' })

test('renders the locale picker', () => {
  const page = buildPage()
  expect(page.locale).toBe('en')
})
