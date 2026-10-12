// Namespace import: import * as vitest from 'vitest', accessed as vitest.test(), vitest.describe().
import * as vitest from 'vitest'

vitest.describe('Namespace import', () => {
  vitest.test('accessing via namespace', () => {
    vitest.expect(1).toBe(1)
  })
})
