// Model defaults module (delta)
// Применяет значения по умолчанию из HL данных для выбранной модели

import { stateManager } from '../core/state.js';
import { updateSectionLayers } from './appearance-new.js';
import { resolveConfiguredPrice } from './price-calculator.js';

/**
 * Получает цену опции из SECTION_OPTIONS или PRICES
 * @param {string} sectionKey - ключ секции
 * @param {string} variantCode - код варианта
 * @returns {number} цена
 */
function getOptionPrice(sectionKey, option = {}) {
    const variantCode = option.variantCode || '';
    const modelCode = stateManager.get('currentModelCode');
    const resolvedPrice = resolveConfiguredPrice(sectionKey, variantCode, modelCode, !!option.isRal);

    if (resolvedPrice !== null) {
        return resolvedPrice;
    }

    return option?.price || 0;
}

/**
 * Применяет значения по умолчанию для модели из HL данных
 * @param {string} modelCode - код модели
 */
export function applyModelDefaults(modelCode) {
    if (!modelCode) {
        console.warn('[ModelDefaults] No modelCode provided');
        return;
    }

    // Используем modelsByCode для поиска модели по коду
    const modelMap = window.CUSTOMIZER_DATA?.modelsByCode || {};
    const model = modelMap[modelCode];
    
    if (!model) {
        console.warn('[ModelDefaults] Model not found:', modelCode, 'Available models:', Object.keys(modelMap));
        return;
    }

    const defaults = model.DEFAULTS || {};
    
    console.log('[ModelDefaults] Applying defaults for model:', modelCode, defaults);

    // Логирование доступных опций по секциям
    console.group(`[Defaults] ${modelCode}`);
    Object.keys(defaults).forEach(section => {
        const def = defaults[section];
        const options = (window.CUSTOMIZER_DATA.sectionOptions?.[section] || [])
            .map(o => o.variantCode);
        console.log(
            `Section ${section}: default=${def.variantCode}, options=`,
            options
        );
    });
    console.groupEnd();

    // Проверяем наличие вариантов для пинов подвеса
    const pinsVariant = defaults.SHOCKMOUNT_PINS;
    const pinsOptions = (window.CUSTOMIZER_DATA.sectionOptions?.['shockmountPins'] || [])
        .map(o => o.variantCode);
    
    console.log('[ModelDefaults] Shockmount pins check:', {
        requestedVariant: pinsVariant,
        availableOptions: pinsOptions,
        isAvailable: pinsOptions.includes(pinsVariant)
    });

    if (pinsVariant && !pinsOptions.includes(pinsVariant)) {
        console.warn('[ModelDefaults] Shockmount pins variant not found:', pinsVariant, 'Available:', pinsOptions);
        // Ищем подходящий вариант
        const fallbackVariant = pinsOptions.find(opt => opt.includes('brass')) || pinsOptions[0];
        if (fallbackVariant) {
            console.log('[ModelDefaults] Using fallback pins variant:', fallbackVariant);
            defaults.SHOCKMOUNT_PINS = { variantCode: fallbackVariant };
        }
    }

    // Используем глобальный список опций по секциям, как в остальном коде
    const sectionOptionsMap = window.CUSTOMIZER_DATA.sectionOptions || window.CUSTOMIZER_DATA.optionsBySection || {};
    
    // Секции и соответствующие поля в defaults
    const sectionDefaults = {
        spheres: defaults.SPHERES,
        body: defaults.BODY,
        logo: defaults.LOGO,
        logobg: defaults.LOGOBG,
        shockmount: defaults.SHOCKMOUNT,
        shockmountPins: defaults.SHOCKMOUNT_PINS,
        shockmountOption: model.UF_DEFAULT_SHOCKMOUNT_OPTION
    };

    // Применяем значения для каждой секции
    Object.entries(sectionDefaults).forEach(([sectionKey, defaultVariantCode]) => {
        if (!defaultVariantCode) {
            console.log(`[ModelDefaults] No default variant for section: ${sectionKey}`);
            return;
        }

        // Используем глобальный список опций по секциям
        const options = sectionOptionsMap[sectionKey] || [];
        const defaultOption = options.find(opt => opt.variantCode === defaultVariantCode);

        if (!defaultOption) {
            console.warn(`[ModelDefaults] Default option not found: ${sectionKey} -> ${defaultVariantCode}`, 'Available options:', options.map(o => o.variantCode));
            return;
        }

        console.log(`[ModelDefaults] Applying default for ${sectionKey}:`, defaultOption);

        // Обновляем state секции
        const currentState = stateManager.get()[sectionKey] || {};
        const optionPrice = getOptionPrice(sectionKey, defaultOption);
        const newState = {
            ...currentState,
            variantCode: defaultOption.variantCode,
            variant: defaultOption.variantCode,
            variantName: defaultOption.variantName,
            isRal: defaultOption.isRal,
            color: defaultOption.color,
            colorValue: defaultOption.colorValue,
            colorName: defaultOption.colorName,
            modelId: defaultOption.modelId,
            svgTargetMode: defaultOption.svgTargetMode,
            svgLayerGroup: defaultOption.svgLayerGroup,
            svgFilterId: defaultOption.svgFilterId,
            svgSpecialKey: defaultOption.svgSpecialKey,
            price: optionPrice
        };

        // Для shockmount устанавливаем только цену цвета, базовая цена будет в shockmountOption
        if (sectionKey === 'shockmount') {
            const optionPriceValue = optionPrice || 0; // Цена цвета (3000)
            
            // Устанавливаем только цену цвета, без суммирования с базовой ценой
            newState.price = optionPriceValue;
        }
        
        // Для shockmountOption устанавливаем цену из правил ценообразования
        if (sectionKey === 'shockmountOption') {
            newState.price = optionPrice;
        }

        stateManager.set(sectionKey, newState);

        // Обновляем SVG если это не shockmount (чтобы не сломать текущую логику)
        if (sectionKey !== 'shockmount' && sectionKey !== 'shockmountPins' && sectionKey !== 'shockmountOption') {
            updateSectionLayers(sectionKey, newState);
        }
    });

    console.log('[ModelDefaults] Applied state snapshot:', {
        model: stateManager.get('currentModelCode'),
        spheres: stateManager.get('spheres')?.variant,
        body: stateManager.get('body')?.variant,
        logo: stateManager.get('logo')?.variant,
        logobg: stateManager.get('logobg')?.variant,
        shockmount: stateManager.get('shockmount')?.variant,
        shockmountPins: stateManager.get('shockmountPins')?.variant,
        shockmountOption: stateManager.get('shockmountOption')?.variant,
    });

    console.log('[ModelDefaults] All defaults applied for model:', modelCode);
}

/**
 * Проверяет, является ли модель моделью по умолчанию
 * @param {string} modelCode - код модели
 * @returns {boolean}
 */
export function isDefaultModel(modelCode) {
    const model = window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode];
    return !!model?.IS_DEFAULT_MODEL;
}
