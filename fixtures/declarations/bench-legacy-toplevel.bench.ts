// 1 bench as top-level import (v2-v4 shape), with .skip modifier
import { bench } from 'vitest'

bench.skip('legacy benchmark', () => {
  const x = 1 + 1
})
