// REGRESSION TEST for symbol-based (not name-based) normalization.
// Expected verdict: NOT a duplicate. The two bodies must produce DIFFERENT `alpha`.
//
// The two test bodies below are BYTE-IDENTICAL: `expect(page.url).toContain('example')`.
// They differ only in what `page` resolves to. In the first it is the import. In the second it is
// a `const` declared in the enclosing `describe` scope, which shadows the import.
//
// This shape matters. An earlier version of this fixture put the shadowing `const page` inside the
// test body itself, which made the two bodies differ by a whole statement -- so a purely
// name-based normalizer would have separated them too, and the fixture proved nothing about
// symbol resolution. Hoisting the shadow into the enclosing describe keeps the bodies identical
// and leaves resolution as the ONLY difference.
//
// cuke-dedup's approach (rename every token whose TEXT matches a declared local) cannot tell these
// apart. Resolving each reference to its binding can. If this ever reports a duplicate, the
// semantic layer has stopped earning its keep.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates binding
// @vitest-dedup:participant L25 "reads the url"
// @vitest-dedup:participant L32 "with a locally built page > reads the url too"
import { describe, test, expect } from 'vitest'
import { page } from './page'

test('reads the url', () => {
  expect(page.url).toContain('example')
})

describe('with a locally built page', () => {
  const page = { url: 'https://example.com' }

  test('reads the url too', () => {
    expect(page.url).toContain('example')
  })
})
