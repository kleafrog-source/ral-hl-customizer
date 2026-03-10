// ============================================
// APPEARANCE MODULE (Updated with Storage Pattern)
// ============================================

import { stateManager } from '../core/state.js';
import { CONFIG, FREE_LOGO_RALS, RAL_PALETTE } from '../config.js';
import { handleShockmountColorSelection, handleShockmountPinSelection } from './shockmount-new.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';
import { applySectionColor, batchApplySectionColors, normalizeToRgbString } from './color-utils.js';
// import { updatePrices } from './price-calculator.js';
import { isMalfaMic, isMalfaLogo, updateLogoSVG as updateLogoFromLogoModule } from './logo.js';

// Function to update logo preview
function updateLogoPreview() {
    updateSVG();
}

// Function to update SVG logo elements based on variant
function updateLogoSVG(variant) {
    // Delegate all MALFA logo logic to logo.js
    updateLogoFromLogoModule();
}

export function initPalettes() {
    const sections = ['spheres', 'body', 'shockmount', 'pins', 'logobg'];
    sections.forEach(section => {
        const container = document.getElementById('pal-' + section);
        if (!container) return; // Skip if container doesn't exist
        container.innerHTML = '';

        for (let [name, color] of Object.entries(RAL_PALETTE)) {
            // Task 3: Exclude RAL 1013 from body palette
            if (section === 'body' && name === '1013') continue;

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

    // Handle logo palette separately (different structure)
    const logoBgContainer = document.getElementById('pal-logo');
    if (logoBgContainer) {
        logoBgContainer.innerHTML = '';
        for (let [name, color] of Object.entries(RAL_PALETTE)) {
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

            div.onclick = () => handleColorSelection('logo', color, name);

            div.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleColorSelection('logo', color, name);
                }
            };

            logoBgContainer.appendChild(div);
        }
    }
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

    // Start batch operation to prevent multiple renders
    const batchSet = stateManager.startBatch();
    //Общая логика handleColorSelection для силуэта и корпуса
    if (section === 'spheres' || section === 'body') {
        //Устанавливает вариант 3 (RAL цвет)
        batchSet(`${section}.variant`, '3');
        //Устанавливает метку RAL цвета
        batchSet(`${section}.color`, ralLabel);
        //сохраняет hex значения RAL цвета в state.body.colorValue или state.spheres.colorValue
        batchSet(`${section}.colorValue`, color);
        // Добавляет +1500р за платный RAL цвет корпуса
        batchSet(`prices.${section}`, CONFIG.optionPrice);

        //variant 3 это RAL цвет
        applySectionColor(section, {
            variant: '3',
            color: ralLabel,
            colorValue: color
        });

    } else if (section === 'logobg') {
        //Устанавливает метку RAL цвета
        batchSet('logobg.color', ralName);
        //сохраняет hex значения RAL цвета в state.logobg.colorValue
        batchSet('logobg.colorValue', color);

        const isFree = FREE_LOGO_RALS.includes(ralName);
        batchSet('prices.logobg', isFree ? 0 : CONFIG.optionPrice);

        // Apply color using color utils
        applySectionColor('logobg', {
            color: ralName,
            colorValue: color
        });

        // Update variant selection in UI
        const submenu = document.getElementById('submenu-logobg');
        if (submenu) {
            submenu.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));
            const targetVariant = submenu.querySelector(`[data-variant="${ralName}"]`);
            if(targetVariant) targetVariant.classList.add('selected');
        }
        
        // Update SVG visualization
        //Перерисовывает микрофон с новым цветом эмали
        updateSVG();

    } else if (section === 'shockmount') {
        //Устанавливает цвет подвеса
        handleShockmountColorSelection(color, ralName);
        
        // Set price based on whether it's a free color or paid
        const freePinsRals = ['9003', '1013', '9005'];
        const isFree = freePinsRals.includes(ralName);
        batchSet('prices.shockmount', isFree ? 0 : CONFIG.optionPrice);
    //Ветка handleShockmountColorSelection отвечает за установку цвета пинов подвеса
    } else if (section === 'pins') {
        // For pins, check if this is a free RAL color
        const freePinsRals = ['9003', '1013', '9005'];
        const isFree = freePinsRals.includes(ralName);
        //передает 'custom' для платного RAL цвета пинов подвеса
        handleShockmountPinSelection('custom', color, ralName);
        
        // Set price based on whether it's a free color or paid
        batchSet('prices.shockmount', isFree ? 0 : CONFIG.optionPrice);
    }
    
    // End batch and apply all changes at once
    stateManager.endBatch();
    
    // Update UI once after all changes
    updateUI();
}

export function updateSectionLayers(section, state) {
    const svg = document.querySelector('#svg-wrapper svg#svg8');
    
    // Skip logobg - it's handled by color-utils
    if (section === 'logobg') {
        return;
    }
    
    const originalLayer = svg.querySelector(`#${section}-original`);
    const colorLayer = svg.querySelector(`#${section}-colorized`);
    const monoLayer = svg.querySelector(`#${section}-monochrome`);

    for (let i = 1; i <= 3; i++) {
        const display = (state.variant === String(i)) ? 'inline' : 'none';
        const origImg = svg.querySelector(`#${section}-original-${i}`);
        const colorImg = svg.querySelector(`#${section}-color-${i}`);
        const monoImg = svg.querySelector(`#${section}-mono-${i}`);

        if (origImg) origImg.style.display = display;
        if (colorImg) colorImg.style.display = display;
        if (monoImg) monoImg.style.display = display;
    }

    
    if (state.color && state.variant === '3') {
        //Прячет spheres-original, показывает colorized слой
        if (originalLayer) originalLayer.style.display = 'none';
        if (colorLayer) colorLayer.style.display = 'inline';
        if (monoLayer) monoLayer.style.display = 'inline';

        const filters = getCorrectiveFilters(state.colorValue);
        //Применяет SVG фильтр для окрашивания в выбранный RAL цвет
        if (colorLayer) colorLayer.style.filter = `url(#filter-${section}-colorize)`;
        //устанавливает RGB значение в feFlood-spheres-color
        updateFilter(section, state.colorValue);
    } else {
        if (originalLayer) originalLayer.style.display = 'inline';
        if (colorLayer) colorLayer.style.display = 'none';
        if (monoLayer) monoLayer.style.display = 'none';
        if (colorLayer) colorLayer.style.filter = `url(#filter-${section}-colorize)`;
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
// Центральная функция для обработки бесплатных вариантов
export function handleStyleSelection(section, variant) {
    const submenu = document.getElementById('submenu-' + section);
    
    // Clear all variant selections in this section
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

    // Start batch operation to prevent multiple renders
    const batchSet = stateManager.startBatch();

    if (section === 'spheres' || section === 'body') {
        // сохраняет выбранный вариант (1,2 или 3) в state.spheres.variant
        batchSet(`${section}.variant`, variant);
        batchSet(`${section}.color`, null); // Clear color
        batchSet(`${section}.colorValue`, '#ffffff00');
        batchSet(`prices.${section}`, 0); // Styles are free

    } else if (section === 'logobg') {
        // Handle logo background color selection
        const isFree = FREE_LOGO_RALS.includes(variant);
        const color = variant === 'black' ? '#000000' : RAL_PALETTE[variant];
        
        batchSet('logobg.color', variant);
        batchSet('logobg.colorValue', color);
        batchSet('prices.logobg', isFree ? 0 : CONFIG.optionPrice);
        
        // Apply color using color utils
        applySectionColor('logobg', {
            color: variant,
            colorValue: color
        });

        //специальная логика для эмблемы
    } else if (section === 'logo') {
        // Handle logo variant selection
        let logoVariant;
       if (variant === 'malfasilver') {
            logoVariant = 'malfasilver';
        } else if (variant === 'malfagold') {
            logoVariant = 'malfagold';
        } else if (variant === 'gold') {
            logoVariant = 'standard-gold';
        } else if (variant === 'silver') {
            logoVariant = 'standard-silver';
        } else {
            logoVariant = variant;
        }
        
        batchSet('logo.variant', logoVariant);
        batchSet('prices.logo', 0);
        
        // Clear palette selection
        submenu.querySelectorAll('.swatch').forEach(s => {
            s.classList.remove('selected');
            s.setAttribute('aria-pressed', 'false');
        });
    }
    
    // End batch and apply all changes at once
    stateManager.endBatch();
    
    // Update SVG logo elements after state is applied
    if (section === 'logo') {
        updateLogoSVG(variant);
    }
    
    // Update UI once after all changes
    updateUI();
    updateLogoPreview();
}


export function closePalette(section) {
    const wrapper = document.getElementById(`palette-wrapper-${section}`);
    const toggleBtn = wrapper?.previousElementSibling;
    
    if (wrapper && toggleBtn) {
        wrapper.classList.remove('open');
        toggleBtn.classList.remove('active');
    }
}
