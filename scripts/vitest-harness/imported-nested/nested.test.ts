import { describe } from 'vitest'
import { outer, mixed } from './runner'

outer('a')
outer('b')
describe('scoped', () => { mixed() })
