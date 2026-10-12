// Second half of the `duplicate-test-bench` case: the SAME duplicated benchmark pair, in a
// `*.bench.ts` file. This is the regression guard for benchmark discovery: Vitest uses the
// separate `benchmark.include` channel for these files, so mirroring only `test.include` would
// silently omit both declarations even though the extractor and rule support them.
import { bench } from 'vitest'
import { parse } from './parser'

bench('parses a long document', () => {
  const source = 'x=1\ny=2\nz=3\n'
  parse(source)
})

bench('reads a large config', () => {
  const text = 'x=1\ny=2\nz=3\n'
  parse(text)
})
