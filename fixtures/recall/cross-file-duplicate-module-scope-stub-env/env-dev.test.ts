// The sibling of `env-prod.test.ts`, identical but for the stubbed environment value.
import { expect, test, vi } from 'vitest'
import { buildUrl } from './url'

vi.stubEnv('MODE', 'development')

test('builds a url in development', () => {
  expect(buildUrl('/a')).toContain('/a')
})
