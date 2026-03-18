import { stateManager } from '../core/state.js';
import { syncCurrentModelOptionData } from './hl-data-manager.js';
import { applyModelDefaults } from './model-defaults.js';
import { applyModelRuntimeState } from './model-runtime.js';

function restoreSavedModelSelection(modelCode, restoreSavedState) {
    return restoreSavedState ? stateManager.restoreModelState(modelCode) : false;
}

function applySelectionDefaults(modelCode, restored) {
    if (!restored) {
        applyModelDefaults(modelCode);
    }
}

export function prepareModelSelection(modelCode, options = {}) {
    const { restoreSavedState = false } = options;

    if (!modelCode) {
        return null;
    }

    syncCurrentModelOptionData(modelCode);
    const restored = restoreSavedModelSelection(modelCode, restoreSavedState);

    const runtimeData = applyModelRuntimeState(modelCode, {
        preserveShockmountSelection: restored
    });

    if (!runtimeData) {
        return {
            restored,
            runtimeData: null
        };
    }

    applySelectionDefaults(modelCode, restored);

    return {
        restored,
        runtimeData
    };
}
