// RECALL variant -- S1: a leading `./` in `test.include` used to match nothing, so this
// config-holding case extracted zero tests. The extraction floor IS the assertion: the two
// identical tests in pkg/ must be discovered and the duplicate-test finding must fire, and the
// leading `./` must not change which files match. In the corpus gate this case is inexpressible
// (D3): it needs its own vitest.config.ts, which the corpus gate's solo run would never copy.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { include: ['./pkg/**/*.spec.ts'] },
})
