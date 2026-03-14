// Model defaults module (delta)
// Применяет значения по умолчанию из HL данных для выбранной модели

import { stateManager } from '../core/state.js';
import { updateSectionLayers } from './appearance-new.js';

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

    // Используем глобальный список опций по секциям, как в остальном коде
    const sectionOptionsMap = window.CUSTOMIZER_DATA.sectionOptions || window.CUSTOMIZER_DATA.optionsBySection || {};
    
    // Секции и соответствующие поля в defaults
    const sectionDefaults = {
        spheres: defaults.SPHERES,
        body: defaults.BODY,
        logo: defaults.LOGO,
        logobg: defaults.LOGOBG,
        shockmount: defaults.SHOCKMOUNT,
        shockmountPins: defaults.SHOCKMOUNT_PINS
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
            svgSpecialKey: defaultOption.svgSpecialKey
        };

        stateManager.set(sectionKey, newState);

        // Обновляем SVG если это не shockmount (чтобы не сломать текущую логику)
        if (sectionKey !== 'shockmount' && sectionKey !== 'shockmountPins') {
            updateSectionLayers(sectionKey, newState);
        }
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
