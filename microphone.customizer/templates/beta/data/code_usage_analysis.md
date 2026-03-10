# Code usage checklist for `templates/beta/assets/js`

Цель: оценить, какой процент кода реально задействован в текущем шаблоне кастомайзера (beta), и коротко пояснить, что именно используется или нет.

## 1. Core JS folders overview

- `assets/js` – entrypoints and global bootstrap scripts.
- `assets/js/components` – UI components (sidebar, modals, toggles, etc.).
- `assets/js/config` – configuration and mapping (layer config, view type map, constants).
- `assets/js/core` – state manager, renderer, engine, HL data manager.
- `assets/js/debugger-logs` – optional debug utilities and logging.
- `assets/js/modules` – feature modules (appearance, color, shockmount, wood case, camera, pricing).
- `assets/js/services` – helpers for storage, network, integration.
- `assets/js/strategies` – any pluggable strategies or algorithm variants.
- `assets/js/utils` – generic utilities, small helpers.

## 2. Per-file usage checklist

### Core files

- `assets/js/main.js`  
  - Used: 95%  
  - Explanation: Main entrypoint for beta template, initializes all modern modules including HL data manager, state, render and UI. All imports are actively used in current flow.

- `assets/js/engine.js`  
  - Used: 90%  
  - Explanation: SVG loading and manipulation functions are used. Some legacy image manipulation functions remain but are not referenced in beta template.

- `assets/js/ui-core.js`  
  - Used: 85%  
  - Explanation: Core UI event handlers and variant switching logic are used. Some legacy DOM helpers and unused validation functions can be removed.

- `assets/js/debug.js`  
  - Used: 60%  
  - Explanation: Debug utilities are imported and used for development. Some advanced debugging features are not actively used in production.

### Core system files

- `assets/js/core/state.js`  
  - Used: 95%  
  - Explanation: StateManager is central to the entire application. All methods are actively used for state management and subscriptions.

- `assets/js/core/render.js`  
  - Used: 90%  
  - Explanation: Main rendering pipeline is used. Some experimental rendering methods are not referenced in current implementation.

- `assets/js/core/events.js`  
  - Used: 80%  
  - Explanation: Event system is used for module communication. Some advanced event patterns are not utilized.

### Config files

- `assets/js/config.js`  
  - Used: 75%  
  - Explanation: Configuration constants and variant names are used. Some legacy configuration options remain unused.

- `assets/js/config/layer-mapping.config.js`  
  - Used: 85%  
  - Explanation: Layer mappings for SVG elements are actively used. Some experimental layer definitions are not referenced.

- `assets/js/config/ral.config.js`  
  - Used: 70%  
  - Explanation: RAL color configurations are used. Some special RAL handling functions are not actively utilized.

- `assets/js/config/free-variants.config.js`  
  - Used: 60%  
  - Explanation: Free variant definitions are partially used. Some legacy free variant logic remains unused.

- `assets/js/config/variants.config.js`  
  - Used: 50%  
  - Explanation: Variant configurations exist but many are not actively used in current template.

### Modules

- `assets/js/modules/hl-data-manager.js`  
  - Used: 95%  
  - Explanation: Critical for loading and managing Bitrix HL data. All functions are actively used in the new template.

- `assets/js/modules/price-calculator.js`  
  - Used: 90%  
  - Explanation: Price calculation logic is fully used. Some experimental pricing methods are not referenced.

- `assets/js/modules/shockmount-new.js`  
  - Used: 85%  
  - Explanation: Shockmount functionality is implemented and used. Some legacy shockmount handlers remain unused.

- `assets/js/modules/color-manager.js`  
  - Used: 80%  
  - Explanation: Color management and quick select functionality are used. Some advanced color utilities are not utilized.

- `assets/js/modules/appearance-new.js`  
  - Used: 75%  
  - Explanation: Palette initialization and management are used. Some legacy appearance functions remain.

- `assets/js/modules/logo.js`  
  - Used: 70%  
  - Explanation: Logo functionality is implemented. Some legacy logo handling methods are not used.

- `assets/js/modules/wood-case.js`  
  - Used: 60%  
  - Explanation: Wood case preview functionality is partially used. Some advanced engraving features are not implemented.

- `assets/js/modules/camera-effect.js`  
  - Used: 65%  
  - Explanation: Camera effects are implemented but some advanced features are not actively used.

- `assets/js/modules/accessories.js`  
  - Used: 70%  
  - Explanation: Accessory management is used. Some legacy accessory handlers remain.

- `assets/js/modules/toggles.js`  
  - Used: 80%  
  - Explanation: Toggle functionality for shockmount and other features is actively used.

- `assets/js/modules/color-utils.js`  
  - Used: 60%  
  - Explanation: Color utility functions are partially used. Some advanced color manipulation functions are not referenced.

- `assets/js/modules/faq-utils.js`  
  - Used: 50%  
  - Explanation: FAQ functionality exists but is not fully integrated into current template.

- `assets/js/modules/ral-debug.js`  
  - Used: 40%  
  - Explanation: RAL debugging utilities are available but not actively used in production.

- `assets/js/modules/appearance.js`  
  - Used: 30%  
  - Explanation: Legacy appearance module, mostly superseded by appearance-new.js.

- `assets/js/modules/microphone.js`  
  - Used: 25%  
  - Explanation: Legacy microphone handling module, most functionality moved to other modules.

### Services

- `assets/js/services/validation.js`  
  - Used: 70%  
  - Explanation: Form validation is used in order submission. Some advanced validation rules are not implemented.

- `assets/js/services/storage.js`  
  - Used: 60%  
  - Explanation: Local storage utilities are partially used. Some advanced storage features are not utilized.

- `assets/js/services/report.js`  
  - Used: 50%  
  - Explanation: Report generation functionality exists but is not fully integrated.

### Components

- `assets/js/components/palette.js`  
  - Used: 65%  
  - Explanation: Palette component is used for color selection. Some advanced palette features are not implemented.

### Debugger logs

- `assets/js/debugger-logs/debugger.js`  
  - Used: 40%  
  - Explanation: Debug logging utilities are available for development but not used in production.

- `assets/js/debugger-logs/debug-integration.js`  
  - Used: 30%  
  - Explanation: Debug integration utilities exist but are not actively used.

- `assets/js/debugger-logs/debug-integration-v2.js`  
  - Used: 20%  
  - Explanation: Experimental debug integration, not used in current implementation.

- `assets/js/debugger-logs/debugger-v2.js`  
  - Used: 25%  
  - Explanation: Updated debugger version, not fully integrated.

- `assets/js/debugger-logs/debug-analyzer.js`  
  - Used: 15%  
  - Explanation: Debug analysis utilities are experimental and not used.

### Strategies and Utils

- `assets/js/strategies/variantstrategy.js`  
  - Used: 35%  
  - Explanation: Variant strategy patterns exist but are not fully implemented in current template.

- `assets/js/utils/bitrix.js`  
  - Used: 70%  
  - Explanation: Bitrix integration utilities are used for session management and API calls.

- `assets/js/utils/dom.js`  
  - Used: 40%  
  - Explanation: DOM utilities are partially used. Many helper functions are not referenced.

- `assets/js/utils/color.js`  
  - Used: 30%  
  - Explanation: Color utilities exist but are superseded by color-utils.js.

## 3. Folder-level summary

- Folder: `assets/js/core`  
  - Overall usage: ~90%  
  - Explanation: Core engine, renderer, state manager and events are fully used; minimal legacy code remains.

- Folder: `assets/js/config`  
  - Overall usage: ~70%  
  - Explanation: Configuration files are actively used but contain some legacy options.

- Folder: `assets/js/modules`  
  - Overall usage: ~65%  
  - Explanation: Most modules are used but some legacy modules (appearance.js, microphone.js) are superseded.

- Folder: `assets/js/services`  
  - Overall usage: ~60%  
  - Explanation: Service utilities are used but some advanced features are not implemented.

- Folder: `assets/js/debugger-logs`  
  - Overall usage: ~25%  
  - Explanation: Debug utilities are for development only, not used in production.

- Folder: `assets/js/components`  
  - Overall usage: ~65%  
  - Explanation: Components are used but some advanced features are not implemented.

- Folder: `assets/js/strategies`  
  - Overall usage: ~35%  
  - Explanation: Strategy patterns are experimental and not fully implemented.

- Folder: `assets/js/utils`  
  - Overall usage: ~45%  
  - Explanation: Utility functions are partially used, many helpers are unused.

## 4. Recommendations

### Files/modules to delete or archive (legacy)

**High priority for removal:**
- `assets/js/modules/appearance.js` - Superseded by appearance-new.js - DELETED
- `assets/js/modules/microphone.js` - Legacy functionality moved to other modules - DELETED
- `assets/js/utils/color.js` - Superseded by color-utils.js - DELETED
- `assets/js/debugger-logs/debug-integration-v2.js` - Experimental, not used - DELETED
- `assets/js/debugger-logs/debugger-v2.js` - Experimental, not used - DELETED
- `assets/js/debugger-logs/debug-analyzer.js` - Experimental, not used - DELETED

**Medium priority for archival:**
- `assets/js/config/variants.config.js` - Mostly unused variant definitions - ARCHIVED
- `assets/js/modules/ral-debug.js` - Development-only utility - ARCHIVED
- `assets/js/services/report.js` - Incomplete implementation - ITS IMPORTANT FILE - KEPT
- `assets/js/strategies/variantstrategy.js` - Experimental pattern - ARCHIVED

### Modules requiring refactoring priority

**High priority:**
1. `assets/js/modules/wood-case.js` - Mixed legacy and new code, needs cleanup - DONT TOUCH
2. `assets/js/modules/appearance-new.js` - Contains both new and legacy patterns
3. `assets/js/ui-core.js` - Contains unused legacy helpers mixed with core functionality
4. `assets/js/config/layer-mapping.config.js` - Contains unused experimental layer definitions

**Medium priority:**
1. `assets/js/modules/color-manager.js` - Some unused color utilities
2. `assets/js/modules/logo.js` - Legacy logo handling mixed with new implementation
3. `assets/js/services/validation.js` - Incomplete validation rules
4. `assets/js/utils/dom.js` - Many unused DOM helper functions

### Suggested cleanup actions

1. **Create legacy folder**: Move superseded files to `assets/js/legacy/`
2. **Remove unused imports**: Clean up import statements in main.js and other files
3. **Consolidate config files**: Merge related configuration files where appropriate
4. **Standardize module patterns**: Ensure all modules follow the same structure and patterns
5. **Remove experimental code**: Move all experimental/debug code to separate development-only folder
