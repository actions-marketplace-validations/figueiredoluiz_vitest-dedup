// Root vitest.config.ts with test.projects combining glob-string projects and inline objects.
// Both forms coexist; each project gets its own resolved config.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      {
        name: 'inline-project',
        include: ['src/**/*.test.ts']
      }
    ]
  }
})
