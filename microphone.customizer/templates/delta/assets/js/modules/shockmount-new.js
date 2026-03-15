// Shockmount module (delta)

import { stateManager } from '../core/state.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';
import { formatPrice } from './price-calculator.js';

/**
 * Применение правил из модели
 */
export function applyShockmountConfig(model) {
    const visible = Number(model.SHOCKMOUNT_VISIBLE) === 1;
    const toggle = Number(model.SHOCKMOUNT_TOGGLE) === 1;
    const enabled = Number(model.SHOCKMOUNT_ENABLED) === 1;
    const price = Number(model.SHOCKMOUNT_PRICE) || 0;

    const container = document.querySelector('#shockmount-module');
    const toggleInput = document.querySelector('#shockmount-toggle');

    if (!container || !toggleInput) return;

    // видимость модуля
    container.style.display = visible ? '' : 'none';

    // состояние toggle
    toggleInput.disabled = !toggle;

    // начальное состояние
    toggleInput.checked = enabled;

    // сохранить в state
    stateManager.set('shockmountEnabled', enabled);
    stateManager.set('shockmountPrice', price);
}

/**
 * Обработчик переключения toggle
 */
export function initShockmountToggle() {
    const toggleInput = document.querySelector('#shockmount-toggle');
    if (!toggleInput) return;

    toggleInput.addEventListener('change', () => {
        stateManager.set('shockmountEnabled', toggleInput.checked);
        document.dispatchEvent(new CustomEvent('price:update'));
    });
}

/**
 * Инициализация модуля
 */
export function initShockmount() {
    initShockmountToggle();
    
    // Подписываемся на изменения shockmount state для обновления UI
    stateManager.subscribeSection('shockmount', () => {
        updateShockmountVisibility();
        updateShockmountLayers(stateManager.get());
        updateShockmountPreview();
        updateShockmountPinsPreview();
    });
    
    // Первоначальное обновление
    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();
}

export function updateShockmountVisibility() {
    const state = stateManager.get();
    const shockmountToggle = document.getElementById('shockmount-toggle');
    const switchContainer = document.getElementById('shockmount-switch-container');
    const shockmountMenuItem = document.getElementById('shockmount-section');
    const shockmountPinsMenuItem = document.getElementById('shockmountPins-section');
    const shockmountSubmenu = document.getElementById('submenu-shockmount');
    const shockmountPinsSubmenu = document.getElementById('submenu-shockmountPins');

    const available = !!state.shockmount?.available; // SHOCKMOUNT_VISIBLE
    const canToggle = !!state.shockmount?.canToggle; // SHOCKMOUNT_TOGGLE
    const enabled = !!state.shockmount?.enabled; // SHOCKMOUNT_ENABLED

    // Скрываем/показываем контейнер toggle, а не сам input
    if (switchContainer) {
        switchContainer.style.display = available ? 'flex' : 'none';
    }
    
    // Управляем состоянием toggle input
    if (shockmountToggle) {
        shockmountToggle.disabled = !canToggle;
        shockmountToggle.checked = enabled;
    }

    // Управляем видимостью меню
    if (shockmountMenuItem) {
        shockmountMenuItem.style.display = available ? '' : 'none';
    }
    if (shockmountPinsMenuItem) {
        shockmountPinsMenuItem.style.display = available ? '' : 'none';
    }

    // Управляем видимостью подменю
    const showSubmenus = available && enabled;
    if (shockmountSubmenu) {
        shockmountSubmenu.style.display = showSubmenus ? 'block' : 'none';
    }
    if (shockmountPinsSubmenu) {
        shockmountPinsSubmenu.style.display = showSubmenus ? 'block' : 'none';
    }
}

export function updateShockmountLayers(currentState = null) {
    const shockmountSVG = document.getElementById('shockmount-svg');
    if (!shockmountSVG) return;

    const state = currentState || stateManager.get();
    const currentModelCode = state.currentModelCode || '';
    const modelSeries = (state.modelSeries || '').toString();
    const is023Series = modelSeries === '023' || currentModelCode.includes('023');
    const targetLayerId = is023Series ? 'layer9' : 'layer10';

    const allLayers = shockmountSVG.querySelectorAll('#layer10, #layer9');
    allLayers.forEach(layer => {
        layer.style.display = 'none';
    });

    if (state.shockmount?.enabled && state.shockmount?.available) {
        const targetLayer = shockmountSVG.querySelector(`#${targetLayerId}`);
        if (targetLayer) targetLayer.style.display = 'inline';
    }
}

function updateShockmountColor(floodId, hex) {
    if (!hex) return;
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;
    const el = shockmountSvg.querySelector(`#${floodId}`);
    if (el) el.setAttribute('flood-color', hex);
}

export function updateShockmountPreview() {
    const state = stateManager.get();
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    if (!state.shockmount?.enabled || !state.shockmount?.available) return;

    const isFilterMode = state.shockmount?.svgTargetMode === 'filter';
    const hasCustomColor = isFilterMode && !!state.shockmount?.colorValue;
    const main017 = shockmountSvg.querySelector('#shockmount-017-pins-brass-group');
    const main023 = shockmountSvg.querySelector('#shockmount-023-pins-brass-group');
    const filterId = state.shockmount?.svgFilterId || 'feFlood6';
    const colorize = shockmountSvg.querySelector(`#${filterId}`);

    if (main017) main017.style.display = hasCustomColor ? 'none' : 'inline';
    if (main023) main023.style.display = hasCustomColor ? 'none' : 'inline';
    if (colorize) colorize.style.display = hasCustomColor ? 'inline' : 'none';

    if (hasCustomColor) {
        updateShockmountColor(filterId, state.shockmount.colorValue);
    }
}

export function updateShockmountPinsPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const state = stateManager.get();
    const pinsState = state.shockmountPins || {};
    const variant = pinsState.variantCode || '';

    let layerMapping = SECTION_LAYER_MAP.shockmountPins?.[variant];
    if (!layerMapping) {
        layerMapping = {
            originals: [],
            colorizedGroup: 'g3',
            monoGroup: 'g4',
            floodFilter: 'feFlood8'
        };
    }

    const brass017 = shockmountSvg.querySelector('#shockmount-017-pins-brass-group');
    const brass023 = shockmountSvg.querySelector('#shockmount-023-pins-brass-group');
    const colorize017 = shockmountSvg.querySelector('#g3');
    const colorize023 = shockmountSvg.querySelector('#g13');
    const mono017 = shockmountSvg.querySelector('#g4');
    const mono023 = shockmountSvg.querySelector('#g13-2');

    const isFilterMode = pinsState.svgTargetMode === 'filter';
    const isOriginalMode = pinsState.svgTargetMode === 'original';
    const isColorizedVariant = isFilterMode || (pinsState.isRal && !isOriginalMode);
    const applyGrayscale = pinsState.svgSpecialKey === 'grayscale';

    if (brass017) {
        brass017.style.display = isColorizedVariant ? 'none' : 'inline';
        brass017.style.filter = applyGrayscale ? 'grayscale(1)' : 'none';
    }
    if (brass023) {
        brass023.style.display = isColorizedVariant ? 'none' : 'inline';
        brass023.style.filter = applyGrayscale ? 'grayscale(1)' : 'none';
    }

    if (colorize017) colorize017.style.display = isColorizedVariant ? 'inline' : 'none';
    if (colorize023) colorize023.style.display = isColorizedVariant ? 'inline' : 'none';
    if (mono017) mono017.style.display = isColorizedVariant ? 'inline' : 'none';
    if (mono023) mono023.style.display = isColorizedVariant ? 'inline' : 'none';

    if (isColorizedVariant && pinsState.colorValue) {
        const filterId = pinsState.svgFilterId || 'feFlood8';
        updateShockmountColor(filterId, pinsState.colorValue);
    }
}

export function toggleShockmount() {
    const state = stateManager.get();
    const s = state.shockmount || {};

    if (!s.available) {
        console.log('[Shockmount] Not available for current model');
        return;
    }

    if (!s.canToggle) {
        console.log('[Shockmount] Toggle is disabled for current model');
        return;
    }

    const nextEnabled = !s.enabled;

    stateManager.batch(batch => {
        batch('shockmount.enabled', nextEnabled);
    });

    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();
}
