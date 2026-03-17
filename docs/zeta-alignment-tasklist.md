# Zeta Alignment Tasklist

## Phase 0: Debug Prep
- [x] Add a lightweight debug panel gated by `?debug=1` or `localStorage`.
- [x] Show current model, normalized camera preset, active layer, selected variants.
- [x] Show resolved price breakdown: base, spheres, body, logo, logobg, case, shockmount.
- [x] Add quick actions: reapply defaults, dump current transforms JSON, copy current state.
- [x] Add live transform inputs for microphone, shockmount, case.

## Phase 1: MALFA Isolation
- [x] Restrict MALFA logo options (`malfasilver`, `malfagold`) to `023-malfa` only.
- [x] Tighten runtime MALFA detection so `023-the-bomblet` and `023-deluxe` are not treated as MALFA.
- [ ] Verify standard logo rendering stays intact for non-MALFA models.

## Phase 2: Default logobg Pricing
- [x] Trace why default `logobg-3001` starts with `2500` for `023-the-bomblet`.
- [x] Align default-price resolution with click-price resolution for free RAL options.
- [x] Preserve `0` for free default RAL backgrounds on initial load and model switch.

## Phase 3: Camera / Layout Tuning
- [ ] Add model-by-model reference notes from provided images.
- [x] Tune `global-view` transforms for microphone, shockmount, case:
- [x] `023-the-bomblet` without shockmount
- [x] `023-the-bomblet` with shockmount
- [x] `023-malfa`
- [x] `023-deluxe`
- [x] `017-fet`
- [x] `017-tube`
- [x] Tune `logo-view` close-up framing.
- [ ] Recheck `mic-active`, `shockmount-active`, `case-active` for each model.

## Phase 4: Sanity Check
- [ ] Verify MALFA options only appear for `023-malfa`.
- [ ] Verify `logobg-3001` loads as `0` for `023-the-bomblet`.
- [ ] Verify pricing stays correct after model switches.
- [ ] Verify report/debug output still reflects final state.
