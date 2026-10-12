// RECALL variant -- duplicate-test-name where the title comes from a function NAME.
//
// `test(someFn)` takes its title from `someFn.name`; the function is the body, not a thunk that
// produces the title (docs/vitest-surface.md ss3). Both declarations here pass a named function
// expression called `parsesAnEmptyDocument`, so both tests are titled
// `parsesAnEmptyDocument` and collide.
//
// Every other `duplicate-test-name` case in this corpus writes its title as a string literal. An
// extractor that resolved a title only from a string/template argument would record these two as
// untitled or dynamic and report nothing, while leaving those cases green.
//
// The two bodies assert different things, so the collision is the only available finding.
import { expect, test } from 'vitest'
import { parse } from './parser'

test(function parsesAnEmptyDocument() {
  expect(parse('')).toEqual([])
})

test(function parsesAnEmptyDocument() {
  expect(parse('  ')).toHaveLength(0)
})
