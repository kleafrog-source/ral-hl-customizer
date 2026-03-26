import { debugLog, debugWarn } from './utils/debug.js';

export const CONFIG = {
    // Цены берутся из HL данных (CUSTOMIZER_DATA), здесь только безопасные дефолты
    basePrice: 0,
    optionPrice: 0,
    scaleFactor: 0.8584,
    // Цена шокмунта берется из HL (CUSTOMIZER_DATA)
    shockmountPrice: 0,
    pxPerMm: 3.2909,
    caseScaleFactor: 1.0  // Коэффициент масштабирования для ручной корректировки CASE_GEOMETRY
};

// Осмысленные строковые ключи для вариантов
export const VARIANT_KEYS = {
    // Для spheres/body
    STANDARD_BRUSHED_STEEL: 'standard-brushed-steel',  // бывший '1'
    STANDARD_GOLD: 'standard-gold',                    // бывший '2' 
    RAL_COLOR: 'ral-color',                            // бывший '3'
    
    // Для пинов подвеса
    PINS_BRASS: 'pins-brass',                          // латунь
    PINS_RAL_9006: 'pins-ral-9006',                    // белый алюминий
    PINS_RAL_9010: 'pins-ral-9010',                    // чистый белый
    PINS_RAL_1013: 'pins-ral-1013',                    // жемчужно-белый
    PINS_RAL_9005: 'pins-ral-9005',                    // матовый черный
    
    // Общие
    NON_RAL: 'non-ral',
    RAL: 'ral',
    CUSTOM: 'custom'
};


export const MALFA_SILVER_RAL = '9006'; // White Aluminium
export const MALFA_GOLD_RAL = '1036'; // Pearl Gold

export const FREE_LOGO_RALS = ['9005', '3001', '3005', '5017', '6001', '9010', MALFA_SILVER_RAL, MALFA_GOLD_RAL];
export const FREE_SHOCKMOUNT_BODY_RALS = ['1013', '9010', '9005'];
export const FREE_SHOCKMOUNT_PINS_RALS = ['1013', '9010', '9005'];

export const variantNames = {
    'standard-brushed-steel': 'Сатинированная сталь',
    'standard-gold': 'Классическая латунь',
    'matte-black': 'Матовый черный'
};

// Функция для получения базового пути к изображениям
function getCustomizerData() {
    return window.CUSTOMIZER_DATA || null;
}

function getCustomizerOptions() {
    return getCustomizerData()?.options || null;
}

function getAssetsBasePath() {
    // Используем глобальную переменную из template.php
    if (window.CUSTOMIZER_ASSETS_PATH) {
        return window.CUSTOMIZER_ASSETS_PATH + '/image/';
    }
    debugWarn('[CONFIG] CUSTOMIZER_ASSETS_PATH not available, using fallback');
    return '/local/templates/microphone.customizer/assets/image/';
}

// Утилиты для работы с данными из Bitrix HighLoad блоков
export function getModelData(modelCode) {
    const data = getCustomizerData();
    if (!data?.modelsByCode) {
        debugWarn('CUSTOMIZER_DATA.modelsByCode not available');
        return null;
    }
    return data.modelsByCode[modelCode] || null;
}

export function getAllModels() {
    const data = getCustomizerData();
    if (!data?.models) {
        debugWarn('CUSTOMIZER_DATA.models not available');
        return {};
    }
    return data.models;
}

export function getModelCodes() {
    const models = getAllModels();
    return Object.values(models).map(model => model.CODE);
}

export function getModelSeries(modelCode) {
    const model = getModelData(modelCode);
    return model?.MODEL_SERIES || null;
}

// Динамическая генерация CASE_IMAGES на основе данных из Bitrix
export function getCaseImages() {
    const models = getAllModels();
    const caseImages = {};
    
    // Получаем assetsPath динамически, а не при загрузке модуля
    const assetsPath = getAssetsBasePath();
    
    // Старый маппинг как fallback
    const fallbackImageMap = {
        '017-tube': 'case_017_tube',
        '017-fet': 'case_017_fet-023_dlx', 
        '023-deluxe': 'case_017_fet-023_dlx',
        '023-the-bomblet': 'case_023thebomblet-23_malfa',
        '023-malfa': 'case_023thebomblet-23_malfa'
    };
    
    Object.keys(models).forEach(modelId => {
        const model = models[modelId];
        const code = model.CODE;
        
        // Пытаемся получить изображение из HL данных
        let imageBase = getCaseImageFromHL(code);
        
        // Fallback на старый маппинг
        if (!imageBase) {
            imageBase = fallbackImageMap[code];
            debugWarn(`[CONFIG] Using fallback image mapping for model: ${code}`);
        }
        
        if (imageBase) {
            caseImages[code] = {
                mobile: assetsPath + imageBase + '_mobile.png',
                tablet: assetsPath + imageBase + '_tablet.png', 
                desktop: assetsPath + imageBase + '_desktop.png',
                _4k: assetsPath + imageBase + '_4k.png'
            };
        }
    });
    
    return caseImages;
}

/**
 * Получает изображение футляра из HL данных для конкретной модели
 * @param {string} modelCode - код модели
 * @returns {string|null} - базовое имя изображения или null
 */
function getCaseImageFromHL(modelCode) {
    // Проверяем доступность CUSTOMIZER_DATA
    if (!window.CUSTOMIZER_DATA || !window.CUSTOMIZER_DATA.options) {
        debugWarn('[CONFIG] CUSTOMIZER_DATA not available for case image mapping');
        return null;
    }
    
    const modelData = getModelData(modelCode);
    if (!modelData) {
        debugWarn(`[CONFIG] Model data not found: ${modelCode}`);
        return null;
    }
    
    // Получаем опции футляров для всех моделей (model_id = 0) и для конкретной модели
    const allCaseOptions = window.CUSTOMIZER_DATA.options[0]?.case || [];
    const modelCaseOptions = window.CUSTOMIZER_DATA.options[modelData.ID]?.case || [];
    const caseOptions = [...allCaseOptions, ...modelCaseOptions];
    
    // Ищем подходящий футляр для этой модели
    for (const caseOption of caseOptions) {
        // Проверяем UF_MODEL_ID - если футляр для конкретной модели
        if (caseOption.UF_MODEL_ID == modelData.ID) {
            // Этот футляр предназначен для нашей модели
            const svgSpecialKey = caseOption.SVG_SPECIAL_KEY;
            if (svgSpecialKey) {
                debugLog(`[CONFIG] Found HL case image for ${modelCode} (model-specific): ${svgSpecialKey}`);
                return svgSpecialKey;
            }
        }
        
        // Проверяем SERIES_VAR - теперь это строка с серией, а не массив
        const seriesVar = caseOption.SERIES_VAR || '';
        const modelSeries = modelData.MODEL_SERIES;
        
        if (seriesVar && modelSeries && seriesVar === modelSeries) {
            const svgSpecialKey = caseOption.SVG_SPECIAL_KEY;
            if (svgSpecialKey) {
                debugLog(`[CONFIG] Found HL case image for ${modelCode} (series-based): ${svgSpecialKey}`);
                return svgSpecialKey;
            }
        }
        
        // Если футляр для всех моделей (UF_MODEL_ID = 0 или пустой) и SERIES_VAR пустой
        if ((!caseOption.UF_MODEL_ID || caseOption.UF_MODEL_ID == 0) && !seriesVar) {
            const svgSpecialKey = caseOption.SVG_SPECIAL_KEY;
            if (svgSpecialKey) {
                debugLog(`[CONFIG] Found HL case image for ${modelCode} (universal): ${svgSpecialKey}`);
                return svgSpecialKey;
            }
        }
    }
    
    debugWarn(`[CONFIG] No suitable case image found in HL data for: ${modelCode}`);
    return null;
}

// Для обратной совместимости оставим статичный экспорт, но с безопасной инициализацией
export let CASE_IMAGES = {};

// Инициализируем CASE_IMAGES когда будут доступны данные
function initializeCaseImages() {
    if (window.CUSTOMIZER_DATA && window.CUSTOMIZER_DATA.models) {
        CASE_IMAGES = getCaseImages();
        debugLog('[CONFIG] CASE_IMAGES initialized:', CASE_IMAGES);
    } else {
        debugWarn('[CONFIG] CUSTOMIZER_DATA not available, CASE_IMAGES will be empty');
    }
}

// Попробуем инициализировать сразу
initializeCaseImages();

// Также добавим возможность переинициализации
export function reinitializeCaseImages() {
    initializeCaseImages();
}

// Динамическая генерация CASE_GEOMETRY на основе данных из Bitrix
export function getCaseGeometry() {
    const models = getAllModels();
    const cases = {};
    const casesRescale = {};
    
    // Геометрия футляров - НЕ перенсим в HL . Оставляем здесь в таком же виде.
    const geometryData = {
        '017-tube': { 
            mm: 550, 
            startConfig: { wMM: 160, yOffsetMM: 50 }, 
            mobile: { x: 2.1, y: 88.55, w: 757, h: 431, poly: [746.33,105.59, 746.02,478.65, 33.85,511.99, 27.12,103.51] }, 
            tablet: { x: 17.68, y: 116.72, w: 1009, h: 574, poly: [1004.24,139.31, 1003.83,633.85, 59.76,678.04, 50.84,136.54] }, 
            desktop: { x: 50.31, y: 156.84, w: 1472, h: 838, poly: [1524.18,190.6, 1523.57,929.4, 113.18,995.43, 99.85,186.46] }, 
            _4k: { x: 88.19, y: 329.76, w: 2775, h: 1580, poly: [2857.65,393.18, 2856.5,1781.43, 206.33,1905.49, 181.28,385.42] } 
        },
        '017-fet': { 
            mm: 284, 
            startConfig: { wMM: 100, yOffsetMM: 50 }, 
            mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, 
            tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, 
            desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, 
            _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } 
        },
        '023-deluxe': { 
            mm: 256, 
            startConfig: { wMM: 100, yOffsetMM: 50 }, 
            mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, 
            tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, 
            desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, 
            _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } 
        },
        '023-the-bomblet': { 
            mm: 139, 
            startConfig: { wMM: 70, yOffsetMM: 50 }, 
            mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, 
            tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, 
            desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, 
            _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } 
        },
        '023-malfa': { 
            mm: 139, 
            startConfig: { wMM: 70, yOffsetMM: 50 }, 
            mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, 
            tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, 
            desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, 
            _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } 
        }
    };
    
    // Коэффициенты масштабирования по умолчанию
    const defaultRescale = {
        mobile: 1.7,
        tablet: 1.1, 
        desktop: 1.1,
        _4k: 1.0
    };
    
    Object.keys(models).forEach(modelId => {
        const model = models[modelId];
        const code = model.CODE;
        
        if (geometryData[code]) {
            cases[code] = geometryData[code];
            casesRescale[code] = { ...defaultRescale };
        }
    });
    
    return {
        res: { mobile: { max: 767, vb: "0 0 750 1334" }, tablet: { max: 1024, vb: "0 0 1024 768" }, desktop: { max: 2560, vb: "0 0 1920 1080" }, _4k: { max: 9999, vb: "0 0 3840 2160" } },
        cases,
        casesRescale
    };
}


export const CASE_GEOMETRY = {
    res: { mobile: { max: 767, vb: "0 0 750 1334" }, tablet: { max: 1024, vb: "0 0 1024 768" }, desktop: { max: 2560, vb: "0 0 1920 1080" }, _4k: { max: 9999, vb: "0 0 3840 2160" } },
    cases: {
        '017-tube': { mm: 550, startConfig: { wMM: 160, yOffsetMM: 50 }, mobile: { x: 2.1, y: 88.55, w: 757, h: 431, poly: [746.33,105.59, 746.02,478.65, 33.85,511.99, 27.12,103.51] }, tablet: { x: 17.68, y: 116.72, w: 1009, h: 574, poly: [1004.24,139.31, 1003.83,633.85, 59.76,678.04, 50.84,136.54] }, desktop: { x: 50.31, y: 156.84, w: 1472, h: 838, poly: [1524.18,190.6, 1523.57,929.4, 113.18,995.43, 99.85,186.46] }, _4k: { x: 88.19, y: 329.76, w: 2775, h: 1580, poly: [2857.65,393.18, 2856.5,1781.43, 206.33,1905.49, 181.28,385.42] } },
        '017-fet': { mm: 284, startConfig: { wMM: 100, yOffsetMM: 50 }, mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } },
        '023-deluxe': { mm: 256, startConfig: { wMM: 100, yOffsetMM: 50 }, mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } },
        '023-the-bomblet': { mm: 139, startConfig: { wMM: 70, yOffsetMM: 50 }, mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } },
        '023-malfa': { mm: 139, startConfig: { wMM: 70, yOffsetMM: 50 }, mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } }
    },
    cases_rescale: {
        // Коэффициенты масштабирования для ручной корректировки CASE_GEOMETRY
        // Позволяют точно настроить размеры для каждого типа футляра и устройства
        '017-tube': {
            mobile: 1.7,      // Базовый масштаб для mobile
            tablet: 1.1,       // Базовый масштаб для tablet  
            desktop: 1.1,      // Базовый масштаб для desktop
            _4k: 1.0          // Базовый масштаб для 4K
        },
        '017-fet': {
            mobile: 1.7,
            tablet: 1.1,
            desktop: 1.1,
            _4k: 1.0
        },
        '023-deluxe': {
            mobile: 1.7,
            tablet: 1.1,
            desktop: 1.1,
            _4k: 1.0
        },
        '023-the-bomblet': {
            mobile: 1.7,
            tablet: 1.1,
            desktop: 1.1,
            _4k: 1.0
        },
        '023-malfa': {
            mobile: 1.7,
            tablet: 1.1,
            desktop: 1.1,
            _4k: 1.0
        }
    }
};

export const MIC_LOGO_GEOMETRY = {
    '017': {
        diameterMm: 55,
        heightMm: 87.02
    },
    '023': {
        diameterMm: 47,
        heightMm: 74.373
    }
};

export function getMicLogoGeometry(modelCode = '') {
    const normalizedCode = String(modelCode || '').trim();
    const seriesKey = normalizedCode.startsWith('023') ? '023' : '017';
    const geometry = MIC_LOGO_GEOMETRY[seriesKey];

    return {
        ...geometry,
        circumferenceMm: Number((Math.PI * geometry.diameterMm).toFixed(3))
    };
}
