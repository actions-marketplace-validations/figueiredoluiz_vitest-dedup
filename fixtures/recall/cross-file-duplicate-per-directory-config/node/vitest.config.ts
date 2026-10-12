// RECALL negative -- S6 mechanism 2: a per-directory config the analyzer now READS. This
// directory runs under `environment: 'node'`; the sibling runs under the other one. The two
// url.test.ts files are byte-identical, but the same body under two different environments is
// not a duplicate.
//
// `cross-file-duplicate` used to link them, because the scan read no config below the analysis
// root. `SourceFile::config_scope` now carries the nearest enclosing config's own `test` object
// into `Context`, keyed on CONTENT rather than path -- so two directories whose configs are
// identical still compare, and only genuinely different ones separate. The
// `knownFalsePositives` entry is gone and `expectedAbsent` carries the assertion alone.
//
// Named weakening: make both configs set the SAME `environment` and the finding returns, for a
// real reason -- two identical tests in one scope.
import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { environment: 'node' } })
