// core/render.js
import { stateManager } from './state.js';
import { CONFIG, variantNames, getModelData } from '../config.js';
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
let prevState = null;

// Обновляет весь UI и SVG после изменения состояния (state)
export function render() {
    const currentState = stateManager.get();

    if (!prevState) {
        performFullRender(currentState);
        prevState = JSON.parse(JSON.stringify(currentState));
        return;
    }

    const changes = identifyChanges(prevState, currentState);
    if (changes.length > 0) {
        performIncrementalRender(currentState, changes);
    }

    prevState = JSON.parse(JSON.stringify(currentState));
}

function identifyChanges(prev, curr) {
    const changes = [];
    const sections = ['variant', 'model', 'spheres', 'body', 'logo', 'logobg', 'case', 'shockmount', 'shockmountPins'];

    sections.forEach(section => {
        if (JSON.stringify(prev[section]) !== JSON.stringify(curr[section])) {
            changes.push(section);
        }
    });

    return changes;
}

function performFullRender(state) {
    updateUI(state);
    renderSidebar(state);
    updateSVG(state);
    updateLogoSVG();
    updateShockmountVisibility(state);
    updateShockmountLayers(state);
    updateShockmountPreview(state);
    updateShockmountPinsPreview(state);
}

function performIncrementalRender(state, changes) {
    // Always update UI and Sidebar as they aggregate data
    updateUI(state);
    renderSidebar(state);

    if (changes.some(c => ['variant', 'model', 'spheres', 'body', 'logo', 'logobg'].includes(c))) {
        updateSVG(state);
        updateLogoSVG();
    }

    if (changes.some(c => ['variant', 'shockmount', 'shockmountPins'].includes(c))) {
        updateShockmountVisibility(state);
        updateShockmountLayers(state);
        updateShockmountPreview(state);
        updateShockmountPinsPreview(state);
    }
}


/**
 * Renders all elements in the sidebar based on the current state.
 * @param {object} currentState - The full state object.
 */
function renderSidebar(currentState) {
    try {
        // Menu Item Icons & Subtitles - с защитой от null элементов
        const spheresColorDisplay = document.getElementById('spheres-color-display');
        if (spheresColorDisplay) {
            spheresColorDisplay.style.backgroundColor = currentState.spheres.colorValue || '#000000';
        }
        
        const bodyColorDisplay = document.getElementById('body-color-display');
        if (bodyColorDisplay) {
            bodyColorDisplay.style.backgroundColor = currentState.body.colorValue || '#000000';
        }
        
        const logoColorDisplay = document.getElementById('logo-color-display');
        if (logoColorDisplay) {
            logoColorDisplay.style.backgroundColor = currentState.logo.customLogo ? '#000' : (currentState.logobg.color === 'black' ? '#000' : currentState.logobg.colorValue);
        }
        
        const logobgColorDisplay = document.getElementById('logobg-color-display');
        if (logobgColorDisplay) {
            logobgColorDisplay.style.backgroundColor = currentState.logobg.color === 'black' ? '#000' : currentState.logobg.colorValue;
        }
        
        const caseColorDisplay = document.getElementById('case-color-display');
        if (caseColorDisplay) {
            caseColorDisplay.style.backgroundColor = '#8B4513';
        }
        
        const shockmountColorDisplay = document.getElementById('shockmount-color-display');
        if (shockmountColorDisplay) {
            shockmountColorDisplay.style.backgroundColor = currentState.shockmount.colorValue;
        }

        // Add pins color display if element exists
        const pinsColorDisplay = document.getElementById('pins-color-display');
        if (pinsColorDisplay) {
            pinsColorDisplay.style.backgroundColor = currentState.shockmountPins.colorValue || '#000000';
        }

        // Subtitles с защитой от null элементов
        const spheresSubtitle = document.getElementById('spheres-subtitle');
        if (spheresSubtitle) {
            spheresSubtitle.textContent = currentState.spheres.color || variantNames[currentState.spheres.variant];
        }
        
        const bodySubtitle = document.getElementById('body-subtitle');
        if (bodySubtitle) {
            bodySubtitle.textContent = currentState.body.color || variantNames[currentState.body.variant];
        }

        let logoSubtitle = 'Кастомный';
        if (!currentState.logo.customLogo) {
            const modelData = getModelData(currentState.variant);
            const isMalfa = modelData?.MODEL_SERIES === 'MALFA' || currentState.variant === '023-malfa';
            
            if (isMalfa) {
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
        document.getElementById('total-price').textContent = `${total.toLocaleString('ru-RU')}₽`;
        document.getElementById('base-price').textContent = `${(currentState.basePrice || 0).toLocaleString('ru-RU')}₽`;

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
    
    // Убедимся, что price - число
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    const formattedPrice = numPrice > 0 ? `+${numPrice.toLocaleString('ru-RU')}₽` : '0₽';
    
    if (priceEl) priceEl.textContent = formattedPrice;
    if (priceRowEl) priceRowEl.textContent = formattedPrice;
}
