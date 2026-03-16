// HL DATA MANAGER (delta)

import { stateManager } from '../core/state.js';
import { loadCustomPrices } from './price-calculator.js';

function mapOptionToState(option) {
    const isRal = option.UF_IS_RAL === 1 || option.UF_IS_RAL === true;
    const ralCode = option.RAL_DATA?.UF_CODE || null;
    return {
        variantCode: option.UF_VARIANT_CODE || '',
        variant: option.UF_VARIANT_CODE || '',
        variantName: option.UF_VARIANT_NAME || '',
        isRal,
        isFree: option.UF_IS_FREE === 1 || option.UF_IS_FREE === true,
        color: ralCode,
        colorValue: option.RAL_DATA?.UF_HEX || null,
        colorName: option.RAL_DATA?.UF_NAME || null,
        modelId: option.UF_MODEL_ID || 0,
        svgTargetMode: option.UF_SVG_TARGET_MODE || null,
        svgLayerGroup: option.UF_SVG_LAYER_GROUP || null,
        svgFilterId: option.UF_SVG_FILTER_ID || null,
        svgSpecialKey: option.UF_SVG_SPECIAL_KEY || null
    };
}

export function initHLDataManager() {
    if (!window.CUSTOMIZER_DATA) {
        console.error('[HL Data Manager] CUSTOMIZER_DATA not found');
        return;
    }

    const data = window.CUSTOMIZER_DATA;

    stateManager.set('hlData', {
        ralColors: data.ralColors || {},
        models: data.models || {},
        modelsByCode: data.modelsByCode || {},
        options: data.options || {},
        prices: data.prices || {},
        viewTypeMap: data.viewTypeMap || {},
        currentModelId: data.currentModelId,
        currentModelCode: data.currentModelCode,
        currentModelOptions: data.currentModelOptions || {},
        liquidToggles: data.liquidToggles || {}
    });

    const currentModel = data.modelsByCode?.[data.currentModelCode] || null;
    stateManager.set('currentModelCode', data.currentModelCode || null);
    stateManager.set('currentModelId', data.currentModelId || null);
    stateManager.set('modelSeries', currentModel?.MODEL_SERIES || null);
    stateManager.set('basePrice', currentModel?.BASE_PRICE || 0);

    // Initialize options for each section based on current model options
    const sectionOptions = data.currentModelOptions || {};
    Object.keys(sectionOptions).forEach(section => {
        const firstOption = sectionOptions[section]?.[0];
        if (!firstOption) return;
        stateManager.set(section, mapOptionToState(firstOption));
    });

    const logobgState = stateManager.get('logobg');
    if (logobgState) {
        stateManager.set('logo.bgColor', logobgState.color || null);
        stateManager.set('logo.bgColorValue', logobgState.colorValue || null);
    }

    // Initialize toggles - всегда выполняем инициализацию shockmount
    const toggleData = data.liquidToggles || {};
    
    // Используем уже существующую переменную currentModel
    const visible = currentModel?.SHOCKMOUNT_VISIBLE === 1; // Видим только когда включен
    const canToggle = currentModel?.SHOCKMOUNT_TOGGLE === 1; // Toggle видим/скрыт
    const enabled = currentModel?.SHOCKMOUNT_ENABLED === 1; // Toggle положение
    const price = currentModel?.SHOCKMOUNT_PRICE || 0;
    const included = currentModel?.SHOCKMOUNT_ENABLED === 1; // Включен в комплект?

    stateManager.set('shockmount.visible', visible);
    stateManager.set('shockmount.canToggle', canToggle);
    stateManager.set('shockmount.included', included);
    stateManager.set('shockmount.enabled', enabled);
    stateManager.set('shockmount.price', price);
    stateManager.set('shockmount.togglePrice', toggleData.shockmount?.price || 0);

    loadCustomPrices(data.prices || {});
}

export function getOptionsForSection(sectionCode) {
    const hlData = stateManager.get('hlData');
    return hlData?.currentModelOptions?.[sectionCode] || [];
}

export function getRalColorById(id) {
    const hlData = stateManager.get('hlData');
    return hlData?.ralColors?.[id] || null;
}

export function getCurrentModel() {
    const hlData = stateManager.get('hlData');
    return hlData?.modelsByCode?.[hlData?.currentModelCode] || null;
}

export function getViewTypeMap() {
    const hlData = stateManager.get('hlData');
    return hlData?.viewTypeMap || {};
}

export function findOptionByVariantCode(sectionCode, variantCode) {
    if (!sectionCode || !variantCode) return null;
    const hlData = stateManager.get('hlData');
    const options = hlData?.currentModelOptions?.[sectionCode] || [];
    return options.find(option => option.UF_VARIANT_CODE === variantCode) || null;
}
