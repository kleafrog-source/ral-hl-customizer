# Audit of Delta Template - SOYUZ Microphone Customizer

## State / HL Data Manager
- **Purpose**: Centralized application state managed via `stateManager` in `core/state.js`. HL data is mapped in `result_modifier.php` and initialized in `main.js`.
- **Status**: Functional but initialization logic in `main.js` has some hardcoded defaults that should be fully driven by HL model flags.
- **Risks**: Potential mismatch between HL data and JS state if mapping is incomplete.

## Sidebar UI
- **Purpose**: Renders sections (spheres, body, logo, etc.) and handles user interactions. Defined in `template.php` and managed by `ui-core.js`.
- **Status**: Supports variant switching and submenus. Contains some hardcoded logic for special models (MALFA).
- **Risks**: Inconsistent UI behavior if HL data structure changes.

## Pricing / Breakdown
- **Purpose**: Calculates total price including surcharges. Logic mostly in `price-calculator.js`.
- **Status**: Uses `data-price` attributes from DOM elements. Default price calculation needs alignment with click handlers.
- **Risks**: Incorrect price display if state and UI attributes diverge.

## Shockmount / ShockmountPins
- **Purpose**: Controls visibility and styling of the shockmount. Implementation in `shockmount-new.js`.
- **Status**: Currently has some hardcoded model checks. Needs to move to full HL-driven logic (`UF_SHOCKMOUNT_*`).
- **Risks**: Incorrect availability or toggle behavior for specific microphone models.

## Wood-box (Laser Engraving)
- **Purpose**: Allows users to upload and position an engraving image on the wooden case. Implementation in `wood-case.js`.
- **Status**: Depends on `interact.js`. Behavior reported as buggy. Needs replacement with anime.js + native events.
- **Risks**: Jittery or unpredictable interaction on touch devices.

## Bitrix CRM Integration
- **Purpose**: Submits configuration to a hidden Bitrix form.
- **Status**: Verification needed to ensure all fields (RAL codes, engraving transforms, etc.) are correctly passed.
- **Risks**: Data loss during lead creation if fields are missing.

## Camera / Animations
- **Purpose**: SVG camera effects and view presets in `camera-effect.js`.
- **Status**: Functional but lacks a way for developers to live-tune values or view current state.
- **Risks**: Difficult to align layers perfectly without a debug helper.

## Current Status (Post-Refactor)
- **Shockmount Logic**: Fully driven by HL data flags (`shockmountVisible`, `shockmountToggle`, etc.). Toggle reliability improved.
- **Pricing**: Aligned state-driven pricing breakdown. Shockmount row and total calculation updated.
- **Bitrix Integration**: Added serialization of the entire configuration to JSON, passed to the hidden form.
- **Wood-Box Interactions**: Replaced `interact.js` with native pointer events and `anime.js`. Centralized transform state.
- **Debug Panel**: Created a dev-only helper panel with a state viewer, camera view switcher, and overlay stencil.
- **Per-Model Persistence**: State is now saved and restored when switching between microphone models.
- **MALFA Logo**: Hardcoded buttons removed; logic is now fully driven by HL variant filtering.
- **Zoom Restriction**: Mobile zoom disabled via meta tag and touch event interception.
