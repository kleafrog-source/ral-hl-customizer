import { stateManager } from '../core/state.js';
import { syncCurrentModelOptionData } from './hl-data-manager.js';
import { applyModelDefaults } from './model-defaults.js';
import { applyModelRuntimeState } from './model-runtime.js';

function restoreSavedModelSelection(modelCode, restoreSavedState) {
    return restoreSavedState ? stateManager.restoreModelState(modelCode) : false;
}

function syncModelSelectionData(modelCode) {
    syncCurrentModelOptionData(modelCode);
}

function applySelectionDefaults(modelCode, restored) {
    if (!restored) {
        applyModelDefaults(modelCode);
    }
}

function buildSelectionResult(restored, runtimeData) {
    return {
        restored,
        runtimeData
    };
}

export function prepareModelSelection(modelCode, options = {}) {
    const { restoreSavedState = false } = options;

    if (!modelCode) {
        return null;
    }

    syncModelSelectionData(modelCode);
    const restored = restoreSavedModelSelection(modelCode, restoreSavedState);

    if (!restored) {
        stateManager.set('case.laserEngravingEnabled', false);
    }

    const runtimeData = applyModelRuntimeState(modelCode, {
        preserveShockmountSelection: restored
    });

    if (!runtimeData) {
        return buildSelectionResult(restored, null);
    }

    applySelectionDefaults(modelCode, restored);

    return buildSelectionResult(restored, runtimeData);
}
