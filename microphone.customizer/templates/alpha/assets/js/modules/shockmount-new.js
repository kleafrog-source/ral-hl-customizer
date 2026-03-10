import { stateManager } from '../core/state.js';
import { eventRegistry } from '../core/events.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';
import { debugSVGState, debugSVGLayers } from '../debug.js';
import { switchPreview } from './accessories.js';
import { normalizeToRgbString } from './color-utils.js';

// --- Private Helper Functions ---

function updateShockmountColor(part, hex) {
    // Safe check for undefined color values
    if (!hex) {
        console.warn('[updateShockmountColor] No color value for part', { part, hex });
        return;
    }
    
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    // Use centralized normalization from color-utils
    const rgbString = normalizeToRgbString(hex);
    if (!rgbString) {
        console.warn('[updateShockmountColor] Failed to normalize color value', { part, hex });
        return;
    }
    
    const floodId = part === 'body' ? 'feFlood6' : 'feFlood8';

    const el = shockmountSvg.querySelector(`#${floodId}`);
    if (el) {
        // Debug logging to verify the actual value being set
        console.log('[DEBUG flood-color shockmount]', {
            filterId: floodId,
            part,
            rawColorValue: hex,
            appliedValue: rgbString
        });
        
        el.setAttribute('flood-color', rgbString);
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
    const shockmountPinsMenuItem = document.getElementById('pins-menu-item');
    const shockmountOptionsSection = document.getElementById('shockmount-options-section');
    const switchContainer = document.getElementById('shockmount-switch-container');
    const includedText = document.getElementById('shockmount-included-text');
    const shockmountToggle = document.getElementById('shockmount-toggle');

    if (!shockmountMenuItem) return;

    const currentVariant = stateManager.get('variant') || '023-the-bomblet';
    const isBomblet = currentVariant === '023-the-bomblet';
    
    if (isBomblet) {
        // Для 023-the-bomblet показываем toggle для подвеса
        if (shockmountToggle) shockmountToggle.style.display = 'flex';
        if (switchContainer) switchContainer.style.display = 'flex';
        if (includedText) includedText.style.display = 'none';
        
        // Показываем секции только если включен toggle
        const isEnabled = stateManager.get('shockmount.enabled') || false;
        if (shockmountMenuItem) shockmountMenuItem.style.display = isEnabled ? 'flex' : 'none';
        if (shockmountPinsMenuItem) shockmountPinsMenuItem.style.display = isEnabled ? 'flex' : 'none';
        if (shockmountOptionsSection) shockmountOptionsSection.style.display = isEnabled ? 'block' : 'none';
        
        // Устанавливаем состояние переключателя
        const shockmountSwitch = document.getElementById('shockmount-switch');
        if (shockmountSwitch) shockmountSwitch.checked = isEnabled;
        
    } else {
        // Для остальных моделей скрываем toggle и показываем подвес по умолчанию
        if (shockmountToggle) shockmountToggle.style.display = 'none';
        if (switchContainer) switchContainer.style.display = 'none';
        if (includedText) includedText.style.display = 'none';
        
        // Всегда показываем секции подвеса (включен в базовую цену)
        if (shockmountMenuItem) shockmountMenuItem.style.display = 'flex';
        if (shockmountPinsMenuItem) shockmountPinsMenuItem.style.display = 'flex';
        if (shockmountOptionsSection) shockmountOptionsSection.style.display = 'block';
        
        // Устанавливаем enabled=true для остальных моделей
        if (stateManager.get('shockmount.enabled') !== true) {
            stateManager.set('shockmount.enabled', true);
        }
    }

    // Переключаем превью если нужно
    if (!stateManager.get('shockmount.enabled') && document.querySelector('.preview-switch-btn.active')?.dataset.preview === 'shockmount') {
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
    '017-tube': 'layer10', 
    '017-fet': 'layer10',
    '023-the-bomblet': 'layer9',
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

//Специальная функция для shockmount секции
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

    //Сохраняет выбранный бесплатный RAL вариант
    stateManager.set('shockmount.variant', variant);
    // Price will be calculated by price calculator based on shockmount.enabled state

    //Применяет изменения к SVG элементам подвеса
    updateShockmountPreview();
}

export function handleShockmountColorSelection(color, ralName) {
    const section = document.getElementById('shockmount-options-section');
    section.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));

    stateManager.set('shockmount.variant', 'custom');
    stateManager.set('shockmount.color', `RAL ${ralName}`);
    stateManager.set('shockmount.colorValue', color);
    // Price will be calculated by price calculator based on shockmount.enabled state

    updateShockmountPreview();
}

//Универсальная функция для бесплатных и платных вариантов
export function handleShockmountPinSelection(variant, color = null, ralName = null) {
    const section = document.getElementById('pins-options-section');
    if (!section) {
        console.error('pins-options-section not found');
        return;
    }
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));
    
    const pinsPalette = document.getElementById('pal-pins');
    if (pinsPalette) {
        pinsPalette.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
    }

    const currentState = stateManager.get();
    const currentVariant = currentState.variant || '023-the-bomblet';
    const is023Series = currentVariant.includes('023');

    // Handle different pin variants
    if (variant === 'pins-brass') {
        stateManager.set('shockmountPins', { 
            variant: 'pins-brass', 
            material: 'brass', 
            colorValue: '#EAE0C8', 
            colorName: 'Polished Brass' 
        });
    } else if (variant === 'pins-ral9006-free') {
        // RAL 9006 uses brass layer with grayscale filter
        stateManager.set('shockmountPins', { 
            variant: 'pins-ral9006-free', 
            material: 'aluminum', 
            colorValue: '#9A9D9D', 
            colorName: 'RAL 9006' 
        });
    } else if (variant.includes('RAL') && variant.includes('-free')) {
        // Other free RAL variants with proper RAL prefix
        const ralCode = variant.replace('pins-RAL', '').replace('-free', '');
        const colors = { '9010': '#EFEEE5', '1013': '#DFDBC7', '9005': '#131516' };
        stateManager.set('shockmountPins', { 
            variant: variant, 
            material: 'ral', 
            colorValue: colors[ralCode], 
            colorName: `RAL ${ralCode}` 
        });
    } else if (variant === 'custom') {
        // Paid custom RAL
        stateManager.set('shockmountPins', { 
            variant: 'pins-ral-custom', 
            material: 'custom', 
            colorValue: color, 
            colorName: `RAL ${ralName}` 
        });
        const targetSwatch = document.getElementById('pal-pins')?.querySelector(`[data-ral="${ralName}"]`);
        if(targetSwatch) targetSwatch.classList.add('selected');
    }

    // Select UI element
    let target = section.querySelector(`[data-variant="${variant}"]`);
    if (target) target.classList.add('selected');

    // Apply changes to SVG
    updateShockmountPinsPreview();
}

export function updateShockmountPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    //Определяет использовать ли бесплатный или платный цвет
    const hasCustomColor = !!stateManager.get().shockmount.colorValue;

    const layers = {
        main017: shockmountSvg.querySelector('#shockmount-017-pins-brass-group'),
        colorize017: shockmountSvg.querySelector('#feFlood6'),
        main023: shockmountSvg.querySelector('#shockmount-023-pins-brass-group'),
        colorize023: shockmountSvg.querySelector('#feFlood6'),
    };

    // Toggle 017 layers
    //Показывает оригинальный слой для бесплатных вариантов
    if (layers.main017) layers.main017.style.display = hasCustomColor ? 'none' : 'inline';
    if (layers.colorize017) layers.colorize017.style.display = hasCustomColor ? 'inline' : 'none';

    // Toggle 023 layers
    //Показывает оригинальный слой для бесплатных вариантов
    if (layers.main023) layers.main023.style.display = hasCustomColor ? 'none' : 'inline';
    if (layers.colorize023) layers.colorize023.style.display = hasCustomColor ? 'inline' : 'none';

    if (hasCustomColor) {
        //устанавливает flood-color в feFlood6 с hex значением
        updateShockmountColor('body', stateManager.get().shockmount.colorValue);
    }
}

export function updateShockmountPinsPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const currentState = stateManager.get();
    const currentVariant = currentState.variant || '023-the-bomblet';
    const is023Series = currentVariant.includes('023');
    const pinsState = currentState.shockmountPins;

    // Debug logging
    debugSVGState('shockmountPins', pinsState, 'updateShockmountPinsPreview start');

    // Get layer mapping for this pin variant
    const layerMapping = SECTION_LAYER_MAP.shockmountPins?.[pinsState?.variant];
    if (!layerMapping) {
        console.warn(`[Shockmount] No layer mapping found for pins variant: ${pinsState?.variant}`);
        return;
    }

    const pinLayers = {
        brass017: shockmountSvg.querySelector('#shockmount-017-pins-brass-group'),
        brass023: shockmountSvg.querySelector('#shockmount-023-pins-brass-group'),
        colorize017: shockmountSvg.querySelector('#g3'),
        colorize023: shockmountSvg.querySelector('#g13'),
        mono017: shockmountSvg.querySelector('#g4'),
        mono023: shockmountSvg.querySelector('#g13-2'),
        colorize: shockmountSvg.querySelector('#feFlood8')
    };

    const layerChanges = [];

    // Reset all filters first
    if (pinLayers.brass017) pinLayers.brass017.style.filter = 'none';
    if (pinLayers.brass023) pinLayers.brass023.style.filter = 'none';

    // Handle brass layers (for brass and RAL 9006 variants)
    if (layerMapping.originals) {
        const isBrassVariant = pinsState?.variant === 'pins-brass';
        const isRal9006Variant = pinsState?.variant === 'pins-ral9006-free';
        
        if (pinLayers.brass017) {
            const display = (isBrassVariant || isRal9006Variant) ? 'inline' : 'none';
            pinLayers.brass017.style.display = display;
            layerChanges.push({ id: 'shockmount-017-pins-brass-group', display });
            
            // Apply grayscale filter for RAL 9006
            if (isRal9006Variant) {
                pinLayers.brass017.style.filter = 'grayscale(1)';
            }
        }
        
        if (pinLayers.brass023) {
            const display = (isBrassVariant || isRal9006Variant) ? 'inline' : 'none';
            pinLayers.brass023.style.display = display;
            layerChanges.push({ id: 'shockmount-023-pins-brass-group', display });
            
            // Apply grayscale filter for RAL 9006
            if (isRal9006Variant) {
                pinLayers.brass023.style.filter = 'grayscale(1)';
            }
        }
    }

    // Handle colorized layers (for RAL variants)
    const isColorizedVariant = layerMapping.colorizedGroup && (
        pinsState?.variant?.includes('RAL') || 
        pinsState?.variant?.includes('ral')
    );
    
    if (isColorizedVariant) {
        // Show colorized layers for both 017 and 023 series
        if (pinLayers.colorize017) {
            pinLayers.colorize017.style.display = 'inline';
            layerChanges.push({ id: 'g3', display: 'inline' });
        }
        if (pinLayers.colorize023) {
            pinLayers.colorize023.style.display = 'inline';
            layerChanges.push({ id: 'g13', display: 'inline' });
        }
        
        // Set flood color for RAL variants
        if (pinsState?.colorValue) {
            updateShockmountColor('pins', pinsState.colorValue);
        }
        layerChanges.push({ id: 'feFlood8', display: 'active' });
    } else {
        // Hide colorized layers
        if (pinLayers.colorize017) {
            pinLayers.colorize017.style.display = 'none';
            layerChanges.push({ id: 'g3', display: 'none' });
        }
        if (pinLayers.colorize023) {
            pinLayers.colorize023.style.display = 'none';
            layerChanges.push({ id: 'g13', display: 'none' });
        }
        
        // Hide mono layers
        if (pinLayers.mono017) {
            pinLayers.mono017.style.display = 'none';
            layerChanges.push({ id: 'g4', display: 'none' });
        }
        if (pinLayers.mono023) {
            pinLayers.mono023.style.display = 'none';
            layerChanges.push({ id: 'g13-2', display: 'none' });
        }
    }

    // Debug layer changes
    debugSVGLayers(layerChanges, 'updateShockmountPinsPreview');
}

function initShockmountEventListeners() {
    eventRegistry.add(document.getElementById('shockmount-switch'), 'change', toggleShockmount);

    document.querySelectorAll('#shockmount-options-section .variant-item').forEach(item => {
        //Навешивается на элементы в quick-select-shockmount
        eventRegistry.add(item, 'click', () => handleShockmountVariantSelection(item.dataset.variant));
    });
    //Навешивается на элементы в quick-select-shockmount-pins - Пины подвеса
    document.querySelectorAll('#pins-options-section .variant-item').forEach(item => {
        eventRegistry.add(item, 'click', () => handleShockmountPinSelection(item.dataset.variant));
    });
}
