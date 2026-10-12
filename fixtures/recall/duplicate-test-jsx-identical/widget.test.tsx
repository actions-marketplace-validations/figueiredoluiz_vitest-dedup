// RECALL variant -- the corpus had NO JSX at all before this case, in either extension.
//
// That gap mattered twice over: component tests are a large share of real Vitest suites, and the
// directive-driven corpus gate cannot hold them either, because it enumerates `*.test.ts` only
// (`check-duplicates-corpus.mjs`, deliberately). So JSX coverage has to live here, where cases are
// named by a manifest and the extension is not load-bearing.
//
// This is the baseline that must work: two tests rendering the same element with the same props
// and the same children. Byte-identical bodies, so the raw-source-slice serialization that JSX
// falls back on compares them equal, and the finding is correct for the ordinary reason.
//
// Named weakening: change one prop value and the finding must disappear.
import { expect, test } from 'vitest'
import { render } from './render'
import { Button } from './widgets'

test('renders the save button', () => {
  const el = render(<Button variant="primary">Save</Button>)
  expect(el.textContent).toBe('Save')
})

test('renders the save button once more', () => {
  const el = render(<Button variant="primary">Save</Button>)
  expect(el.textContent).toBe('Save')
})
