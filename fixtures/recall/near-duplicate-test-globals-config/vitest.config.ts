// RECALL config case -- `near-duplicate-test` under ambient globals.
//
// The config is what makes the sibling file readable: with no imports, its bare declarators are
// ordinary free identifiers, and only `globals: true` turns them into Vitest calls. The rule must
// then fire exactly as its `-positive` twin does. Realistic because many suites run this way --
// no per-file imports, one config line -- and that combination had never been exercised against a
// RULE here, only against extraction.
//
// Named weakening: flip `globals` to false and the case must report 0 tests and no finding.
import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { globals: true } })
