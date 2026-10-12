// RECALL config case -- `redundant-hook` under ambient globals.
//
// The config is what makes the sibling file readable: with no declarator imports, its bare
// `describe`/`test`/`beforeEach` are ordinary free identifiers, and only `globals: true` turns
// them into Vitest calls. The rule must then fire exactly as its `-positive` twin does.
//
// Named weakening: flip `globals` to false and the case must report 0 tests and no finding.
import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { globals: true } })
