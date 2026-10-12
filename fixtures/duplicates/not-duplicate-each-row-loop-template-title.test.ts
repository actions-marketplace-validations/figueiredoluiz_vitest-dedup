// OBSERVED IN REAL CODE: a public HTTP client's config-merge suite -- `it.each([false, null, 123])`
// inside `for (const key of [...])`, titled `` `overwrites default ${key} with %p` ``. All nine of
// that project's findings in the 2026-09-27 scan are one declaration (18 of 35 false positives).
// The loop variable cannot fold into the template title, so every row of every iteration renders
// the SAME unrendered pattern and the rows collapse on the title alone -- the body half of the
// rule's claim ("identical rendered title AND substituted body") is not discriminating.
// `duplicate-each-row` links these rows today, so the expectation is pending until the S7 fix
// lands. Named weakening: hoist the loop away so `${key}` folds into the title and make two rows
// literally identical -- the finding then returns for a real reason (that edit's spirit ships as
// duplicate-each-row-loop-enclosed-real-repeat.test.ts).
// @vitest-dedup:extracted 6
// @vitest-dedup:expect rule=none verdict=not-compared severity=none
// @vitest-dedup:isolates not-isolable once the title will not render, the rows are indistinguishable by construction -- the loop variable is not substituted into the body either, so every emitted field agrees and no relation between participants could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L19 "`overwrites default ${key} with %p`"
// @vitest-dedup:participant L19 "`overwrites default ${key} with %p`"
import { it, expect } from 'vitest'

for (const key of ['url', 'params']) {
  it.each([false, null, 123])(`overwrites default ${key} with %p`, (value) => {
    expect(merge({ [key]: value }, { [key]: value })).toEqual({ [key]: value })
  })
}
