// debugger-logs/state-debug.js
// Модуль для отладки состояния кастомизатора

import { stateManager } from '../core/state.js';
import { getModelData } from '../config.js';
import { getOptionsForSection, getCurrentModelOptions, findOptionByVariantCode } from '../modules/hl-data-manager.js';

/**
 * Логирует текущее состояние кастомизатора для отладки
 * @param {string} label - Метка для группы логов
 */
export function logCustomizerState(label = '[STATE DEBUG]') {
    const hlData = stateManager.get('hlData');
    const snapshot = {
        currentModelCode: stateManager.get('currentModelCode'),
        currentModelId: stateManager.get('currentModelId'),
        currentModel: stateManager.get('currentModel'),
        modelSeries: stateManager.get('modelSeries') || stateManager.get('currentModel')?.modelSeries,
        spheres: stateManager.get('spheres'),
        body: stateManager.get('body'),
        logo: stateManager.get('logo'),
        logobg: stateManager.get('logobg'),
        case: stateManager.get('case'),
        shockmount: stateManager.get('shockmount'),
        shockmountPins: stateManager.get('shockmountPins')
    };

    console.group(label);
    console.log('Snapshot:', snapshot);
    
    // Проверка наличия HL данных
    if (!hlData) {
        console.warn('⚠️ HL Data is undefined - check initHLDataManager');
        console.groupEnd();
        return;
    }
    
    if (!hlData.modelsByCode) {
        console.warn('⚠️ HL Data modelsByCode is undefined - check result_modifier.php');
        console.groupEnd();
        return;
    }
    
    // Проверка текущей модели
    if (!snapshot.currentModelCode) {
        console.warn('⚠️ currentModelCode is undefined - check state initialization');
        console.groupEnd();
        return;
    }
    
    // Дополнительная информация о модели
    if (snapshot.currentModelCode) {
        const modelData = getModelData(snapshot.currentModelCode);
        console.log('Model Data from HL:', modelData);
    }
    
    // Информация о выбранном футляре
    if (snapshot.case && snapshot.case.variant) {
        console.log('Selected Case:', snapshot.case);
    }
    
    console.groupEnd();
}

/**
 * Трассировка цепочки HL → state → logic для секции
 * @param {string} section - Название секции ('spheres', 'body', 'logo', etc.)
 * @param {string} label - Метка для логов
 */
export function logSectionFlow(section = 'spheres', label = '[FLOW DEBUG]') {
    const hlData = stateManager.get('hlData');
    const currentModelCode = stateManager.get('currentModelCode');
    const currentModel = hlData?.modelsByCode?.[currentModelCode] || null;
    const options = getOptionsForSection(section) || [];
    const sectionState = stateManager.get(section);

    console.group(`${label} ${section}`);
    
    // 1. Model information
    console.log('📍 Model:', {
        code: currentModelCode,
        series: currentModel?.MODEL_SERIES,
        id: currentModel?.ID,
        raw: currentModel
    });
    
    // 2. HL options for this section
    console.log('📋 HL Options:', options.map(opt => ({
        variant: opt.UF_VARIANT_CODE,
        name: opt.UF_VARIANT_NAME,
        svgTargetMode: opt.UF_SVG_TARGET_MODE,
        svgLayerGroup: opt.UF_SVG_LAYER_GROUP,
        svgFilterId: opt.UF_SVG_FILTER_ID,
        svgSpecialKey: opt.UF_SVG_SPECIAL_KEY,
        isRal: opt.UF_IS_RAL,
        ralColorId: opt.UF_RAL_COLOR_ID
    })));
    
    // 3. Current state
    console.log('🎯 State:', sectionState);
    
    // 4. Find selected option
    let selectedOption = null;
    if (sectionState?.variant) {
        selectedOption = findOptionByVariantCode(sectionState.variant);
    }
    
    if (selectedOption) {
        console.log('✅ Selected Option:', {
            variant: selectedOption.UF_VARIANT_CODE,
            name: selectedOption.UF_VARIANT_NAME,
            svgTargetMode: selectedOption.UF_SVG_TARGET_MODE,
            svgLayerGroup: selectedOption.UF_SVG_LAYER_GROUP,
            svgFilterId: selectedOption.UF_SVG_FILTER_ID,
            svgSpecialKey: selectedOption.UF_SVG_SPECIAL_KEY
        });
        
        // 5. Logic decision
        const mode = selectedOption.UF_SVG_TARGET_MODE;
        const filterId = selectedOption.UF_SVG_FILTER_ID;
        const layerGroup = selectedOption.UF_SVG_LAYER_GROUP;
        const specialKey = selectedOption.UF_SVG_SPECIAL_KEY;
        
        console.log('🔀 SVG Logic Decision:', {
            mode,
            filterId,
            layerGroup,
            specialKey,
            decision:
                mode === 'original' ? '🎨 original → show layerGroup only' :
                mode === 'filter'   ? `🔍 filter → apply ${filterId}` :
                mode === 'gradient' ? '🌈 gradient → gradient handler' :
                specialKey          ? `⭐ specialKey → ${specialKey}` :
                                      '❓ fallback / unknown'
        });
        
        // 6. Arrow visualization
        console.log('📊 HL → State → Logic:', {
            fromHL: {
                svgTargetMode: selectedOption.UF_SVG_TARGET_MODE,
                svgLayerGroup: selectedOption.UF_SVG_LAYER_GROUP,
                svgFilterId: selectedOption.UF_SVG_FILTER_ID,
                svgSpecialKey: selectedOption.UF_SVG_SPECIAL_KEY
            },
            toState: sectionState,
            behavior:
                mode === 'original'
                    ? 'original → show layerGroup only'
                    : mode === 'filter'
                    ? `filter → apply ${filterId}` 
                    : mode === 'gradient'
                    ? 'gradient → gradient handler'
                    : specialKey
                    ? `specialKey → ${specialKey}` 
                    : 'fallback / unknown'
        });
    } else {
        console.warn('⚠️ No selected option found for variant:', sectionState?.variant);
        if (sectionState?.variant) {
            console.log('🔍 Available options for variant:', options.filter(opt => 
                opt.UF_VARIANT_CODE === sectionState.variant
            ));
        }
    }
    
    console.groupEnd();
}

/**
 * Логирует информацию о маппинге футляров
 * @param {string} caseVariant - вариант футляра
 * @param {string} modelCode - код модели
 */
export function logCaseMapping(caseVariant, modelCode) {
    console.group('[CASE MAPPING DEBUG]');
    console.log('Case Variant:', caseVariant);
    console.log('Model Code:', modelCode);
    
    const modelData = getModelData(modelCode);
    console.log('Model Data:', modelData);
    
    // Получаем опции футляров из HL данных
    const hlData = stateManager.get('hlData');
    const caseOptions = hlData?.options?.case || [];
    const selectedCaseOption = caseOptions.find(opt => opt.UF_VARIANT_CODE === caseVariant);
    
    console.log('Available Case Options:', caseOptions);
    console.log('Selected Case Option:', selectedCaseOption);
    
    if (selectedCaseOption) {
        console.log('SVG_SPECIAL_KEY:', selectedCaseOption.SVG_SPECIAL_KEY);
        console.log('SERIES_VAR:', selectedCaseOption.SERIES_VAR);
    }
    
    console.groupEnd();
}

/**
 * Проверяет совместимость футляра с моделью
 * @param {string} caseVariant - вариант футляра
 * @param {string} modelCode - код модели
 * @returns {boolean} - совместим ли футляр с моделью
 */
export function checkCaseCompatibility(caseVariant, modelCode) {
    const modelData = getModelData(modelCode);
    if (!modelData) {
        console.warn(`[CASE COMPATIBILITY] Model data not found for: ${modelCode}`);
        return false;
    }
    
    const modelSeries = modelData.MODEL_SERIES;
    const modelId = modelData.ID;
    console.log(`[CASE COMPATIBILITY] Model ${modelCode} series: ${modelSeries}, ID: ${modelId}`);
    
    // Получаем опции футляров из HL данных
    const hlData = stateManager.get('hlData');
    const allCaseOptions = hlData?.options?.[0]?.case || [];
    const modelCaseOptions = hlData?.options?.[modelId]?.case || [];
    const caseOptions = [...allCaseOptions, ...modelCaseOptions];
    
    const selectedCaseOption = caseOptions.find(opt => opt.UF_VARIANT_CODE === caseVariant);
    
    if (!selectedCaseOption) {
        console.warn(`[CASE COMPATIBILITY] Case option not found: ${caseVariant}`);
        return false;
    }
    
    console.log(`[CASE COMPATIBILITY] Case ${caseVariant} details:`, {
        UF_MODEL_ID: selectedCaseOption.UF_MODEL_ID,
        SERIES_VAR: selectedCaseOption.SERIES_VAR,
        SVG_SPECIAL_KEY: selectedCaseOption.SVG_SPECIAL_KEY
    });
    
    // Проверяем UF_MODEL_ID - если футляр для конкретной модели
    if (selectedCaseOption.UF_MODEL_ID == modelId) {
        console.log(`[CASE COMPATIBILITY] Case is model-specific for ${modelCode}`);
        return true;
    }
    
    // Проверяем SERIES_VAR - теперь это строка с серией
    const seriesVar = selectedCaseOption.SERIES_VAR || '';
    if (seriesVar && modelSeries && seriesVar === modelSeries) {
        console.log(`[CASE COMPATIBILITY] Case is compatible via SERIES_VAR: ${seriesVar}`);
        return true;
    }
    
    // Если футляр для всех моделей
    if ((!selectedCaseOption.UF_MODEL_ID || selectedCaseOption.UF_MODEL_ID == 0) && !seriesVar) {
        console.log(`[CASE COMPATIBILITY] Case is universal for all models`);
        return true;
    }
    
    console.log(`[CASE COMPATIBILITY] Case is NOT compatible with model ${modelCode}`);
    console.log(`[CASE COMPATIBILITY] Expected series: ${modelSeries}, got: ${seriesVar}`);
    return false;
}

/**
 * Трассировка для футляров
 * @param {string} label - Метка для логов
 */
export function logCaseFlow(label = '[CASE FLOW]') {
    const hlData = stateManager.get('hlData');
    const currentModelCode = stateManager.get('currentModelCode');
    const currentModel = hlData?.modelsByCode?.[currentModelCode] || null;
    const caseState = stateManager.get('case');
    
    console.group(`${label}`);
    
    console.log('📍 Model:', {
        code: currentModelCode,
        series: currentModel?.MODEL_SERIES,
        id: currentModel?.ID,
        raw: currentModel
    });
    
    console.log('📦 Case State:', caseState);
    
    if (caseState?.variant) {
        // Get case options
        const allCaseOptions = hlData?.options?.[0]?.case || [];
        const modelCaseOptions = hlData?.options?.[currentModel?.ID]?.case || [];
        const caseOptions = [...allCaseOptions, ...modelCaseOptions];
        
        console.log('📋 Available Case Options:', caseOptions.map(opt => ({
            variant: opt.UF_VARIANT_CODE,
            name: opt.UF_VARIANT_NAME,
            modelId: opt.UF_MODEL_ID,
            seriesVar: opt.SERIES_VAR,
            svgSpecialKey: opt.SVG_SPECIAL_KEY,
            svgTargetMode: opt.UF_SVG_TARGET_MODE
        })));
        
        const selectedCaseOption = caseOptions.find(opt => opt.UF_VARIANT_CODE === caseState.variant);
        
        if (selectedCaseOption) {
            console.log('✅ Selected Case Option:', {
                variant: selectedCaseOption.UF_VARIANT_CODE,
                name: selectedCaseOption.UF_VARIANT_NAME,
                modelId: selectedCaseOption.UF_MODEL_ID,
                seriesVar: selectedCaseOption.SERIES_VAR,
                svgSpecialKey: selectedCaseOption.SVG_SPECIAL_KEY
            });
            
            // Compatibility check
            const isModelSpecific = selectedCaseOption.UF_MODEL_ID == currentModel?.ID;
            const isSeriesCompatible = selectedCaseOption.SERIES_VAR === currentModel?.MODEL_SERIES;
            const isUniversal = !selectedCaseOption.UF_MODEL_ID && !selectedCaseOption.SERIES_VAR;
            
            console.log('🔀 Case Compatibility:', {
                isModelSpecific,
                isSeriesCompatible,
                isUniversal,
                compatible: isModelSpecific || isSeriesCompatible || isUniversal,
                decision:
                    isModelSpecific ? '🎯 model-specific case' :
                    isSeriesCompatible ? '📗 series-compatible case' :
                    isUniversal ? '🌍 universal case' :
                                    '❌ incompatible case'
            });
            
            console.log('📊 HL → State → Logic:', {
                fromHL: {
                    modelId: selectedCaseOption.UF_MODEL_ID,
                    seriesVar: selectedCaseOption.SERIES_VAR,
                    svgSpecialKey: selectedCaseOption.SVG_SPECIAL_KEY
                },
                toState: caseState,
                behavior: `case → ${selectedCaseOption.SVG_SPECIAL_KEY || 'unknown'}`
            });
        } else {
            console.warn('⚠️ No case option found for variant:', caseState.variant);
        }
    } else {
        console.warn('⚠️ No case variant selected');
    }
    
    console.groupEnd();
}

/**
 * Трассировка для пинов шокмаунта
 * @param {string} label - Метка для логов
 */
export function logShockmountPinsFlow(label = '[PINS FLOW]') {
    const hlData = stateManager.get('hlData');
    const currentModelCode = stateManager.get('currentModelCode');
    const currentModel = hlData?.modelsByCode?.[currentModelCode] || null;
    const pinsState = stateManager.get('shockmountPins');
    
    console.group(`${label}`);
    
    console.log('📍 Model:', {
        code: currentModelCode,
        series: currentModel?.MODEL_SERIES,
        id: currentModel?.ID,
        raw: currentModel
    });
    
    console.log('🔩 Pins State:', pinsState);
    
    if (pinsState?.variant) {
        const pinsOptions = getOptionsForSection('shockmountPins') || [];
        
        console.log('📋 Available Pins Options:', pinsOptions.map(opt => ({
            variant: opt.UF_VARIANT_CODE,
            name: opt.UF_VARIANT_NAME,
            modelId: opt.UF_MODEL_ID,
            seriesVar: opt.SERIES_VAR,
            svgLayerGroup: opt.UF_SVG_LAYER_GROUP,
            svgSpecialKey: opt.UF_SVG_SPECIAL_KEY,
            svgTargetMode: opt.UF_SVG_TARGET_MODE
        })));
        
        const selectedPinsOption = pinsOptions.find(opt => opt.UF_VARIANT_CODE === pinsState.variant);
        
        if (selectedPinsOption) {
            console.log('✅ Selected Pins Option:', {
                variant: selectedPinsOption.UF_VARIANT_CODE,
                name: selectedPinsOption.UF_VARIANT_NAME,
                modelId: selectedPinsOption.UF_MODEL_ID,
                seriesVar: selectedPinsOption.SERIES_VAR,
                svgLayerGroup: selectedPinsOption.UF_SVG_LAYER_GROUP,
                svgSpecialKey: selectedPinsOption.UF_SVG_SPECIAL_KEY
            });
            
            // Compatibility check
            const isModelSpecific = selectedPinsOption.UF_MODEL_ID == currentModel?.ID;
            const isSeriesCompatible = selectedPinsOption.SERIES_VAR === currentModel?.MODEL_SERIES;
            const isUniversal = !selectedPinsOption.UF_MODEL_ID && !selectedPinsOption.SERIES_VAR;
            
            console.log('🔀 Pins Compatibility:', {
                isModelSpecific,
                isSeriesCompatible,
                isUniversal,
                compatible: isModelSpecific || isSeriesCompatible || isUniversal,
                decision:
                    isModelSpecific ? '🎯 model-specific pins' :
                    isSeriesCompatible ? '📗 series-compatible pins' :
                    isUniversal ? '🌍 universal pins' :
                                    '❌ incompatible pins'
            });
            
            console.log('📊 HL → State → Logic:', {
                fromHL: {
                    modelId: selectedPinsOption.UF_MODEL_ID,
                    seriesVar: selectedPinsOption.SERIES_VAR,
                    svgLayerGroup: selectedPinsOption.UF_SVG_LAYER_GROUP,
                    svgSpecialKey: selectedPinsOption.UF_SVG_SPECIAL_KEY
                },
                toState: pinsState,
                behavior: `pins → ${selectedPinsOption.UF_SVG_LAYER_GROUP || 'unknown'}`
            });
        } else {
            console.warn('⚠️ No pins option found for variant:', pinsState.variant);
        }
    } else {
        console.warn('⚠️ No pins variant selected');
    }
    
    console.groupEnd();
}

// Глобальные функции для доступа из консоли (для отладки)
window.debugCustomizer = {
    logState: logCustomizerState,
    logCaseMapping: logCaseMapping,
    checkCaseCompatibility: checkCaseCompatibility,
    logSectionFlow: logSectionFlow,
    logCaseFlow: logCaseFlow,
    logShockmountPinsFlow: logShockmountPinsFlow
};

console.log('[STATE DEBUG] Debug module loaded. Use window.debugCustomizer.logState() for debugging.');
