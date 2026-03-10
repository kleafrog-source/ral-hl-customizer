// modules/price-calculator.js

import { APP_DEBUG, stateManager } from '../core/state.js';

// Глобальное хранилище цен из HL-блока CustomizerPrices
let customPricesData = null;

/**
 * Загружает данные о ценах из HL-блока CustomizerPrices
 * @param {Object} pricesData - Данные из window.CUSTOMIZER_DATA.prices
 */
export function loadCustomPrices(pricesData) {
    customPricesData = pricesData;
    if (APP_DEBUG) {
        console.log('[Price Calculator] Loaded custom prices:', customPricesData);
    }
}

/**
 * Получает наценку для варианта с приоритетом поиска
 * @param {string} sectionCode - Код раздела
 * @param {string} variantCode - Код варианта
 * @param {string} modelCode - Код модели (ID или код)
 * @param {boolean} isRal - Является ли вариант RAL цветом
 * @returns {number} - Наценка или 0
 */
export function getSurcharge(sectionCode, variantCode = '', modelCode = '', isRal = false) {
    if (!customPricesData || !customPricesData[sectionCode]) {
        return 0;
    }

    const sectionData = customPricesData[sectionCode];
    const modelKey = modelCode || '';
    const variantKey = variantCode || '';
    
    // 1. Точный матч: (section, model, variant)
    if (sectionData[modelKey] && sectionData[modelKey][variantKey] !== undefined) {
        return sectionData[modelKey][variantKey];
    }
    
    // 2. Матч по модели (любой вариант):
    if (sectionData[modelKey] && sectionData[modelKey][''] !== undefined) {
        return sectionData[modelKey][''];
    }
    
    // 3. Глобальный матч (любая модель, любой вариант):
    if (sectionData[''] && sectionData[''][''] !== undefined) {
        return sectionData[''][''];
    }
    
    // 4. RAL наценка если это RAL цвет
    if (isRal && sectionData['_ral_surcharge'] !== undefined) {
        return sectionData['_ral_surcharge'];
    }
    
    return 0;
}

/**
 * Рассчитывает разбивку цен по разделам на основе текущего состояния
 * @param {Object} state - Текущее состояние
 * @returns {Object} Объект с ценами по разделам
 */
export function getBreakdown(state) {
    const breakdown = {
        base: state.basePrice || 0,
        spheres: 0,
        body: 0,
        logo: 0,
        case: 0,
        shockmount: 0,
        shockmountPins: 0
    };

    const modelId = state.currentModel?.id || '';
    
    // Spheres
    if (state.spheres?.color) {
        breakdown.spheres = getSurcharge('spheres', state.spheres.color, modelId, state.spheres.variant === 'ral');
    }

    // Body
    if (state.body?.color) {
        breakdown.body = getSurcharge('body', state.body.color, modelId, state.body.variant === 'ral');
    }

    // Logo & LogoBg
    // Если включен кастомный логотип - берем наценку за него
    if (state.logo?.customLogo) {
        breakdown.logo = getSurcharge('logo', 'custom', modelId, false);
    } else {
        // Иначе проверяем наценку за цвет эмали (logobg)
        if (state.logobg?.color) {
            breakdown.logo = getSurcharge('logobg', state.logobg.color, modelId, state.logobg.variant === 'ral');
        }
    }

    // Case
    if (state.case?.laserEngravingEnabled) {
        breakdown.case = getSurcharge('case', 'engraving', modelId, false);
    }

    // Shockmount
    if (state.shockmount?.enabled) {
        // Базовая цена подвеса (если он не включен в модель)
        // В HL данных UF_SHOCKMOUNT_PRICE может быть в модели, но мы ищем в CustomizerPrices для гибкости
        breakdown.shockmount = getSurcharge('shockmount', '', modelId, false);

        // Наценка за цвет каркаса
        if (state.shockmount.color) {
            breakdown.shockmount += getSurcharge('shockmount', state.shockmount.color, modelId, state.shockmount.variant === 'ral');
        }

        // Наценка за пины
        if (state.shockmountPins?.colorName) {
            breakdown.shockmountPins = getSurcharge('shockmountPins', state.shockmountPins.variant, modelId, state.shockmountPins.variant?.includes('ral'));
        }
    }

    return breakdown;
}

/**
 * Рассчитывает общую стоимость
 * @param {Object} state - Текущее состояние
 * @returns {number} Общая цена
 */
export function calculateTotal(state) {
    const breakdown = getBreakdown(state);
    return Object.values(breakdown).reduce((sum, price) => sum + price, 0);
}

/**
 * Форматирует цену для отображения
 * @param {number} price - Цена
 * @returns {string} Отформатированная строка
 */
export function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
        return '0₽';
    }
    return price > 0 ? `+${price.toLocaleString('ru-RU')}₽` : '0₽';
}
