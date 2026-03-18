# ETA Bootstrap Tasklist

## Goal

Build `eta` as a controlled refactor track from `zeta` and use it as the final stabilization path before production.

## Phase 1: Freeze the fork

- [x] Copy `zeta` into `eta`
- [x] Remove template-name-specific runtime leftovers
- [ ] Verify `eta` renders and loads assets correctly
- [ ] Confirm `eta` keeps current Bitrix form integration intact

## Phase 2: Normalize logic

- [ ] Introduce a single model capability layer
- [ ] Centralize option filtering rules by model
- [ ] Centralize default option resolution
- [ ] Centralize price resolution and free/paid RAL logic

## Phase 3: Scene system

- [ ] Split camera/layout presets into a dedicated scene config
- [ ] Keep separate presets for `023-the-bomblet` with and without shockmount
- [ ] Tune transforms from visual references with debug tools
- [ ] Export final scene presets from debug into source

## Phase 4: UI and DX

- [ ] Keep MALFA-only controls isolated to `023-malfa`
- [ ] Keep debug panel available behind `?debug=1`
- [ ] Make debug exports convenient for transforms and price state
- [ ] Recheck mobile start screen and tablet hero layout

## Phase 5: Release readiness

- [ ] Smoke-test all target models
- [ ] Recheck hidden Bitrix form payload
- [ ] Recheck logo upload, case upload, and preview upload
- [ ] Create release checkpoint commit for `eta`
