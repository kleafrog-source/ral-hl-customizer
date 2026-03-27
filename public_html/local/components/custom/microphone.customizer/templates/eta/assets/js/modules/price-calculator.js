// modules/price-calculator.js (eta)

import { debugLog } from '../utils/debug.js';

let customPricesData = {};

export function loadCustomPrices(pricesData) {
    customPricesData = pricesData || {};
}

function safeNumber(value) {
    const num = typeof value === 'number' ? value : parseInt(value, 10);
    return isNaN(num) ? 0 : num;
}

export function resolveConfiguredPrice(sectionCode, variantCode = '', modelCode = '', isRal = false) {
    if (!customPricesData || !customPricesData[sectionCode]) {
        return null;
    }

    const sectionData = customPricesData[sectionCode];

    if (modelCode && variantCode && sectionData[modelCode]?.[variantCode] !== undefined) {
        return safeNumber(sectionData[modelCode][variantCode]);
    }

    if (variantCode && sectionData['']?.[variantCode] !== undefined) {
        return safeNumber(sectionData[''][variantCode]);
    }

    if (modelCode && sectionData[modelCode]?.[''] !== undefined) {
        return safeNumber(sectionData[modelCode]['']);
    }

    if (isRal && sectionData['_ral_surcharge'] !== undefined) {
        return safeNumber(sectionData['_ral_surcharge']);
    }

    if (sectionData['']?.[''] !== undefined) {
        return safeNumber(sectionData['']['']);
    }

    return null;
}

export function getSurcharge(sectionCode, variantCode = '', modelCode = '', isRal = false) {
    const resolvedPrice = resolveConfiguredPrice(sectionCode, variantCode, modelCode, isRal);
    return resolvedPrice === null ? 0 : resolvedPrice;
}

function getShockmountBreakdown(state) {
    const shockmountState = state.shockmount || {};
    const shockmountActive = !!shockmountState.visible && !!shockmountState.enabled;

    debugLog('[Price Calculator] Shockmount state:', shockmountState);

    const showShockmountPrice = shockmountActive && (shockmountState.price || 0) > 0;
    debugLog('[Price Calculator] Show price:', showShockmountPrice, {
        visible: shockmountState.visible,
        enabled: shockmountState.enabled,
        canToggle: shockmountState.canToggle,
        included: shockmountState.included,
        price: shockmountState.price
    });

    const framePrice = showShockmountPrice ? safeNumber(shockmountState.price) : 0;
    const pinsPrice = shockmountActive ? safeNumber(state.shockmountPins?.price) : 0;
    const basePrice = shockmountActive ? safeNumber(state.shockmountOption?.price) : 0;

    return {
        total: framePrice + pinsPrice + basePrice,
        base: basePrice,
        frame: framePrice,
        pins: pinsPrice
    };
}

export function getBreakdown(state) {
    const modelCode = state.currentModelCode || '';
    const hlData = state.hlData || {};
    const model = hlData.modelsByCode?.[modelCode] || {};
    const useCustomLogo = !!state.logo?.useCustom;
    
    // Базовая цена из HL данных модели
    const basePrice = safeNumber(model.BASE_PRICE || state.basePrice);
    debugLog('[Price Calculator] Base price:', {
        modelCode,
        basePriceFromHL: model.BASE_PRICE,
        basePriceFromState: state.basePrice,
        finalBasePrice: basePrice
    });

    const spheresPrice = safeNumber(state.spheres?.price);
    const bodyPrice = safeNumber(state.body?.price);
    const logoPrice = useCustomLogo
        ? getSurcharge('logo', 'custom-microphone-logo', modelCode, false)
        : safeNumber(state.logo?.price);
    const logobgPrice = useCustomLogo ? 0 : safeNumber(state.logobg?.price);
    const caseBasePrice = safeNumber(state.case?.price);
    const engravingPrice = state.case?.laserEngravingEnabled
        ? getSurcharge('case', 'custom-woodcase-image', modelCode, false)
        : 0;
    const casePrice = caseBasePrice + engravingPrice;
    const shockmountBreakdown = getShockmountBreakdown(state);

    return {
        base: basePrice,
        spheres: spheresPrice,
        body: bodyPrice,
        logo: logoPrice,
        logobg: logobgPrice,
        case: casePrice,
        shockmount: shockmountBreakdown.total,
        shockmountBase: shockmountBreakdown.base,
        shockmountFrame: shockmountBreakdown.frame,
        shockmountPins: shockmountBreakdown.pins
    };
}

// Логирование цен для отладки
export function debugPrices(state) {
    debugLog('[Price] Breakdown', {
        model: state.currentModelCode,
        basePrice: state.basePrice,
        spheres: state.spheres?.price,
        body: state.body?.price,
        logo: state.logo?.price,
        logobg: state.logobg?.price,
        shockmount: state.shockmount?.price,
        shockmountPins: state.shockmountPins?.price,
        shockmountOption: state.shockmountOption?.price,
        case: state.case?.price,
    });
}

export function calculateTotal(state) {
    const breakdown = getBreakdown(state);
    return [
        breakdown.base,
        breakdown.spheres,
        breakdown.body,
        breakdown.logo,
        breakdown.logobg,
        breakdown.case,
        breakdown.shockmount
    ].reduce((sum, price) => sum + safeNumber(price), 0);
}

export function formatPrice(price) {
    const num = safeNumber(price);
    return num > 0 ? `+${num.toLocaleString('ru-RU')}₽` : '0₽';
}
