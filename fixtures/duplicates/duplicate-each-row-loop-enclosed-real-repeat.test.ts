// Twin of not-duplicate-each-row-loop-template-title.test.ts, and the row that protects recall
// while S7 is being fixed: the SAME loop-enclosed `.each`, but with a title that renders fully
// (plain printf directives, no `${...}` template) and two literally identical rows. The finding
// must survive any S7 fix -- a fix that suppresses every `.each` inside a loop, rather than the
// title-collapse mechanism, deletes this real duplicate along with the false positives. The loop
// deliberately iterates one value: with two, the loop variable would reach the body and make the
// iterations' rows differ, turning one unambiguous finding into several that share a declaration
// line and title.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-each-row verdict=redundant severity=warning
// @vitest-dedup:participant L16 "adds 1 to 2"
// @vitest-dedup:participant L16 "adds 1 to 2"
import { it, expect } from 'vitest'

for (const mode of ['strict']) {
  it.each([[1, 2], [1, 2]])('adds %s to %s', (a, b) => {
    expect(sum(a, b, mode)).toBe(a + b)
  })
}
