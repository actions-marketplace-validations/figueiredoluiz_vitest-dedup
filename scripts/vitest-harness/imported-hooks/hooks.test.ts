import { describe, test, expect } from 'vitest'
import { withHook, suiteWithHook, fixtureRunner } from './runner'

test('before scope', () => { expect(1).toBe(1) })
describe('scoped', () => {
  test('earlier sibling', () => { expect((globalThis as any).hooked).toBe(true) })
  withHook()
  test('later sibling', () => { expect((globalThis as any).hooked).toBe(true) })
})
suiteWithHook()
fixtureRunner()
test('after', () => { expect(1).toBe(1) })
