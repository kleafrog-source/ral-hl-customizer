import { stateManager } from '../core/state.js';
import { buildShockmountState } from '../config/model-capabilities.js';
import { updateSectionLayers } from './appearance-new.js';
import { resolveConfiguredPrice } from './price-calculator.js';
import { debugLog, isRuntimeDebugEnabled } from '../utils/debug.js';

function getDefaultVariantCode(defaultValue) {
    if (!defaultValue) {
        return '';
    }

    if (typeof defaultValue === 'string') {
        return defaultValue;
    }

    if (typeof defaultValue === 'object') {
        return defaultValue.variantCode || defaultValue.variant || '';
    }

    return String(defaultValue);
}

function getOptionPrice(sectionKey, option = {}) {
    if (option.isRal && (option.isFree || option.isRalPaid === false)) {
        return 0;
    }

    const variantCode = option.variantCode || '';
    const modelCode = stateManager.get('currentModelCode');
    const resolvedPrice = resolveConfiguredPrice(sectionKey, variantCode, modelCode, !!option.isRal);

    if (resolvedPrice !== null) {
        return resolvedPrice;
    }

    return option?.price || 0;
}

function getFallbackVariantCode(sectionKey, options = []) {
    if (!options.length) {
        return '';
    }

    if (sectionKey === 'shockmountPins') {
        return options.find((option) => option.variantCode?.includes('brass'))?.variantCode || options[0].variantCode || '';
    }

    return options[0].variantCode || '';
}

function resolveDefaultOption(sectionKey, requestedVariantCode, options = []) {
    const directMatch = options.find((option) => option.variantCode === requestedVariantCode);
    if (directMatch) {
        return directMatch;
    }

    const fallbackVariantCode = getFallbackVariantCode(sectionKey, options);
    if (!fallbackVariantCode) {
        return null;
    }

    const fallbackOption = options.find((option) => option.variantCode === fallbackVariantCode) || null;
    if (fallbackOption && requestedVariantCode && requestedVariantCode !== fallbackVariantCode) {
        debugLog(
            `[ModelDefaults] Fallback for ${sectionKey}: requested=${requestedVariantCode}, fallback=${fallbackVariantCode}`
        );
    }

    return fallbackOption;
}

function getSectionDefaults(model) {
    const defaults = { ...(model.DEFAULTS || {}) };
    const shockmountState = buildShockmountState(model);

    return {
        spheres: getDefaultVariantCode(defaults.SPHERES),
        body: getDefaultVariantCode(defaults.BODY),
        logo: getDefaultVariantCode(defaults.LOGO),
        logobg: getDefaultVariantCode(defaults.LOGOBG),
        shockmount: getDefaultVariantCode(defaults.SHOCKMOUNT),
        shockmountPins: getDefaultVariantCode(defaults.SHOCKMOUNT_PINS),
        shockmountOption: getDefaultVariantCode(shockmountState.defaultOption)
    };
}

export function applyModelDefaults(modelCode) {
    if (!modelCode) {
        console.warn('[ModelDefaults] No modelCode provided');
        return;
    }

    const modelMap = window.CUSTOMIZER_DATA?.modelsByCode || {};
    const model = modelMap[modelCode];

    if (!model) {
        console.warn('[ModelDefaults] Model not found:', modelCode, 'Available models:', Object.keys(modelMap));
        return;
    }

    const defaults = { ...(model.DEFAULTS || {}) };
    const sectionOptionsMap = window.CUSTOMIZER_DATA.sectionOptions || window.CUSTOMIZER_DATA.optionsBySection || {};
    const sectionDefaults = getSectionDefaults(model);

    debugLog('[ModelDefaults] Applying defaults for model:', modelCode, defaults);

    if (isRuntimeDebugEnabled()) {
        console.group(`[Defaults] ${modelCode}`);
        Object.keys(defaults).forEach((section) => {
            const def = getDefaultVariantCode(defaults[section]);
            const options = (sectionOptionsMap[section] || []).map((option) => option.variantCode);
            console.log(`Section ${section}: default=${def}, options=`, options);
        });
        console.groupEnd();
    }

    const pinsVariant = getDefaultVariantCode(defaults.SHOCKMOUNT_PINS);
    const pinsOptions = (sectionOptionsMap.shockmountPins || []).map((option) => option.variantCode);

    debugLog('[ModelDefaults] Shockmount pins check:', {
        requestedVariant: pinsVariant,
        availableOptions: pinsOptions,
        isAvailable: pinsOptions.includes(pinsVariant)
    });

    if (pinsVariant && !pinsOptions.includes(pinsVariant)) {
        debugLog('[ModelDefaults] Shockmount pins variant not found:', pinsVariant, 'Available:', pinsOptions);
        const fallbackVariant = pinsOptions.find((option) => option.includes('brass')) || pinsOptions[0] || '';
        if (fallbackVariant) {
            debugLog('[ModelDefaults] Using fallback pins variant:', fallbackVariant);
            defaults.SHOCKMOUNT_PINS = fallbackVariant;
            sectionDefaults.shockmountPins = fallbackVariant;
        }
    }

    Object.entries(sectionDefaults).forEach(([sectionKey, defaultVariantCode]) => {
        const options = sectionOptionsMap[sectionKey] || [];
        const resolvedVariantCode = defaultVariantCode || getFallbackVariantCode(sectionKey, options);

        if (!resolvedVariantCode) {
            debugLog(`[ModelDefaults] No default variant for section: ${sectionKey}`);
            return;
        }

        const defaultOption = resolveDefaultOption(sectionKey, resolvedVariantCode, options);

        if (!defaultOption) {
            console.warn(
                `[ModelDefaults] Default option not found: ${sectionKey} -> ${resolvedVariantCode}`,
                'Available options:',
                options.map((option) => option.variantCode)
            );
            return;
        }

        debugLog(`[ModelDefaults] Applying default for ${sectionKey}:`, defaultOption);

        const currentState = stateManager.get()[sectionKey] || {};
        const optionPrice = getOptionPrice(sectionKey, defaultOption);
        const nextState = {
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

        if (sectionKey === 'shockmount') {
            nextState.price = optionPrice || 0;
        }

        if (sectionKey === 'shockmountOption') {
            nextState.price = optionPrice;
        }

        stateManager.set(sectionKey, nextState);

        if (sectionKey !== 'shockmount' && sectionKey !== 'shockmountPins' && sectionKey !== 'shockmountOption') {
            updateSectionLayers(sectionKey, nextState);
        }
    });

    debugLog('[ModelDefaults] Applied state snapshot:', {
        model: stateManager.get('currentModelCode'),
        spheres: stateManager.get('spheres')?.variant,
        body: stateManager.get('body')?.variant,
        logo: stateManager.get('logo')?.variant,
        logobg: stateManager.get('logobg')?.variant,
        shockmount: stateManager.get('shockmount')?.variant,
        shockmountPins: stateManager.get('shockmountPins')?.variant,
        shockmountOption: stateManager.get('shockmountOption')?.variant
    });

    debugLog('[ModelDefaults] All defaults applied for model:', modelCode);
}

export function isDefaultModel(modelCode) {
    const model = window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode];
    return !!model?.IS_DEFAULT_MODEL;
}
