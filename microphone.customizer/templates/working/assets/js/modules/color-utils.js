// modules/color-utils.js

import { stateManager } from '../core/state.js';

/**
 * Configuration for color sections and their SVG elements
 */
const COLOR_SECTION_CONFIG = {
    body: {
        floodFilterId: 'feFlood-body-color',
        svgLayers: ['body-colorized', 'body-monochrome'],
        originalLayer: 'body-original'
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
    },
    logobg: {
        floodFilterId: 'feFlood-logobg-color',
        svgLayers: ['logobg-colorized'],
        originalLayer: 'logobg-original'
    },
    spheres: {
        floodFilterId: 'feFlood-spheres-color',
        svgLayers: ['spheres-colorized', 'spheres-monochrome'],
        originalLayer: 'spheres-original'
    }
};

/**
 * Sets flood color for a specific filter
 * @param {string} filterId - The ID of the flood filter element
 * @param {string} rgbOrHex - Color in RGB or HEX format
 */
export function setFloodColor(filterId, rgbOrHex) {
    console.log(`[Color Utils] setFloodColor called with filterId: ${filterId}, color: ${rgbOrHex}`);
    
    const svg = document.querySelector('#svg-wrapper svg#svg8');
    console.log(`[Color Utils] SVG found:`, !!svg);
    
    if (!svg) {
        console.warn(`[Color Utils] SVG element not found`);
        return;
    }

    const filterElement = svg.querySelector(`#${filterId}`);
    console.log(`[Color Utils] Filter element found:`, !!filterElement, `for ID: ${filterId}`);
    
    if (filterElement) {
        const rgb = rgbOrHex.startsWith('#') ? hexToRgb(rgbOrHex) : rgbOrHex;
        console.log(`[Color Utils] Setting flood-color to: ${rgb}`);
        filterElement.setAttribute('flood-color', rgb);
        console.log(`[Color Utils] Successfully applied flood-color: ${rgb} to ${filterId}`);
    } else {
        console.warn(`[Color Utils] Filter element not found: ${filterId}`);
    }
}

/**
 * Applies color to a specific section
 * @param {string} sectionKey - The section key (body, shockmount, pins, logobg, spheres)
 * @param {object} sectionState - The state object for the section
 */
export function applySectionColor(sectionKey, sectionState) {
    console.log(`[Color Utils] applySectionColor called with sectionKey: ${sectionKey}, sectionState:`, sectionState);
    
    const config = COLOR_SECTION_CONFIG[sectionKey];
    if (!config) {
        console.warn(`[Color Utils] Unknown section: ${sectionKey}`);
        return;
    }

    const svg = document.querySelector('#svg-wrapper svg#svg8');
    console.log(`[Color Utils] SVG found in applySectionColor:`, !!svg);
    
    if (!svg) return;

    // Special handling for logobg - only set flood color, no layer switching
    if (sectionKey === 'logobg') {
        if (sectionState.colorValue) {
            console.log(`[Color Utils] Setting logobg flood color: ${sectionState.colorValue}`);
            setFloodColor(config.floodFilterId, sectionState.colorValue);
        } else {
            console.log(`[Color Utils] No colorValue found for logobg`);
        }
        return;
    }

    // Set flood color for other sections
    if (sectionState.colorValue) {
        console.log(`[Color Utils] Setting flood color for ${sectionKey}: ${sectionState.colorValue}`);
        setFloodColor(config.floodFilterId, sectionState.colorValue);
    } else {
        console.log(`[Color Utils] No colorValue found for ${sectionKey}`);
    }

    // Handle layer visibility for non-logobg sections
    const hasCustomColor = sectionState.color && sectionState.variant === '3';
    console.log(`[Color Utils] Has custom color for ${sectionKey}: ${hasCustomColor}`);
    
    // Show/hide layers based on custom color
    config.svgLayers.forEach(layerId => {
        const layer = svg.querySelector(`#${layerId}`);
        if (layer) {
            layer.style.display = hasCustomColor ? 'inline' : 'none';
            console.log(`[Color Utils] Layer ${layerId} display set to: ${hasCustomColor ? 'inline' : 'none'}`);
        } else {
            console.warn(`[Color Utils] Layer not found: ${layerId}`);
        }
    });

    // Show original layer when no custom color
    const originalLayer = svg.querySelector(`#${config.originalLayer}`);
    if (originalLayer) {
        originalLayer.style.display = hasCustomColor ? 'none' : 'inline';
        console.log(`[Color Utils] Original layer ${config.originalLayer} display set to: ${hasCustomColor ? 'none' : 'inline'}`);
    }

    // Apply filters if needed
    if (hasCustomColor) {
        const colorizedLayer = svg.querySelector(`#${config.svgLayers[0]}`);
        if (colorizedLayer) {
            const filters = getCorrectiveFilters(sectionState.colorValue);
            console.log(`[Color Utils] Applying filters for ${sectionKey}: ${filters}`);
            colorizedLayer.style.filter = `url(#filter-${sectionKey}-colorize) ${filters}`;
        }
    }
}

/**
 * Gets corrective filters for specific colors
 * @param {string} hex - Hex color value
 * @returns {string} CSS filter string
 */
export function getCorrectiveFilters(hex) {
    const rgb = hexToRgbValues(hex);
    if (!rgb) return '';

    const [r, g, b] = rgb;

    if (r > 200 && g > 180 && b < 100) {
        return 'brightness(1.05) saturate(0.9) hue-rotate(-5deg)';
    }
    if (r > 230 && g > 230 && b > 230) {
        return 'contrast(1.1)';
    }
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
