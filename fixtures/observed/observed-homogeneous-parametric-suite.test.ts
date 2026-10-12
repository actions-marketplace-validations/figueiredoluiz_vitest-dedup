// OBSERVED IN REAL CODE: a public TypeScript schema-validation library -- 89 tests of the form
// `test("string", () => { expectMethodMatch(schema.string()) })`, grouped into `primitive types`
// and per-type `... validations` describes.
//
// SHAPE: a homogeneous parametric suite. Every test calls one project-owned assertion helper with
// a differently-built subject: `z.string()` versus `z.string().min(5)`, `.max(5)`, or
// `.startsWith('a')`.
//
// BEFORE CALL ARGUMENTS WERE RETAINED: the helper calls all emitted the same event. The nested
// schema-builder calls made the primitive trace a strict subsequence of every refinement trace,
// producing 190 `subsumed-test` findings from 89 tests in the real file. None was a defect: each
// refinement is deliberate coverage. This was the largest measured source of that rule's noise.
//
// FIXED: an ordinary call event now carries canonical argument shapes. The helper observation for
// `z.string()` is different from each refined schema, so none of the four tests subsumes another.
// The three expectations below pin every formerly reported base/refinement pair. The corpus gate
// also rejects any undeclared finding, covering the refinement/refinement and string/number pairs.
// @vitest-dedup:extracted 5
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the claim is that a refinement is no longer subsumed by the primitive it refines, because the helper's ARGUMENT now reaches its behaviour event: `expectMethodMatch(z.string())` and `expectMethodMatch(z.string().min(5))` are different events, so neither test's events are a subset of the other's. That is a property of the events, not a relation between two comparable records. Load-bearing instead: revert the argument fragment in `walk_call` and all three findings return at exactly the participants below
// @vitest-dedup:participant L34 "toJSONSchema method > primitive types > string"
// @vitest-dedup:participant L44 "toJSONSchema method > string validations > min length"
// @vitest-dedup:participant L48 "toJSONSchema method > string validations > max length"
// @vitest-dedup:participant L52 "toJSONSchema method > string validations > starts with"
import { describe, test, expect } from 'vitest'
import { z } from './schema-lib'

function expectMethodMatch(schema, params) {
  expect(schema.toJSONSchema(params)).toEqual(z.toJSONSchema(schema, params))
}

describe('toJSONSchema method', () => {
  describe('primitive types', () => {
    test('string', () => {
      expectMethodMatch(z.string())
    })

    test('number', () => {
      expectMethodMatch(z.number())
    })
  })

  describe('string validations', () => {
    test('min length', () => {
      expectMethodMatch(z.string().min(5))
    })

    test('max length', () => {
      expectMethodMatch(z.string().max(5))
    })

    test('starts with', () => {
      expectMethodMatch(z.string().startsWith('a'))
    })
  })
})
