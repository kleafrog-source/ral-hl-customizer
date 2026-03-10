// ============================================
// HL DATA MANAGER - Управление данными из Highload-блоков Битрикс
// ============================================

import { stateManager } from '../core/state.js';
import { loadCustomPrices } from './price-calculator.js';

/**
 * Инициализация менеджера данных HL-блоков
 */
export function initHLDataManager() {
    if (!window.CUSTOMIZER_DATA) {
        console.error('[HL Data Manager] CUSTOMIZER_DATA not found');
        return;
    }

    const data = window.CUSTOMIZER_DATA;
    
    console.log('[HL Data Manager] Initializing with data:', data);

    // Сохраняем данные в state manager
    stateManager.set('hlData', {
        ralColors: data.ralColors || {},
        models: data.models || {},
        modelsByCode: data.modelsByCode || {},
        options: data.options || {},
        prices: data.prices || {},
        viewTypeMap: data.viewTypeMap || {},
        currentModelId: data.currentModelId,
        currentModelCode: data.currentModelCode,
        currentModelOptions: data.currentModelOptions || {}
    });

    // Инициализируем опции для текущей модели
    initializeModelOptions(data.currentModelOptions, data.currentModelCode);

    // Устанавливаем базовые цены из HL-данных
    initializeModelPricing(data.modelsByCode, data.currentModelCode);
    
    // Устанавливаем серию модели в state
    const currentModel = data.modelsByCode[data.currentModelCode];
    if (currentModel && currentModel.MODEL_SERIES) {
        stateManager.set('modelSeries', currentModel.MODEL_SERIES);
    } else if (currentModel && currentModel.UF_MODEL_SERIES) {
        stateManager.set('modelSeries', currentModel.UF_MODEL_SERIES);
    } else {
        // Fallback если поле не заполнено
        const series = data.currentModelCode.includes('017') ? '017' : '023';
        stateManager.set('modelSeries', series);
    }

    // Загружаем цены из CustomizerPrices в price-calculator
    loadCustomPrices(data.prices);

    console.log('[HL Data Manager] Initialization complete');
}

/**
 * Инициализация опций для текущей модели
 */
function initializeModelOptions(modelOptions, modelCode) {
    if (!modelOptions) return;

    console.log('[HL Data Manager] Initializing model options:', modelOptions);

    // Устанавливаем опции для каждой секции
    Object.keys(modelOptions).forEach(sectionCode => {
        const options = modelOptions[sectionCode];
        if (options && Array.isArray(options)) {
            // Устанавливаем первый вариант как активный для каждой секции
            const firstOption = options[0];
            if (firstOption) {
                // Определяем variant на основе новых полей
                let variant = firstOption.UF_VARIANT_CODE;
                
                // Для RAL вариантов используем специальную логику
                if (firstOption.UF_IS_RAL && firstOption.UF_RAL_COLOR_ID) {
                    variant = 'ral'; // Стандартный RAL вариант
                }
                
                // Устанавливаем состояние для секции
                stateManager.set(sectionCode, {
                    variant: variant,
                    color: firstOption.UF_RAL_COLOR_ID || null,
                    colorValue: firstOption.RAL_DATA?.UF_HEX || null,
                    colorName: firstOption.RAL_DATA?.UF_NAME || null,
                    name: firstOption.UF_VARIANT_NAME,
                    isRal: firstOption.UF_IS_RAL === 1,
                    isFree: firstOption.UF_IS_FREE === 1,
                    price: firstOption.UF_PRICE || 0,
                    modelId: firstOption.UF_MODEL_ID || null,
                    
                    // Новые SVG поля
                    svgTargetMode: firstOption.svgTargetMode || null,
                    svgLayerGroup: firstOption.svgLayerGroup || null,
                    svgFilterId: firstOption.svgFilterId || null,
                    svgSpecialKey: firstOption.svgSpecialKey || null
                });
            }
        }
    });

    // Устанавливаем состояние для spheres и body по умолчанию
    if (!stateManager.get('spheres')) {
        const spheresOptions = modelOptions.spheres || [];
        const defaultSpheres = spheresOptions.find(opt => opt.UF_VARIANT_CODE === 'spheres-brass');
        if (defaultSpheres) {
            stateManager.set('spheres', {
                variant: 'spheres-brass',
                color: null,
                colorValue: null,
                colorName: null,
                name: defaultSpheres.UF_VARIANT_NAME,
                isRal: false,
                isFree: true,
                price: 0,
                modelId: null,
                svgTargetMode: defaultSpheres.svgTargetMode || 'original',
                svgLayerGroup: defaultSpheres.svgLayerGroup || 'spheres-original-2',
                svgFilterId: defaultSpheres.svgFilterId || null,
                svgSpecialKey: defaultSpheres.svgSpecialKey || null
            });
        }
    }

    if (!stateManager.get('body')) {
        const bodyOptions = modelOptions.body || [];
        const defaultBody = bodyOptions.find(opt => opt.UF_VARIANT_CODE === 'body-satinsteel');
        if (defaultBody) {
            stateManager.set('body', {
                variant: 'body-satinsteel',
                color: null,
                colorValue: null,
                colorName: null,
                name: defaultBody.UF_VARIANT_NAME,
                isRal: false,
                isFree: true,
                price: 0,
                modelId: null,
                svgTargetMode: defaultBody.svgTargetMode || 'original',
                svgLayerGroup: defaultBody.svgLayerGroup || 'body-original-3',
                svgFilterId: defaultBody.svgFilterId || null,
                svgSpecialKey: defaultBody.svgSpecialKey || null
            });
        }
    }
}

/**
 * Инициализация цен модели
 */
function initializeModelPricing(modelsByCode, modelCode) {
    if (!modelsByCode || !modelCode) return;

    const currentModel = modelsByCode[modelCode];
    if (!currentModel) {
        console.warn('[HL Data Manager] Model not found:', modelCode);
        return;
    }

    console.log('[HL Data Manager] Initializing pricing for model:', currentModel);

    // Устанавливаем базовую цену (поддерживаем оба формата полей)
    const basePrice = currentModel.UF_BASE_PRICE || currentModel.BASE_PRICE || 0;
    stateManager.set('basePrice', basePrice);
    
    // Устанавливаем информацию о подвесе
    const shockmountEnabled = (currentModel.UF_SHOCKMOUNT_ENABLED !== undefined) 
        ? currentModel.UF_SHOCKMOUNT_ENABLED === 1 
        : currentModel.SHOCKMOUNT_ENABLED === 1;
    
    const shockmountPrice = currentModel.UF_SHOCKMOUNT_PRICE || currentModel.SHOCKMOUNT_PRICE || 0;

    // Устанавливаем информацию о текущей модели в стейт
    stateManager.set('currentModel', {
        id: currentModel.ID,
        code: currentModel.UF_CODE || currentModel.CODE || modelCode,
        name: currentModel.UF_NAME || currentModel.NAME || '',
        basePrice: basePrice,
        shockmountEnabled: shockmountEnabled,
        shockmountPrice: shockmountPrice
    });

    console.log('[HL Data Manager] Model pricing initialized:', {
        model: modelCode,
        basePrice: basePrice,
        shockmountEnabled: shockmountEnabled
    });
}

/**
 * Получение опций для секции
 */
export function getOptionsForSection(sectionCode) {
    const hlData = stateManager.get('hlData');
    return hlData.options?.[sectionCode] || [];
}

/**
 * Получение RAL цвета по ID
 */
export function getRalColorById(ralId) {
    const hlData = stateManager.get('ralColors') || stateManager.get('hlData')?.ralColors;
    return hlData?.[ralId] || null;
}

/**
 * Получение информации о текущей модели
 */
export function getCurrentModel() {
    return stateManager.get('currentModel') || stateManager.get('hlData')?.modelsByCode?.[stateManager.get('currentModelCode')];
}

/**
 * Получение маппинга типов представлений
 */
export function getViewTypeMap() {
    const hlData = stateManager.get('hlData');
    return hlData.viewTypeMap || {};
}

/**
 * Обновление опций при смене модели
 */
export function updateModelOptions(modelCode) {
    const hlData = stateManager.get('hlData');
    const model = hlData.modelsByCode?.[modelCode];
    
    if (!model) {
        console.warn('[HL Data Manager] Model not found for update:', modelCode);
        return;
    }

    console.log('[HL Data Manager] Updating model options for:', modelCode);

    // Обновляем текущую модель
    stateManager.set('currentModelCode', modelCode);
    stateManager.set('currentModelId', model.ID);
    
    // Инициализируем опции новой модели
    const modelOptions = hlData.options?.[model.ID] || hlData.options?.[0] || {};
    initializeModelOptions(modelOptions, modelCode);
    
    // Обновляем цены
    initializeModelPricing(hlData.modelsByCode, modelCode);
}

/**
 * Преобразование viewType в ключ секции для state
 */
function getSectionKeyFromViewType(viewType) {
    const sectionMap = {
        'spheres': 'spheres',
        'body': 'body', 
        'logo': 'logo',
        'logoBg': 'logoBg',
        'case': 'case',
        'shockmount': 'shockmount',
        'shockmountPins': 'shockmountPins'
    };
    
    return sectionMap[viewType] || null;
}

/**
 * Получение опций для текущей модели по viewType
 */
export function getCurrentModelOptions(viewType = null) {
    const hlData = stateManager.get('hlData');
    if (!hlData || !hlData.currentModelOptions) return {};

    if (viewType) {
        return hlData.currentModelOptions[viewType] || [];
    }
    
    return hlData.currentModelOptions;
}

/**
 * Получение RAL-цветов
 */
export function getRalColors() {
    const hlData = stateManager.get('hlData');
    return hlData?.ralColors || {};
}

/**
 * Поиск опции по variant_code
 */
export function findOptionByVariantCode(variantCode, viewType = null) {
    const options = getCurrentModelOptions(viewType);
    
    for (const [type, typeOptions] of Object.entries(options)) {
        if (viewType && type !== viewType) continue;
        
        const found = typeOptions.find(opt => opt.UF_VARIANT_CODE === variantCode);
        if (found) return found;
    }
    
    return null;
}

/**
 * Обновление состояния на основе выбранной опции
 */
export function updateStateFromOption(option, sectionKey) {
    if (!option || !sectionKey) return;

    let value = option.UF_VARIANT_CODE;
    let hex = '';
    let variant = 'non-ral';

    // Если это RAL-цвет
    if (option.UF_IS_RAL && option.RAL_DATA) {
        hex = option.RAL_DATA.UF_HEX;
        variant = 'ral';
    } else if (option.UF_HEX) {
        hex = option.UF_HEX;
    }

    // Обновляем state
    stateManager.set(`${sectionKey}.color`, value);
    stateManager.set(`${sectionKey}.colorValue`, hex);
    stateManager.set(`${sectionKey}.variant`, variant);
    stateManager.set(`${sectionKey}.optionId`, option.ID);

    console.log(`[HL Data Manager] Updated ${sectionKey} from option:`, {
        value,
        hex,
        variant,
        optionId: option.ID
    });
}
