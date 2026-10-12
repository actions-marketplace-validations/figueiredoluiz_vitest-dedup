// The other half of the i18n-module reproduction: identical to
// not-cross-file-duplicate-module-scope-setup-a.test.ts except the module-scope `await setup(...)`
// boots a DIFFERENT fixture application ('./fixtures/beta'). See that file's header for the claim,
// the weakening, and why the pair's expectation holds (S6 mechanism 3 landed: the awaited
// module-scope call now reaches `ContextKey`).
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant not-cross-file-duplicate-module-scope-setup-a.test.ts#L21 "renders the locale picker"
// @vitest-dedup:participant L15 "renders the locale picker"
import { test, expect } from 'vitest'

await setup({ rootDir: './fixtures/beta' })

test('renders the locale picker', () => {
  const page = buildPage()
  expect(page.locale).toBe('en')
})
