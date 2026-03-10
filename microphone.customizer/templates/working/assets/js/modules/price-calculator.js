// modules/price-calculator.js

import { CONFIG, FREE_LOGO_RALS, FREE_SHOCKMOUNT_BODY_RALS, FREE_SHOCKMOUNT_PINS_RALS } from '../config.js';
import { APP_DEBUG } from '../core/state.js';

/**
 * Price calculation rules for different sections
 */
const PRICE_RULES = {
    base: () => CONFIG.basePrice,
    
    spheres: (state) => {
        return state.spheres.color ? CONFIG.optionPrice : 0;
    },
    
    body: (state) => {
        return state.body.color ? CONFIG.optionPrice : 0;
    },
    
    logo: (state) => {
        return state.logo.customLogo ? CONFIG.customLogoPrice : 0;
    },
    
    logobg: (state) => {
        if (!state.logobg.color) return 0;
        return FREE_LOGO_RALS.includes(state.logobg.color) ? 0 : CONFIG.optionPrice;
    },
    
    shockmount: (state) => {
        if (!state.shockmount.enabled) return 0;
        if (!state.shockmount.color) return 0;
        return FREE_SHOCKMOUNT_BODY_RALS.includes(state.shockmount.color.replace('RAL ', '')) ? 0 : CONFIG.optionPrice;
    },
    
    shockmountPins: (state) => {
        if (!state.shockmountPins.colorName) return 0;
        return FREE_SHOCKMOUNT_PINS_RALS.includes(state.shockmountPins.colorName.replace('RAL ', '')) ? 0 : CONFIG.optionPrice;
    },
    
    case: (state) => {
        return state.case.customLogo ? CONFIG.customLogoPrice : 0;
    }
};

/**
 * Calculates price breakdown for all sections
 * @param {Object} state - Current application state
 * @returns {Object} Price breakdown by section
 */
export function getBreakdown(state) {
    const breakdown = {};
    
    Object.entries(PRICE_RULES).forEach(([section, calculator]) => {
        try {
            breakdown[section] = calculator(state);
        } catch (error) {
            console.error(`[Price Calculator] Error calculating price for ${section}:`, error);
            breakdown[section] = 0;
        }
    });
    
    return breakdown;
}

/**
 * Calculates total price from breakdown
 * @param {Object} state - Current application state
 * @returns {number} Total price
 */
export function calculateTotal(state) {
    const breakdown = getBreakdown(state);
    const total = Object.values(breakdown).reduce((sum, price) => sum + price, 0);
    
    if (APP_DEBUG) {
        console.log('[Price Calculator] Breakdown:', breakdown);
        console.log('[Price Calculator] Total:', total);
    }
    
    return total;
}

/**
 * Updates prices in state based on current configuration
 * @param {Object} state - Current application state
 * @returns {Object} Updated prices object
 */
export function updatePrices(state) {
    const breakdown = getBreakdown(state);
    return {
        ...state.prices,
        ...breakdown
    };
}

/**
 * Checks if a color is free for a specific section
 * @param {string} section - Section name (body, shockmount, pins, logobg)
 * @param {string} color - Color name or RAL code
 * @returns {boolean} True if color is free
 */
export function isFreeColor(section, color) {
    switch (section) {
        case 'body':
            return false; // Body has no free colors
        case 'shockmount':
            return FREE_SHOCKMOUNT_BODY_RALS.includes(color.replace('RAL ', ''));
        case 'pins':
            return FREE_SHOCKMOUNT_PINS_RALS.includes(color.replace('RAL ', ''));
        case 'logobg':
            return FREE_LOGO_RALS.includes(color);
        default:
            return false;
    }
}

/**
 * Gets price for a specific section
 * @param {string} section - Section name
 * @param {Object} state - Current application state
 * @returns {number} Section price
 */
export function getSectionPrice(section, state) {
    const calculator = PRICE_RULES[section];
    return calculator ? calculator(state) : 0;
}

/**
 * Formats price for display
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
    return `+${price}₽`;
}

/**
 * Gets all available price rules (for debugging)
 * @returns {Object} Price rules object
 */
export function getPriceRules() {
    return PRICE_RULES;
}
