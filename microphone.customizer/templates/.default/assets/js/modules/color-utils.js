// modules/color-utils.js

import { stateManager } from '../core/state.js';
import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';
import { isFreeVariant } from '../config/free-variants.config.js';
import { debugSVGState, debugSVGLayers, debugFilters } from '../debug.js';

/**
 * Configuration for color sections and their SVG elements
 */
const COLOR_SECTION_CONFIG = {
    spheres: {
        floodFilterId: 'feFlood-spheres-color',
        svgLayers: ['spheres-colorized', 'spheres-monochrome'],
        originalLayer: 'spheres-original'
    },
    body: {
        floodFilterId: 'feFlood-body-color',
        svgLayers: ['body-colorized', 'body-monochrome'],
        originalLayer: 'body-original'
    },    
    logobg: {
        floodFilterId: 'feFlood-logobg-color',
        svgLayers: ['logobg-colorized'],
        originalLayer: 'logobg-original'
    },
    shockmount: {
        floodFilterId: 'feFlood-shockmount-color',
        svgLayers: ['shockmount-colorize', 'shockmount-monochrome'],
        originalLayer: 'shockmount-original'
    },
    pins: {
        floodFilterId: 'feFlood-pins-color',
        svgLayers: ['shockmount-pins-colorize', 'shockmount-pins-monochrome'],
        originalLayer: 'shockmount-pins-original'
    }
};

// Mapping for numeric variants to string variants
const VARIANT_MAPPING = {
    spheres: {
        '1': 'deepblack',
        '2': 'classicbrass', 
        '3': 'satinsteel'
    },
    body: {
        '1': 'anthracite',
        '2': 'pearlwhite',
        '3': 'satinsteel',
        '4': 'ivory'
    }
};

/**
 * Gets the correct variant key for SECTION_LAYER_MAP
 * @param {string} sectionKey - The section key
 * @param {string} variant - The variant value (numeric or string)
 * @returns {string} The mapped variant key
 */
function getMappedVariant(sectionKey, variant) {
    // If variant is already a string (not numeric), return as-is
    if (isNaN(variant)) {
        return variant;
    }
    
    // Map numeric variants to string variants
    return VARIANT_MAPPING[sectionKey]?.[variant] || variant;
}

/**
 * Normalizes color value to rgb(r,g,b) format
 * @param {string} colorValue - Color value in hex (#RRGGBB), rgb, or comma-separated format
 * @returns {string|null} RGB color string or null if input is invalid
 */
export function normalizeToRgbString(colorValue) {
    if (!colorValue) return null;

    if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
        const clean = colorValue.replace('#', '');
        // Handle hex with alpha (#RRGGBBAA) - strip alpha component
        const hex6 = clean.length === 8 ? clean.slice(0, 6) : clean;
        return hexToRgb('#' + hex6);
    }

    if (typeof colorValue === 'string' && colorValue.includes(',')) {
        return `rgb(${colorValue})`;
    }

    // Already rgb(...) or specific format
    return colorValue;
}

/**
 * Sets the flood color for an SVG filter
 * @param {string} filterId - The ID of the filter element
 * @param {string} rgbOrHex - Color value in hex (#RRGGBB) or rgb format
 */
export function setFloodColor(filterId, rgbOrHex) {
    const svg = document.querySelector('#svg-wrapper svg#svg8');
    
    if (!svg) {
        console.warn(`[Color Utils] SVG element not found`);
        return;
    }

    const filterElement = svg.querySelector(`#${filterId}`);
    
    if (filterElement) {
        const rgbString = normalizeToRgbString(rgbOrHex);
        
        // Skip if color value is invalid
        if (!rgbString) {
            console.warn(`[Color Utils] Invalid color value for filter ${filterId}:`, rgbOrHex);
            return;
        }
        
        // Debug logging to verify the actual value being set
        console.log('[DEBUG flood-color]', {
            filterId,
            rawColorValue: rgbOrHex,
            appliedValue: rgbString
        });
        
        filterElement.setAttribute('flood-color', rgbString);
    } else {
        console.warn(`[Color Utils] Filter element not found: ${filterId}`);
    }
}

/**
 * Applies color to a specific section
 * @param {string} sectionKey - The section key (spheres, body, logobg, shockmount, pins)
 * @param {object} sectionState - The state object for the section
 * @param {object} config - The configuration object for the section
 */
//данная функция отвечает за применение цвета к конкретному разделу
//sectionKey - ключ раздела  расположенные в таком порядке: spheres, body, logobg, shockmount, pins
//sectionState - объект состояния для раздела и могут быть следующие свойства: colorValue, colorType, colorName
export function applySectionColor(sectionKey, sectionState, config) {
    if (!sectionState) {
        console.warn('[Color Utils] No section state provided for', sectionKey);
        return;
    }
    
    //находит SVG элемент Микрофона
    const svg = document.querySelector('#svg-wrapper svg#svg8');
    if (!svg) return;

    // Debug logging
    debugSVGState(sectionKey, sectionState, 'applySectionColor start');

    // Skip layer visibility updates for initial load to preserve default visibility
    const isInitialLoad = !sectionState.variant || 
        (sectionKey === 'spheres' && sectionState.variant === 'spheres-default-satin-steel') ||
        (sectionKey === 'body' && sectionState.variant === 'body-default-satin-steel');
    
    if (!isInitialLoad) {
        // Map variant to correct string key for SECTION_LAYER_MAP
        const mappedVariant = getMappedVariant(sectionKey, sectionState.variant);
        
        // Debug: Check what layers exist in SVG for this section
        console.log(`[Color Utils] Checking SVG layers for ${sectionKey}:`);
        const allLayers = svg.querySelectorAll('[id*="' + sectionKey + '-"]');
        allLayers.forEach(layer => {
            console.log(`  Found layer: #${layer.id}, current display: ${window.getComputedStyle(layer).display}`);
        });

        // Get layer mapping for this section and variant
        const layerMapping = SECTION_LAYER_MAP[sectionKey]?.[mappedVariant];
        if (!layerMapping) {
            console.warn(`[Color Utils] No layer mapping found for ${sectionKey}.${mappedVariant} (original: ${sectionState.variant})`);
            return;
        }

        console.log(`[Color Utils] Layer mapping for ${sectionKey}.${mappedVariant}:`, layerMapping);

        // Handle layer visibility based on variant type
        const isCustomVariant = mappedVariant?.includes('ral-custom');
        const isSpecialVariant = mappedVariant && !mappedVariant.includes('RAL') && !mappedVariant.includes('ral-custom');
        const layerChanges = [];

        // Hide all layers first
        if (layerMapping.originals) {
            layerMapping.originals.forEach(layerId => {
                const layer = svg.querySelector(`#${layerId}`);
                if (layer) {
                    // Force explicit display for special variants (non-RAL, non-ral-custom)
                    // Hide for RAL variants (both free and custom)
                    const display = isSpecialVariant ? 'inline' : 'none';
                    console.log(
                        `[Color Utils] Setting ${layerId} display to ${display} ` +
                        `(variant: ${sectionState.variant} -> ${mappedVariant}, isSpecial: ${isSpecialVariant})`
                    );
                    layer.style.display = display;

                    // Verify style was applied
                    setTimeout(() => {
                        const appliedDisplay = window.getComputedStyle(layer).display;
                        console.log(
                            `[Color Utils] ${layerId} display after setting: ${appliedDisplay} (expected: ${display})`
                        );
                    }, 10);

                    layerChanges.push({ id: layerId, display });
                } else {
                    console.warn(`[Color Utils] Layer #${layerId} not found in SVG`);
                }
            });
        }

        // Show/hide colorized and monochrome groups
        if (layerMapping.colorizedGroup) {
            const colorizedLayer = svg.querySelector(`#${layerMapping.colorizedGroup}`);
            if (colorizedLayer) {
                // Show colorized layers for RAL variants (both free and custom)
                // Hide for special variants
                const display = !isSpecialVariant ? 'inline' : 'none';
                colorizedLayer.style.display = display;
                layerChanges.push({ id: layerMapping.colorizedGroup, display });
            }
        }

        if (layerMapping.monoGroup) {
            const monoLayer = svg.querySelector(`#${layerMapping.monoGroup}`);
            if (monoLayer) {
                // Show monochrome layers for RAL variants (both free and custom)
                // Hide for special variants
                const display = !isSpecialVariant ? 'inline' : 'none';
                monoLayer.style.display = display;
                layerChanges.push({ id: layerMapping.monoGroup, display });
            }
        }

        // Debug layer changes
        debugSVGLayers(layerChanges, `applySectionColor for ${sectionKey}`);
    }

    // Set flood color for all sections (including initial load)
    if (sectionState.colorValue) {
        setFloodColor(config.floodFilterId, sectionState.colorValue);
        debugFilters(config.floodFilterId, sectionState.colorValue, 'setFloodColor');
    }

    // Apply filters if needed
    if (sectionState.colorValue && config.correctiveFilters) {
        const filters = getCorrectiveFilters(sectionState.colorValue);
        const colorLayer = svg.querySelector(`#${config.colorizedLayer}`);
        if (colorLayer) {
            colorLayer.style.filter = `url(#filter-${sectionKey}-colorize) ${filters}`;
        }
    }
}

/**
 * Gets corrective filters for specific colors
 * @param {string} hex - Hex color value
 * @returns {string} CSS filter string
 */
export function getCorrectiveFilters(hex) {
    // Removed brightness/contrast filters as they interfere with SVG filter balance
    return '';
}

/**
 * Converts hex to RGB format
 * @param {string} hex - Hex color value
 * @returns {string} RGB color string
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : hex;
}

/**
 * Converts hex to RGB values array
 * @param {string} hex - Hex color value
 * @returns {number[]} RGB values array
 */
export function hexToRgbValues(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

/**
 * Batch apply multiple section colors
 * @param {Object} sections - Object with section keys and their states
 */
export function batchApplySectionColors(sections) {
    Object.entries(sections).forEach(([sectionKey, sectionState]) => {
        applySectionColor(sectionKey, sectionState);
    });
}

/**
 * Get section configuration
 * @param {string} sectionKey - The section key
 * @returns {Object} Section configuration
 */
export function getSectionConfig(sectionKey) {
    return COLOR_SECTION_CONFIG[sectionKey];
}
