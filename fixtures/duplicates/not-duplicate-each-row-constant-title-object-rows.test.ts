// OBSERVED IN REAL CODE: a public application framework's form-utility suite -- the constant title
// `'simple'` over two differing OBJECT rows (6 of the rule's 35 false positives). A constant
// title consumes nothing, and the callback reads its row as one `input` object whose substituted
// members do not reach the body's normalized form, so both halves of the rule's claim
// ("identical rendered title AND substituted body") see two identical rows where the source has
// two different ones. `duplicate-each-row` links these rows today, so the expectation is pending
// until the S7 fix lands. Named weakening: make the two object rows literally identical -- the
// finding then returns for a real reason (each-row-duplicate-rows.test.ts already pins that
// positive in this corpus, which is why no new twin file exists for this row).
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the rows differ only inside object literals that neither the title nor the compared body observes, so every emitted field agrees and no relation between participants could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L17 "simple"
// @vitest-dedup:participant L17 "simple"
import { it, expect } from 'vitest'

it.each([
  { data: {}, meta: {} },
  { data: { foo: 'foo', nested: { prop: 'prop' } }, meta: { pathname: '/foo', validate: true } },
])('simple', async (input) => {
  const blob = serialize(input.data, input.meta)
  const res = await deserialize(blob)
  expect(res.data).toEqual(input.data)
  expect(res.meta).toEqual(input.meta ?? {})
})
