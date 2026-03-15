# Customizer Project Audit (Final)

## Release Status: Ready for Testing
The customizer has been overhauled to rely on Bitrix Highload (HL) data as the single source of truth. All functional requirements from the brief have been met and tested in the sandbox.

### Key Achievements
- [x] **Shockmount Logic**: Fully dynamic, driven by `UF_SHOCKMOUNT_*` flags. Correctly handles included vs. optional states.
- [x] **Pricing Engine**: Centralized in `price-calculator.js`. Accurately calculates surcharges for RAL, engravings, and optional accessories.
- [x] **CRM Data Integrity**: Submits detailed configuration (variants, HEX codes, prices) via individual fields and a unified JSON payload (`config_json`).
- [x] **Wood-Box Interaction**: Replaced `interact.js` with a custom native implementation. Supports pinch-zoom and drag with `anime.js` smoothing.
- [x] **Per-Model Persistence**: Implemented state snapshots. Switching between 017 and 023 models preserves user selections.
- [x] **Developer Debugger**: New panel accessible via `?debug=1`. Allows real-time camera tuning, state inspection, and alignment via stencils.
- [x] **Mobile UX**: Restricted zoom and improved sidebar responsiveness. Compact "Send configuration" button.

---

## Technical Overview

### 1. State Management
- **Entry Points**: `assets/js/core/state.js`, `assets/js/modules/hl-data-manager.js`
- **Improvements**: Added `stateManager.batch()` for performance. Implemented `perModelState` for model-switching persistence.
- **Integration**: Fixed PHP-to-JS mapping in `result_modifier.php` to include all requested HL fields.

### 2. Pricing Logic
- **Entry Point**: `assets/js/modules/price-calculator.js`
- **Logic**: Surcharges are looked up with priority: `(Model+Variant)` > `(Model)` > `(RAL Surcharge)` > `(Global)`.
- **UI**: Sidebar rows now use `toLocaleString('ru-RU')` and dynamically show/hide based on relevant state flags.

### 3. Wood-Box Engraving
- **Entry Point**: `assets/js/modules/wood-case.js`
- **Events**: Uses PointerEvents API for unified mouse/touch handling.
- **Rendering**: `anime.js` handles all DOM updates for the logo container. Homography math remains for perspective projection.

### 4. Camera & Animations
- **Entry Point**: `assets/js/modules/camera-effect.js`
- **New Views**: Added `logo-view` for close-up emblem customization.
- **Tuning**: All transform strings can be live-edited in the Debug Panel and exported for direct copy-pasting into code.

---

## Maintenance Notes
- **HL Blocks**: When adding new models to Bitrix, ensure `UF_MODEL_SERIES` ('017' or '023') and shockmount flags are correctly set.
- **CRM Form**: If the CRM WebForm is changed, verify the `name` attributes in `template.php` still match the expected lead fields.
- **SVG Layers**: The shockmount module expects IDs `layer9` and `layer10` in the SVG asset for 023 and 017 series respectively.
