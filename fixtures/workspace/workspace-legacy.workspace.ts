// Legacy vitest.workspace.ts (deprecated v3.2+ but still functional). Defines projects.
export default [
  {
    test: {
      name: 'project-a',
      include: ['a/**/*.test.ts']
    }
  },
  {
    test: {
      name: 'project-b',
      include: ['b/**/*.test.ts']
    }
  }
]
