import { currentState, setState, setInitialConfig } from '../state.js';
import { CONFIG, FREE_LOGO_RALS, RAL_PALETTE, variantNames, MALFA_SILVER_RAL, MALFA_GOLD_RAL, DEFAULT_MIC_CONFIGS } from '../config.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';
import { updateShockmountVisibility } from './shockmount.js';

export function applyVariantPreset(variant) {
    // Reset all selections first
    document.querySelectorAll('.variant-item').forEach(item => {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
    });

    document.querySelectorAll('.swatch').forEach(swatch => {
        swatch.classList.remove('selected');
        swatch.setAttribute('aria-pressed', 'false');
    });

    // Show MALFA logo option and hide color selection for non-MALFA variants
    const malfaLogoOptions = document.querySelectorAll('.malfa-logo');
    const logoSubmenu = document.getElementById('submenu-logo');
    const colorSection = logoSubmenu.querySelector('.submenu-section:nth-child(2)');

    if (variant === 'malfa') {
        malfaLogoOptions.forEach(option => option.style.display = 'flex');
        // Ensure the malfa-logo itself is visible
        document.getElementById('malfa-logo').style.display = 'inline';
        // Ensure the logo overlay is visible
        document.getElementById('logo-overlay').style.display = 'block';
        // Ensure all submenu sections within submenu-logo are visible
        logoSubmenu.querySelectorAll('.submenu-section').forEach(section => section.style.display = 'block');
    } else {
        malfaLogoOptions.forEach(option => option.style.display = 'none');
        // Hide the malfa-logo itself
        document.getElementById('malfa-logo').style.display = 'none';
        // Hide the logo overlay
        document.getElementById('logo-overlay').style.display = 'none';
        // Restore default visibility for submenu sections (e.g., if a custom logo is active, only show the relevant sections)
        if (colorSection) colorSection.style.display = 'block'; // Re-enable if it was hidden for MALFA
    }

    switch(variant) {
        case '023-the-bomblet':
            // Полусферы - Сатинированная сталь
            setState('spheres', { variant: '3', color: null, colorValue: '#a1a1a0' });
            selectVariant('spheres', '3');

            // Корпус - Матовый антрацит
            setState('body', { variant: '3', color: null, colorValue: '#a1a1a0' });
            selectVariant('body', '3');

            // Тип логотипа Холодный хром
            setState('logo', { variant: 'silver', bgColor: '3001', bgColorValue: '#8F1E24', customLogo: null });
            selectVariant('logo', 'silver');
            selectRALVariant('logo', '3001');

            // Кейс - сохраняем текущие настройки кейса
            const bombletCustomLogo = currentState.case.customLogo;
            const bombletLogoTransform = currentState.case.logoTransform;
            setState('case', {
                variant: 'standard',
                customLogo: bombletCustomLogo,
                logoTransform: bombletLogoTransform || { x: 40, y: 26, scale: 1.2 }
            });
            selectVariant('case', 'standard');

            // Shockmount - выключен по умолчанию для 023 THE BOMBLET
            setState('shockmount', { enabled: false, variant: 'white', color: null, colorValue: '#ffffff' });
            setState('prices.shockmount', 0);

            setState('prices', { base: CONFIG.basePrice, spheres: 0, body: 0, logo: 0, case: 0, shockmount: 0 });
            break;

        case 'malfa':
            // Полусферы - Сатинированная сталь
            setState('spheres', { variant: '3', color: null, colorValue: '#a1a1a0' });
            selectVariant('spheres', '3');

            // Корпус - Матовый антрацит
            setState('body', { variant: '1', color: null, colorValue: '#000000' });
            selectVariant('body', '1');

            // Тип логотипа MALFA (Серебро по умолчанию)
            setState('logo', { variant: 'malfa', bgColor: MALFA_SILVER_RAL, bgColorValue: RAL_PALETTE[MALFA_SILVER_RAL], customLogo: null });
            selectVariant('logo', 'malfa');
            selectRALVariant('logo', MALFA_SILVER_RAL); // Select the RAL variant as well

            // Кейс - сохраняем текущие настройки кейса
            const malfaCustomLogo = currentState.case.customLogo;
            const malfaLogoTransform = currentState.case.logoTransform;
            setState('case', {
                variant: 'standard',
                customLogo: malfaCustomLogo,
                logoTransform: malfaLogoTransform || { x: 40, y: 26, scale: 1.2 }
            });
            selectVariant('case', 'standard');

            // Shockmount - включен в комплекте
            setState('shockmount', { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' });
            setState('prices.shockmount', 0);

            setState('prices', { base: CONFIG.basePrice, spheres: 0, body: 0, logo: 0, case: 0, shockmount: 0 });
            break;

        case '023-dlx':
            // Полусферы - Сатинированная сталь
            setState('spheres', { variant: '3', color: null, colorValue: '#a1a1a0' });
            selectVariant('spheres', '3');

            // Корпус - Сатинированная сталь
            setState('body', { variant: '3', color: null, colorValue: '#a1a1a0' });
            selectVariant('body', '3');

            // Тип логотипа Холодный хром
            setState('logo', { variant: 'silver', bgColor: '3001', bgColorValue: '#8F1E24', customLogo: null });
            selectVariant('logo', 'silver');
            selectRALVariant('logo', '3001');

            // Кейс - сохраняем текущие настройки кейса
            const dlxCustomLogo = currentState.case.customLogo;
            const dlxLogoTransform = currentState.case.logoTransform;
            setState('case', {
                variant: 'standard',
                customLogo: dlxCustomLogo,
                logoTransform: dlxLogoTransform || { x: 40, y: 26, scale: 1.2 }
            });
            selectVariant('case', 'standard');

            // Shockmount - включен в комплекте
            setState('shockmount', { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' });
            setState('prices.shockmount', 0);

            setState('prices', { base: CONFIG.basePrice, spheres: 0, body: 0, logo: 0, case: 0, shockmount: 0 });
            break;

        case '017-fet':
            // Полусферы - Классическая латунь
            setState('spheres', { variant: '2', color: null, colorValue: '#d4af37' });
            selectVariant('spheres', '2');

            // Корпус - Слоновая кость
            setState('body', { variant: '2', color: 'RAL 1013', colorValue: '#dfdbc7' });
            selectVariant('body', '2');
            selectRALVariant('body', '1013');

            // Тип логотипа Классическая латунь
            setState('logo', { variant: 'gold', bgColor: '6001', bgColorValue: '#40693A', customLogo: null });
            selectVariant('logo', 'gold');
            selectRALVariant('logo', '6001');

            // Кейс - сохраняем текущие настройки кейса
            const fetCustomLogo = currentState.case.customLogo;
            const fetLogoTransform = currentState.case.logoTransform;
            setState('case', {
                variant: 'standard',
                customLogo: fetCustomLogo,
                logoTransform: fetLogoTransform || { x: 40, y: 26, scale: 1.2 }
            });
            selectVariant('case', 'standard');

            // Shockmount - включен в комплекте
            setState('shockmount', { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' });
            setState('prices.shockmount', 0);

            setState('prices', { base: CONFIG.basePrice, spheres: 0, body: CONFIG.optionPrice, logo: 0, case: 0, shockmount: 0 });
            break;

        case '017-tube':
            // Полусферы - Классическая латунь
            setState('spheres', { variant: '2', color: null, colorValue: '#d4af37' });
            selectVariant('spheres', '2');

            // Корпус - Слоновая кость
            setState('body', { variant: '2', color: 'RAL 1013', colorValue: '#dfdbc7' });
            selectVariant('body', '2');
            selectRALVariant('body', '1013');

            // Тип логотипа Золотистый
            setState('logo', { variant: 'gold', bgColor: '5017', bgColorValue: '#0F518A', customLogo: null });
            selectVariant('logo', 'gold');
            selectRALVariant('logo', '5017');

            // Кейс - сохраняем текущие настройки кейса
            const tubeCustomLogo = currentState.case.customLogo;
            const tubeLogoTransform = currentState.case.logoTransform;
            setState('case', {
                variant: 'standard',
                customLogo: tubeCustomLogo,
                logoTransform: tubeLogoTransform || { x: 40, y: 26, scale: 1.2 }
            });
            selectVariant('case', 'standard');

            // Shockmount - включен в комплекте
            setState('shockmount', { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' });
            setState('prices.shockmount', 0);

            setState('prices', { base: CONFIG.basePrice, spheres: 0, body: CONFIG.optionPrice, logo: 0, case: 0, shockmount: 0 });
            break;
    }

    updateShockmountVisibility();
    if (window.WoodCase) {
        window.WoodCase.setCase(variant);
    }
    // Set initial config after applying preset for reset functionality
    setInitialConfig(DEFAULT_MIC_CONFIGS[variant]);

    updateSVG();
    updateUI();
}

export function selectVariant(section, variant) {
    const submenu = document.getElementById('submenu-' + section);
    const selected = submenu.querySelector(`[data-variant="${variant}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
    }
}

export function selectRALVariant(section, ralCode) {
    const submenu = document.getElementById('submenu-' + section);
    const selected = submenu.querySelector(`[data-variant="${ralCode}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
    }
}
