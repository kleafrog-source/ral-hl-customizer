// ============================================
// APPEARANCE MODULE (HL Data Oriented)
// ============================================

import { stateManager } from '../core/state.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';
import { handleShockmountColorSelection, handleShockmountPinSelection } from './shockmount-new.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';
import { applyColorToSection, getColorDataFromOption, normalizeToRgbString } from './color-utils.js';
import { isMalfaMic, isMalfaLogo } from './logo.js';
import { getOptionsForSection, getRalColorById } from './hl-data-manager.js';
import { CONFIG } from '../config.js';

// Function to update logo preview
function updateLogoPreview() {
    updateSVG();
}

// Function to update SVG logo elements based on variant
function updateLogoSVG(variant) {
    // Delegate all MALFA logo logic to logo.js
    // updateLogoFromLogoModule(); // Not needed here, engine.js calls it
}

/**
 * Initialize palettes using HL data
 */
export function initPalettes() {
    const hlData = window.CUSTOMIZER_DATA;
    if (!hlData) return;
    
    const ralPalette = hlData.ralColors || {};
    const viewTypeMap = hlData.viewTypeMap || {};
    
    // Get all sections that have RAL options enabled from the mapping
    Object.values(viewTypeMap).forEach(section => {
        // We use IDs for palettes in template like: logobg-swatches, spheres-swatches etc
        // Check both variants (pal- and -swatches) used in template.php
        let container = document.getElementById('pal-' + section) || document.getElementById(section + '-swatches');
        
        if (!container) return; 
        container.innerHTML = '';

        for (let [id, colorData] of Object.entries(ralPalette)) {
            const name = colorData.UF_CODE;
            const color = colorData.UF_HEX;

            // Optional: filter certain colors for certain sections if needed
            // if (section === 'body' && name === '1013') continue;

            let div = document.createElement('div');
            div.className = 'swatch';
            div.style.backgroundColor = color;
            div.title = `RAL ${name}`;
            div.dataset.color = color;
            div.dataset.ral = name;

            div.setAttribute('role', 'button');
            div.setAttribute('tabindex', '0');
            div.setAttribute('aria-label', `RAL ${name} ${color}`);
            div.setAttribute('aria-pressed', 'false');

            div.onclick = () => handleColorSelection(section, color, name);

            div.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleColorSelection(section, color, name);
                }
            };

            container.appendChild(div);
        }
    });
}

export function togglePalette(section) {
    const wrapper = document.getElementById(`palette-wrapper-${section}`);
    const toggleBtn = wrapper?.previousElementSibling;
    
    const submenuId = section === 'pins' ? 'submenu-pins' : `submenu-${section}`;
    const submenu = document.getElementById(submenuId);
    
    if (!wrapper || !toggleBtn || !submenu) {
        return;
    }

    const isOpen = wrapper.classList.contains('open');
    
    // Close all other palettes
    document.querySelectorAll('.palette-wrapper').forEach(p => {
        p.classList.remove('open');
        const btn = p.previousElementSibling;
        if (btn && btn.classList.contains('palette-toggle-btn')) {
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
    
    if (!isOpen) {
        wrapper.classList.add('open');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
        wrapper.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Initialize all palette wrappers to be closed by default
 */
export function initPaletteWrappers() {
    document.querySelectorAll('.palette-wrapper').forEach(wrapper => {
        wrapper.classList.remove('open');
        const toggleBtn = wrapper.previousElementSibling;
        if (toggleBtn && toggleBtn.classList.contains('palette-toggle-btn')) {
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Handle color selection using HL data
 */
export function handleColorSelection(section, color, ralName) {
    const ralLabel = `RAL ${ralName}`;

    let swatchContainer;
    if (section === 'pins') {
        swatchContainer = document.getElementById('pal-pins').parentElement;
    } else if (section === 'logobg') {
        swatchContainer = document.getElementById('pal-logobg').parentElement;
    } else {
        swatchContainer = document.getElementById('submenu-' + section);
    }

    if (!swatchContainer) return;

    // Update ARIA and Visuals
    swatchContainer.querySelectorAll('.swatch').forEach(s => {
        s.classList.remove('selected');
        s.setAttribute('aria-pressed', 'false');
    });
    const targetSwatch = swatchContainer.querySelector(`.swatch[data-ral="${ralName}"]`);
    if (targetSwatch) {
        targetSwatch.classList.add('selected');
        targetSwatch.setAttribute('aria-pressed', 'true');
    }

    // Get RAL color data from HL
    const ralColorData = getRalColorById(ralName);
    if (!ralColorData) {
        console.warn(`[Appearance] RAL color not found: ${ralName}`);
        return;
    }

    // Get current section options from HL data
    const sectionOptions = getOptionsForSection(section);
    const ralOption = sectionOptions.find(opt => opt.UF_IS_RAL && opt.UF_RAL_COLOR_ID == ralName);
    
    if (!ralOption) {
        console.warn(`[Appearance] RAL option not found for section ${section}, RAL ${ralName}`);
        return;
    }

    // Prepare color data using HL structure
    const colorData = getColorDataFromOption(ralOption);
    colorData.colorValue = color; // Override with actual hex color
    colorData.colorName = ralLabel;

    // Start batch operation to prevent multiple renders
    const batchSet = stateManager.startBatch();
    
    // Update state based on section type
    if (section === 'spheres' || section === 'body') {
        // Set variant to 'ral' for RAL colors
        batchSet(`${section}.variant`, 'ral');
        batchSet(`${section}.color`, ralName);
        batchSet(`${section}.colorValue`, color);
        batchSet(`${section}.colorName`, ralLabel);
        batchSet(`${section}.isRal`, true);
        batchSet(`${section}.price`, ralOption.UF_PRICE || 0);
        batchSet(`${section}.name`, ralOption.UF_VARIANT_NAME);
        
        // Update SVG fields from HL data
        batchSet(`${section}.svgTargetMode`, ralOption.svgTargetMode);
        batchSet(`${section}.svgLayerGroup`, ralOption.svgLayerGroup);
        batchSet(`${section}.svgFilterId`, ralOption.svgFilterId);
        batchSet(`${section}.svgSpecialKey`, ralOption.svgSpecialKey);

        // Apply color using new color utils
        applyColorToSection(section, colorData);

    } else if (section === 'logobg') {
        // Handle logo background
        batchSet('logobg.color', ralName);
        //сохраняет hex значения RAL цвета в state.logobg.colorValue
        batchSet('logobg.colorValue', color);
        // Добавляет +500р за платный RAL цвет фона логотипа
        batchSet('prices.logobg', CONFIG.optionPrice);

        // Apply color using new color utils
        applyColorToSection('logobg', colorData);
        
        // Update SVG visualization
        updateSVG();

    } else if (section === 'shockmount') {
        // Handle shockmount color using HL data
        handleShockmountColorSelection(color, ralName);
        
        // Set price from HL data
        batchSet('prices.shockmount', ralOption.UF_PRICE || 0);
        
    } else if (section === 'pins') {
        // Handle pins color using HL data
        handleShockmountPinSelection('custom', color, ralName);
        
        // Set price from HL data
        batchSet('prices.shockmount', ralOption.UF_PRICE || 0);
    }
    
    // End batch and apply all changes at once
    stateManager.endBatch();
    
    // Update UI once after all changes
    updateUI();
}

/**
 * Update section layers using HL data configuration
 */
export function updateSectionLayers(section, state) {
    const svg = document.querySelector('#microphone-svg-container svg');
    if (!svg || section === 'logobg') return;
    
    // Use HL data for SVG configuration
    const svgTargetMode = state.svgTargetMode;
    const svgLayerGroup = state.svgLayerGroup;
    const svgFilterId = state.svgFilterId;

    // Apply based on SVG target mode from HL data
    switch (svgTargetMode) {
        case 'original':
            applyOriginalMode(svg, section, svgLayerGroup);
            break;
        case 'filter':
            applyFilterMode(svg, section, svgFilterId, state);
            break;
        case 'gradient':
            applyGradientMode(svg, section, state);
            break;
        default:
            // Fallback to colorized mode using SECTION_LAYER_MAP
            applyColorizedMode(svg, section, state);
            break;
    }
}

/**
 * Apply original mode - show only specific original layer
 */
function applyOriginalMode(svg, section, svgLayerGroup) {
    // Hide all original layers for this section
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.originals && Array.isArray(config.originals)) {
                config.originals.forEach(layerId => {
                    const layer = svg.querySelector(`#${layerId}`);
                    if (layer) {
                        layer.style.display = 'none';
                    }
                });
            }
        });
    }

    // Show only the specified original layer
    if (svgLayerGroup) {
        const targetLayer = svg.querySelector(`#${svgLayerGroup}`);
        if (targetLayer) {
            targetLayer.style.display = 'inline';
            targetLayer.style.setProperty('display', 'inline', 'important');
        }
    }

    // Hide colorized layers
    hideColorizedLayers(svg, section);
}

/**
 * Apply filter mode - use SVG filters
 */
function applyFilterMode(svg, section, svgFilterId, state) {
    if (!svgFilterId || !state.colorValue) return;

    // Show colorized layers
    showColorizedLayers(svg, section);

    // Apply flood filter
    const floodFilter = svg.querySelector(`#${svgFilterId}`);
    if (floodFilter) {
        const floodElement = floodFilter.querySelector('feFlood');
        if (floodElement) {
            floodElement.setAttribute('flood-color', state.colorValue);
        }
    }
}

/**
 * Apply gradient mode (placeholder for future implementation)
 */
function applyGradientMode(svg, section, state) {
    // TODO: Implement gradient mode
    applyColorizedMode(svg, section, state);
}

/**
 * Apply colorized mode - standard colorization using SECTION_LAYER_MAP
 */
function applyColorizedMode(svg, section, state) {
    const mapping = SECTION_LAYER_MAP[section]?.[state.variant];
    if (!mapping) {
        console.warn(`[Appearance] No mapping found for ${section} variant: ${state.variant}`);
        return;
    }

    const originalGroup = svg.querySelector(`#${section}-original`);
    const colorGroup = svg.querySelector(`#${section}-colorized`);
    const monoGroup = svg.querySelector(`#${section}-monochrome`);

    // Handle standard layers
    const isCustomRal = state.variant.includes('ral-custom');

    // Hide all first
    for (let i = 1; i <= 4; i++) {
        const origImg = svg.querySelector(`#${section}-original-${i}`);
        const colorImg = svg.querySelector(`#${section}-color-${i}`);
        const monoImg = svg.querySelector(`#${section}-mono-${i}`);
        if (origImg) origImg.style.display = 'none';
        if (colorImg) colorImg.style.display = 'none';
        if (monoImg) monoImg.style.display = 'none';
    }

    if (isCustomRal) {
        if (originalGroup) originalGroup.style.display = 'none';
        if (colorGroup) colorGroup.style.display = 'inline';
        if (monoGroup) monoGroup.style.display = 'inline';

        // Show correct color/mono images for the base variant we're colorizing
        const baseIndex = 1;
        const colorImg = svg.querySelector(`#${section}-color-${baseIndex}`);
        const monoImg = svg.querySelector(`#${section}-mono-${baseIndex}`);
        if (colorImg) colorImg.style.display = 'inline';
        if (monoImg) monoImg.style.display = 'inline';

        updateFilter(`feFlood${section === 'spheres' ? '1' : section === 'body' ? '2' : '3'}`, section, state.colorValue);
    } else {
        if (originalGroup) originalGroup.style.display = 'inline';
        if (colorGroup) colorGroup.style.display = 'none';
        if (monoGroup) monoGroup.style.display = 'none';

        // Show specified original layers
        mapping.originals.forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'inline';
        });
    }
}

/**
 * Show colorized layers for section
 */
function showColorizedLayers(svg, section) {
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.colorizedGroup) {
                const layer = svg.querySelector(`#${config.colorizedGroup}`);
                if (layer) {
                    layer.style.display = 'inline';
                }
            }
            if (config.monoGroup) {
                const layer = svg.querySelector(`#${config.monoGroup}`);
                if (layer) {
                    layer.style.display = 'inline';
                }
            }
        });
    }

    // Hide original layers
    hideOriginalLayers(svg, section);
}

/**
 * Hide colorized layers for section
 */
function hideColorizedLayers(svg, section) {
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.colorizedGroup) {
                const layer = svg.querySelector(`#${config.colorizedGroup}`);
                if (layer) {
                    layer.style.display = 'none';
                }
            }
            if (config.monoGroup) {
                const layer = svg.querySelector(`#${config.monoGroup}`);
                if (layer) {
                    layer.style.display = 'none';
                }
            }
        });
    }
}

/**
 * Hide original layers for section
 */
function hideOriginalLayers(svg, section) {
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.originals && Array.isArray(config.originals)) {
                config.originals.forEach(layerId => {
                    const layer = svg.querySelector(`#${layerId}`);
                    if (layer) {
                        layer.style.display = 'none';
                    }
                });
            }
        });
    }
}

export function getCorrectiveFilters(hex) {
    // Removed brightness/contrast filters as they interfere with SVG filter balance
    return '';
}

export function calculateLuminance(hex) {
    const rgb = hexToRgbValues(hex);
    if (!rgb) return 0;
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

export function updateFilter(filterId, section, hex) {
    // Skip color update if no color value provided (especially for logobg on init)
    if (!hex) {
        if (section === 'logobg') {
            // Silent skip for logobg when no color is set yet
            return;
        }
        console.warn('[updateFilter] No color value for section', { section, hex });
        return;
    }
    
    // Use centralized normalization from color-utils
    const rgbString = normalizeToRgbString(hex);
    if (!rgbString) {
        console.warn('[updateFilter] Failed to normalize color value', { section, hex });
        return;
    }
    
    let id = (section === 'logobg') ? 'feFlood-logobg-color' : `feFlood-${section}-color`;
    
    const el = document.querySelector(`#${id}`);
    if (el) {
        // Debug logging to verify the actual value being set
        console.log('[DEBUG flood-color appearance-new]', {
            filterId: id,
            section,
            rawColorValue: hex,
            appliedValue: rgbString
        });
        
        el.setAttribute('flood-color', rgbString);
    }
}

export function hexToRgbValues(hex) {
    if (!hex) return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

/**
 * Handle style selection using HL data
 */
export function handleStyleSelection(section, variant) {
    const submenu = document.getElementById('submenu-' + section);
    
    // Clear all variant selections in this section
    if (submenu) {
        submenu.querySelectorAll('.variant-item').forEach(i => {
            i.classList.remove('selected');
            i.setAttribute('aria-selected', 'false');
        });

        // Clear palette selections when variant is selected
        submenu.querySelectorAll('.swatch').forEach(s => {
            s.classList.remove('selected');
            s.setAttribute('aria-pressed', 'false');
        });

        const selected = submenu.querySelector(`[data-variant="${variant}"]`);
        if (selected) {
            selected.classList.add('selected');
            selected.setAttribute('aria-selected', 'true');
        }
    }

    // Get HL options for this section
    const sectionOptions = getOptionsForSection(section);
    const selectedOption = sectionOptions.find(opt => opt.UF_VARIANT_CODE === variant);
    
    if (!selectedOption) {
        console.warn(`[Appearance] Option not found for section ${section}, variant ${variant}`);
        return;
    }

    // Prepare option data using HL structure
    const optionData = getColorDataFromOption(selectedOption);

    // Update state using batch operation
    const batchSet = stateManager.startBatch();
    batchSet(`${section}.variant`, variant);
    batchSet(`${section}.color`, selectedOption.UF_RAL_COLOR_ID || null);
    batchSet(`${section}.colorValue`, selectedOption.RAL_DATA?.UF_HEX || null);
    batchSet(`${section}.colorName`, selectedOption.RAL_DATA?.UF_NAME || null);
    batchSet(`${section}.isRal`, selectedOption.UF_IS_RAL === 1);
    batchSet(`${section}.isFree`, selectedOption.UF_IS_FREE === 1);
    batchSet(`${section}.price`, selectedOption.UF_PRICE || 0);
    batchSet(`${section}.name`, selectedOption.UF_VARIANT_NAME);
    batchSet(`${section}.modelId`, selectedOption.UF_MODEL_ID || null);
    
    // Update SVG fields from HL data
    batchSet(`${section}.svgTargetMode`, selectedOption.svgTargetMode);
    batchSet(`${section}.svgLayerGroup`, selectedOption.svgLayerGroup);
    batchSet(`${section}.svgFilterId`, selectedOption.svgFilterId);
    batchSet(`${section}.svgSpecialKey`, selectedOption.svgSpecialKey);
    
    stateManager.endBatch();

    // Apply changes using new color utils
    applyColorToSection(section, optionData);
    
    // Update UI
    updateUI();
}

export function closePalette(section) {
    const wrapper = document.getElementById(`palette-wrapper-${section}`);
    const toggleBtn = wrapper?.previousElementSibling;
    
    if (wrapper && toggleBtn) {
        wrapper.classList.remove('open');
        toggleBtn.classList.remove('active');
    }
}
