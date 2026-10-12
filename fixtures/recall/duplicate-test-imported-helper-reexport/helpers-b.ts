// Side B's public module, mirroring side A: a named re-export of an equivalent helper from its
// own inner module. Resolution must follow both hops to compare the bodies.
export { assertNonEmpty } from './inner-b'
