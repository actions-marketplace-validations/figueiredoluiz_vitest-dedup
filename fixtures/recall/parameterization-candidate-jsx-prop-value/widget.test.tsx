// RECALL known miss -- two tests differing only in one JSX prop LITERAL.
//
// Outside JSX this is the canonical `parameterization-candidate`: same shape, one value moving,
// so the pair wants to be one `test.each` row set. `parameterization-candidate-positive` asserts
// exactly that for plain calls. Put the same variation inside a JSX attribute and the analyzer
// reports nothing (measured).
//
// Same mechanism as the formatting miss beside it, different casualty: because `opaque(span)`
// hands the whole element over as one text blob, the literal inside it is not a literal any more
// -- there is nothing for the structural digest to collapse, so the two bodies are simply two
// different strings. The formatting case costs a `duplicate-test`; this one costs a
// `parameterization-candidate`, and that second loss is the easier of the two to overlook because
// nothing anywhere counts it.
//
// Named weakening: move `variant` out of the element into a plain variable passed to `render` and
// the finding appears -- the same values, no longer hidden inside an opaque slice.
import { expect, test } from 'vitest'
import { render } from './render'
import { Button } from './widgets'

test('renders the primary button', () => {
  const el = render(<Button variant="primary">Save</Button>)
  expect(el.getAttribute('data-variant')).toBe('primary')
})

test('renders the secondary button', () => {
  const el = render(<Button variant="secondary">Save</Button>)
  expect(el.getAttribute('data-variant')).toBe('secondary')
})
