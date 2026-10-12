// RECALL config case -- `duplicate-suite` under ambient globals.
//
// Every rule needs a case where the CONFIG is what makes the file readable at all. Without
// `globals: true` the sibling test file imports nothing, so its bare `describe`/`test` are
// ordinary free identifiers and the analyzer must extract zero tests from it. With this config
// resolved, they are Vitest declarators and the rule must fire exactly as its `-positive` twin
// does.
//
// Realistic because a large share of suites run this way: no per-file imports, one config line.
// That combination had never been exercised against a RULE here, only against extraction.
//
// Named weakening: flip `globals` to false and the case must report 0 tests and no finding.
import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { globals: true } })
