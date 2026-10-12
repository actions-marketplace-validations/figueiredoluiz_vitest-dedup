// Three hand-written tests that are exactly the rows of one `test.each` table. Expected
// verdict: consolidatable. The rule must propose the table (keeping every case as its own row --
// consolidation never licenses deleting one), and this fixture also stands as the "rows vs separate
// declarations" half of the `.each` self-duplication guard: each-differing-input-expected-pairs.
// test.ts is the companion showing that once such a table exists, its own generated rows must NOT
// flag each other -- the `.each` self-duplication defect.
//
// The tool reports pairwise, spanning-tree-style findings rather than one N-ary cluster: with three
// structurally identical tests it links (1,2) and (2,3), not (1,3). Both edges are declared below.
// @vitest-dedup:extracted 3
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L31 "add(1, 1) = 2"
// @vitest-dedup:participant L35 "add(1, 2) = 3"
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L35 "add(1, 2) = 3"
// @vitest-dedup:participant L39 "add(2, 1) = 3"
// TWO CROSS-FILE COLLISIONS (declared, not dodged): the first two tests below are byte-identical
// to the substituted rows of each-expanded-vs-table.test.ts's table, so `cross-file-duplicate`
// links each of them to that table's declaration line. The third (`add(2, 1) = 3`) has no twin
// there and is linked to nothing across files, which is the contrast that keeps the pair honest.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant each-expanded-vs-table.test.ts#L42 "add(1, 1) = 2"
// @vitest-dedup:participant L31 "add(1, 1) = 2"
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant each-expanded-vs-table.test.ts#L42 "add(1, 2) = 3"
// @vitest-dedup:participant L35 "add(1, 2) = 3"
import { test, expect } from 'vitest'
import { add } from './math'

test('add(1, 1) = 2', () => {
  expect(add(1, 1)).toBe(2)
})

test('add(1, 2) = 3', () => {
  expect(add(1, 2)).toBe(3)
})

test('add(2, 1) = 3', () => {
  expect(add(2, 1)).toBe(3)
})
