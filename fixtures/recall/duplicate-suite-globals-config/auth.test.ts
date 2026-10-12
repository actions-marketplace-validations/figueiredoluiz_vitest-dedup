// No imports at all: `describe`, `test` and `expect` are ambient, resolvable only because the
// sibling `vitest.config.ts` sets `globals: true`. Two byte-identical suites in one file.
import { login } from './auth'

describe('login', () => {
  test('accepts valid credentials', () => {
    expect(login('ada', 'secret').ok).toBe(true)
  })

  test('rejects a bad password', () => {
    expect(() => login('ada', 'wrong')).toThrow('invalid credentials')
  })
})

describe('login', () => {
  test('accepts valid credentials', () => {
    expect(login('ada', 'secret').ok).toBe(true)
  })

  test('rejects a bad password', () => {
    expect(() => login('ada', 'wrong')).toThrow('invalid credentials')
  })
})
