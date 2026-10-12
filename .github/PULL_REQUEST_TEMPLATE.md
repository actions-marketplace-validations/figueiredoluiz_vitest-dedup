## Problem

Describe the user-visible problem or capability.

## Changes

Describe the implementation and any compatibility decisions.

## Validation

- [ ] `cargo fmt --all --check` and `RUSTFLAGS="-D warnings" cargo clippy --all-targets --all-features --locked` pass
- [ ] `cargo test --all-targets --all-features --locked` passes
- [ ] npm tests pass (`npm test`) when launcher, npm, or Action behavior changes
- [ ] A focused regression test covers the change, and it fails without the change
- [ ] Analysis or reporting changes pass the fixture corpus gate and the recall gate
- [ ] `actionlint` run locally on changed workflow files (not yet a CI gate)
- [ ] Documentation is updated when user-visible behavior changes (`npm run check:docs`)

## Safety

- [ ] No proprietary code, secrets, generated reports, or build artifacts are included
- [ ] Release and publishing behavior is unchanged, or the release impact is described
