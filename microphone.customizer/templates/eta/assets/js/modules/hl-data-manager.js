// HL DATA MANAGER (delta)

import { stateManager } from '../core/state.js';
import { supportsMalfaLogos } from '../config/model-capabilities.js';
import { loadCustomPrices } from './price-calculator.js';

const MALFA_VARIANTS = new Set(['malfasilver', 'malfagold']);

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
        floodOpacity: option.RAL_DATA?.UF_FLOOD_OPACITY || null,
        modelId: option.UF_MODEL_ID || 0,
        svgTargetMode: option.UF_SVG_TARGET_MODE || null,
        svgLayerGroup: option.UF_SVG_LAYER_GROUP || null,
        svgFilterId: option.UF_SVG_FILTER_ID || null,
        svgSpecialKey: option.UF_SVG_SPECIAL_KEY || null
    };
}

function mapOptionForSection(option) {
    const isRal = option.UF_IS_RAL === 1 || option.UF_IS_RAL === true;
    return {
        variantCode: option.UF_VARIANT_CODE || '',
        variantName: option.UF_VARIANT_NAME || '',
        isRal,
        isFree: option.UF_IS_FREE === 1 || option.UF_IS_FREE === true,
        isRalPaid: option.IS_RAL_PAID === 1 || option.IS_RAL_PAID === true ? true : !(option.UF_IS_FREE === 1 || option.UF_IS_FREE === true),
        price: parseInt(option.UF_PRICE || '0', 10) || 0,
        color: option.UF_RAL_COLOR_CODE || '',
        colorValue: option.RAL_DATA?.UF_HEX || '',
        colorName: option.RAL_DATA?.UF_NAME || '',
        modelId: parseInt(option.UF_MODEL_ID || '0', 10) || 0,
        svgTargetMode: option.UF_SVG_TARGET_MODE || '',
        svgLayerGroup: option.UF_SVG_LAYER_GROUP || '',
        svgFilterId: option.UF_SVG_FILTER_ID || '',
        svgSpecialKey: option.UF_SVG_SPECIAL_KEY || ''
    };
}

export function buildCurrentModelOptions(modelCode) {
    const data = window.CUSTOMIZER_DATA || {};
    const model = data.modelsByCode?.[modelCode];
    if (!model) {
        return {};
    }

    const currentModelId = parseInt(model.ID || '0', 10) || 0;
    const currentSeries = String(model.MODEL_SERIES || '');
    const allowMalfaLogos = supportsMalfaLogos(modelCode);
    const allOptions = data.options || {};
    const merged = {};

    const appendSectionOptions = (source) => {
        Object.entries(source || {}).forEach(([sectionCode, sectionOptions]) => {
            if (!Array.isArray(sectionOptions)) {
                return;
            }

            if (!merged[sectionCode]) {
                merged[sectionCode] = [];
            }

            merged[sectionCode].push(...sectionOptions);
        });
    };

    appendSectionOptions(allOptions[0]);
    appendSectionOptions(allOptions[currentModelId]);

    Object.keys(merged).forEach((sectionCode) => {
        merged[sectionCode] = merged[sectionCode].filter((option) => {
            const optionModelId = parseInt(option.UF_MODEL_ID || '0', 10) || 0;
            if (optionModelId > 0 && optionModelId !== currentModelId) {
                return false;
            }

            const seriesVar = String(option.SERIES_VAR || option.UF_SERIESVAR || '');
            if (seriesVar && seriesVar !== currentSeries) {
                return false;
            }

            const variantCode = String(option.UF_VARIANT_CODE || '');
            if (sectionCode === 'logo' && !allowMalfaLogos && MALFA_VARIANTS.has(variantCode)) {
                return false;
            }

            return true;
        });
    });

    return merged;
}

export function syncCurrentModelOptionData(modelCode) {
    const model = window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode] || {};
    const currentModelOptions = buildCurrentModelOptions(modelCode);
    const sectionOptions = Object.fromEntries(
        Object.entries(currentModelOptions).map(([sectionKey, options]) => [
            sectionKey,
            (options || []).map(mapOptionForSection)
        ])
    );

    window.CUSTOMIZER_DATA.currentModelCode = modelCode;
    window.CUSTOMIZER_DATA.currentModelId = parseInt(model.ID || '0', 10) || 0;
    window.CUSTOMIZER_DATA.currentModelOptions = currentModelOptions;
    window.CUSTOMIZER_DATA.sectionOptions = sectionOptions;
    window.CUSTOMIZER_DATA.optionsBySection = sectionOptions;

    const hlData = stateManager.get('hlData') || {};
    stateManager.set('hlData', {
        ...hlData,
        currentModelCode: modelCode,
        currentModelId: window.CUSTOMIZER_DATA.currentModelId,
        currentModelOptions
    });

    return { currentModelOptions, sectionOptions };
}

export function initHLDataManager() {
    if (!window.CUSTOMIZER_DATA) {
        console.error('[HL Data Manager] CUSTOMIZER_DATA not found');
        return;
    }

    const data = window.CUSTOMIZER_DATA;
    console.log('[HL Data Manager] CUSTOMIZER_DATA:', data);
    console.log('[HL Data Manager] modelsByCode:', data.modelsByCode);

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
    console.log('[HL Data Manager] Current model:', currentModel);
    console.log('[HL Data Manager] MODEL_SERIES:', currentModel?.MODEL_SERIES);
    console.log('[HL Data Manager] DEFAULT_SHOCKMOUNT_OPTION:', currentModel?.UF_DEFAULT_SHOCKMOUNT_OPTION);
    stateManager.set('currentModelCode', data.currentModelCode || null);
    stateManager.set('currentModelId', data.currentModelId || null);
    stateManager.set('modelSeries', currentModel?.MODEL_SERIES || null);
    stateManager.set('basePrice', currentModel?.BASE_PRICE || 0);
    stateManager.set('defaultShockmountOption', currentModel?.UF_DEFAULT_SHOCKMOUNT_OPTION || null);

    syncCurrentModelOptionData(data.currentModelCode || null);

    // Initialize options for each section based on current model options
    const sectionOptions = stateManager.get('hlData')?.currentModelOptions || {};
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

    // Initialize toggles - НЕ выполняем инициализацию shockmount здесь, так как она делается в main.js
    const toggleData = data.liquidToggles || {};
    
    // НЕ переопределяем shockmount состояние - оно уже установлено в main.js
    // Это позволяет избежать конфликта инициализации

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
