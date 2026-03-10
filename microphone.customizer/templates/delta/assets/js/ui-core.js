import { stateManager } from './core/state.js';
import { updateSVG } from './engine.js';
import { updateLogoSVG } from './modules/logo.js';
import { updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from './modules/shockmount-new.js';
import { calculateTotal, getBreakdown, formatPrice } from './modules/price-calculator.js';
import { initHLDataManager } from './modules/hl-data-manager.js';

export function updateUI() {
    const state = stateManager.get();
    const breakdown = getBreakdown(state);
    const total = calculateTotal(state);

    const basePriceEl = document.getElementById('base-price');
    if (basePriceEl) basePriceEl.textContent = `${(state.basePrice || 0).toLocaleString('ru-RU')}₽`;

    const setPrice = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatPrice(value);
    };

    setPrice('spheres-price-row', breakdown.spheres);
    setPrice('body-price-row', breakdown.body);
    setPrice('logo-price-row', breakdown.logo + breakdown.logobg);
    setPrice('case-price-row', breakdown.case);
    setPrice('shockmount-price-row', breakdown.shockmount);

    const shockmountMenuPrice = document.getElementById('shockmount-price');
    if (shockmountMenuPrice) shockmountMenuPrice.textContent = formatPrice(breakdown.shockmount);

    const totalEl = document.getElementById('total-price');
    if (totalEl) totalEl.textContent = `${total.toLocaleString('ru-RU')}₽`;

    const shockmountRow = document.getElementById('shockmount-price-row-container');
    if (shockmountRow) {
        const showShockmount = !!state.shockmount?.enabled && !state.shockmount?.included;
        shockmountRow.style.display = showShockmount ? 'flex' : 'none';
    }

    const setColorDisplay = (id, color) => {
        const el = document.getElementById(id);
        if (el && color) el.style.backgroundColor = color;
    };

    setColorDisplay('spheres-color-display', state.spheres?.colorValue);
    setColorDisplay('body-color-display', state.body?.colorValue);
    setColorDisplay('logo-color-display', state.logo?.useCustom ? '#000000' : state.logobg?.colorValue);
    setColorDisplay('logobg-color-display', state.logobg?.colorValue);
    setColorDisplay('shockmount-color-display', state.shockmount?.colorValue);
    setColorDisplay('shockmountPins-color-display', state.shockmountPins?.colorValue);

    const setSubtitle = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || 'Выберите вариант';
    };

    const getLabel = (sectionState) => {
        if (!sectionState) return 'Выберите вариант';
        if (sectionState.isRal && sectionState.colorName) return sectionState.colorName;
        if (sectionState.variantName) return sectionState.variantName;
        return 'Выберите вариант';
    };

    setSubtitle('spheres-subtitle', getLabel(state.spheres));
    setSubtitle('body-subtitle', getLabel(state.body));
    setSubtitle('logo-subtitle', state.logo?.useCustom ? 'Кастомный логотип' : getLabel(state.logo));
    setSubtitle('logobg-subtitle', getLabel(state.logobg));
    setSubtitle('case-subtitle', getLabel(state.case));
    setSubtitle('shockmount-subtitle', getLabel(state.shockmount));
    setSubtitle('shockmountPins-subtitle', getLabel(state.shockmountPins));
}

function applyOptionFromElement(element) {
    const section = element.dataset.optionPart;
    if (!section) return;
    if ((section === 'logo' || section === 'logobg') && stateManager.get('logo.useCustom')) return;

    const isRal = element.dataset.isRal === '1';
    const colorValue = element.dataset.ralHex || null;
    const colorName = element.dataset.ralName || null;

    const batch = stateManager.startBatch();
    const variantCode = element.dataset.variantCode || '';
    const variantName = element.dataset.variantName || '';
    const ralCode = element.dataset.ral || element.dataset.ralCode || (isRal ? variantCode : null);

    batch(`${section}.variantCode`, variantCode);
    batch(`${section}.variant`, variantCode);
    batch(`${section}.variantName`, variantName);
    batch(`${section}.isRal`, isRal);
    batch(`${section}.color`, ralCode);
    batch(`${section}.colorValue`, colorValue);
    batch(`${section}.colorName`, colorName ? `RAL ${colorName}` : null);
    batch(`${section}.modelId`, parseInt(element.dataset.modelId || '0', 10));
    batch(`${section}.svgTargetMode`, element.dataset.svgTargetMode || null);
    batch(`${section}.svgLayerGroup`, element.dataset.svgLayerGroup || null);
    batch(`${section}.svgFilterId`, element.dataset.svgFilterId || null);
    batch(`${section}.svgSpecialKey`, element.dataset.svgSpecialKey || null);
    stateManager.endBatch();

    if (section === 'logobg') {
        stateManager.set('logo.bgColor', ralCode || null);
        stateManager.set('logo.bgColorValue', colorValue || null);
    }

    updateSVG();
    updateLogoSVG();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();
    updateUI();
}

export function initEventListeners() {
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.addEventListener('click', () => toggleSubmenu(item.dataset.section));
    });

    document.querySelectorAll('.back-button, .submenu-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.back || btn.closest('.submenu')?.id?.replace('submenu-', '');
            if (section) toggleSubmenu(section, true);
        });
    });

    document.querySelectorAll('.palette-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            const container = document.getElementById(`${section}-palette`);
            if (!container) return;
            const isOpen = container.style.display === 'block';
            container.style.display = isOpen ? 'none' : 'block';
        });
    });

    document.querySelectorAll('.option-button, .swatch').forEach(btn => {
        btn.addEventListener('click', () => applyOptionFromElement(btn));
    });

    document.querySelectorAll('.variant-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const modelCode = btn.dataset.variant;
            if (!modelCode || !window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode]) return;

            document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            window.CUSTOMIZER_DATA.currentModelCode = modelCode;
            window.CUSTOMIZER_DATA.currentModelId = window.CUSTOMIZER_DATA.modelsByCode[modelCode].ID;
            window.CUSTOMIZER_DATA.currentModelOptions = window.CUSTOMIZER_DATA.options[window.CUSTOMIZER_DATA.currentModelId] || window.CUSTOMIZER_DATA.options[0] || {};

            initHLDataManager();
            updateShockmountVisibility();
            updateShockmountLayers(stateManager.get());
            updateShockmountPreview();
            updateShockmountPinsPreview();
            updateSVG();
            updateUI();

            if (window.WoodCase) {
                window.WoodCase.setCase(modelCode);
            }
        });
    });
}

export function toggleSubmenu(section, forceClose = false) {
    const submenu = document.getElementById(`submenu-${section}`);
    const menuItem = document.querySelector(`[data-section="${section}"]`);
    if (!submenu || !menuItem) return;

    const isOpen = submenu.style.display === 'block';
    document.querySelectorAll('.submenu').forEach(sm => {
        sm.style.display = 'none';
    });
    if (!forceClose && !isOpen) {
        submenu.style.display = 'block';
    }
}
