// RECALL negative -- two DIFFERENT components taking the same props and the same children.
//
// `Button` and `Link` come from one module and render different things, so the two tests assert
// different behaviour and neither is deletable. The pair is the counterweight to the two known
// misses beside it: any future structuring of JSX must keep this silent, and the cheapest wrong
// fix -- routing the element name through free-identifier resolution without content-addressing
// the binding -- is precisely the one that would collapse these two.
//
// Named weakening: rename `Link` to `Button` and the pair becomes a genuine duplicate-test.
import { expect, test } from 'vitest'
import { render } from './render'
import { Button, Link } from './widgets'

test('renders a button', () => {
  const el = render(<Button variant="primary">Save</Button>)
  expect(el.textContent).toBe('Save')
})

test('renders a link', () => {
  const el = render(<Link variant="primary">Save</Link>)
  expect(el.textContent).toBe('Save')
})
