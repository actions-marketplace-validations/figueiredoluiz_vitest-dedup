// RECALL variant -- S7 x S3: a loop-unrolled `.each` (the config-merge shape) inside a file whose config
// is a `test.projects` entry. Cannot live in fixtures/mixed/ (D3): the corpus gate's solo run
// copies one bare .test.ts and never the config beside it. The duplicate-each-row finding this
// case pins as absent fires today, so it is classified `knownFalsePositives` until the S7 fix.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { projects: [{ test: { name: 'pkg', root: './pkg' } }] },
})
