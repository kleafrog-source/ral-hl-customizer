// Shockmount module (delta)

import { stateManager } from '../core/state.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';

export function initShockmount() {
    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();
}

export function updateShockmountVisibility() {
    const state = stateManager.get();
    const shockmountMenuItem = document.getElementById('shockmount-menu-item');
    const shockmountPinsMenuItem = document.getElementById('shockmountPins-section');
    const switchContainer = document.getElementById('shockmount-switch-container');
    const includedText = document.getElementById('shockmount-included-text');

    const enabled = !!state.shockmount?.enabled;
    const included = !!state.shockmount?.included;

    if (switchContainer) {
        switchContainer.style.display = included ? 'none' : 'flex';
    }
    if (includedText) {
        includedText.style.display = included ? 'block' : 'none';
    }

    if (shockmountMenuItem) shockmountMenuItem.style.display = enabled ? 'flex' : 'none';
    if (shockmountPinsMenuItem) shockmountPinsMenuItem.style.display = enabled ? 'flex' : 'none';
}

export function updateShockmountLayers(currentState = null) {
    const shockmountSVG = document.getElementById('shockmount-svg');
    if (!shockmountSVG) return;

    const state = currentState || stateManager.get();
    const currentModelCode = state.currentModelCode || '';
    const is023Series = currentModelCode.includes('023');
    const targetLayerId = is023Series ? 'layer10' : 'layer9';

    const allLayers = shockmountSVG.querySelectorAll('#layer10, #layer9');
    allLayers.forEach(layer => {
        layer.style.display = 'none';
    });

    if (state.shockmount?.enabled) {
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

    const hasCustomColor = !!state.shockmount?.colorValue;
    const main017 = shockmountSvg.querySelector('#shockmount-017-pins-brass-group');
    const main023 = shockmountSvg.querySelector('#shockmount-023-pins-brass-group');
    const colorize = shockmountSvg.querySelector('#feFlood6');

    if (main017) main017.style.display = hasCustomColor ? 'none' : 'inline';
    if (main023) main023.style.display = hasCustomColor ? 'none' : 'inline';
    if (colorize) colorize.style.display = hasCustomColor ? 'inline' : 'none';

    if (hasCustomColor) {
        updateShockmountColor('feFlood6', state.shockmount.colorValue);
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

    const isColorizedVariant = pinsState.isRal || variant.toLowerCase().includes('ral');

    if (brass017) brass017.style.display = isColorizedVariant ? 'none' : 'inline';
    if (brass023) brass023.style.display = isColorizedVariant ? 'none' : 'inline';

    if (colorize017) colorize017.style.display = isColorizedVariant ? 'inline' : 'none';
    if (colorize023) colorize023.style.display = isColorizedVariant ? 'inline' : 'none';
    if (mono017) mono017.style.display = isColorizedVariant ? 'inline' : 'none';
    if (mono023) mono023.style.display = isColorizedVariant ? 'inline' : 'none';

    if (isColorizedVariant && pinsState.colorValue) {
        updateShockmountColor('feFlood8', pinsState.colorValue);
    }
}
