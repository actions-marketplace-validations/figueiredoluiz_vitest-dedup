// The other half of the cross-file-duplicate-same-module-scope-setup twin: identical module-scope
// setup (same rootDir), identical body, in a second file. See the -a file's header.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant cross-file-duplicate-same-module-scope-setup-a.test.ts#L14 "lists the supported locales"
// @vitest-dedup:participant L11 "lists the supported locales"
import { test, expect } from 'vitest'

await setup({ rootDir: './fixtures/shared' })

test('lists the supported locales', () => {
  const page = buildPage()
  expect(page.locales).toContain('en')
})
