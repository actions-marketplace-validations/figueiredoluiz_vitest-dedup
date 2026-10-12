// RECALL config case -- `subsumed-test` under ambient globals.
//
// The config is what makes the sibling file readable: with no imports, its bare declarators are
// ordinary free identifiers, and only `globals: true` turns them into Vitest calls. The rule ships
// `Off`, so the case passes `--rule subsumed-test=warning`, exactly as its `-positive` twin does.
//
// Named weakening: flip `globals` to false and the case must report 0 tests and no finding.
import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { globals: true } })
