// Twin of not-cross-file-duplicate-module-scope-setup-{a,b}.test.ts: the same module-scope
// `await setup({ rootDir: ... })` shape with the SAME rootDir in both files, so the two contexts
// genuinely match and the identical bodies are a real cross-file duplicate. Must fire today and
// after the S6 fix: a fix that simply stops comparing files whose module scope awaits anything
// would delete this true positive along with the false positives it shares a shape with.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L14 "lists the supported locales"
// @vitest-dedup:participant cross-file-duplicate-same-module-scope-setup-b.test.ts#L11 "lists the supported locales"
import { test, expect } from 'vitest'

await setup({ rootDir: './fixtures/shared' })

test('lists the supported locales', () => {
  const page = buildPage()
  expect(page.locales).toContain('en')
})
