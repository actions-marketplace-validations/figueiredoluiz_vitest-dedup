// Renamed imports from 'vitest': test as t, describe as group, expect as assert.
import { test as t, describe as group, expect as assert } from 'vitest'

group('Renamed imports', () => {
  t('with renamed bindings', () => {
    assert(1).toBe(1)
  })
})
