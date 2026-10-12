import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      { name: 'with-globals', globals: true },
      { name: 'without-globals', globals: false }
    ]
  }
})
