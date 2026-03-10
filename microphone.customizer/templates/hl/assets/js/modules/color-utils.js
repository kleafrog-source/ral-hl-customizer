// ============================================
// COLOR UTILS (HL Data Oriented)
// ============================================

import { stateManager } from '../core/state.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';

/**
 * Apply color to SVG section based on HL data configuration
 * @param {string} section - Section key (spheres, body, logobg, shockmount, pins)
 * @param {object} colorData - Color data from HL structure
 */
export function applyColorToSection(section, colorData) {
    if (!colorData) {
        console.warn(`[Color Utils] No color data provided for section: ${section}`);
        return;
    }

    const svg = document.querySelector('#microphone-svg-container svg');
    if (!svg) return;

    // Apply color based on SVG target mode from HL data
    const svgTargetMode = colorData.svgTargetMode;
    
    switch (svgTargetMode) {
        case 'original':
            applyOriginalMode(svg, section, colorData);
            break;
        case 'filter':
            applyFilterMode(svg, section, colorData);
            break;
        case 'gradient':
            applyGradientMode(svg, section, colorData);
            break;
        default:
            // Fallback to colorized mode
            applyColorizedMode(svg, section, colorData);
            break;
    }

    // Update layer visibility
    updateSectionLayers(svg, section, colorData);
}

/**
 * Apply original mode - show only specified layer
 */
function applyOriginalMode(svg, section, colorData) {
    if (!colorData.svgLayerGroup) return;
    
    const layerIds = colorData.svgLayerGroup.split(',').map(id => id.trim());
    
    // Hide all layers first
    hideAllLayers(svg, section);
    
    // Show only specified layers
    layerIds.forEach(layerId => {
        const layer = svg.querySelector(`#${layerId}`);
        if (layer) {
            layer.style.display = 'inline';
        }
    });
}

/**
 * Apply filter mode - use SVG filter with color
 */
function applyFilterMode(svg, section, colorData) {
    if (!colorData.svgFilterId || !colorData.colorValue) return;
    
    // Use RGB value from HL data if available, otherwise convert hex
    const rgbValue = colorData.rgbValue || normalizeToRgbString(colorData.colorValue);
    
    if (rgbValue) {
        setFilterFloodColor(svg, colorData.svgFilterId, rgbValue);
    }
}

/**
 * Apply gradient mode - for future gradient effects
 */
function applyGradientMode(svg, section, colorData) {
    // TODO: Implement gradient effects
    console.log(`[Color Utils] Gradient mode not yet implemented for section: ${section}`);
}

/**
 * Apply colorized mode - direct color application
 */
function applyColorizedMode(svg, section, colorData) {
    if (!colorData.colorValue) return;
    
    const rgbValue = colorData.rgbValue || normalizeToRgbString(colorData.colorValue);
    
    if (rgbValue) {
        // Apply color to colorized layers
        const sectionConfig = SECTION_LAYER_MAP[section];
        if (sectionConfig) {
            Object.values(sectionConfig).forEach(config => {
                if (config.colorizedGroup) {
                    const layer = svg.querySelector(`#${config.colorizedGroup}`);
                    if (layer) {
                        layer.style.display = 'inline';
                        // Apply color to layer elements
                        const colorElements = layer.querySelectorAll('[fill], [stroke]');
                        colorElements.forEach(el => {
                            if (el.hasAttribute('fill')) {
                                el.setAttribute('fill', rgbValue);
                            }
                            if (el.hasAttribute('stroke')) {
                                el.setAttribute('stroke', rgbValue);
                            }
                        });
                    }
                }
            });
        }
    }
}

/**
 * Update section layers visibility
 */
function updateSectionLayers(svg, section, colorData) {
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (!sectionConfig) return;

    // Handle special cases
    if (colorData.svgSpecialKey === 'MALFA') {
        handleMALFAMode(svg, colorData);
    } else if (colorData.svgSpecialKey === 'woodcase') {
        handleWoodcaseMode(svg, colorData);
    } else if (colorData.svgSpecialKey === 'grayscale') {
        handleGrayscaleMode(svg, colorData);
    }
}

/**
 * Handle MALFA special mode
 */
function handleMALFAMode(svg, colorData) {
    const malfaLogo = svg.querySelector('#malfa-logo');
    if (malfaLogo) {
        malfaLogo.style.display = 'inline';
    }
}

/**
 * Handle woodcase special mode
 */
function handleWoodcaseMode(svg, colorData) {
    // TODO: Implement woodcase mode
    console.log('[Color Utils] Woodcase mode not yet implemented');
}

/**
 * Handle grayscale special mode
 */
function handleGrayscaleMode(svg, colorData) {
    // TODO: Implement grayscale mode
    console.log('[Color Utils] Grayscale mode not yet implemented');
}

/**
 * Hide all layers for a section
 */
function hideAllLayers(svg, section) {
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (!sectionConfig) return;

    Object.values(sectionConfig).forEach(config => {
        if (config.colorizedGroup) {
            const layer = svg.querySelector(`#${config.colorizedGroup}`);
            if (layer) layer.style.display = 'none';
        }
        if (config.monoGroup) {
            const layer = svg.querySelector(`#${config.monoGroup}`);
            if (layer) layer.style.display = 'none';
        }
    });
}

/**
 * Set flood color for SVG filter
 */
function setFilterFloodColor(svg, filterId, rgbValue) {
    const filterElement = svg.querySelector(`#${filterId}`);
    if (filterElement) {
        filterElement.setAttribute('flood-color', rgbValue);
        console.log('[DEBUG flood-color]', {
            filterId,
            appliedValue: rgbValue
        });
    } else {
        console.warn(`[Color Utils] Filter element not found: ${filterId}`);
    }
}

/**
 * Normalize color value to RGB string
 * In HL data we have both hex and rgb, so this is minimal conversion
 */
export function normalizeToRgbString(color) {
    if (!color) return null;
    
    // If already in rgb format
    if (color.startsWith('rgb(')) {
        return color;
    }
    
    // If hex, convert to rgb
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    return color;
}

/**
 * Get color data from HL option structure
 * @param {object} option - HL option with RAL data
 * @returns {object} Color data structure
 */
export function getColorDataFromOption(option) {
    return {
        colorValue: option.RAL_DATA?.UF_HEX || null,
        rgbValue: option.RAL_DATA?.UF_RGB || null,
        colorName: option.RAL_DATA?.UF_NAME || null,
        svgTargetMode: option.svgTargetMode || null,
        svgLayerGroup: option.svgLayerGroup || null,
        svgFilterId: option.svgFilterId || null,
        svgSpecialKey: option.svgSpecialKey || null,
        isRal: option.UF_IS_RAL === 1,
        isFree: option.UF_IS_FREE === 1,
        price: option.UF_PRICE || 0,
        name: option.UF_VARIANT_NAME || null
    };
}
