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

    const spheresPrice = getSurcharge('spheres', state.spheres?.variantCode || '', modelCode, !!state.spheres?.isRal);
    const bodyPrice = getSurcharge('body', state.body?.variantCode || '', modelCode, !!state.body?.isRal);
    const logoPrice = state.logo?.useCustom
        ? getSurcharge('logo', 'custom-microphone-logo', modelCode, false)
        : getSurcharge('logo', state.logo?.variantCode || '', modelCode, !!state.logo?.isRal);
    const logobgPrice = getSurcharge('logobg', state.logobg?.variantCode || '', modelCode, !!state.logobg?.isRal);

    const caseBasePrice = getSurcharge('case', state.case?.variantCode || '', modelCode, !!state.case?.isRal);
    const engravingPrice = state.case?.laserEngravingEnabled
        ? getSurcharge('case', 'custom-woodcase-image', modelCode, false)
        : 0;

    let shockmountPrice = 0;
    if (state.shockmount?.included) {
        shockmountPrice = 0;
    } else if (state.shockmount?.enabled) {
        shockmountPrice = getSurcharge('shockmount', state.shockmount?.variantCode || '', modelCode, !!state.shockmount?.isRal);
    }

    const pinsPrice = state.shockmountPins?.variantCode
        ? getSurcharge('shockmountPins', state.shockmountPins.variantCode || '', modelCode, !!state.shockmountPins?.isRal)
        : 0;

    return {
        base: safeNumber(state.basePrice),
        spheres: spheresPrice,
        body: bodyPrice,
        logo: logoPrice,
        logobg: logobgPrice,
        case: caseBasePrice + engravingPrice,
        shockmount: shockmountPrice + pinsPrice
    };
}

export function calculateTotal(state) {
    const breakdown = getBreakdown(state);
    return Object.values(breakdown).reduce((sum, price) => sum + safeNumber(price), 0);
}

export function formatPrice(price) {
    const num = safeNumber(price);
    return num > 0 ? `+${num.toLocaleString('ru-RU')}₽` : '0₽';
}
