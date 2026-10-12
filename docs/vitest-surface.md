# Vitest test-declaration surface

What VitestDedup recognizes, and why. This is the reference the extractor is written against:
anything Vitest can express that the analyzer must either read or refuse.

Verified against the Vitest API and config documentation at version **5.0.0**. Facts that are v5
breaking changes relative to v2-v4, the versions most repositories still run, are flagged
`[v5 CHANGE]`. Anything not confirmed by the published docs is marked `UNVERIFIED`.

**Start with [Extraction hazards, ranked](#extraction-hazards-ranked)** if you are reading this to
understand where static analysis of Vitest gets hard. The numbered sections below are the surface
itself.

| # | Section | Covers |
| --- | --- | --- |
| 1 | [Test-declaring callables](#1-test-declaring-callables) | `test`, `it`, `describe`, `suite`, `bench` |
| 2 | [Modifiers and chained forms](#2-modifiers-and-chained-forms) | `.skip`, `.only`, `.todo`, `.each`, chaining order |
| 3 | [Signature variants](#3-signature-variants) | Options object vs bare function, legacy timeout |
| 4 | [`.each` / `.for` tables](#4-each--for-table-forms-and-title-derivation) | Table forms and title rendering |
| 5 | [Hooks](#5-hooks) | Lifecycle hooks and their scoping |
| 6 | [Fixtures](#6-fixtures-testextend) | `test.extend` and fixture resolution |
| 7 | [How the API becomes available](#7-how-describetestetc-become-available) | Imports vs `globals: true` |
| 8 | [In-source testing](#8-in-source-testing) | `import.meta.vitest` |
| 9 | [Default file globs](#9-default-file-globs) | `include`, `exclude`, benchmark and typecheck channels |
| 10 | [Projects / workspace](#10-projects--workspace) | Per-project resolution |
| 11 | [Look-alikes](#11-look-alikes-that-are-not-vitest-tests) | Playwright, Jest, Cypress, Mocha, node:test |
| 12 | [The `vi` mocking family](#12-the-vi-module-mocking-family) | `mock`, `doMock`, `hoisted`, and the rest |

---

## 1. Test-declaring callables

| Callable | Alias of | Import | Notes |
| --- | --- | --- | --- |
| `test` | none | `vitest` | Primary test declarator. |
| `it` | `test` | `vitest` | Full alias, same object, same modifier surface, interchangeable everywhere including `.each`/`.extend` chains. |
| `describe` | none | `vitest` | Suite/group declarator. |
| `suite` | `describe` | `vitest` | Full alias of `describe`. `[v5 CHANGE]` the `vitest/suite` *subpath* entry point was removed in v5, but the named export `suite` from the `vitest` package root is unaffected, extractor should treat `suite(...)` exactly as `describe(...)`. |
| `bench` | none | **not** a top-level export in v5 | `[v5 CHANGE]` "Benchmarking API Rewrite": in Vitest 5, `bench` is no longer `import { bench } from 'vitest'`; it is obtained as a **test-context fixture**, destructured from the callback argument of a regular `test`: `test('name', ({ bench }) => { bench(...) })`. `bench.skip`/`.only`/`.todo` are removed, use `test.skip`/`.only`/`.todo` on the enclosing test instead. In v2-v4, `bench` **was** a top-level import with its own `.skip`/`.only`/`.todo`/`.each`, structurally parallel to `test`. The extractor must support **both shapes** since the corpus will contain both major versions. |

Interchangeability: `test`/`it` are the same function object; `describe`/`suite` are the same
function object. All modifier and chain forms below apply identically to both members of each
pair. There is no cross-pair interchangeability (`describe.only` and `test.only` are unrelated).

## 2. Modifiers and chained forms

| Modifier | Applies to | Effect | Chainable with |
| --- | --- | --- | --- |
| `.skip` | test, describe (, bench in ≤v4) | Never runs; still listed/reported | `.concurrent`, `.each`, `.for` |
| `.only` | test, describe (, bench ≤v4) | Only `.only`-marked items run in the file/run | `.concurrent`, `.each`, `.for` |
| `.todo` | test, describe (, bench ≤v4) | Placeholder, not executed, reported as todo | generally terminal (no body required) |
| `.fails` | test only | Inverts pass/fail, test **must** throw/fail or the run fails | `.each`, `.for` |
| `.concurrent` | test, describe | Runs in parallel with sibling concurrent tests | `.skip`, `.only`, `.todo`, `.each`, `.for` |
| `.sequential` | test, describe | `[v5 CHANGE]` **Removed in v5** ("Removed `test.sequential`, `describe.sequential`, and `sequential` Options"). Present and meaningful in v2-v4 as the inverse of `.concurrent` (forces sequential execution inside an otherwise-concurrent suite). Extractor must still recognize it as a legal chain member for pre-v5 corpora. | UNVERIFIED |
| `.skipIf(cond)` | test, describe | Skip when `cond` truthy, evaluated at collection time | usually leaf of chain, precedes `.each`/`.for`? UNVERIFIED ordering |
| `.runIf(cond)` | test, describe | Inverse of `.skipIf` | same |
| `.each(table)` | test, describe (, bench ≤v4) | Expands one declaration into N declarations, one per table row | combines with `.skip/.only/.todo/.concurrent` |
| `.for(table)` | test, describe | Like `.each` but does not spread array rows into positional args, and gives the callback `TestContext` as its 2nd param | same combinability as `.each` |
| `.extend(fixtures)` | test only | Returns a **new** `test`-like function bound to merged fixtures; not a modifier on an individual test, it produces a new base object that itself has `.skip/.only/.each/...` | Chains from the new object, not from `test` directly |
| `.scoped(...)` | result of `.extend` | Deprecated in v4.1 in favor of `.override`; sets/overrides fixture values for the current suite and nested suites | Must be called at top level of a `describe` block |
| `.shuffle` | describe (config-level `sequence.shuffle` also exists) | Randomizes execution order of tests within the suite; inherited by nested suites unless overridden with `{ shuffle: false }` | UNVERIFIED whether `test.shuffle` exists (docs only show `describe.shuffle`) |

Newer, v4.1+/v5-only members (worth knowing exist even if a v1 extractor treats them as
out-of-scope, so they don't get misparsed as unknown-and-ignored when they actually carry
semantics):

| Form | Since | Meaning |
| --- | --- | --- |
| `test.override(fixtures)` | 4.1 | Overrides fixture values for all tests in current + nested suites; supersedes `.scoped`. Must be called at the describe-block top level, so its call site (not just its existence) is part of the suite structure. |
| `test.beforeEach` / `.afterEach` / `.beforeAll` / `.afterAll` | scoped-hook sugar | Hooks bound to a `test.extend`-produced object, typed with its fixtures, behaviorally identical to the free `beforeEach`/etc. but namespaced under the extended `test`. |
| `test.aroundEach` / `.aroundAll` | 4.1 | New hook forms combining before+after in one wrapper function. UNVERIFIED exact signature. |
| `test.describe` / `test.suite` | 4.1 | "Scoped describe", a `describe` bound to the extended fixtures, same semantics as top-level `describe` otherwise. |

### Legal chain orders

Confirmed from docs (both orders shown as valid, i.e. **order-independent** for
skip/only/todo × concurrent):

```
test.concurrent(...)
test.skip.concurrent(...)   // or test.concurrent.skip(...)
test.only.concurrent(...)   // or test.concurrent.only(...)
test.todo.concurrent(...)   // or test.concurrent.todo(...)
describe.skip.concurrent()  // or describe.concurrent.skip()
describe.only.concurrent()  // or describe.concurrent.only()
describe.todo.concurrent()  // or describe.concurrent.todo()
```

`.each`/`.for` appear to always be the **last** link before the call, e.g.
`test.concurrent.skip.each(table)(title, fn)`, `describe.concurrent.each(table)(title, fn)`,
`test.skipIf(cond).each(table)(...)`. The extractor should treat the modifier chain as an
**unordered set** of flags (skip/only/todo/concurrent/fails) collected by walking `MemberExpression`
links, with `.each`/`.for`/`.skipIf(...)`/`.runIf(...)` as the (at most one) chain-terminal,
call-taking members, rather than hard-coding a specific order, the docs demonstrate both orders
are accepted and there is no indication the parser cares about order for the boolean flags.

## 3. Signature variants

```ts
// title forms
test('a plain string title', fn)
test(`a template literal title ${maybeDynamic}`, fn)   // only statically resolvable if template has no expressions, or all expressions are literals/const-foldable
test(namedFunction, fn?)                                // if 1st arg is a Function, its .name becomes the title WITHOUT calling it

// options object: 2nd OR 3rd positional argument
test('name', fn, timeoutMs)                             // legacy 3-arg numeric-timeout form
test('name', { timeout, retry, repeats, tags, meta, concurrent, skip, only, todo, fails }, fn)  // options as 2nd arg, fn as 3rd
describe('name', { ... }, fn)                            // same options-object pattern for suites

// callback receiving TestContext
test('name', (ctx) => { ctx.expect(1).toBe(1) })
test('name', ({ expect, skip, task, annotate, signal, onTestFailed, onTestFinished }) => {})
```

- **Title as string**: the common case, statically a `StringLiteral`.
- **Title as template literal**: statically resolvable only when it is a `NoSubstitutionTemplateLiteral`, or every substitution expression const-folds (e.g. `${1+1}`); an extractor must fall back to "dynamic title" (store cooked template + placeholder positions) when substitutions reference runtime identifiers.
- **Title as function name**: `test(someFn)`, `someFn.name` is used as title, `someFn` is **not invoked** to obtain the title (i.e. the function is the test body, not a title-producing thunk). Requires resolving the function's `.name`, for a `function name() {}` declaration or named `const name = function() {}` expression this is static; for other cases (anonymous `() => {}` assigned then passed) resolving the effective `.name` requires binding lookup via `oxc_semantic`.
- **Options object position**: can be the **2nd** argument (`test(name, options, fn)`) or the value at that position can instead be the **function itself with no options** (`test(name, fn)`), extractor must disambiguate by argument type (`Function` vs plain `Object`), not position alone. A bare number in the "3rd" position is the legacy timeout shorthand, not an options object.
- **`options.timeout`**, **`options.retry`** (`number | { count?, delay?, condition? }`), **`options.repeats`**, **`options.tags`** (`string[]`), **`options.meta`** (arbitrary object), plus the boolean modifier fields (`concurrent`, `skip`, `only`, `todo`, `fails`) which are **the object-literal equivalent of the chained forms**, `test('x', { skip: true }, fn)` is equivalent to `test.skip('x', fn)`. The extractor must union modifier flags from both the member-expression chain and the options object.
- **`TestContext` callback param**: destructured or whole-object; whole-object access (`(ctx) => ctx.skip()`) vs destructured (`({ skip }) => skip()`) are both legal and must both be recognized when detecting in-body use of `skip`/`expect`/`onTestFinished`/`onTestFailed`/`bench`(v5)/`task`/`annotate`/`signal`.
- **`onTestFinished`/`onTestFailed` are also importable directly from `'vitest'`**, exactly like
  `beforeEach`/`afterEach` (`import { test, onTestFinished } from 'vitest'`), not only reachable via
  `TestContext` destructuring as the callback example above implies. Both forms register a callback
  against "whichever test is currently running", but the imported/global form does so through
  module-level shared state, which Vitest's own docs call out as unsound for `.concurrent` tests
  ("Vitest doesn't track concurrent tests in global hooks"), the context-bound form is the only
  one Vitest recommends once `.concurrent` is in play. See §5 for the hook-table entry.

## 4. `.each` / `.for` table forms and title derivation

Three table shapes:

1. **Array of arrays**, each inner array is spread positionally into the callback params:
   ```ts
   test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])('add(%i, %i) -> %i', (a, b, expected) => {
     expect(a + b).toBe(expected)
   })
   ```
   Row `[1, 1, 2]` + template `'add(%i, %i) -> %i'` → title `add(1, 1) -> 2`.

2. **Array of objects**, each object is passed whole; `$field` / `$0`,`$1`.. / `$field.nested`
   interpolation reads properties off it for the title, and the callback destructures fields by name:
   ```ts
   test.each([{ a: 1, b: 1, expected: 2 }])('add($a, $b) -> $expected', ({ a, b, expected }) => {
     expect(a + b).toBe(expected)
   })
   ```
   Also supports positional `$0`, `$1`, ... and dotted paths (`$a.val`).

3. **Tagged-template-literal table**, a string header row (`|`-separated column names) followed
   by one-or-more rows of `${value}` cells, consumed as a tagged template:
   ```ts
   test.each`
     a      | b      | expected
     ${1}   | ${1}   | ${2}
     ${'a'} | ${'b'} | ${'ab'}
   `('returns $expected when $a is added $b', ({ a, b, expected }) => {})
   ```
   Statically: the header row's identifiers become field names; the `${...}` expressions are the
   `TaggedTemplateExpression`'s `expressions` array, positionally matched to header columns in
   row-major order. Only const-foldable expressions in the cells yield a static concrete title;
   non-literal expressions (e.g. `${someVar}`) mean the row's concrete value, and therefore its
   title, is not statically known and must be treated as an opaque/dynamic row.

**Title interpolation directives** (printf-style, applied left-to-right against the row's
positional values, independent of `$field` mode):

| Directive | Meaning |
| --- | --- |
| `%s` | string |
| `%d` | number |
| `%i` | integer |
| `%f` | float |
| `%j` | JSON |
| `%o` | object |
| `%#` | 0-based index of the row within the table |
| `%$` | 1-based index of the row |
| `%%` | documented as a literal `%`; **measured otherwise, see below** |

### What the numeric directives actually coerce

Measured against **Vitest 5.0.3**, one value per row, reading each test's own `currentTestName` from
inside the run rather than inferring it from the pattern. `%d` is `Number(value)`; `%i` and `%f` are
`parseInt`/`parseFloat` over the value's **string** form, which is a different function on a different
input and disagrees with `%d` on most non-numbers.

| value | `%s` | `%d` | `%i` | `%f` |
| --- | --- | --- | --- | --- |
| `null` | `null` | `0` | `NaN` | `NaN` |
| `true` | `true` | `1` | `NaN` | `NaN` |
| `false` | `false` | `0` | `NaN` | `NaN` |
| `undefined` | `undefined` | `NaN` | `NaN` | `NaN` |
| `0` | `0` | `0` | `0` | `0` |
| `-0` | `-0` | `0` | `0` | `-0` |
| `1.5` | `1.5` | `1.5` | `1` | `1.5` |
| `-1.5` | `-1.5` | `-1.5` | `-1` | `-1.5` |
| `'a'` | `a` | `NaN` | `NaN` | `NaN` |
| `''` | *(empty)* | `0` | `NaN` | `NaN` |
| `'1.5'` | `1.5` | `1.5` | `1` | `1.5` |
| `'12abc'` | `12abc` | `NaN` | `12` | `12` |
| `'0x1F'` | `0x1F` | `31` | `31` | `0` |
| `[]` | *(empty)* | `0` | `NaN` | `NaN` |
| `[2]` | `2` | `2` | `2` | `2` |
| `[2, 3]` | `2,3` | `NaN` | `2` | `2` |
| `[null]` | *(empty)* | `0` | `NaN` | `NaN` |
| `[true]` | `true` | `NaN` | `NaN` | `NaN` |
| `{ k: 1 }` | `{ k: 1 }` | `NaN` | `NaN` | `NaN` |
| `NaN` | `NaN` | `NaN` | `NaN` | `NaN` |
| `Infinity` | `Infinity` | `Infinity` | `NaN` | `Infinity` |
| `10n` | `10n` | `10n` | `10n` | `10` |

Four rows are worth naming because they are the ones a reimplementation gets wrong:

- **`null` and `true` are `0` and `1` under `%d` only.** Under `%i`/`%f` they are `NaN`, because
  `parseInt('null')` is `NaN`. A summary that says "`null` renders 0" is true of one directive in
  three.
- **`%i`/`%f` parse a prefix; `%d` does not.** `'12abc'` is `12` under `%i`/`%f` and `NaN` under `%d`.
- **An array goes through its string form.** `[2, 3]` is `'2,3'`, so `%i` and `%f` yield `2` while
  `%d` yields `NaN`. `[]` is `''`, which `Number` reads as `0` but `parseInt` reads as `NaN`.
- **`-0` keeps its sign under `%f` alone**, Vitest's own `formatTitle` rewrites the directive to
  `-%f` for a negative-zero item (read from the 5.0.3 bundle), while `%d`/`%i` print `0`. A BigInt
  is *never* `Number(value)`: `%d`/`%i` special-case it to print the literal's own `10n`, while
  `%f` has no such case and prints `parseFloat('10')` = `10`.

**What this analyzer renders, and where it refuses.** The coercions above that yield a real
number are rendered exactly (`null`→`0` and `true`→`1` under `%d`; `'12abc'`→`12` and `[2,3]`→`2`
under `%i`/`%f`; `Infinity` under `%d`/`%f`; `-0` under `%f`). Every coercion that yields `NaN` is
**refused**, the title stays unrendered and the declaration opts out of title comparison,
because `NaN` is a title that does not discriminate between rows, and rendering it would report
rows that differ as the same case. The refusal lives in `numeric_directive`
(`src/frontend/extract.rs`).

`%s` is `String(value)` except for plain objects, which get `pretty-format` (`{ k: 1 }`, not
`[object Object]`). `%o` is the inspect form throughout (`'a'`, `[ 2, 3 ]`).

### `%%` consumes an argument (upstream defect)

Documented as a literal `%`. Measured on Vitest 5.0.3, it emits `%`, a space, and **the next
positional argument**, consuming it, so every directive after it shifts by one:

| pattern | row | rendered title |
| --- | --- | --- |
| `%% x %s y %s z %s` | `['A','B','C']` | `% A x B y C z undefined` |
| `x %s y %% z %s` | `['A','B','C']` | `x A y % B z C` |
| `x %s y %s z %%` | `['A','B','C']` | `x A y B z % C` |
| `%%%%` | `['A','B','C']` | `% A% B` |
| `100%% done %s` | `['A','B']` | `100% A done B` |
| `only %s` | `['A','B','C']` | `only A` |

The last row rules out "leftover arguments are appended": they are not. `%%` is behaving as a
directive, not as an escape.

**This analyzer refuses to render a title containing `%%`** rather than reproducing this, because
it cannot know which Vitest version will run the tests it is reading. It parses configuration and
source without executing either, so the installed version is not a fact available to it. Mirroring
the current behaviour would produce wrong titles for anyone on a version where this is fixed, and a
wrong title is a wrong answer about which rows collide. Refusing costs only that rows with `%%` in
the title stay uncompared, and the run says so.

### Depth truncation and width elision are one 40-character budget

Measured on **Vitest 5.0.3** by the same probe method (one `.each` row per value, reading each
test's own `currentTestName`), cross-checked by calling the shipped `inspect` directly, the two
agree on every value below. The probe is permanent: `scripts/check/verify-titles.mjs` runs
`scripts/vitest-harness/title-values.test.ts` through the pinned Vitest and through this analyzer
and fails on any title that differs. Every row of the table below is in that fixture except the
two nested past `MAX_CELL_DEPTH`, which this analyzer refuses: a refusal has no runtime title to
compare. There is **no fixed depth limit and no fixed item-count limit**: both
truncations are driven by `taskTitleValueFormatTruncate` (default **40 characters**), applied per
interpolated value. The algorithm, read from the 5.0.3 bundle's `inspect`/`stringify` and confirmed
by the measurements:

1. Render the value with pretty-format at `maxDepth: 10`.
2. While the result is **≥ 40 units** and `maxDepth > 1`, halve `maxDepth` (10 → 5 → 2 → 1)
   and re-render. A composite past `maxDepth` prints as `[Array]`/`[Object]`.
3. If it is still > 40: a *string* keeps its first 38 units inside the quotes, then `…`; an
   **array, object, set or map** re-renders at `maxDepth: 1` with a binary-searched item width so
   the result fits 40, marking the cut `…(k)` where `k` is the number of omitted entries; anything
   else re-renders at `maxDepth: 0`.

Every length is JavaScript `string.length`: UTF-16 code units, so `😀` counts twice, and a cut
that would split a surrogate pair backs off one unit. A bare `$field` string takes a different
path, `truncateString(value, 40)`: unchanged at 40 units, otherwise the first 39 then `…`. `%s`
of a plain object is the same `inspect` call as `%o` (the object has no own `toString`); `%s` of
a string or an array is not truncated at all.

| value interpolated into the title | rendered (Vitest 5.0.3, truncate 40) |
| --- | --- |
| `[0..9]`, 10 one-digit items (32 chars) | `[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]`, full |
| `[0..19]`, 20 items | `[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, …(10) ]` |
| `[90..100]`, 11 two-digit items | `[ 90, 91, 92, 93, 94, 95, 96, 97, …(3) ]`, the width is *searched* to fit the budget, not a fixed 10 |
| `{ <46-char key>: 1 }` | `{ …(1) }`, the search can find width 0 |
| array nested 9 deep (37 chars) | full, depth alone never truncates |
| array nested 10 deep (41 chars) | `[ [ [ [ [ [Array] ] ] ] ] ]`, halving landed at 5 levels |
| object nested 5 deep (37 chars) | `{ a: { a: { a: { a: { a: 1 } } } } }`, full |
| object nested 6 deep (42 chars) | `{ a: { a: [Object] } }` |
| the string `'a'×38` under `%o` | `'aaaa…aaa'`, full: 40 units with the quotes |
| the string `'a'×39`, `×40`, `×41`, `×45` under `%o` | `'aaaa…aaa…'`, 38 characters, then `…`, inside the quotes |
| the string `'a'×38`, `×39`, `×40` under `$field` | full, no quotes |
| the string `'a'×41`, `×45` under `$field` | `aaaa…aaa…`, 39 characters, then `…` |
| `'😀'×19` / `'😀'×20` under `%o` | full / `'😀…😀…'`, 19 emoji, then `…` |
| `'😀'×20` / `'😀'×21` under `$field` | full / `😀…😀…`, 19 emoji, then `…` |
| `[ '😀'×10, '😀'×10, 1 ]` under `%o` (33 characters, 53 units) | `[ '😀😀😀😀😀😀😀😀😀😀', …(2) ]` |
| `{ aaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbb: 2, ccccccccccccccc: 3 }` under `%s` | `{ aaaaaaaaaaaaaaa: 1, …(2) }` |

**What this analyzer does with that:** the budget is mirrored for the mechanisms this section
measures, and the depth refusal stays separate:

- **Depth: still a refusal, not a rendering difference.** `render_inspect`
  (`src/frontend/registry.rs`) renders composites only down to `MAX_CELL_DEPTH` (8), a bound
  against unbounded recursion over repository content. A composite nested past that bound is
  *refused outright*: the cell is unreadable, its row keeps the unrendered pattern, and the
  declaration opts out of title comparison (`not-compared`). No partially-rendered title is
  produced, and the budget mirror does not change this: a value that refuses the full render
  refuses everything (Vitest's own halving starts at `maxDepth: 10`; ours would start from a
  render this analyzer cannot prove).
- **Width: mirrored, within the depth bound.** Below the refusal bound, `inspect_within_budget`
  reproduces the algorithm above in UTF-16 units: the full rendering, then `maxDepth` halved
  5 → 2 → 1 with composites at the limit printing `[Array]`/`[Object]`, then, still over, a
  quoted string cut to 38 units plus `…` (41 with the quotes, exactly as the measured rows land),
  a bare `$field` string cut to 39, and an array or object re-rendered at `maxDepth: 1` showing
  the largest item count that fits, marked `…(k)`. The mirror reproduces every row of the
  measured table within the depth bound byte-for-byte; the two rows nested 9 and 10 deep are
  past `MAX_CELL_DEPTH` and are refused, as the previous point says. A rendering of exactly 40
  units is returned as the `maxDepth: 1` render without the search (the algorithm's threshold
  is strictly over). The covered mechanisms are the measured ones: `%o`/inspect, `$field`, `%s`
  of a plain object, and the tagged-template row's assembled object. `%s` on a scalar or array,
  `%j`, and the numeric directives are not truncated by Vitest either, and stay full here.

Mirroring the budget makes a rendered title a claim about the runtime string: two distinct values
that Vitest titles identically (the same `…(k)` elision) now render alike here too. That is the
point, and it is precision-safe because title comparison never decides a finding on its own,
the body and context fingerprints still see the full, injective renderings.

`[v5 CHANGE]` "Test Titles and Inspected Values Use `pretty-format`", in v5, interpolated string
values are **no longer wrapped in quotes** in the rendered title, and a `taskTitleValueFormatTruncate`
option (default 40 chars) truncates long interpolated values. This changes the exact title string
an extractor reproduces vs. pre-v5 Vitest, **the title-rendering logic must be versioned** (or the
extractor must not claim byte-exact title reproduction across Vitest majors, only per-major).

**`test.for` vs `test.each`**: identical table syntax and identical title-derivation rules; the only
difference is at the callback-argument level, `.for` does **not** spread an array row into
positional params, it passes the whole row as the callback's first argument (so array rows require
destructuring: `([a, b, expected]) => {}`), and the callback receives `TestContext` as its **second**
parameter, enabling `context.expect` for concurrent-safe snapshots. Non-array (object / tagged
template) rows behave identically between `.each` and `.for`.

`describe.each` / `describe.for` use the same table/title rules to generate multiple `describe`
blocks (each with its own interpolated title and independently nested tests) rather than multiple
tests.

**Static-analysis fallback rule**: whenever the table itself is not a literal array/object
expression at the call site (e.g. `test.each(getCases())`), the extractor cannot enumerate rows at
all, it must record "parameterized, table unresolved" rather than guessing a row count.

## 5. Hooks

| Hook | Signature | Scope | Notes |
| --- | --- | --- | --- |
| `beforeAll(fn, timeout?)` | `fn: (ctx: ModuleContext) => unknown` | File (top-level) or enclosing `describe` | Runs once before all tests in scope. |
| `afterAll(fn, timeout?)` | same | same | Runs once after all tests in scope. |
| `beforeEach(fn, timeout?)` | `fn: (ctx: TestContext) => unknown` | File or enclosing `describe` | Runs before every test in scope; may **return a cleanup function**, which runs after all `afterEach` hooks in that scope (i.e. later than ordinary `afterEach`). |
| `afterEach(fn, timeout?)` | same | same | Runs after every test in scope. |
| `onTestFinished(fn)` | `fn: (ctx: TestContext) => unknown`, called from inside a running test/hook | Single test instance | Runs after that test's `afterEach` chain; multiple registrations run in **reverse** registration order; not affected by `sequence.hooks` config. |
| `onTestFailed(fn)` | same shape | Single test instance | Only fires if the test failed; also runs after `afterEach`. |

**`onTestFinished`/`onTestFailed` have two call forms, not one**: both are destructurable off
`TestContext` (as shown in §3) *and* importable directly from `'vitest'` as named exports, the same
shape as `beforeEach`/`afterEach`. Both forms throw if called outside a running test body. The
docs explicitly warn the global/imported form is unsound under `.concurrent`: "If you are running
tests concurrently, you should always use the `onTestFailed`/`onTestFinished` hook from the test
context since Vitest doesn't track concurrent tests in global hooks", i.e. the imported form
resolves "the current test" through shared module state that a single sequential runner keeps
consistent but that concurrent execution does not. An extractor doing name-based import resolution
for `'vitest'` exports should recognize `onTestFinished`/`onTestFailed` as legal top-level imports,
not just as context members.

**Nesting/ordering rules**:
- Hooks registered at file top-level apply to every test in the file; hooks registered inside a
  `describe` apply only to tests (and nested describes) within that block.
- Default execution order is a "stack": `beforeAll`/`beforeEach` run outer-to-inner (parent before
  child), `afterAll`/`afterEach` run inner-to-outer (child before parent), i.e. `afterEach` order
  is the reverse of `beforeEach` registration order, configurable globally via `sequence.hooks`.
- `test.beforeEach`/`test.afterEach`/`test.beforeAll`/`test.afterAll` (hooks hung off a
  `test.extend()`-produced object) are the same hooks, scoped to whatever suite they're declared
  in, just spelled through the extended-test namespace so they can see fixture types.
- `test.aroundEach`/`test.aroundAll` (v4.1+) combine setup+teardown in one wrapper; exact signature
  UNVERIFIED, treat as an opaque hook-registering call for extraction purposes (record its
  presence and scope; don't try to model control flow inside it yet).

For context-compatibility purposes (the `redundant-hook` and context-equivalence rules), a
`TestCase`'s effective hook chain is: every
`beforeAll`/`beforeEach` from the root of the file down through each enclosing `describe`, in
declaration order, **plus** the corresponding `afterEach`/`afterAll` from each level in reverse,
this is exactly the ordered set the analyzer needs to compare for "equivalent context."

## 6. Fixtures (`test.extend`)

```ts
const myTest = test.extend<{ db: Database }>({
  db: async ({}, use) => {
    const db = await connect()
    await use(db)
    await db.close()
  },
})

myTest('reads a row', async ({ db }) => {
  expect(await db.get('x')).toBeDefined()
})
```

- Fixture keys are the **object's property names** (object-syntax) or the **first string argument**
  to `.extend('name', fn)` (builder-syntax, newer). Either way, the fixture's name is statically the
  literal key/string, no computed keys expected in idiomatic code, but a `[computed]: fn` key would
  defeat static naming and should be flagged unresolved.
- A fixture function's signature is `(dependencies, use) => ...` (object-syntax) or
  `(dependencies, { onCleanup }) => value` (builder-syntax). `dependencies` is destructured from
  previously-defined fixtures (including base ones), this is itself a fixture dependency graph the
  extractor can build from the destructuring pattern's property names, matched against sibling keys
  in the same `.extend()` call and any upstream `.extend()` in the chain.
- **Auto vs. lazy initialization**: Vitest decides whether to instantiate a fixture based on whether
  the test callback (or a downstream fixture) actually uses it, i.e., a **runtime**
  usage-detection mechanism, not purely a static one. This is **not** arity/reflection on the
  function's declared params: Vitest's own docs describe it as "smartly initialize your fixtures
  ... based on usage" and separately instruct that "you should always use the object destructuring
  pattern `{ database }` to access context both in fixture function and test function", i.e. the
  detector is understood to work reliably on the destructured-name shape, and whole-object dot
  access to a *custom fixture* (`(ctx) => ctx.db`, as opposed to a built-in `TestContext` member
  like `ctx.expect`) is a discouraged, not-guaranteed-detected pattern, not merely a stylistic
  alternative. `{ auto: true }` forces initialization unconditionally, sidestepping the detector
  entirely. **What a static analyzer can know**: the full fixture graph and its declared
  dependencies (from source). **What it cannot fully know**: whether a given test transitively
  pulls in a given fixture's side effects without also statically re-deriving Vitest's own
  usage-detection heuristic against that specific callback's access pattern, which the extractor
  *can* approximate for the destructured shape (a syntactic pattern-match on the callback's
  parameter list) but should treat whole-object access to a fixture name as a weaker, best-effort
  signal than a destructured one, not an equally reliable mirror of runtime behavior.
- **`scope`**: `'test'` (default, per-test) / `'file'` (shared per file) / `'worker'` (shared per
  worker process), changes whether two tests sharing a fixture are "isolated" for context-equivalence
  purposes; a `file`/`worker`-scoped fixture means state genuinely carries over between tests, which
  the context model should represent (two tests using the same file-scoped fixture are *not*
  automatically context-independent the way two `test`-scoped-fixture tests are).
- **`injected: true`**: value supplied externally via project `provide` config; statically the
  fixture's *value* is unknowable (comes from config, not source), record as "external/opaque
  fixture value."
- **`test.scoped(...)`** (deprecated 4.1+) / **`test.override(...)`** (4.1+, current): both mutate
  fixture values for the current suite (and nested suites) rather than defining new fixtures; must
  be called at a `describe` block's top level, a call site inside a test body or nested callback is
  invalid and (per docs) not the supported form, so the extractor should anchor these calls to
  direct children of a `describe` block's statement list.
- Reaching the callback: extended fixtures are merged into the same `TestContext` object ordinary
  hooks/tests receive, from the test body's perspective there is no syntactic difference between a
  built-in context property (`expect`, `task`, `skip`, ...) and a user-defined fixture; both are
  just destructured names. Disambiguating "known Vitest context member" vs. "user fixture" requires
  cross-referencing the destructured name against (a) the built-in `TestContext` member list and (b)
  the fixture keys visible from the `test.extend` chain that produced the local `test`/`it` binding.

## 7. How `describe`/`test`/etc. become available

| Mode | Form | Notes |
| --- | --- | --- |
| Named import | `import { test, describe, it, expect, beforeEach } from 'vitest'` | Most common; resolved via normal import-binding semantics (`oxc_semantic` symbol resolution), including renamed imports (`import { test as t } from 'vitest'`). |
| Namespace import | `import * as vitest from 'vitest'; vitest.test(...)`, `vitest.describe(...)` | Must recognize member access off a namespace-imported binding from the `'vitest'` specifier, not just bare identifiers. |
| Globals | `globals: true` in config | No import at all, `test`/`describe`/`it`/`suite`/`expect`/hooks/etc. are ambient globals, indistinguishable syntactically from any other free identifier of the same name. Recognizing them **requires resolving the effective Vitest config for the file's project** (see below) and, only when `globals: true` resolves for that file, treating the bare identifiers as Vitest globals. A bare identifier that merely *looks* like a test declarator is not one until the config says so. |

**`globals` config specifics** (from `/config/globals`):
- Default: **`false`**.
- Enable via `test: { globals: true }` in the resolved Vite/Vitest config, or the `--globals` CLI flag.
- For TypeScript ambient types, projects also add `"types": ["vitest/globals"]` to `tsconfig.json`, this is a type-checking concern only, not a runtime-behavior signal, so the extractor should not use it as an alternative detection source (a repo could have the types entry without `globals: true`, or vice versa via CLI flag) but MAY use it as a corroborating hint when the config file itself is not resolvable.

**Where `globals: true` can be set**, any of:
- Root `vitest.config.{ts,mts,cts,js,mjs,cjs}` (looked up first).
- Root `vite.config.{ts,mts,cts,js,mjs,cjs}` (looked up second, if no vitest.config found), with the `test` field nested under Vite's own config object, optionally gated by `process.env.VITEST` / Vite's `mode` to avoid polluting the plain Vite build config type.
- Per-project, inside a `test.projects` entry, either as an inline object (`{ test: { globals: true, ... } }`) or via a referenced project config file matching `vitest.config*` / `vite.config*` / `vitest.<name>.config.*` / `vite.<name>.config.*` (`<name>` = letters/digits/`_`/`-`). Because projects can set `extends: false` to ignore the root config, `globals` is **not guaranteed uniform across a workspace**, the extractor must resolve it **per project**, not once globally for the whole scan. `[UNVERIFIED]` whether `globals` is on the explicit "root config only" restricted-options list (the config overview page mentions such a list exists but the fetched excerpt didn't confirm this specific option's membership); treat it as settable-per-project unless direct testing shows otherwise.
- Legacy `vitest.workspace.{ts,js}` files (deprecated since 3.2, replaced by `test.projects`, but still functionally supported per the projects guide), each entry can carry its own `globals` the same way a `projects` array entry can.
- Config file lookup does **not** consider JSON files for the root config (`vitest.config.json` is not in the documented lookup list); `UNVERIFIED` for legacy `vitest.workspace.json`.

## 8. In-source testing

```ts
// src/add.ts
export function add(a: number, b: number) { return a + b }

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add(1, 1)).toBe(2)
  })
}
```

- Gated entirely by the `if (import.meta.vitest)` guard; `test`/`it`/`expect`/etc. are pulled off
  `import.meta.vitest` itself (an injected object), not from a `'vitest'` import specifier, the
  extractor's "how did this binding get here" resolution needs a special case: a `MemberExpression`
  destructure off `import.meta.vitest` is a Vitest-global-equivalent binding, regardless of the
  file's `globals` setting.
- Governed by **`includeSource`** config: `string[]` glob list, resolved relative to `root`,
  **default `[]`** (feature is opt-in, off unless a project lists source globs, e.g.
  `includeSource: ['src/**/*.{js,ts}']`). A file only contributes in-source tests if it matches
  `includeSource` (in addition to actually containing `import.meta.vitest` blocks).
  Note this is **independent of, and additive to**, the regular `include` test-file glob, a file
  can be scanned for in-source tests without matching `include` at all, since it's not a "test
  file" in the ordinary sense (it's application source with embedded tests).
- Production exclusion is a **build-time** concern (Vite `define: { 'import.meta.vitest': 'undefined' }`
  enabling dead-code elimination), irrelevant to the static extractor except as confirmation that
  `import.meta.vitest` guards are the sole and idiomatic gate; the extractor doesn't need to model
  bundler DCE, just recognize the guard shape.

## 9. Default file globs

| Option | Default | Purpose |
| --- | --- | --- |
| `include` | `['**/*.{test,spec}.?(c\|m)[jt]s?(x)']` | Which files are "test files" and get collected at all. Resolved relative to `root`. |
| `exclude` | `['**/node_modules/**', '**/.git/**']` | Files never scanned regardless of `include`. |
| `includeSource` | `[]` | Additional non-test source files scanned **only** for `import.meta.vitest` blocks (see §8). Empty by default, in-source testing is entirely opt-in. |
| `benchmark.include` | `['**/*.{bench,benchmark}.?(c\|m)[jt]s?(x)']` | Legacy benchmark files collected independently of `include`. |
| `benchmark.exclude` | `['node_modules', 'dist', '.idea', '.git', '.cache']` | Benchmark-file exclusions, independent of `exclude`. |
| `benchmark.includeSource` | `[]` | Additional source files containing benchmarks; opt-in and independent of `includeSource`. |
| `typecheck.enabled` | `false` | The gate for the whole type-test channel: while off, the files `typecheck.include` names are not test files at all (type tests run only under this switch or the `--typecheck` CLI flag). |
| `typecheck.include` | `['**/*.{test,spec}-d.?(c\|m)[jt]s?(x)']` | Type-test files, consulted only while `typecheck.enabled` is on. A separate list from `include`: `.test-d.ts` matches the default `include` never. |
| `typecheck.exclude` | Vitest's `configDefaults.exclude` | Type-test exclusions, independent of `exclude`. |

Discovery in the analyzer therefore has five independent admission channels per project: ordinary
test files (`include` minus `exclude`), benchmark files (`benchmark.include` minus
`benchmark.exclude`), test in-source files (`includeSource` minus `exclude`), benchmark
in-source files (`benchmark.includeSource` minus `benchmark.exclude`), and, gated behind
`typecheck.enabled`, type-test files (`typecheck.include` minus `typecheck.exclude`). A match in
any channel admits the file once. Custom test globs do not replace benchmark defaults, custom
benchmark globs do not replace test defaults, and the type-test defaults apply only when
`typecheck.include` is not written.

## 10. Projects / workspace

- Current mechanism: root `test.projects: (string | InlineProjectConfig)[]`. Entries can be:
  - glob strings matching directories containing a project config (`'packages/*'`), including
    negation (`'!packages/excluded'`) and extended-glob exclusion (`'packages/!(business)'`),
  - explicit config-file globs (`'packages/*/vitest.config.{e2e,unit}.ts'`),
  - inline objects (`{ test: { name, include, environment, ... } }`).
- A referenced project config file must be named `vitest.config.*` / `vite.config.*` /
  `vitest.<name>.config.*` / `vite.<name>.config.*`.
- Inline projects **inherit the root config by default** in v5 (`extends: true` implicit)
  `[v5 CHANGE, pre-v5 default was not to inherit]`; `extends: false` opts a project out entirely.
  Some options concatenate across the inheritance chain (e.g. `setupFiles`) rather than override;
  `tags` replaces rather than merges. Certain options (`coverage`, `reporters`,
  `resolveSnapshotPath`, `attachmentsDir`, and reportedly more per the "not supported inside a
  project" marker on the config reference pages) are **root-only** and cannot vary per project,
  `UNVERIFIED` whether `globals` is on that restricted list; treat as project-overridable per §7.
- Legacy `vitest.workspace.{ts,js}` files are deprecated (since 3.2) but documented as still
  functionally equivalent to a `projects` array, the extractor should treat a discovered
  `vitest.workspace.*` the same as a root `projects` list.
- **Implication for corpus boundaries**: a project (in the `test.projects` sense) is the right unit
  for resolving `globals`, `include`/`exclude`/`includeSource`, and `setupFiles`, the analyzer
  should build one "resolved config" per project and attribute each discovered test file to exactly
  one (or, if globs overlap, potentially more than one, `UNVERIFIED` whether Vitest allows/dedupes
  a file matched by two projects) project, rather than assuming one global config for the whole
  repository.

## 11. Look-alikes that are NOT Vitest tests

| Framework | Import shape | Distinguishing signal |
| --- | --- | --- |
| **Playwright Test** | `import { test, expect } from '@playwright/test'` (or a project fixture wrapper re-exporting `test`) | Import specifier is `@playwright/test` (or a local file that itself imports from it), not `'vitest'`. Callback receives Playwright fixtures (`page`, `context`, `browser`, `request`), recognizably different fixture vocabulary from Vitest's `TestContext`. `test.describe`, `test.beforeEach` exist in both frameworks with similar *shapes*, so import-specifier resolution (not name matching) is the only reliable static signal. |
| **Jest** | `test`/`it`/`describe` as ambient globals (Jest's own `globals`-like default), or `import { test, describe, expect } from '@jest/globals'` | No `'vitest'` import anywhere in the file/module graph; presence of `jest.config.*` instead of `vitest`/`vite` config at the resolved project root; use of `jest.fn()`/`jest.mock()` instead of `vi.fn()`/`vi.mock()` is a strong corroborating (but not exhaustive) signal since some codebases alias `vi` to `jest`-like helpers. |
| **Cypress** | `describe`/`it` as ambient Mocha-style globals injected by the Cypress test runner; `cy.*` commands in the body | No `'vitest'` import; presence of `cypress.config.*` at project root; body uses `cy.visit`, `cy.get`, etc., a distinct global command object with no Vitest analogue. |
| **`node:test`** | `import { test, describe } from 'node:test'` or `require('node:test')` | Import specifier is the `node:test` builtin, not `'vitest'`, so the analyzer deliberately extracts zero Vitest declarations from these bindings. `node:test` also lacks `.each`/`.for`/`.extend` in the same shape (it has its own, smaller modifier set) and typically pairs with `node:assert` rather than Vitest's `expect`. |
| **Mocha/Jasmine (via `globals: true`-like ambient `describe`/`it`)** | Ambient `describe`/`it`, `before`/`after`/`beforeEach`/`afterEach` (note: `before`/`after`, not `beforeAll`/`afterAll`) | The hook names `before`/`after` (rather than `beforeAll`/`afterAll`) are a Mocha-specific tell; no `'vitest'` import; presence of `.mocharc.*`. |

**How to tell them apart statically, in priority order:**
1. **Resolve the import specifier** of the binding used to call `test`/`describe`/etc. via
   `oxc_semantic`. If it traces to `'vitest'` (directly or through a namespace import), it's Vitest,
   full stop, this dominates every other heuristic.
2. If the binding is **not imported at all** (a bare global), it is only a Vitest test if the file's
   resolved project config has `globals: true` **and** no *other* globally-injected test framework
   is active for that project (Vitest and Jest/Mocha/Cypress globals are not normally combined in
   one project, but a monorepo could have different projects using different runners, hence
   resolving config **per project**, §10, matters here too).
3. If the binding traces to a **different** package specifier (`@playwright/test`, `@jest/globals`,
   `node:test`, a Cypress support-file global, etc.), it is definitively **not** a Vitest test,
   regardless of how structurally similar the call shape looks (`describe(str, fn)` is common to
   nearly every one of these frameworks).
4. As a last-resort corroborating signal only (never load-bearing on its own): co-occurring
   framework-specific calls in the same file (`cy.*`, `page.*` Playwright fixtures, `jest.*`), and
   the presence/absence of a `vitest`/`vite` config file at the resolved project root vs. a
   `playwright.config.*`/`jest.config.*`/`cypress.config.*`.

## 12. The `vi` module-mocking family

The mocking surface is larger than `vi.mock`, and two pairs in it differ from `vi.mock` exactly
the way `vi.doMock` does. The distinction is easy to miss because the call shape
(`(specifier, factory?)`) is identical across all of them.

| Member | Hoisted? | Scope | Notes |
| --- | --- | --- | --- |
| `vi.mock(path, factory?)` | **Yes**, moved to top of file, before all imports | File-wide; affects every `import` of `path` in the file | The primitive already covered by fixture 56 (`vi-mock-hoisting.test.ts`). Factory runs once, cached. `{ spy: true }` automocks while preserving original implementations. **Modelled** when written as a module-top-level statement with a string-literal specifier: it becomes a registration event in the fold described below. Written anywhere else, inside a function, a hook, an `if`, it taints the file instead; see the fold's third bullet. |
| `vi.doMock(path, factory?)` | **No** | Scoped, affects only dynamic `import()`s evaluated *after* this call runs, in whichever test/hook calls it; static imports and earlier dynamic imports are unaffected | **Handled conservatively** (`src/frontend/extract.rs`): since a `doMock` call cannot be soundly attributed to one test by static analysis, this extractor marks the **whole file's** mocks unresolved whenever any `vi.doMock` call appears anywhere in it, rather than risk silently treating it as file-wide like `vi.mock` (which would be a false-duplicate hazard) or silently ignoring it (a false-duplicate hazard the other direction). The tradeoff is recall, not precision: real duplicates elsewhere in a `doMock`-using file simply stop being compared. See `fixtures/edge/vi-domock-scoped.test.ts`. |
| `vi.unmock(path)` | **Yes**, same hoisting class as `vi.mock`, and hoisted calls keep their relative source order | File-wide | Removes `path` from the mock registry; subsequent imports (anywhere in the file, due to hoisting) get the real module. **Modelled**, on the same terms as `vi.mock` above: a module-top-level call with a string-literal specifier is a registration event, and the file's mock set is the fold of all such events, last-in-source-order wins per specifier. So `vi.mock(p, f); vi.unmock(p)` nets to unmocked, `vi.unmock(p); vi.mock(p, f)` nets to mocked, and `vi.unmock(p)` alone (nothing ever mocked `p`) nets to the same empty set as a file that mocks nothing. See `fixtures/edge/vi-unmock-file-wide.test.ts` and the `fixtures/duplicates/not-duplicates-mock-then-unmock*` pair. |
| `vi.doUnmock(path)` | **No** | Scoped, only the next dynamic import(s) after this call; does not reevaluate an already-imported module | Non-hoisted counterpart of `vi.unmock`, symmetric to how `vi.doMock` is the non-hoisted counterpart of `vi.mock`. **Handled conservatively**, the same way as `vi.doMock`: the call marks the file unresolved rather than being ignored or folded in as if it were hoisted. See `fixtures/edge/vi-dounmock-scoped.test.ts`. |
| `vi.resetModules()` | N/A (a call, not a registration) | Per-call; commonly invoked in a `beforeEach` | Clears the module cache so a subsequent dynamic `import()`/`require()` reevaluates the module; does **not** reset the mock registry itself (a module mocked before `resetModules()` is still mocked after). Top-level static imports already evaluated cannot be reevaluated by this call. Not currently modeled by the extractor as anything other than an opaque body statement; low risk since it doesn't change `mocked_modules` membership, only cache freshness. |
| `vi.mocked(value, options?)` | N/A | N/A | TypeScript-only type helper, returns its argument unchanged at runtime. `options: { partial?, deep? }` only narrows the returned *type*. Not a registration; purely a body-level call the generic body fingerprint already captures. |
| `vi.importActual<T>(path)` | N/A | N/A | Imports the real module, bypassing mock substitution, the standard way to build a partial mock inside a `vi.mock` factory. |
| `vi.importMock<T>(path)` | N/A | N/A | Imports a module with every export automocked, following the same automocking algorithm `vi.mock()` uses with no factory. |
| `vi.mockObject(value, options?)` | N/A | N/A | **New since 3.2.0.** Deep-mocks an arbitrary object's properties/methods the same way `vi.mock()` mocks a module's exports, without going through the module registry at all. `{ spy: true }` preserves original implementations while still tracking calls. |
| `vi.when(spy, options?)` | N/A | N/A | **New since 5.0.0.** Argument-matched stubbing on a spy: `.calledWith(...args).thenReturn(...)`/`.thenThrow(...)`/`.thenResolve(...)`/etc. A body-level API for shaping mock behavior per call signature, not a module-registration primitive, same low extraction risk as `vi.mocked`/`vi.importActual` above. |

**Why the `mock`/`doMock` and `unmock`/`doUnmock` pairs matter for this analyzer specifically**: a
test's effective `Context` includes which modules are mocked and with what factory (the
`duplicates/not-duplicates-different-mocks-*` pair asserts this for `vi.mock`). Anything that changes *whether* a specifier is mocked, including un-mocking it,
is therefore part of that context, and any registration primitive the extractor doesn't recognize
is a silent hole in context-equivalence: two files can look identically mocked while one is
genuinely unmocked at runtime, which is exactly the shape of a false `duplicate-test` finding.

**What is modelled, and what still taints.** All four primitives are recognized.
`collect_mocked_modules` (`src/frontend/extract.rs`) models the hoisted pair, `vi.mock` with its
factory and `vi.unmock`, as an ordered event list read from the module's top-level statements and
folded per specifier, last in source order winning. The file's `Context` then carries exactly the
specifiers Vitest's registry would hold.

That yields **two** distinct contexts from three source shapes, not three. "Mocks `./m`" stands
alone; "mocks then unmocks `./m`" and "never mentions `./m`" fold to the same empty
`mocked_modules` and therefore hash identically, which is correct: at runtime both resolve the
real module and the tests are comparable.

The ordering was measured under Vitest 5 with a module exporting `value = 99` and a factory
returning `value: 1`: `vi.mock(p, f)` then `vi.unmock(p)` yields **99** (the real module), while
`vi.unmock(p)` then `vi.mock(p, f)` yields **1** (the factory). "Unmock wins" would be right only
for the first ordering.

Three things still mark the whole file unresolved, excluding its tests from comparison rather than
recording a mock state that may be wrong:

- **`vi.doMock` / `vi.doUnmock`**, because they are not hoisted: they take effect where they run,
  for dynamic imports evaluated after that point, so there is no file-wide answer to fold.
- **A specifier that is not a readable string literal**, or a `vi.mock` factory that is present but
  not an inline arrow/function, recording nothing would be indistinguishable from no mock at all.
- **`vi.mock` / `vi.unmock` called outside module top level**, in a `describe`, a test body, an
  `if` (the non-hoisted `vi.doMock` / `vi.doUnmock` are covered by the first bullet wherever they
  appear).
  Vitest 5 does not run such a file at all: the `vitest:mocks` plugin fails the transform with
  *"N call(s) in `<file>` was defined outside of the module's top level scope … Although it appears
  nested, it will be hoisted and executed before anything in this file"*. That was confirmed by
  running the three shapes (inside `describe`, inside `test`, inside a top-level `if`) under
  Vitest 5.0.0. The error is also the answer to the conditional case: the call is hoisted out of
  the branch, so `if (flag) vi.mock(p)` is not conditional at all, and Vitest refuses it rather
  than let the nesting read as if it were. A file the runner rejects has no runtime context to
  model, and on older Vitest it has a file-wide but unconditional one, so "unknown" is the answer
  either way.

### 12b. The module-scope ambient-state family

Mocking is not the only way a file establishes state its tests run under. A second family of
module-scope calls swaps the *conditions* rather than the *dependencies*: the timer mode, a
stubbed environment key or global, a spied return value, a redefined assertion predicate. None of
them is a registration the mock fold could hold, and none is awaited (so `module_setup`, whose
admission rule is `await`, never saw them), yet two files differing only in one of them are as
non-duplicate as two files mocking different modules.

| Member | What it establishes | Modelled |
| --- | --- | --- |
| `vi.useFakeTimers()` / `vi.useRealTimers()` | The timer mode every test in the file runs under | **Yes**, `Context::ambient_state` (`src/model.rs`), as module-top-level whitespace-collapsed source text in source order |
| `vi.stubEnv(key, value)` | A `process.env`/`import.meta.env` key's value | **Yes**, same terms |
| `vi.stubGlobal(name, value)` | A global binding's value, the same call shape as `stubEnv` | **Yes**, same terms (no dedicated corpus case; recorded here so the choice is visible) |
| `vi.spyOn(obj, prop).mockReturnValue(v)` (and the rest of the chain) | A spied binding's return value, the ordinary way to stub one export without `vi.mock` | **Yes**, the whole chained statement is captured, chain and arguments together |
| `expect.extend({ name(…) {…} })` | What an assertion *means*, same matcher name, different predicate | **Yes**, same terms. Sharpest of the family: the body and the dependencies can be identical while the two tests assert opposite things |

Two boundary rules, both inherited from `module_setup`'s design. **Module top level only**: the
same calls inside a hook body are that hook's body, inside a test body are that body, and inside a
`describe` are not facts every test in the file inherits. **A known family, not every `vi.*` /
`expect.*` call**: `vi.mock`/`vi.unmock` stay the mock fold's territory (never also recorded here),
and ordinary program text at module scope, a helper call, a plain `const`, is not ambient state.
The payload is source text, so a formatting difference collapses while a genuinely different value
never matches, and an unreadable payload suppresses a comparison rather than inventing one.

---

## Extraction hazards, ranked

1. **`bench` changed from a top-level import (v2-v4) to a `TestContext` fixture (v5)**, the single
   test-declaring callable whose entire declaration *shape* differs across the majors the
   extractor will encounter in real repos. Getting this wrong either misses all v5 benchmarks or
   crashes on v4 ones.
2. **`.sequential` was removed in v5** (`test.sequential`, `describe.sequential`, and the
   `sequential` config option are all gone) but is common in v2-v4 corpora, treating it as an
   unknown/ignored member on a v5-only extractor silently drops a real modifier from older code.
3. **`globals: true` resolution is per-project, not per-repo**, `test.projects` entries can set
   `extends: false` and diverge on `globals`, so a bare `test(...)` identifier's meaning depends on
   which project's resolved config governs that file. A single "did this repo set globals" boolean
   is wrong for any repo using projects/workspace with mixed configs.
4. **Look-alikes share call shape, not identity**, Playwright, Jest, Cypress, node:test, and Mocha
   all expose a `describe(string, fn)` / `it(string, fn)` shape nearly indistinguishable from
   Vitest's by name alone. Only import-specifier resolution (or, for globals, resolved per-project
   config plus absence of any other test-framework import) is sound; name-based matching produces
   false positives.
5. **`.each`/`.for` title strings are only reproducible when the table is a literal**, a
   non-literal table argument (`test.each(getCases())`) means row values, row count, and therefore
   concrete titles are unknowable statically; the extractor must degrade to "unresolved" rather than
   guess, and must not silently treat it as zero tests.
6. **Title-rendering itself changed in v5** (`pretty-format`, no quote-wrapping of interpolated
   strings, new truncation option), byte-exact title reproduction is version-dependent, not a
   single fixed algorithm.
7. **Options-object vs. bare-function 2nd argument is a type disambiguation, not a positional one**:
   `test(name, fn)` vs `test(name, options, fn)` requires checking whether the 2nd arg is a
   `Function` or an `Object` literal; modifier flags can also arrive via the options object
   (`{ skip: true }`) and must be unioned with chain-based flags (`test.skip`) rather than treated
   as mutually exclusive sources.
8. **Fixture "reaches the callback" the same way built-in context members do**, a destructured
   name in a test callback is ambiguous between a Vitest built-in (`expect`, `task`, `skip`, `bench`
   in v5) and a user `test.extend` fixture unless cross-referenced against the specific `test`
   binding's `.extend` chain; a naive allowlist/denylist of "known" context names breaks the moment
   a fixture happens to reuse a common name.
9. **In-source tests bind `test`/`it`/`expect` off `import.meta.vitest`**, not off a `'vitest'`
   import specifier and not off ambient globals, a resolver that only checks import specifiers or
   `globals: true` will miss every in-source test, and `includeSource` (default `[]`) gates which
   files even get scanned for the `import.meta.vitest` guard, independently of the ordinary
   `include` glob.
10. **A local variable can be named `test`/`describe`/`it` without being Vitest's** (shadowing an
    import, or a plain helper function), name matching without binding resolution produces false
    positives even inside an otherwise-legitimate Vitest file.
11. **The mocking family is modelled only where hoisting makes a file-wide answer sound**:
    `collect_mocked_modules` folds module-top-level `vi.mock`/`vi.unmock` with string-literal
    specifiers into one mock set (last in source order wins per specifier, verified against a real
    Vitest 5 run, see §12), and taints the whole file for everything else: the non-hoisted
    `vi.doMock`/`vi.doUnmock`, an unreadable specifier or factory, and **any** of the four called
    outside module top level. A tainted file's tests are excluded from comparison entirely, which
    trades a possible false duplicate for a certain false negative, the same direction throughout.
    The top-level restriction matters because the scan is a whole-program AST walk, and a
    `vi.mock` found inside a `describe`, a test body, or an `if` must not be recorded as file-wide.
    Vitest 5 refuses to run such a file at all (`vitest:mocks`: "defined outside of the module's
    top level scope"), so there is no runtime context there to model, including in the
    conditional case, where the call is hoisted out of the branch. See §12 for the full table and
    `fixtures/edge/vi-unmock-file-wide.test.ts` / `vi-dounmock-scoped.test.ts`, which demonstrate
    the modelled and tainted shapes respectively, and the
    `fixtures/duplicates/not-duplicates-mock-then-unmock*` pair, which asserts the mocked and
    mocked-then-unmocked contexts are compared and found different rather than excluded.
    `[status: current]` as implemented by `collect_mocked_modules` in `src/frontend/extract.rs`.

---
