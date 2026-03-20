// Shockmount module (eta)

import { stateManager } from '../core/state.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';

function getShockmountSvg() {
    return document
        .getElementById('shockmount-svg-container')
        ?.querySelector('svg') || null;
}

function getPinsLayerMapping(variant) {
    return SECTION_LAYER_MAP.shockmountPins?.[variant] || {
        originals: [],
        colorizedGroup: 'g3',
        monoGroup: 'g4',
        floodFilter: 'feFlood8'
    };
}

export function initShockmount() {
    stateManager.subscribeSection('shockmount', () => {
        refreshShockmountUI();
    });

    refreshShockmountUI();
}

export function refreshShockmountUI(currentState = null) {
    updateShockmountVisibility();
    updateShockmountLayers(currentState || stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();
}

export function updateShockmountVisibility() {
    const state = stateManager.get();
    const shockmountToggle = document.getElementById('shockmount-switch');
    const switchContainer = document.getElementById('shockmount-toggle');
    const shockmountMenuItem = document.getElementById('shockmount-section');
    const shockmountPinsMenuItem = document.getElementById('shockmountPins-section');
    const shockmountSubmenu = document.getElementById('submenu-shockmount');
    const shockmountPinsSubmenu = document.getElementById('submenu-shockmountPins');

    const canToggle = !!state.shockmount?.canToggle;
    const enabled = !!state.shockmount?.enabled;
    const visible = !!state.shockmount?.visible;
    const shouldShowShockmount = visible && enabled;

    if (switchContainer) {
        switchContainer.style.display = canToggle ? 'flex' : 'none';
    }

    if (shockmountToggle) {
        shockmountToggle.disabled = false;
        shockmountToggle.checked = enabled;
    }

    if (shockmountMenuItem) {
        shockmountMenuItem.style.display = shouldShowShockmount ? '' : 'none';
    }

    if (shockmountPinsMenuItem) {
        shockmountPinsMenuItem.style.display = shouldShowShockmount ? '' : 'none';
    }

    if (shockmountSubmenu) {
        shockmountSubmenu.style.display = shouldShowShockmount ? 'block' : 'none';
    }

    if (shockmountPinsSubmenu) {
        shockmountPinsSubmenu.style.display = shouldShowShockmount ? 'block' : 'none';
    }
}

export function updateShockmountLayers(currentState = null) {
    const shockmountSVG = getShockmountSvg();
    if (!shockmountSVG) {
        return;
    }

    const state = currentState || stateManager.get();
    const modelSeries = String(state.modelSeries || '');
    const targetLayerId = modelSeries === '023' ? 'layer9' : 'layer10';

    const allLayers = shockmountSVG.querySelectorAll('#layer10, #layer9');
    allLayers.forEach((layer) => {
        layer.style.display = 'none';
    });

    if (state.shockmount?.enabled && state.shockmount?.visible) {
        const targetLayer = shockmountSVG.querySelector(`#${targetLayerId}`);
        if (targetLayer) {
            targetLayer.style.display = 'inline';
        }
    }
}

function updateShockmountColor(floodId, hex, opacity = null) {
    if (!hex) {
        return;
    }

    const shockmountSVG = getShockmountSvg();
    if (!shockmountSVG) {
        return;
    }

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
    const shockmountSVG = getShockmountSvg();
    if (!shockmountSVG) {
        return;
    }

    if (!state.shockmount?.enabled || !state.shockmount?.visible) {
        return;
    }

    const isFilterMode = state.shockmount?.svgTargetMode === 'filter';
    const hasCustomColor = isFilterMode && !!state.shockmount?.colorValue;
    const filterId = state.shockmount?.svgFilterId || 'feFlood6';

    const main017 = shockmountSVG.querySelector('#shockmount-017-pins-brass-group');
    const main023 = shockmountSVG.querySelector('#shockmount-023-pins-brass-group');

    if (main017) {
        main017.style.display = hasCustomColor ? 'none' : 'inline';
    }
    if (main023) {
        main023.style.display = hasCustomColor ? 'none' : 'inline';
    }

    if (hasCustomColor) {
        const opacity = state.shockmount?.floodOpacity || null;
        updateShockmountColor(filterId, state.shockmount.colorValue, opacity);
    }
}

export function updateShockmountPinsPreview() {
    const shockmountSVG = getShockmountSvg();
    if (!shockmountSVG) {
        return;
    }

    const state = stateManager.get();
    const pinsState = state.shockmountPins || {};
    const variant = pinsState.variantCode || '';

    const layerMapping = getPinsLayerMapping(variant);

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

    if (colorize017) {
        colorize017.style.display = isColorizedVariant ? 'inline' : 'none';
    }
    if (colorize023) {
        colorize023.style.display = isColorizedVariant ? 'inline' : 'none';
    }
    if (mono017) {
        mono017.style.display = isColorizedVariant ? 'inline' : 'none';
    }
    if (mono023) {
        mono023.style.display = isColorizedVariant ? 'inline' : 'none';
    }

    if (isColorizedVariant && pinsState.colorValue) {
        const filterId = pinsState.svgFilterId || 'feFlood8';
        const opacity = pinsState.floodOpacity || null;
        updateShockmountColor(filterId, pinsState.colorValue, opacity);
    }
}

export function toggleShockmount() {
    const state = stateManager.get();
    const shockmountState = state.shockmount || {};

    if (!shockmountState.available || !shockmountState.canToggle) {
        return;
    }

    stateManager.batch((batch) => {
        batch('shockmount.enabled', !shockmountState.enabled);
    });

    refreshShockmountUI(stateManager.get());
}
