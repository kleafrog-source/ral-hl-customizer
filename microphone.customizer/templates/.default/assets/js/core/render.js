// core/render.js
import { stateManager } from './state.js';
import { CONFIG, variantNames } from '../config.js';
import { FREE_LOGO_RALS, MALFA_SILVER_RAL } from '../config/ral.config.js';
import { updateSVG } from '../engine.js';
import { updateLogoSVG } from '../modules/logo.js';
import { updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from '../modules/shockmount-new.js';
import { calculateTotal, getBreakdown } from '../modules/price-calculator.js';
import { updateUI } from '../ui-core.js';

/**
 * Main render function for the entire UI.
 * This function should be subscribed to state changes.
 */
// Обновляет весь UI и SVG после изменения состояния (state)
export function render() {
    const currentState = stateManager.get();

    // Delegate to more specific render functions
    updateUI(currentState);
    renderSidebar(currentState);
    updateSVG(currentState);
    updateLogoSVG();
    
    // These functions from shockmount.js are also pure render functions
    updateShockmountVisibility(currentState);
    updateShockmountLayers(currentState);
    updateShockmountPreview(currentState);
    updateShockmountPinsPreview(currentState);
}


/**
 * Renders all elements in the sidebar based on the current state.
 * @param {object} currentState - The full state object.
 */
function renderSidebar(currentState) {
    try {
        // Menu Item Icons & Subtitles
        document.getElementById('spheres-color-display').style.backgroundColor = currentState.spheres.colorValue || '#000000';
        document.getElementById('body-color-display').style.backgroundColor = currentState.body.colorValue || '#000000';
        document.getElementById('logo-color-display').style.backgroundColor = currentState.logo.customLogo ? '#000' : (currentState.logobg.color === 'black' ? '#000' : currentState.logobg.colorValue);
    document.getElementById('logobg-color-display').style.backgroundColor = currentState.logobg.color === 'black' ? '#000' : currentState.logobg.colorValue;
        document.getElementById('case-color-display').style.backgroundColor = '#8B4513';
        document.getElementById('shockmount-color-display').style.backgroundColor = currentState.shockmount.colorValue;
        
        // Add pins color display if element exists
        const pinsColorDisplay = document.getElementById('pins-color-display');
        if (pinsColorDisplay) {
            pinsColorDisplay.style.backgroundColor = currentState.shockmountPins.colorValue || '#000000';
        }

        document.getElementById('spheres-subtitle').textContent = currentState.spheres.color || variantNames[currentState.spheres.variant];
        document.getElementById('body-subtitle').textContent = currentState.body.color || variantNames[currentState.body.variant];
        
        let logoSubtitle = 'Кастомный';
        if (!currentState.logo.customLogo) {
            if (currentState.variant === '023-malfa') {
                logoSubtitle = `MALFA (${currentState.logo.variant})`;
            } else if (FREE_LOGO_RALS.includes(currentState.logobg.color)) {
                logoSubtitle = `RAL ${currentState.logobg.color}`;
            } else {
                logoSubtitle = currentState.logo.variant === 'silver' ? 'Холодный хром' : 'Классическая латунь';
            }
        }
        document.getElementById('logo-subtitle').textContent = logoSubtitle;

        document.getElementById('case-subtitle').textContent = currentState.case.variant === 'custom' ? 'Собственное изображение' : 'Стандартный (Логотип Soyuz)';

        const shockmountColorNames = { 'white': 'Чистый белый', 'cream': 'Жемчужно-белый', 'black': 'Матовый черный' };
        let shockmountText = shockmountColorNames[currentState.shockmount.variant] || 'Чистый белый';
        if (currentState.shockmount.variant === 'custom' && currentState.shockmount.color) {
            const ralMatch = currentState.shockmount.color.match(/RAL\s*(\d+)/);
            shockmountText = ralMatch ? `RAL ${ralMatch[1]}` : currentState.shockmount.color;
        }
        document.getElementById('shockmount-subtitle').textContent = shockmountText;
        
        // Prices
        const priceBreakdown = getBreakdown(currentState);
        renderPrice('spheres', priceBreakdown.spheres);
        renderPrice('body', priceBreakdown.body);
        renderPrice('logo', priceBreakdown.logo);
        renderPrice('case', priceBreakdown.case);
        renderPrice('shockmount', priceBreakdown.shockmount);
        
        // Total Price
        const total = calculateTotal(currentState);
        document.getElementById('total-price').textContent = `${total}₽`;
        document.getElementById('base-price').textContent = `${CONFIG.basePrice}₽`;

    } catch (e) {
        console.error("Error during sidebar render:", e);
    }
}

/**
 * Renders the price for a specific section.
 * @param {string} section - The name of the section (e.g., 'spheres').
 * @param {number} price - The price value.
 */
function renderPrice(section, price) {
    const priceEl = document.getElementById(`${section}-price`);
    const priceRowEl = document.getElementById(`${section}-price-row`);
    const formattedPrice = `+${price || 0}₽`;
    if (priceEl) priceEl.textContent = formattedPrice;
    if (priceRowEl) priceRowEl.textContent = formattedPrice;
}
