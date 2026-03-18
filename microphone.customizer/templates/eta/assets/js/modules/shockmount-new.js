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
    const switchContainer = document.getElementById('shockmount-toggle');
    const shockmountMenuItem = document.getElementById('shockmount-section');
    const shockmountPinsMenuItem = document.getElementById('shockmountPins-section');
    const shockmountSubmenu = document.getElementById('submenu-shockmount');
    const shockmountPinsSubmenu = document.getElementById('submenu-shockmountPins');

    const canToggle = !!state.shockmount?.canToggle; // SHOCKMOUNT_TOGGLE: 0=скрыт, 1=виден
    const enabled = !!state.shockmount?.enabled; // SHOCKMOUNT_ENABLED: 0=выкл, 1=вкл
    const visible = !!state.shockmount?.visible; // SHOCKMOUNT_VISIBLE: 0=никогда, 1=когда включен

    // console.log('[Shockmount Visibility] State:', {
    //     canToggle, enabled, visible,
    //     shouldShowShockmount: visible && enabled
    // });

    // Видимость toggle контейнера зависит только от canToggle
    if (switchContainer) {
        switchContainer.style.display = canToggle ? 'flex' : 'none';
    }
    
    // Управляем состоянием toggle input
    if (shockmountToggle) {
        shockmountToggle.disabled = false; // toggle всегда активен когда видим
        shockmountToggle.checked = enabled;
    }

    // Видимость shockmount и меню зависит от visible и enabled
    const shouldShowShockmount = visible && enabled;
    
    // Управляем видимостью меню
    if (shockmountMenuItem) {
        shockmountMenuItem.style.display = shouldShowShockmount ? '' : 'none';
    }
    if (shockmountPinsMenuItem) {
        shockmountPinsMenuItem.style.display = shouldShowShockmount ? '' : 'none';
    }

    // Управляем видимостью подменю
    const showSubmenus = shouldShowShockmount;
    if (shockmountSubmenu) {
        shockmountSubmenu.style.display = showSubmenus ? 'block' : 'none';
    }
    if (shockmountPinsSubmenu) {
        shockmountPinsSubmenu.style.display = showSubmenus ? 'block' : 'none';
    }
}

export function updateShockmountLayers(currentState = null) {
    const shockmountSVG = document
   .getElementById('shockmount-svg-container')
   ?.querySelector('svg')
    if (!shockmountSVG) return;

    const state = currentState || stateManager.get();
    const currentModelCode = state.currentModelCode || '';
    const modelSeries = (state.modelSeries || '').toString();
    // Правильно определяем серию: используем только modelSeries
    const is023Series = modelSeries === '023';
    const targetLayerId = is023Series ? 'layer9' : 'layer10';
    
    // console.log('[Shockmount Layers] Debug:', {
    //     currentModelCode,
    //     modelSeries,
    //     is023Series,
    //     targetLayerId,
    //     modelSeriesType: typeof modelSeries,
    //     modelSeriesValue: state.modelSeries
    // });

    const allLayers = shockmountSVG.querySelectorAll('#layer10, #layer9');
    allLayers.forEach(layer => {
        layer.style.display = 'none';
    });

    if (state.shockmount?.enabled && state.shockmount?.visible) {
        const targetLayer = shockmountSVG.querySelector(`#${targetLayerId}`);
        if (targetLayer) targetLayer.style.display = 'inline';
    }
}

function updateShockmountColor(floodId, hex, opacity = null) {
    if (!hex) return;
    const shockmountSVG = document
   .getElementById('shockmount-svg-container')
   ?.querySelector('svg');
    if (!shockmountSVG) return;
    const el = shockmountSVG.querySelector(`#${floodId}`);
    if (el) {
        el.setAttribute('flood-color', hex);
        if (opacity !== null) {
            el.setAttribute('flood-opacity', opacity);
        }
    }
}

export function updateShockmountPreview() {
    const state = stateManager.get();
    const shockmountSVG = document
   .getElementById('shockmount-svg-container')
   ?.querySelector('svg');
    if (!shockmountSVG) return;

    if (!state.shockmount?.enabled || !state.shockmount?.visible) return;

    const isFilterMode = state.shockmount?.svgTargetMode === 'filter';
    const hasCustomColor = isFilterMode && !!state.shockmount?.colorValue;
    const currentModelCode = state.currentModelCode || '';
    const modelSeries = (state.modelSeries || '').toString();
    // Правильно определяем серию: используем только modelSeries
    // const is023Series = modelSeries === '023';
    
    // console.log('[Shockmount Preview] Debug:', {
    //     currentModelCode,
    //     modelSeries,
    //     is023Series,
    //     modelSeriesType: typeof modelSeries,
    //     modelSeriesValue: state.modelSeries
    // });
    
    // Определяем правильный filterId для каркаса (feFlood6 для обеих серий)
    let filterId = state.shockmount?.svgFilterId || 'feFlood6';
    // feFlood6 используется для каркаса обеих серий
    // feFlood8 используется для пинов (не здесь)
    
    // console.log('[Shockmount Preview] Filter ID:', filterId, 'for series:', modelSeries);
    
    const main017 = shockmountSVG.querySelector('#shockmount-017-pins-brass-group');
    const main023 = shockmountSVG.querySelector('#shockmount-023-pins-brass-group');
    const colorize = shockmountSVG.querySelector(`#${filterId}`);

    if (main017) main017.style.display = hasCustomColor ? 'none' : 'inline';
    if (main023) main023.style.display = hasCustomColor ? 'none' : 'inline';
    // НЕ применяем display к SVG фильтру - это ломает его работу!
    // if (colorize) colorize.style.display = hasCustomColor ? 'inline' : 'none';

    if (hasCustomColor) {
        const opacity = state.shockmount?.floodOpacity || null;
        updateShockmountColor(filterId, state.shockmount.colorValue, opacity);
    }
}

export function updateShockmountPinsPreview() {
    const shockmountSVG = document
   .getElementById('shockmount-svg-container')
   ?.querySelector('svg');
    if (!shockmountSVG) return;

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

    const brass017 = shockmountSVG.querySelector('#shockmount-017-pins-brass-group');
    const brass023 = shockmountSVG.querySelector('#shockmount-023-pins-brass-group');
    const colorize017 = shockmountSVG.querySelector('#g3');
    const colorize023 = shockmountSVG.querySelector('#g14');
    const mono017 = shockmountSVG.querySelector('#g4');
    const mono023 = shockmountSVG.querySelector('#layer7');

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
    // НЕ применяем display к SVG фильтрам - это ломает их работу!
    // if (colorize017) colorize017.style.display = isColorizedVariant ? 'inline' : 'none';
    // if (colorize023) colorize023.style.display = isColorizedVariant ? 'inline' : 'none';

    if (isColorizedVariant && pinsState.colorValue) {
        const filterId = pinsState.svgFilterId || 'feFlood8';
        const opacity = pinsState.floodOpacity || null;
        updateShockmountColor(filterId, pinsState.colorValue, opacity);
    }
}

export function toggleShockmount() {
    const state = stateManager.get();
    const s = state.shockmount || {};

    if (!s.available) return;
    if (!s.canToggle) return;

    const nextEnabled = !s.enabled;

    stateManager.batch(batch => {
        batch('shockmount.enabled', nextEnabled);
    });

    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();
}
