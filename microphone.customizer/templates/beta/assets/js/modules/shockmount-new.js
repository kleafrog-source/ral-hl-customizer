// ============================================
// SHOCKMOUNT MODULE (HL Data Oriented)
// ============================================

import { stateManager } from '../core/state.js';
import { eventRegistry } from '../core/events.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';
import { debugSVGState, debugSVGLayers } from '../debug.js';
import { switchPreview } from './accessories.js';
import { applyColorToSection, getColorDataFromOption, normalizeToRgbString } from './color-utils.js';
import { getModelData } from '../config.js';
import { getOptionsForSection, getRalColorById } from './hl-data-manager.js';

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

    // Get current model from HL data
    const currentModelCode = stateManager.get('currentModelCode') || '023-the-bomblet';
    const modelData = getModelData(currentModelCode);
    const isBomblet = currentModelCode === '023-the-bomblet';
    
    // Get shockmount info from HL data
    const shockmountInfo = stateManager.get('shockmount') || {};
    const isEnabled = shockmountInfo.enabled || false;
    
    if (isBomblet) {
        // Для 023-the-bomblet показываем toggle для подвеса
        if (shockmountToggle) shockmountToggle.style.display = 'flex';
        if (switchContainer) switchContainer.style.display = 'flex';
        if (includedText) includedText.style.display = 'none';
        
        // Показываем секции только если включен toggle
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

export function updateShockmountLayers(currentState = null) {
    const shockmountSVG = document.getElementById('shockmount-svg');
    if (!shockmountSVG) return;

    const state = currentState || stateManager.get();
    const currentModelCode = state.currentModelCode;
    
    // Get target layer ID based on model code from Bitrix data
    const modelData = getModelData(currentModelCode);
    const is023Series = currentModelCode && currentModelCode.includes('023');
    const targetLayerId = is023Series ? 'layer10' : 'layer9';
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

/**
 * Handle shockmount variant selection using HL data
 */
export function handleShockmountVariantSelection(variant) {
    const section = document.getElementById('shockmount-options-section');
    if (section) {
        section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));

        // Ищем элемент с учетом префиксов
        let target = section.querySelector(`[data-variant="shock-${variant}"]`);
        if (!target) {
            target = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (target) target.classList.add('selected');
    }

    // Also deselect custom color from palette
    const shockmountPalette = document.getElementById('pal-shockmount');
    if (shockmountPalette) {
        shockmountPalette.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
    }

    // Get HL options for shockmount section
    const sectionOptions = getOptionsForSection('shockmount');
    const selectedOption = sectionOptions.find(opt => opt.UF_VARIANT_CODE === variant);
    
    if (!selectedOption) {
        console.warn(`[Shockmount] Option not found for variant ${variant}`);
        return;
    }

    // Prepare option data using HL structure
    const optionData = getColorDataFromOption(selectedOption);

    // Update state using batch operation
    const batchSet = stateManager.startBatch();
    batchSet('shockmount.variant', variant);
    batchSet('shockmount.color', selectedOption.UF_RAL_COLOR_ID || null);
    batchSet('shockmount.colorValue', selectedOption.RAL_DATA?.UF_HEX || null);
    batchSet('shockmount.colorName', selectedOption.RAL_DATA?.UF_NAME || null);
    batchSet('shockmount.isRal', selectedOption.UF_IS_RAL === 1);
    batchSet('shockmount.isFree', selectedOption.UF_IS_FREE === 1);
    batchSet('shockmount.price', selectedOption.UF_PRICE || 0);
    batchSet('shockmount.name', selectedOption.UF_VARIANT_NAME);
    batchSet('shockmount.modelId', selectedOption.UF_MODEL_ID || null);
    
    // Update SVG fields from HL data
    batchSet('shockmount.svgTargetMode', selectedOption.svgTargetMode);
    batchSet('shockmount.svgLayerGroup', selectedOption.svgLayerGroup);
    batchSet('shockmount.svgFilterId', selectedOption.svgFilterId);
    batchSet('shockmount.svgSpecialKey', selectedOption.svgSpecialKey);
    
    stateManager.endBatch();

    // Apply changes using new color utils
    applyColorToSection('shockmount', optionData);
    
    // Update preview
    updateShockmountPreview();
}

/**
 * Handle shockmount color selection using HL data
 */
export function handleShockmountColorSelection(color, ralName) {
    const section = document.getElementById('shockmount-options-section');
    if (section) {
        section.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));
    }

    // Get RAL color data from HL
    const ralColorData = getRalColorById(ralName);
    if (!ralColorData) {
        console.warn(`[Shockmount] RAL color not found: ${ralName}`);
        return;
    }

    // Get shockmount options from HL data
    const sectionOptions = getOptionsForSection('shockmount');
    const ralOption = sectionOptions.find(opt => opt.UF_IS_RAL && opt.UF_RAL_COLOR_ID == ralName);
    
    if (!ralOption) {
        console.warn(`[Shockmount] RAL option not found for RAL ${ralName}`);
        return;
    }

    // Prepare color data using HL structure
    const colorData = getColorDataFromOption(ralOption);
    colorData.colorValue = color; // Override with actual hex color
    colorData.colorName = `RAL ${ralName}`;

    // Update state using batch operation
    const batchSet = stateManager.startBatch();
    batchSet('shockmount.variant', 'ral');
    batchSet('shockmount.color', ralName);
    batchSet('shockmount.colorValue', color);
    batchSet('shockmount.colorName', `RAL ${ralName}`);
    batchSet('shockmount.isRal', true);
    batchSet('shockmount.price', ralOption.UF_PRICE || 0);
    batchSet('shockmount.name', ralOption.UF_VARIANT_NAME);
    
    // Update SVG fields from HL data
    batchSet('shockmount.svgTargetMode', ralOption.svgTargetMode);
    batchSet('shockmount.svgLayerGroup', ralOption.svgLayerGroup);
    batchSet('shockmount.svgFilterId', ralOption.svgFilterId);
    batchSet('shockmount.svgSpecialKey', ralOption.svgSpecialKey);
    
    stateManager.endBatch();

    // Apply changes using new color utils
    applyColorToSection('shockmount', colorData);
    
    // Update preview
    updateShockmountPreview();
}

/**
 * Handle shockmount pin selection using HL data
 */
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

    // Get HL options for pins section
    const sectionOptions = getOptionsForSection('shockmountPins');
    let selectedOption;

    if (variant === 'custom') {
        // Handle custom RAL color selection
        const ralColorData = getRalColorById(ralName);
        if (!ralColorData) {
            console.warn(`[Shockmount Pins] RAL color not found: ${ralName}`);
            return;
        }

        selectedOption = sectionOptions.find(opt => opt.UF_IS_RAL && opt.UF_RAL_COLOR_ID == ralName);
        
        if (!selectedOption) {
            console.warn(`[Shockmount Pins] RAL option not found for RAL ${ralName}`);
            return;
        }

        // Select the swatch in palette
        const targetSwatch = pinsPalette?.querySelector(`[data-ral="${ralName}"]`);
        if (targetSwatch) targetSwatch.classList.add('selected');
    } else {
        // Handle predefined variant selection
        selectedOption = sectionOptions.find(opt => opt.UF_VARIANT_CODE === variant);
        
        if (!selectedOption) {
            console.warn(`[Shockmount Pins] Option not found for variant ${variant}`);
            return;
        }
    }

    // Prepare option data using HL structure
    const optionData = getColorDataFromOption(selectedOption);
    if (variant === 'custom') {
        optionData.colorValue = color; // Override with actual hex color
        optionData.colorName = `RAL ${ralName}`;
    }

    // Update state using batch operation
    const batchSet = stateManager.startBatch();
    batchSet('shockmountPins.variant', variant);
    batchSet('shockmountPins.color', selectedOption.UF_RAL_COLOR_ID || null);
    batchSet('shockmountPins.colorValue', selectedOption.RAL_DATA?.UF_HEX || color || null);
    batchSet('shockmountPins.colorName', selectedOption.RAL_DATA?.UF_NAME || `RAL ${ralName}` || null);
    batchSet('shockmountPins.isRal', selectedOption.UF_IS_RAL === 1);
    batchSet('shockmountPins.isFree', selectedOption.UF_IS_FREE === 1);
    batchSet('shockmountPins.price', selectedOption.UF_PRICE || 0);
    batchSet('shockmountPins.name', selectedOption.UF_VARIANT_NAME);
    batchSet('shockmountPins.modelId', selectedOption.UF_MODEL_ID || null);
    
    // Update SVG fields from HL data
    batchSet('shockmountPins.svgTargetMode', selectedOption.svgTargetMode);
    batchSet('shockmountPins.svgLayerGroup', selectedOption.svgLayerGroup);
    batchSet('shockmountPins.svgFilterId', selectedOption.svgFilterId);
    batchSet('shockmountPins.svgSpecialKey', selectedOption.svgSpecialKey);
    
    stateManager.endBatch();

    // Apply changes using new color utils
    applyColorToSection('pins', optionData);
    
    // Select UI element
    const target = section.querySelector(`[data-variant="${variant}"]`);
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
    const currentModelCode = currentState.currentModelCode || '023-the-bomblet';
    const modelData = getModelData(currentModelCode);
    const is023Series = currentModelCode && currentModelCode.includes('023');
    const pinsState = currentState.shockmountPins;

    // Debug logging
    debugSVGState('shockmountPins', pinsState, 'updateShockmountPinsPreview start');

    // Get layer mapping for this pin variant
    let layerMapping = null;
    if (pinsState && pinsState.variant) {
        layerMapping = SECTION_LAYER_MAP.shockmountPins?.[pinsState.variant];
    }
    
    // Fallback for unknown variants - use default mapping
    if (!layerMapping) {
        const variantName = pinsState && pinsState.variant ? pinsState.variant : 'unknown';
        console.warn(`[Shockmount] No layer mapping found for pins variant: ${variantName}, using default mapping`);
        layerMapping = {
            originals: [],
            colorizedGroup: 'g3',
            monoGroup: 'g4',
            description: `Variant ${variantName} (default)`,
            colorizedFilter: 'filter9',
            monoFilter: 'filter13',
            floodFilter: 'feFlood8'
        };
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
    const isColorizedVariant = layerMapping.colorizedGroup && pinsState && (
        pinsState.variant.includes('RAL') || 
        pinsState.variant.includes('ral')
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
