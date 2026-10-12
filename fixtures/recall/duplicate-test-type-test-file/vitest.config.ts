// The config that makes the sibling `.test-d.ts` file a test file at all. Vitest runs type tests
// from `typecheck.include`, a separate list from `test.include`, and only under `--typecheck`.
// So a repository can hold hundreds of type tests that the default `include` never names.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      include: ['**/*.test-d.ts'],
    },
  },
})
