// RECALL variant -- duplicate-test over `bench` declarations.
//
// `bench` is an executable declaration (`DeclarationKind::Benchmark`, accepted by
// `is_executable_declaration`), so two benchmarks with alpha-equal bodies under one context are
// redundant on exactly the terms two `test`s are: running the same measurement twice measures
// nothing new. This is the pre-v5 top-level-import spelling, which the extractor must keep
// supporting (docs/vitest-surface.md ss1: v5 moved `bench` to a test-context fixture, and the
// corpus contains both majors).
//
// The variant exists because every other duplicate-test case in this corpus uses `test`: a rule
// that quietly stopped accepting `Benchmark` as executable would keep every one of them green.
import { bench } from 'vitest'
import { parse } from './parser'

bench('parses a short document', () => {
  const source = 'a=1\nb=2\n'
  parse(source)
})

bench('reads a small config', () => {
  const text = 'a=1\nb=2\n'
  parse(text)
})
