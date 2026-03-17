// Model defaults module (delta)
// Применяет значения по умолчанию из HL данных для выбранной модели

import { stateManager } from '../core/state.js';
import { updateSectionLayers } from './appearance-new.js';

/**
 * Получает цену опции из SECTION_OPTIONS или PRICES
 * @param {string} sectionKey - ключ секции
 * @param {string} variantCode - код варианта
 * @returns {number} цена
 */
function getOptionPrice(sectionKey, variantCode) {
    // Try to resolve via PRICES first (it's more reliable for specific model/variant pairs)
    const prices = window.CUSTOMIZER_DATA.prices?.[sectionKey];
    const modelCode = stateManager.get('currentModelCode');

    if (prices) {
        if (modelCode && variantCode && prices[modelCode]?.[variantCode] !== undefined) {
            return Number(prices[modelCode][variantCode]);
        }
        if (prices['']?.[''] !== undefined) {
            return Number(prices['']['']);
        }
    }

    const sectionOptions = window.CUSTOMIZER_DATA.sectionOptions?.[sectionKey] || [];
    const option = sectionOptions.find(opt => opt.variantCode === variantCode);
    // FIXME: default price path differs from click handler (should ideally use resolveOptionPrice logic)
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
        const optionPrice = getOptionPrice(sectionKey, defaultVariantCode);
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
            
            console.log('[ModelDefaults] Shockmount price calculation:', {
                sectionKey,
                optionPriceValue,
                oldPrice: currentState.price
            });
            
            // Устанавливаем только цену цвета, без суммирования с базовой ценой
            newState.price = optionPriceValue;
            console.log('[ModelDefaults] Color price only:', newState.price);
        }
        
        // Для shockmountOption устанавливаем цену из правил ценообразования
        if (sectionKey === 'shockmountOption') {
            // Цена для shockmountOption берется из PRICES по правилу shockmountOption
            const prices = window.CUSTOMIZER_DATA.prices?.['shockmountOption'];
            const optionPriceForShockmount = prices?.[modelCode]?.[defaultVariantCode] || 0;
            
            console.log('[ModelDefaults] ShockmountOption price calculation:', {
                sectionKey,
                modelCode,
                variantCode: defaultVariantCode,
                price: optionPriceForShockmount
            });
            
            newState.price = optionPriceForShockmount;
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
