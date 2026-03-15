// modules/price-calculator.js (delta)

let customPricesData = {};

export function loadCustomPrices(pricesData) {
    customPricesData = pricesData || {};
}

function safeNumber(value) {
    const num = typeof value === 'number' ? value : parseInt(value, 10);
    return isNaN(num) ? 0 : num;
}

export function getSurcharge(sectionCode, variantCode = '', modelCode = '', isRal = false) {
    if (!customPricesData || !customPricesData[sectionCode]) {
        return 0;
    }

    const sectionData = customPricesData[sectionCode];
    const modelKey = modelCode || '';
    const variantKey = variantCode || '';

    if (modelCode && variantCode && sectionData[modelCode]?.[variantCode] !== undefined) {
        return safeNumber(sectionData[modelCode][variantCode]);
    }

    if (sectionData[modelKey] && sectionData[modelKey][''] !== undefined) {
        return safeNumber(sectionData[modelKey]['']);
    }

    if (isRal && sectionData['_ral_surcharge'] !== undefined) {
        return safeNumber(sectionData['_ral_surcharge']);
    }

    if (sectionData[''] && sectionData[''][''] !== undefined) {
        return safeNumber(sectionData['']['']);
    }

    return 0;
}

export function getBreakdown(state) {
    const modelCode = state.currentModelCode || '';

    const spheresPrice = safeNumber(state.spheres?.price);
    const bodyPrice = safeNumber(state.body?.price);
    const logoPrice = safeNumber(state.logo?.price);
    const logobgPrice = safeNumber(state.logobg?.price);
    const casePrice = safeNumber(state.case?.price);

    const s = state.shockmount || {};
    const showShockmountPrice = s.available && (s.canToggle || !s.included) && (s.price || 0) > 0;
    const shockmountPrice = showShockmountPrice ? safeNumber(s.price) : 0;

    // pins price usually 0 or included in shockmount price in HL, but we read it if exists
    const pinsPrice = safeNumber(state.shockmountPins?.price);

    return {
        base: safeNumber(state.basePrice),
        spheres: spheresPrice,
        body: bodyPrice,
        logo: logoPrice,
        logobg: logobgPrice,
        case: casePrice,
        shockmount: shockmountPrice + pinsPrice
    };
}

// Логирование цен для отладки
export function debugPrices(state) {
    console.log('[Price] Breakdown', {
        model: state.currentModelCode,
        basePrice: state.basePrice,
        spheres: state.spheres?.price,
        body: state.body?.price,
        logo: state.logo?.price,
        logobg: state.logobg?.price,
        shockmount: state.shockmount?.price,
        shockmountPins: state.shockmountPins?.price,
        case: state.case?.price,
    });
}

export function calculateTotal(state) {
    const breakdown = getBreakdown(state);
    return Object.values(breakdown).reduce((sum, price) => sum + safeNumber(price), 0);
}

export function formatPrice(price) {
    const num = safeNumber(price);
    return num > 0 ? `+${num.toLocaleString('ru-RU')}₽` : '0₽';
}
