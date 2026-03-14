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

    // Initialize toggles
    const toggleData = data.liquidToggles || {};
    if (toggleData.shockmount) {
        // Shockmount behavior based on HL data:
        const currentModel = data.modelsByCode?.[data.currentModelCode] || null;
        const shockmountEnabled = !!currentModel?.SHOCKMOUNT_ENABLED;
        const shockmountPrice = currentModel?.SHOCKMOUNT_PRICE || 0;
        
        // Если UF_SHOCKMOUNT_ENABLED = 1, то подвес включен в комплект (toggle скрыт, всегда включен)
        // Если UF_SHOCKMOUNT_ENABLED = 0, то подвес платный (toggle виден, пользователь решает)
        const available = !shockmountEnabled; // Toggle доступен только если подвес не включен в комплект
        const included = shockmountEnabled && shockmountPrice === 0;
        const enabled = shockmountEnabled; // Если включен в комплект, то всегда включен

        stateManager.set('shockmount.available', available);
        stateManager.set('shockmount.included', included);
        stateManager.set('shockmount.enabled', enabled);
        stateManager.set('shockmount.togglePrice', toggleData.shockmount.price || 0);
    }

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
