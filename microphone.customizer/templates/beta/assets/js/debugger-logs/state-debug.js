// debugger-logs/state-debug.js
// Модуль для отладки состояния кастомизатора

import { stateManager } from '../core/state.js';
import { getModelData } from '../config.js';

/**
 * Логирует текущее состояние кастомизатора для отладки
 * @param {string} label - Метка для группы логов
 */
export function logCustomizerState(label = '[STATE DEBUG]') {
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
    
    // Проверяем SERIES_VAR - содержит ли ID моделей
    const seriesVar = selectedCaseOption.SERIES_VAR || [];
    if (seriesVar.length > 0 && seriesVar.includes(modelId.toString())) {
        console.log(`[CASE COMPATIBILITY] Case is compatible via SERIES_VAR`);
        return true;
    }
    
    // Если футляр для всех моделей
    if ((!selectedCaseOption.UF_MODEL_ID || selectedCaseOption.UF_MODEL_ID == 0) && 
        seriesVar.length === 0) {
        console.log(`[CASE COMPATIBILITY] Case is universal for all models`);
        return true;
    }
    
    console.log(`[CASE COMPATIBILITY] Case is NOT compatible with model ${modelCode}`);
    return false;
}

// Глобальные функции для доступа из консоли (для отладки)
window.debugCustomizer = {
    logState: logCustomizerState,
    logCaseMapping: logCaseMapping,
    checkCaseCompatibility: checkCaseCompatibility
};

console.log('[STATE DEBUG] Debug module loaded. Use window.debugCustomizer.logState() for debugging.');
