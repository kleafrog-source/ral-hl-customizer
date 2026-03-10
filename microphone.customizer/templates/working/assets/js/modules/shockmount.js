import { stateManager } from '../core/state.js';
import { CONFIG } from '../config.js';
import { switchPreview } from './accessories.js';

// --- Private Helper Functions ---

function hexToRgb(hex) {
    if (!hex) return 'rgb(0,0,0)';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 'rgb(0,0,0)';
}

function updateShockmountColor(part, hex) {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const rgb = hexToRgb(hex);
    const floodId = part === 'body' ? 'feFlood6' : 'feFlood8';

    const el = shockmountSvg.querySelector(`#${floodId}`);
    if (el) {
        el.setAttribute('flood-color', rgb);
    }
}

// --- Public API ---

export function initShockmount() {
    initShockmountEventListeners();
    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();
}

export function updateShockmountVisibility() {
    const shockmountMenuItem = document.getElementById('shockmount-menu-item');
    const shockmountPinsMenuItem = document.getElementById('shockmount-pins-menu-item');
    const shockmountOptionsSection = document.getElementById('shockmount-options-section');
    const switchContainer = document.getElementById('shockmount-switch-container');
    const includedText = document.getElementById('shockmount-included-text');

    if (!shockmountMenuItem) return;

    const isBomblet = stateManager.get().variant === '023-the-bomblet';
    shockmountMenuItem.style.display = 'flex';
    if (shockmountPinsMenuItem) {
        shockmountPinsMenuItem.style.display = stateManager.get().shockmount.enabled ? 'flex' : 'none';
    }

    if (isBomblet) {
        if(switchContainer) switchContainer.style.display = 'block';
        // Полностью скрываем текст о включении в комплект
        if(includedText) includedText.style.display = 'none';
        const isEnabled = stateManager.get().shockmount.enabled;
        if(shockmountOptionsSection) shockmountOptionsSection.style.display = isEnabled ? 'block' : 'none';
        const shockmountSwitch = document.getElementById('shockmount-switch');
        if(shockmountSwitch) shockmountSwitch.checked = isEnabled;
        
        const newPrice = isEnabled ? CONFIG.shockmountPrice : 0;
        if (stateManager.get().prices.shockmount !== newPrice) {
            stateManager.set('prices.shockmount', newPrice);
        }
    } else {
        // Для других моделей скрываем свитч (подвес безусловен или недоступен)
        if(switchContainer) switchContainer.style.display = 'none';
        // Полностью скрываем текст о включении в комплект
        if(includedText) includedText.style.display = 'none';
        if(shockmountOptionsSection) shockmountOptionsSection.style.display = 'block';
        
        if (stateManager.get().shockmount.enabled !== true) {
            stateManager.set('shockmount.enabled', true);
        }
        if (stateManager.get().prices.shockmount !== 0) {
            stateManager.set('prices.shockmount', 0);
        }
    }

    if (!stateManager.get().shockmount.enabled && document.querySelector('.preview-switch-btn.active')?.dataset.preview === 'shockmount') {
        switchPreview('microphone');
    }
}

export function toggleShockmount() {
    const isEnabled = document.getElementById('shockmount-switch').checked;
    stateManager.set('shockmount.enabled', isEnabled);
    updateShockmountVisibility();

}

// Mapping of variants to shockmount layer IDs
const SHOCKMOUNT_LAYER_BY_VARIANT = {
    '017-basic': 'layer10',
    '017-deluxe': 'layer10', 
    '017-fet': 'layer10',
    '023-basic': 'layer9',
    '023-malfa': 'layer9',
    '023-deluxe': 'layer9'
};

export function updateShockmountLayers(currentState = null) {
    const shockmountSVG = document.getElementById('shockmount-svg');
    if (!shockmountSVG) return;

    const state = currentState || stateManager.get();
    const currentVariant = state.variant;
    
    // Get target layer ID based on variant
    const targetLayerId = SHOCKMOUNT_LAYER_BY_VARIANT[currentVariant];
    if (!targetLayerId) return;

    // Hide all shockmount layers first
    const allLayers = shockmountSVG.querySelectorAll('#layer10, #layer9');
    allLayers.forEach(layer => {
        layer.style.display = 'none';
    });

    // Show only target layer if shockmount is enabled
    if (state.shockmount && state.shockmount.enabled === true) {
        const targetLayer = shockmountSVG.querySelector(`#${targetLayerId}`);
        if (targetLayer) {
            targetLayer.style.display = 'inline';
        }
    }
}

export function handleShockmountVariantSelection(variant) {
    const section = document.getElementById('shockmount-options-section');
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));

    // Ищем элемент с учетом префиксов
    let target = section.querySelector(`[data-variant="shock-${variant}"]`);
    if (!target) {
        target = section.querySelector(`[data-variant="${variant}"]`);
    }
    if (target) target.classList.add('selected');

    // Also deselect custom color from palette
    document.getElementById('pal-shockmount').querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));

    const colors = { 'RAL9003': '#F4F4F4', 'RAL1013': '#EAE0C8', 'RAL9005': '#0E0E10' };
    // Remove prefix if present
    const cleanVariant = variant.replace('shock-', '');
    stateManager.set('shockmount.variant', variant);
    stateManager.set('shockmount.color', colors[cleanVariant] || `RAL ${cleanVariant}`);
    stateManager.set('shockmount.colorValue', colors[cleanVariant] || '#F4F4F4');
    stateManager.set('prices.shockmount', 0);


    updateShockmountPreview();
}

export function handleShockmountColorSelection(color, ralName) {
    const section = document.getElementById('shockmount-options-section');
    section.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));

    stateManager.set('shockmount.variant', 'custom');
    stateManager.set('shockmount.color', `RAL ${ralName}`);
    stateManager.set('shockmount.colorValue', color);
    stateManager.set('prices.shockmount', CONFIG.optionPrice);


    updateShockmountPreview();
}

export function handleShockmountPinSelection(variant, color = null, ralName = null) {
    const section = document.getElementById('shockmount-pins-options-section');
    if (!section) {
        console.error('shockmount-pins-options-section not found');
        return;
    }
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));
    
    const pinsPalette = document.getElementById('pal-pins');
    if (pinsPalette) {
        pinsPalette.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
    }

    if (variant === 'custom') {
        // Check if this is a free RAL color
        const freePinsRals = ['9003', '1013', '9005'];
        const isFree = freePinsRals.includes(ralName);
        
        stateManager.set('shockmountPins', { variant: 'custom', material: 'custom', colorValue: color, colorName: `RAL ${ralName}` });
        const targetSwatch = document.getElementById('pal-pins')?.querySelector(`[data-ral="${ralName}"]`);
        if(targetSwatch) targetSwatch.classList.add('selected');
        
        // Set price - free for standard RAL colors, paid for others
        stateManager.set('prices.shockmount', isFree ? 0 : CONFIG.optionPrice);

    } else if (variant === 'brass') {
        stateManager.set('shockmountPins', { variant: 'brass', material: 'brass', colorValue: null, colorName: 'Polished Brass' });
        // Ищем с префиксом pins-
        let target = section.querySelector(`[data-variant="pins-${variant}"]`);
        if (!target) {
            target = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (target) target.classList.add('selected');
        
        // Brass is free
        stateManager.set('prices.shockmount', 0);
        
    } else {
        // Standard color variants (RAL9003, RAL1013, RAL9005)
        const colors = { 'RAL9003': '#F4F4F4', 'RAL1013': '#EAE0C8', 'RAL9005': '#0E0E10' };
        // Remove prefix if present
        const cleanVariant = variant.replace('pins-', '');
        stateManager.set('shockmountPins', { 
            variant: variant, 
            material: null, 
            colorValue: colors[cleanVariant], 
            colorName: cleanVariant
        });
        // Ищем с префиксом pins-
        let targetPins = section.querySelector(`[data-variant="pins-${cleanVariant}"]`);
        if (!targetPins) {
            targetPins = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (targetPins) targetPins.classList.add('selected');
        
        // Standard colors are free
        stateManager.set('prices.shockmount', 0);
    }

    updateShockmountPinsPreview();
}

export function updateShockmountPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const hasCustomColor = !!stateManager.get().shockmount.colorValue;

    const layers = {
        main017: shockmountSvg.querySelector('#shockmount-017-pins-brass-group'),
        colorize017: shockmountSvg.querySelector('#feFlood6'),
        main023: shockmountSvg.querySelector('#shockmount-023-pins-brass-group'),
        colorize023: shockmountSvg.querySelector('#feFlood6'),
    };

    // Toggle 017 layers
    if (layers.main017) layers.main017.style.display = hasCustomColor ? 'none' : 'inline';
    if (layers.colorize017) layers.colorize017.style.display = hasCustomColor ? 'inline' : 'none';

    // Toggle 023 layers
    if (layers.main023) layers.main023.style.display = hasCustomColor ? 'none' : 'inline';
    if (layers.colorize023) layers.colorize023.style.display = hasCustomColor ? 'inline' : 'none';

    if (hasCustomColor) {
        updateShockmountColor('body', stateManager.get().shockmount.colorValue);
    }
}

export function updateShockmountPinsPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const isBrass = stateManager.get().shockmountPins.variant === 'pins-brass' || stateManager.get().shockmountPins.variant === 'brass';

    const layers = {
        brass017: shockmountSvg.querySelector('#shockmount-017-pins-brass-group'),
        colorize017: shockmountSvg.querySelector('#feFlood8'),
        brass023: shockmountSvg.querySelector('#shockmount-023-pins-brass-group'),
        colorize023: shockmountSvg.querySelector('#feFlood8'),
    };

    // Toggle 017 layers
    if (layers.brass017) layers.brass017.style.display = isBrass ? 'inline' : 'none';
    // if (layers.colorize017) layers.colorize017.style.display = isBrass ? 'none' : 'inline';

    // Toggle 023 layers
    if (layers.brass023) layers.brass023.style.display = isBrass ? 'inline' : 'none';
    // if (layers.colorize023) layers.colorize023.style.display = isBrass ? 'none' : 'inline';

    if (!isBrass) {
        updateShockmountColor('pins', stateManager.get().shockmountPins.colorValue);
    }
}

import { eventRegistry } from '../core/events.js';

// ... (rest of imports)

// ... (rest of file)

function initShockmountEventListeners() {
    eventRegistry.add(document.getElementById('shockmount-switch'), 'change', toggleShockmount);

    document.querySelectorAll('#shockmount-options-section .variant-item').forEach(item => {
        eventRegistry.add(item, 'click', () => handleShockmountVariantSelection(item.dataset.variant));
    });

    document.querySelectorAll('#shockmount-pins-options-section .variant-item').forEach(item => {
        eventRegistry.add(item, 'click', () => handleShockmountPinSelection(item.dataset.variant));
    });
}
