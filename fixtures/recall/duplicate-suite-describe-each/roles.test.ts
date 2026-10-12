// RECALL variant -- duplicate-suite must NOT fire between the suites a `describe.each` generates.
//
// One `describe.each` over three rows expands into three suite instances that share a single
// declaration `Location`, one title pattern and one body. On title-and-body alone they are
// indistinguishable copies of each other, and reporting them would be an error-severity-adjacent
// false claim about code that is doing exactly what the API is for -- the generated instances are
// the table, not copies of it.
//
// `emit_duplicate_suite` collapses one-per-location (`dedup_by_declaration`) for this reason, and
// this case is what makes that collapse falsifiable. A second, genuinely hand-copied block would
// still be reported; nothing here is hand-copied, so the expectation is silence with the run NOT
// incomplete -- the table is a readable array literal, so this is `distinct`, not `not-compared`,
// and the rows were really compared.
//
// The generated tests share a rendered title per row but each row's title differs from the others,
// so no `duplicate-test-name` collision is available to make this case pass for the wrong reason.
import { describe, expect, test } from 'vitest'
import { permissions } from './roles'

describe.each([['admin'], ['editor'], ['viewer']])('%s permissions', (role) => {
  test('resolves a permission set', () => {
    expect(permissions(role).length).toBeGreaterThan(0)
  })
})
