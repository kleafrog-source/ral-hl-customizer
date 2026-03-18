import { stateManager } from '../core/state.js';
import { syncCurrentModelOptionData } from './hl-data-manager.js';
import { applyModelDefaults } from './model-defaults.js';
import { applyModelRuntimeState } from './model-runtime.js';

export function prepareModelSelection(modelCode, options = {}) {
    const { restoreSavedState = false } = options;

    if (!modelCode) {
        return null;
    }

    syncCurrentModelOptionData(modelCode);

    const restored = restoreSavedState
        ? stateManager.restoreModelState(modelCode)
        : false;

    const runtimeData = applyModelRuntimeState(modelCode, {
        preserveShockmountSelection: restored
    });

    if (!restored) {
        applyModelDefaults(modelCode);
    }

    return {
        restored,
        runtimeData
    };
}
