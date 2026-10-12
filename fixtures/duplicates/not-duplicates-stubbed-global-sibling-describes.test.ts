// OBSERVED IN REAL CODE: a public diagramming library's text-splitting suite -- the same
// table under `describe('when Intl.Segmenter is available')` and under a describe whose
// `beforeAll` runs `vi.stubGlobal('Intl', { Segmenter: undefined })`. Same inputs under opposite
// global state is the file's entire purpose. NOTE the load-bearing detail of the observed shape:
// the stubbing file imports `vi` from 'vitest' but does NOT import `beforeAll` -- the hook is an
// ambient global, exactly as in the source repository, and an ambient hook registration the
// analyzer cannot resolve is invisible to `Context::hooks`, so the two contexts compare equal and
// `duplicate-test` fires at ERROR severity (S8; the only analyzer defect among that rule's four
// misses). The expectation is pending until the S8 fix lands. Named weakening: delete the
// `vi.stubGlobal` line -- with the hook carrying no observable effect the pair becomes a genuine
// duplicate and fires (duplicates-different-suites-no-hooks.test.ts is that positive twin).
// @vitest-dedup:extracted 2
// MECHANISM, measured 2026-09-27 and NOT what this fixture was first written against. The
// variable is resolution, not the hook kind and not the stubbing:
//   - This file imports `{ describe, it, expect, vi }` and NOT `beforeAll` -- the same omission
//     the observed text-splitting suite makes, legal there because the project sets `globals: true` in
//     a `test.projects` config the analyzer cannot read (S3).
//   - An unimported hook is not resolved as a Vitest hook, so it never folds into ContextKey.
//     Both participants below carry contextKey 24e7184815de5034 -- equal, hence the finding.
//   - Measured on the real file: 12 findings at defaults, 0 under `--globals`.
//   - A variant of this fixture that imports `beforeAll` explicitly produces NO finding, with or
//     without --globals. That variant was written, measured, and deleted rather than shipped:
//     it pins correct behaviour that no rule threatens.
// One-edit weakening, and the cheapest way to re-check the whole claim: add `beforeAll` to the
// import list above. The finding disappears immediately.
// CONSEQUENCE: S8 needs no fix of its own -- it closes when S3/S4 close. The severity is the
// reason it matters: with no configuration at all, the tool reports a false ERROR.
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant L35 "when Intl.Segmenter is available > splits words using the platform segmenter"
// @vitest-dedup:participant L46 "when Intl.Segmenter is not available > splits words using the platform segmenter"
import { describe, it, expect, vi } from 'vitest'

describe('when Intl.Segmenter is available', () => {
  it('splits words using the platform segmenter', () => {
    const words = splitWords('hello world')
    expect(words).toHaveLength(2)
  })
})

describe('when Intl.Segmenter is not available', () => {
  beforeAll(() => {
    vi.stubGlobal('Intl', { Segmenter: undefined })
  })

  it('splits words using the platform segmenter', () => {
    const words = splitWords('hello world')
    expect(words).toHaveLength(2)
  })
})
