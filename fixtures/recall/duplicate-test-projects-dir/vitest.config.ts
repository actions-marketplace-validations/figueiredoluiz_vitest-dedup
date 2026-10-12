// RECALL variant -- S3 sub-mechanism 2 (nuxt/ui's shape): a `test.projects` entry setting `dir:`
// with include patterns relative to that directory. `dir:` becomes the project's base directory,
// so `src/**/*.spec.ts` resolves against `pkg/` and reaches pkg/src/. Before the fix the pattern
// was matched from the repository root, never reached pkg/src/, and the case extracted zero
// tests -- the extraction floor IS the assertion here.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [{ test: { name: 'pkg', dir: './pkg', include: ['src/**/*.spec.ts'] } }],
  },
})
