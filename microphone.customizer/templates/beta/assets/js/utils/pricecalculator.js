// utils/PriceCalculator.js

import { CONFIG, getModelData } from '../config.js';

/**
 * Calculates the total price based on the current state.
 * @param {object} state - The application's current state object.
 * @returns {number} The total calculated price.
 */
export function calculateTotal(state) {
    if (!state || !state.prices) {
        return CONFIG.basePrice;
    }

    let total = CONFIG.basePrice;
    total += state.prices.spheres || 0;
    total += state.prices.body || 0;
    total += state.prices.logo || 0;
    total += state.prices.logobg || 0;
    total += state.prices.case || 0;
    total += state.prices.shockmount || 0;

    // Conditional shockmount price based on model data from Bitrix
    const modelData = getModelData(state.variant);
    const isBomblet = state.variant === '023-the-bomblet';
    
    if (isBomblet && state.shockmount.enabled) {
        total += CONFIG.shockmountPrice;
    } else {
        // For other variants, shockmount price is managed directly in the prices object
        total += state.prices.shockmount || 0;
    }

    return total;
}

/**
 * Provides a detailed breakdown of the current pricing.
 * @param {object} state - The application's current state object.
 * @returns {object} An object containing the price for each section.
 */
export function getBreakdown(state) {
    if (!state || !state.prices) {
        return {
            base: CONFIG.basePrice,
            spheres: 0,
            body: 0,
            logo: 0,
            logobg: 0,
            case: 0,
            shockmount: 0,
            total: CONFIG.basePrice
        };
    }

    const modelData = getModelData(state.variant);
    const isBomblet = state.variant === '023-the-bomblet';
    
    const shockmountPrice = (isBomblet && state.shockmount.enabled)
        ? CONFIG.shockmountPrice
        : (state.prices.shockmount || 0);

    const breakdown = {
        base: CONFIG.basePrice,
        spheres: state.prices.spheres || 0,
        body: state.prices.body || 0,
        logo: state.prices.logo || 0,
        logobg: state.prices.logobg || 0,
        case: state.prices.case || 0,
        shockmount: state.prices.shockmount || 0
    };

    const total = Object.values(breakdown).reduce((acc, price) => acc + price, 0);

    return { ...breakdown, total };
}
