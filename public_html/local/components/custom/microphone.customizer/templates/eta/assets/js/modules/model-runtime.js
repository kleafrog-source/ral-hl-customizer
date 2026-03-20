import { stateManager } from '../core/state.js';
import { buildShockmountState } from '../config/model-capabilities.js';

function safeNumber(value) {
    const num = typeof value === 'number' ? value : parseInt(value, 10);
    return Number.isNaN(num) ? 0 : num;
}

function applyShockmountRuntimeState(batch, shockmountState, model, preserveShockmountSelection) {
    batch('shockmount.canToggle', shockmountState.canToggle);
    batch('shockmount.available', shockmountState.available);
    batch('shockmount.visible', shockmountState.visible);
    batch('shockmount.included', shockmountState.included);

    if (preserveShockmountSelection) {
        return;
    }

    batch('shockmount.enabled', shockmountState.enabled);
    batch('shockmount.variant', model.defaultShockmount || null);
    batch('shockmountPins.variant', model.defaultShockmountPins || null);
}

export function getModelRuntimeData(modelCode) {
    if (!modelCode) {
        return null;
    }

    const model = window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode];
    if (!model) {
        return null;
    }

    return {
        model,
        modelCode,
        modelId: safeNumber(model.ID),
        modelSeries: model.MODEL_SERIES || '',
        basePrice: safeNumber(model.BASE_PRICE),
        shockmountState: buildShockmountState(model)
    };
}

export function applyModelRuntimeState(modelCode, options = {}) {
    const { preserveShockmountSelection = false } = options;
    const runtimeData = getModelRuntimeData(modelCode);

    if (!runtimeData) {
        return null;
    }

    const { model, modelId, modelSeries, basePrice, shockmountState } = runtimeData;

    stateManager.batch(batch => {
        batch('currentModelCode', modelCode);
        batch('currentModelId', modelId);
        batch('modelSeries', modelSeries);
        batch('basePrice', basePrice);
        batch('defaultShockmountOption', shockmountState.defaultOption);
        applyShockmountRuntimeState(batch, shockmountState, model, preserveShockmountSelection);
    });

    return runtimeData;
}
