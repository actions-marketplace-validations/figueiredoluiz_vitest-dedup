import { describe } from 'vitest'
import { declareCase, declareOne } from './runner'

declareCase('a', 1)
declareCase('b' + 'c', 2)
declareCase('a', 3)
for (const name of ['x', 'y']) declareCase(name, 4)
describe('caller', () => { declareCase('nested', 5) })
declareOne(`t${1 + 1}`)

/** Forwards its own parameter, which the caller folds from this frame's argument. */
function forward(name: string) { declareOne(name) }
forward('forwarded')
