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
    if (modelCode && variantCode && sectionData[modelCode]?.[variantCode]) {
        const price = sectionData[modelCode][variantCode];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] Exact match found: ${sectionCode}/${modelCode}/${variantCode} = ${price}`);
        }
        return typeof price === 'number' ? price : parseInt(price) || 0;
    }
    
    // 2. Матч по модели (любой вариант):
    if (sectionData[modelKey] && sectionData[modelKey][''] !== undefined) {
        const price = sectionData[modelKey][''];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] Model match found: ${sectionCode}/${modelKey}/* = ${price}`);
        }
        return typeof price === 'number' ? price : parseInt(price) || 0;
    }
    
    // 3. RAL наценка для конкретной секции (приоритет над глобальным)
    if (isRal && sectionData['_ral_surcharge'] !== undefined) {
        const price = sectionData['_ral_surcharge'];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] Section-specific RAL surcharge applied: ${sectionCode} = ${price}`);
        }
        return typeof price === 'number' ? price : parseInt(price) || 0;
    }
    
    // 4. Глобальный матч (любая модель, любой вариант):
    if (sectionData[''] && sectionData[''][''] !== undefined) {
        const price = sectionData[''][''];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] Global match found: ${sectionCode}/*/* = ${price}`);
        }
        return typeof price === 'number' ? price : parseInt(price) || 0;
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
    
    // Spheres - проверяем RAL статус и применяем наценку
    if (state.spheres?.color) {
        const isRalColor = state.spheres.variant === 'ral' || state.spheres.variant === '3';
        breakdown.spheres = getSurcharge('spheres', state.spheres.color, modelId, isRalColor);
    }

    // Body - проверяем RAL статус и применяем наценку
    if (state.body?.color) {
        const isRalColor = state.body.variant === 'ral' || state.body.variant === '3';
        breakdown.body = getSurcharge('body', state.body.color, modelId, isRalColor);
    }

    // Logo & LogoBg
    // Если включен кастомный логотип - берем наценку за него
    if (state.logo?.customLogo) {
        breakdown.logo = getSurcharge('logo', 'custom', modelId, false);
    } else {
        // Иначе проверяем наценку за цвет эмали (logobg)
        if (state.logobg?.color) {
            const isRalColor = state.logobg.variant === 'ral';
            breakdown.logo = getSurcharge('logobg', state.logobg.color, modelId, isRalColor);
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
            const isRalColor = state.shockmount.variant === 'ral';
            breakdown.shockmount += getSurcharge('shockmount', state.shockmount.color, modelId, isRalColor);
        }

        // Наценка за пины
        if (state.shockmountPins?.color) {
            const isRalColor = state.shockmountPins.variant === 'ral' || state.shockmountPins.variant?.includes('ral');
            breakdown.shockmountPins = getSurcharge('shockmountPins', state.shockmountPins.color, modelId, isRalColor);
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
    
    // Убедимся, что все значения - числа перед суммированием
    const total = Object.values(breakdown).reduce((sum, price) => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
        return sum + numPrice;
    }, 0);
    
    // Возвращаем число, а не строку
    return total;
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
