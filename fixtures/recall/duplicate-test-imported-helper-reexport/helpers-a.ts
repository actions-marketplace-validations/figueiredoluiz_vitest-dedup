// Side A's public module re-exports its helper from an inner module -- the shape the motivating
// corpus uses (`import { run } from '#test'` reaching a runner that re-exports from elsewhere).
// The helper body lives one resolution hop away, in inner-a.ts.
export { checkActive } from './inner-a'
