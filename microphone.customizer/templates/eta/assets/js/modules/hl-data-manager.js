// HL DATA MANAGER (eta)

import { stateManager } from '../core/state.js';
import { supportsMalfaLogos } from '../config/model-capabilities.js';
import { loadCustomPrices } from './price-calculator.js';
import { debugLog } from '../utils/debug.js';

const MALFA_VARIANTS = new Set(['malfasilver', 'malfagold']);

function parseBoolFlag(value) {
    return value === 1 || value === true;
}

function parseModelId(value) {
    return parseInt(value || '0', 10) || 0;
}

function getCurrentModelData(modelCode) {
    return window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode] || null;
}

function mapOptionToState(option) {
    const isRal = parseBoolFlag(option.UF_IS_RAL);
    const ralCode = option.RAL_DATA?.UF_CODE || null;
    return {
        variantCode: option.UF_VARIANT_CODE || '',
        variant: option.UF_VARIANT_CODE || '',
        variantName: option.UF_VARIANT_NAME || '',
        isRal,
        isFree: parseBoolFlag(option.UF_IS_FREE),
        color: ralCode,
        colorValue: option.RAL_DATA?.UF_HEX || null,
        colorName: option.RAL_DATA?.UF_NAME || null,
        floodOpacity: option.RAL_DATA?.UF_FLOOD_OPACITY || null,
        modelId: parseModelId(option.UF_MODEL_ID),
        svgTargetMode: option.UF_SVG_TARGET_MODE || null,
        svgLayerGroup: option.UF_SVG_LAYER_GROUP || null,
        svgFilterId: option.UF_SVG_FILTER_ID || null,
        svgSpecialKey: option.UF_SVG_SPECIAL_KEY || null
    };
}

function mapOptionForSection(option) {
    const isRal = parseBoolFlag(option.UF_IS_RAL);
    const isFree = parseBoolFlag(option.UF_IS_FREE);
    const isRalPaid = parseBoolFlag(option.IS_RAL_PAID) ? true : !isFree;
    return {
        variantCode: option.UF_VARIANT_CODE || '',
        variantName: option.UF_VARIANT_NAME || '',
        isRal,
        isFree,
        isRalPaid,
        price: parseInt(option.UF_PRICE || '0', 10) || 0,
        color: option.UF_RAL_COLOR_CODE || '',
        colorValue: option.RAL_DATA?.UF_HEX || '',
        colorName: option.RAL_DATA?.UF_NAME || '',
        modelId: parseModelId(option.UF_MODEL_ID),
        svgTargetMode: option.UF_SVG_TARGET_MODE || '',
        svgLayerGroup: option.UF_SVG_LAYER_GROUP || '',
        svgFilterId: option.UF_SVG_FILTER_ID || '',
        svgSpecialKey: option.UF_SVG_SPECIAL_KEY || ''
    };
}

function buildInitialHlData(data) {
    return {
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
    };
}

function initializeSectionStates(currentModelOptions) {
    stateManager.batch((batch) => {
        Object.keys(currentModelOptions || {}).forEach((section) => {
            const firstOption = currentModelOptions[section]?.[0];
            if (!firstOption) {
                return;
            }

            batch(section, mapOptionToState(firstOption));
        });
    });
}

function syncInitialLogoBackgroundState() {
    const logobgState = stateManager.get('logobg');
    if (!logobgState) {
        return;
    }

    stateManager.batch((batch) => {
        batch('logo.bgColor', logobgState.color || null);
        batch('logo.bgColorValue', logobgState.colorValue || null);
    });
}

export function buildCurrentModelOptions(modelCode) {
    const data = window.CUSTOMIZER_DATA || {};
    const model = getCurrentModelData(modelCode);
    if (!model) {
        return {};
    }

    const currentModelId = parseModelId(model.ID);
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
            const optionModelId = parseModelId(option.UF_MODEL_ID);
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
    const model = getCurrentModelData(modelCode) || {};
    const currentModelOptions = buildCurrentModelOptions(modelCode);
    const sectionOptions = Object.fromEntries(
        Object.entries(currentModelOptions).map(([sectionKey, options]) => [
            sectionKey,
            (options || []).map(mapOptionForSection)
        ])
    );

    window.CUSTOMIZER_DATA.currentModelCode = modelCode;
    window.CUSTOMIZER_DATA.currentModelId = parseModelId(model.ID);
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
    debugLog('[HL Data Manager] CUSTOMIZER_DATA:', data);
    debugLog('[HL Data Manager] modelsByCode:', data.modelsByCode);

    stateManager.set('hlData', buildInitialHlData(data));

    const currentModel = getCurrentModelData(data.currentModelCode);
    debugLog('[HL Data Manager] Current model:', currentModel);
    debugLog('[HL Data Manager] MODEL_SERIES:', currentModel?.MODEL_SERIES);
    debugLog('[HL Data Manager] DEFAULT_SHOCKMOUNT_OPTION:', currentModel?.UF_DEFAULT_SHOCKMOUNT_OPTION);
    stateManager.batch((batch) => {
        batch('currentModelCode', data.currentModelCode || null);
        batch('currentModelId', data.currentModelId || null);
        batch('modelSeries', currentModel?.MODEL_SERIES || null);
        batch('basePrice', currentModel?.BASE_PRICE || 0);
        batch('defaultShockmountOption', currentModel?.UF_DEFAULT_SHOCKMOUNT_OPTION || null);
    });

    const { currentModelOptions } = syncCurrentModelOptionData(data.currentModelCode || null);

    initializeSectionStates(currentModelOptions);

    syncInitialLogoBackgroundState();

    // Initialize toggles - НЕ выполняем инициализацию shockmount здесь, так как она делается в main.js
    
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
