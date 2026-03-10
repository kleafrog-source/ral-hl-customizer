import { currentState, setState } from '../state.js';
import { CONFIG, FREE_LOGO_RALS, RAL_PALETTE } from '../config.js';
import { handleShockmountColorSelection, handleShockmountPinSelection } from './shockmount.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';

export function initPalettes() {
    const sections = ['spheres', 'body', 'shockmount', 'pins'];
    sections.forEach(section => {
        const container = document.getElementById('pal-' + section);
        if (!container) return; // Skip if container doesn't exist
        container.innerHTML = '';

        for (let [name, color] of Object.entries(RAL_PALETTE)) {
            // Task 3: Exclude RAL 1013 from body palette
            if (section === 'body' && name === '1013') continue;

            let div = document.createElement('div');
            // Используем уникальный класс для пинов
            div.className = section === 'pins' ? 'shockmount-pins-swatch' : 'swatch';
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

    // Handle logo-bg palette separately (different structure)
    const logoBgContainer = document.getElementById('pal-logo-bg');
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

            div.onclick = () => handleColorSelection('logo-bg', color, name);

            div.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleColorSelection('logo-bg', color, name);
                }
            };

            logoBgContainer.appendChild(div);
        }
    }
}

export function togglePalette(section) {
    console.log('🔍 togglePalette called with section:', section);
    
    let wrapper, toggleBtn, submenu;
    
    if (section === 'pins') {
        // Используем уникальные классы для пинов
        wrapper = document.getElementById('palette-wrapper-pins');
        toggleBtn = wrapper?.previousElementSibling; // Кнопка palette-toggle-btn
        submenu = document.getElementById('submenu-shockmount-pins');
    } else {
        // Общая логика для других разделов
        wrapper = document.getElementById(`palette-wrapper-${section}`);
        toggleBtn = wrapper?.previousElementSibling;
        submenu = document.getElementById(`submenu-${section}`);
    }
    
    console.log('🔍 Elements found:', {
        wrapper: wrapper ? 'found' : 'NOT FOUND',
        toggleBtn: toggleBtn ? 'found' : 'NOT FOUND', 
        submenu: submenu ? 'found' : 'NOT FOUND',
        wrapperId: wrapper ? wrapper.id : 'none',
        submenuId: submenu ? submenu.id : 'none'
    });
    
    if (!wrapper || !toggleBtn || !submenu) {
        console.log('❌ Missing elements, returning');
        return;
    }

    const isOpen = wrapper.classList.contains('open');
    console.log('🔍 Current state - isOpen:', isOpen);
    
    console.log('🔍 Wrapper classes before:', wrapper.className);
    
    // Close all other palettes
    document.querySelectorAll('.shockmount-pins-palette-wrapper, .palette-wrapper').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.shockmount-pins-palette-toggle-btn, .palette-toggle-btn').forEach(b => b.classList.remove('active'));
    
    // Toggle current palette
    if (!isOpen) {
        wrapper.classList.add('open');
        toggleBtn.classList.add('active');
        console.log('✅ Opening palette - added classes');
    } else {
        wrapper.classList.remove('open');
        toggleBtn.classList.remove('active');
        console.log('✅ Closing palette - removed classes');
    }
    
    // Проверяем результат
    setTimeout(() => {
        const finalState = wrapper.classList.contains('open');
        console.log('🔍 Final state - isOpen:', finalState);
        console.log('🔍 Final wrapper classes:', wrapper.className);
    }, 100);
}

export function handleColorSelection(section, color, ralName) {
    const ralLabel = `RAL ${ralName}`;

    let swatchContainer;
    if (section === 'pins') {
        // Используем уникальные классы для пинов
        swatchContainer = document.getElementById('pal-pins')?.parentElement;
    } else {
        // Общая логика для других разделов
        swatchContainer = document.getElementById('submenu-' + section);
    }

    if (!swatchContainer) return;

    // Update ARIA and Visuals
    swatchContainer.querySelectorAll('.shockmount-pins-swatch, .swatch').forEach(s => {
        s.classList.remove('selected');
        s.setAttribute('aria-pressed', 'false');
    });
    const targetSwatch = swatchContainer.querySelector(`.shockmount-pins-swatch[data-ral="${ralName}"], .swatch[data-ral="${ralName}"]`);
    if (targetSwatch) {
        targetSwatch.classList.add('selected');
        targetSwatch.setAttribute('aria-pressed', 'true');
    }

    if (section === 'spheres' || section === 'body') {
        setState(`${section}.variant`, '3');
        setState(`${section}.color`, ralLabel);
        setState(`${section}.colorValue`, color);
        setState(`prices.${section}`, CONFIG.optionPrice);

        // Обновляем UI и SVG после изменения цвета
        updateUI();
        updateSVG();

        // НЕ выбираем автоматически вариант для radio-button логики
        // Пользователь должен сам выбирать вариант или цвет
        // const submenu = document.getElementById('submenu-' + section);
        // submenu.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));
        // const var3 = submenu.querySelector('[data-variant="3"]');
        // if(var3) var3.classList.add('selected');

    } else if (section === 'logo-bg') {
        setState('logo.bgColor', ralName);
        setState('logo.bgColorValue', color);

        if (FREE_LOGO_RALS.includes(ralName)) {
            setState('prices.logo', 0);
        } else {
            setState('prices.logo', CONFIG.optionPrice);
        }

        const submenu = document.getElementById('submenu-logo-bg');
        submenu.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));
        const targetVariant = submenu.querySelector(`[data-variant="${ralName}"]`);
        if(targetVariant) targetVariant.classList.add('selected');

    } else if (section === 'pins') {
        console.log('🔍 handleColorSelection for pins:', { ralLabel, color, ralName });
        
        setState('pins.color', ralLabel);
        setState('pins.colorValue', color);
        setState('prices.pins', CONFIG.optionPrice);

        // Синхронизируем с shockmount.pins для визуализации
        setState('shockmount.pins.colorValue', color);
        setState('shockmount.pins.variant', 'pins-custom'); // Устанавливаем custom вариант

        console.log('🔄 Synced shockmount.pins:', {
            colorValue: color,
            variant: 'pins-custom'
        });

        // Обновляем UI элементы с уникальными классами
        const subtitle = document.getElementById('shockmount-pins-subtitle');
        if (subtitle) {
            subtitle.textContent = ralLabel;
        }
        
        const price = document.getElementById('shockmount-pins-price');
        if (price) {
            price.textContent = `+${CONFIG.optionPrice}₽`;
        }
        
        // Обновляем выбранный вариант в submenu с уникальными классами
        const pinsSubmenu = document.getElementById('submenu-shockmount-pins');
        if (pinsSubmenu) {
            pinsSubmenu.querySelectorAll('.shockmount-pins-variant-item').forEach(i => i.classList.remove('selected'));
            // Ищем вариант с RAL цветом
            const targetVariant = pinsSubmenu.querySelector(`[data-variant*="RAL${ralName}"]`);
            if(targetVariant) {
                targetVariant.classList.add('selected');
                console.log('✅ Selected variant:', targetVariant.dataset.variant);
            } else {
                // Если не нашли RAL вариант, выбираем custom
                const customVariant = pinsSubmenu.querySelector('[data-variant="pins-custom"]');
                if(customVariant) {
                    customVariant.classList.add('selected');
                    console.log('✅ Selected custom variant');
                }
            }
        }

        // Обновляем визуализацию шокмаунта
        handleShockmountPinSelection('custom', color, ralName);
        console.log('✅ Updated shockmount pins preview');

        // Обновляем общий UI
        updateUI();

    } else if (section === 'logo') {
        setState('logo.bgColor', ralName);
        setState('logo.bgColorValue', color);

        if (FREE_LOGO_RALS.includes(ralName)) {
            setState('prices.logo', 0);
        } else {
            setState('prices.logo', CONFIG.optionPrice);
        }

        const submenu = document.getElementById('submenu-logo');
        FREE_LOGO_RALS.forEach(ral => {
            submenu.querySelector(`[data-variant="${ral}"]`)?.classList.remove('selected');
        });
    } else if (section === 'shockmount') {
        handleShockmountColorSelection(color, ralName);
    }
}

export function updateSectionLayers(section, state) {
    const svg = document.querySelector('#svg-wrapper svg');
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

    // Task 4: Only apply color logic if custom color is selected AND variant is 3
    if (state.color && state.variant === '3') {
        if (originalLayer) originalLayer.style.display = 'none';
        if (colorLayer) colorLayer.style.display = 'inline';
        if (monoLayer) monoLayer.style.display = 'inline';

        const filters = getCorrectiveFilters(state.colorValue);
        if (colorLayer) colorLayer.style.filter = `url(#filter-${section}-colorize) ${filters}`;

        updateFilter(section, state.colorValue);
    } else {
        if (originalLayer) originalLayer.style.display = 'inline';
        if (colorLayer) colorLayer.style.display = 'none';
        if (monoLayer) monoLayer.style.display = 'none';
        if (colorLayer) colorLayer.style.filter = `url(#filter-${section}-colorize)`;
    }
}

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

export function calculateLuminance(hex) {
    const rgb = hexToRgbValues(hex);
    if (!rgb) return 0;
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

export function updateFilter(section, hex) {
    const svg = document.querySelector('#svg-wrapper svg');
    const rgb = hexToRgb(hex);
    let id = (section === 'logobg') ? 'feFlood-logobg-color' : `feFlood-${section}-color`;
    const el = svg.querySelector(`#${id}`);
    if (el) el.setAttribute('flood-color', rgb);
}

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : hex;
}

export function hexToRgbValues(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

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

    if (section === 'spheres' || section === 'body') {
        setState(`${section}.variant`, variant);
        setState(`${section}.color`, null); // Clear color
        setState(`${section}.colorValue`, '#ffffff00');
        setState(`prices.${section}`, 0); // Styles are free

    } else if (section === 'logo') {
        if (variant === 'classicbrass') {
            setState('logo.variant', 'standard-gold');
            setState('prices.logo', 0);
        } else if (variant === 'coldchrome') {
            setState('logo.variant', 'standard-silver');
            setState('prices.logo', 0);
        } else if (variant === 'malfasilver') {
            setState('logo.variant', '9006');
            setState('prices.logo', 0);
        } else if (variant === 'malfagold') {
            setState('logo.variant', '1036');
            setState('prices.logo', 0);
        } else {
            setState('logo.variant', variant);
            setState('prices.logo', 0);
        }
    } else if (section === 'logo-bg') {
        if (variant === 'black' || FREE_LOGO_RALS.includes(variant)) {
            setState('logo.bgColor', variant);
            setState('logo.bgColorValue', variant === 'black' ? '#000000' : RAL_PALETTE[variant]);
            setState('prices.logo', 0);
        } else {
            setState('logo.bgColor', variant);
            setState('logo.bgColorValue', RAL_PALETTE[variant]);
            setState('prices.logo', CONFIG.optionPrice);
        }
        
        // Clear palette selection
        submenu.querySelectorAll('.swatch').forEach(s => {
            s.classList.remove('selected');
            s.setAttribute('aria-pressed', 'false');
        });
    }
    updateSVG();
    updateUI();
}
