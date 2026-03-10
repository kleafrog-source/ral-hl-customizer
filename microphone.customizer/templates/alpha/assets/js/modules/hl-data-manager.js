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
        currentModelId: data.currentModelId,
        currentModelCode: data.currentModelCode,
        currentModelOptions: data.currentModelOptions || {}
    });

    // Инициализируем опции для текущей модели
    initializeModelOptions(data.currentModelOptions, data.currentModelCode);

    // Устанавливаем базовые цены из HL-данных
    initializeModelPricing(data.modelsByCode, data.currentModelCode);
    
    // Загружаем цены из CustomizerPrices в price-calculator
    loadCustomPrices(data.prices);

    console.log('[HL Data Manager] Initialization complete');
}

/**
 * Инициализация опций для текущей модели
 */
function initializeModelOptions(modelOptions, modelCode) {
    if (!modelOptions) return;

    // Проходим по всем типам опций и устанавливаем начальные значения
    Object.keys(modelOptions).forEach(viewType => {
        const options = modelOptions[viewType];
        if (!options || options.length === 0) return;

        // Находим первую активную опцию
        const firstOption = options.find(opt => opt.UF_ACTIVE !== '0');
        if (!firstOption) return;

        // Устанавливаем начальное состояние для этого типа опции
        const sectionKey = getSectionKeyFromViewType(viewType);
        if (!sectionKey) return;

        // Определяем значение и цвет
        let value = firstOption.UF_VARIANT_CODE;
        let hex = '';
        let variant = 'non-ral';

        // Если это RAL-цвет
        if (firstOption.UF_IS_RAL && firstOption.RAL_DATA) {
            hex = firstOption.RAL_DATA.UF_HEX;
            variant = 'ral';
        } else if (firstOption.UF_HEX) {
            hex = firstOption.UF_HEX;
        }

        // Устанавливаем в state
        stateManager.set(`${sectionKey}.color`, value);
        stateManager.set(`${sectionKey}.colorValue`, hex);
        stateManager.set(`${sectionKey}.variant`, variant);
        stateManager.set(`${sectionKey}.optionId`, firstOption.ID);

        // Special case for shockmount: OFF by default for 023-the-bomblet
        if (sectionKey === 'shockmount') {
            const isBomblet = modelCode === 'bomblet' || modelCode === '023-the-bomblet';
            stateManager.set('shockmount.enabled', !isBomblet);
        }

        // Use model series from HL data if available
        const hlData = stateManager.get('hlData');
        const modelInfo = hlData?.modelsByCode[modelCode];
        if (modelInfo) {
            const series = modelCode.includes('023') ? '023' : '017';
            stateManager.set('model', series);
        }

        console.log(`[HL Data Manager] Set initial ${sectionKey}:`, {
            value,
            hex,
            variant,
            optionId: firstOption.ID
        });
    });
}

/**
 * Инициализация ценообразования на основе данных модели
 */
function initializeModelPricing(modelsByCode, currentModelCode) {
    if (!modelsByCode || !currentModelCode) return;

    const currentModel = modelsByCode[currentModelCode];
    if (!currentModel) return;

    // Устанавливаем базовую цену модели
    stateManager.set('basePrice', currentModel.UF_BASE_PRICE || 0);
    
    // Устанавливаем информацию о модели
    stateManager.set('currentModel', {
        id: currentModel.ID,
        code: currentModel.UF_CODE,
        name: currentModel.UF_NAME,
        basePrice: currentModel.UF_BASE_PRICE,
        shockmountEnabled: currentModel.UF_SHOCKMOUNT_ENABLED,
        shockmountPrice: currentModel.UF_SHOCKMOUNT_PRICE
    });

    console.log('[HL Data Manager] Model pricing initialized:', {
        model: currentModelCode,
        basePrice: currentModel.UF_BASE_PRICE,
        shockmountEnabled: currentModel.UF_SHOCKMOUNT_ENABLED
    });
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
 * Получение информации о текущей модели
 */
export function getCurrentModel() {
    return stateManager.get('currentModel');
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
