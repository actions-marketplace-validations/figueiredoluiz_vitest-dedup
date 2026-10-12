// OBSERVED IN REAL CODE: a public lint-rule package, in two sibling config test files --
// `runWithConfig('default', {})` at module scope, with the `it.concurrent(name, ...)` living
// inside `runWithConfig`'s body, declared *below* the calls. Checked against the real source at
// its pinned commit, not paraphrased from a report.
//
// SHAPE: a local `function` helper that declares tests, invoked at module scope. The call runs
// during module evaluation, so Vitest registers one test per call site; the title comes from the
// call's own literal argument, and the `.concurrent` chain belongs to the wrapped declaration.
// Three calls, one `it`: three cases at ONE declaration location, which is the same
// several-cases-one-declaration shape `test.each` rows and unrolled loops produce.
//
// WHAT THE ANALYZER DID WRONG (S11): the structural walk stopped at every `function` declaration,
// so both files extracted zero tests. The run was flagged (`incomplete`, `nothingRead`) but the
// message blamed `test.globals = true` -- which is not the cause here, and following it would
// have sent the reader to `--globals` for a file that imports `it` from `'vitest'` explicitly.
// A helper body is now walked from each site that CALLS it, never from its declaration.
//
// WHAT IT MUST DO NOW: extract three tests, with the call sites' literal arguments as their
// titles -- and report nothing. Silence here is not a concession: the three cases share one
// declaration, so they are three views of one `it`, not three duplicates of each other. This is
// the property `analysis::dedup_by_declaration` exists for, reached through a third route.
//
// A file-scope-only fix, deliberately: 133 of that repository's 135 files declare nothing locally
// at all -- they `import { run } from '#test'`, which re-exports from the `eslint-vitest-rule-
// tester` package, so their declarations live two modules away. Those are a cross-module problem
// and this fixture makes no claim about them.
//
// Kin: `fixtures/observed/observed-loop-unrolled-declarations.test.ts` is the same
// several-cases-one-declaration shape reached through a `for...of` instead of a helper call.
// @vitest-dedup:extracted 3
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the three participants are instances of ONE `it` call, reached from three different call sites, and --emit-test-fingerprints reports them with identical alpha/structural/behavior and different titles -- "shares a declaration site with" is not a relation between two participants that this vocabulary names, so no per-pair dimension here could fail. Load-bearing instead by a manual weakening run against this binary: give each call site its own `it` (copy the helper body inline three times) and the three cases stop sharing a location -- duplicate-test then fires at error severity on all three. One declaration versus three is the only variable between them.
// @vitest-dedup:participant L43 "default"
// @vitest-dedup:participant L43 "tab-quotes-semi"
// @vitest-dedup:participant L43 "all"
import { it } from 'vitest'

runWithConfig('default', {})
runWithConfig('tab-quotes-semi', { indent: 'tab' })
runWithConfig('all', 'all')

function runWithConfig(name: string, configs: Record<string, string> | string) {
  it.concurrent(name, async ({ expect }) => {
    const resolved = typeof configs === 'string' ? presets[configs] : customize(configs)
    expect(await lintFixture(resolved)).toMatchSnapshot()
  })
}
