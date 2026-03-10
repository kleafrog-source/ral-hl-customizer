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

Формат для каждого файла:

- `relative/path/to/file.js`  
  - Used: XX%  
  - Explanation: кратко, что используется (функции/классы, ключевые участки), а что явно осталось от legacy.

### Example format (to be filled by SWE)

- `assets/js/main.js`  
  - Used: 90%  
  - Explanation: main entrypoint for beta template, initializes HL data, state, render and UI. Minor legacy callbacks remain but do not affect current flow.

- `assets/js/core/state.js`  
  - Used: 80%  
  - Explanation: StateManager, batching and subscriptions are used for all visual updates. Some unused helper methods (`X`, `Y`) are legacy and can be removed later.

- `assets/js/modules/wood-case.js`  
  - Used: 40%  
  - Explanation: Only initialization for standard wood case preview is used. Legacy handlers for old engraving flow are not called anymore (no DOM hooks in beta template).

## 3. Folder-level summary

Для каждой папки:

- Folder: `assets/js/core`  
  - Overall usage: ~85%  
  - Explanation: core engine, renderer, HL data manager and state are fully used; some experimental helpers are not referenced in beta template.

- Folder: `assets/js/debugger-logs`  
  - Overall usage: ~30%  
  - Explanation: only a subset of debug utilities (`debug.js`, `debugger.js`) are imported in the beta template; the rest is for development only.

## 4. Recommendations

После чеклиста:

- Список файлов/модулей, которые можно безопасно удалить или вынести в `legacy/`.
- Список модулей, которые нужно рефакторить в первую очередь (например, из‑за дублирования логики или сильной связности с DOM).

Создай новый файл в папке данной папке data если возникнут сложностью с редактированием данного файла. 