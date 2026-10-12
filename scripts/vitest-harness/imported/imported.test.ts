import { describe, test, expect } from 'vitest'
import { register as run } from './second-barrel'
import { ordinary, shadowed } from './runner'

ordinary()
shadowed()
run()
run()
describe('caller suite', () => { run() })
test('direct', () => { expect(2 + 2).toBe(4) })
