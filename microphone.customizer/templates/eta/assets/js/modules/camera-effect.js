import { stateManager } from '../core/state.js';
import { getAnimationModelKey, getBaseAnimationModelKey } from '../config/model-capabilities.js';
import { CAMERA_PRESETS } from '../config/camera-presets.js';

const layers = {
    microphone: null,
    shockmount: null,
    case: null
};

const LAYER_ELEMENT_IDS = {
    microphone: 'microphone-svg-container',
    shockmount: 'shockmount-svg-container',
    case: 'case-preview-container'
};

const LAYER_STATE_MAP = {
    microphone: 'mic-active',
    shockmount: 'shockmount-active',
    case: 'case-active',
    logo: 'logo-view'
};

let activeLayerId = null;
let currentTimeline = null;

export function normalizeMicModel(modelCode) {
    return getBaseAnimationModelKey(modelCode);
}

export function resolveAnimationModel(modelCode, state = stateManager.get()) {
    return getAnimationModelKey(modelCode, state);
}

export function getAnimationPreset(modelCode, state = stateManager.get()) {
    const normalizedModel = resolveAnimationModel(modelCode, state);
    return {
        model: normalizedModel,
        states: CAMERA_PRESETS[normalizedModel] || null
    };
}

function isAnimeReady() {
    return typeof window.anime === 'function';
}

function syncLayerElements() {
    Object.entries(LAYER_ELEMENT_IDS).forEach(([id, elementId]) => {
        layers[id] = document.getElementById(elementId);
    });

    Object.entries(layers).forEach(([id, element]) => {
        if (element) {
            element.classList.add('layer');
            element.style.opacity = '1';
            element.style.display = 'block';
            return;
        }

        console.warn(`Camera effect layer element with ID for '${id}' not found.`);
    });
}

function getLayerStateName(layerId) {
    return LAYER_STATE_MAP[layerId] || null;
}

function getActiveLayerFromState(stateName) {
    if (stateName === 'global-view') {
        return null;
    }

    return Object.keys(LAYER_STATE_MAP).find((layerId) => LAYER_STATE_MAP[layerId] === stateName) || 'case';
}

function getPresetState(modelCode, stateName, state = stateManager.get()) {
    const preset = getAnimationPreset(modelCode, state);
    return {
        model: preset.model,
        config: preset.states?.[stateName] || null
    };
}

function parseTransform(transformStr) {
    const result = { translateX: 0, translateY: 0, scale: 1 };
    if (!transformStr) return result;

    const regex = /(translateX|translateY|scale)\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(transformStr)) !== null) {
        const [, key, value] = match;
        result[key] = key === 'scale' ? parseFloat(value) : value;
    }

    return result;
}

function resetLayerPointerEvents() {
    Object.values(layers).forEach((element) => {
        if (element) {
            element.style.pointerEvents = 'none';
        }
    });
}

function forEachConfiguredLayer(animationConfig, callback) {
    Object.keys(layers).forEach((layerId) => {
        const layerElement = layers[layerId];
        const layerState = animationConfig?.[layerId];

        if (!layerElement || !layerState) {
            return;
        }

        callback(layerElement, layerState, layerId);
    });
}

function syncActiveClasses(layerId, stateName) {
    Object.values(layers).forEach((element) => element?.classList.remove('active'));

    if (layerId && layers[layerId]) {
        layers[layerId].classList.add('active');
    }

    if (stateName === 'case-active' && layers.case) {
        layers.case.style.pointerEvents = 'auto';
    }
}

function applyStaticState(animationConfig, stateName) {
    if (!animationConfig) {
        return;
    }

    resetLayerPointerEvents();

    forEachConfiguredLayer(animationConfig, (layerElement, layerState) => {
        layerElement.style.transform = layerState.transform;
        layerElement.style.opacity = layerState.opacity;
    });

    syncActiveClasses(getActiveLayerFromState(stateName), stateName);
}

function animateCameraState(modelCode, stateName, newActiveLayerId, state = stateManager.get()) {
    const { model: micModel, config: animationConfig } = getPresetState(modelCode, stateName, state);
    if (!animationConfig) {
        console.warn(`Animation state '${stateName}' for model '${micModel}' not found.`);
        return;
    }

    if (currentTimeline) {
        currentTimeline.pause();
    }

    const timeline = window.anime.timeline({
        complete: () => {
            syncActiveClasses(newActiveLayerId, stateName);
            currentTimeline = null;
        }
    });

    resetLayerPointerEvents();

    forEachConfiguredLayer(animationConfig, (layerElement, layerState) => {
        const transformProps = parseTransform(layerState.transform);
        timeline.add({
            targets: layerElement,
            ...transformProps,
            opacity: layerState.opacity,
            duration: layerState.duration,
            easing: layerState.easing
        }, 0);
    });

    currentTimeline = timeline;
}

export function initCameraEffect(initialVariant, initialState = 'global-view') {
    if (!isAnimeReady()) {
        console.error('anime.js is not loaded. Camera effect cannot be initialized.');
        return;
    }

    syncLayerElements();

    const { config: initialConfig } = getPresetState(initialVariant, initialState);
    applyStaticState(initialConfig, initialState);

    activeLayerId = getActiveLayerFromState(initialState);
}

export function switchLayer(newActiveLayerId) {
    if (!isAnimeReady()) {
        console.error('anime.js is not loaded. Cannot switch layers.');
        return;
    }

    if (newActiveLayerId !== 'logo' && !layers[newActiveLayerId]) {
        console.warn(`Cannot switch to layer '${newActiveLayerId}': element not found.`);
        return;
    }

    if (newActiveLayerId === activeLayerId && newActiveLayerId !== null) {
        return;
    }

    const stateName = getLayerStateName(newActiveLayerId);
    if (!stateName) {
        return;
    }

    const currentState = stateManager.get();

    if (newActiveLayerId === 'shockmount') {
        if (currentState.shockmount?.enabled === true && currentState.shockmount?.available) {
            animateCameraState(currentState.currentModelCode, stateName, newActiveLayerId, currentState);
            activeLayerId = newActiveLayerId;
        }
        return;
    }

    animateCameraState(currentState.currentModelCode, stateName, newActiveLayerId, currentState);
    activeLayerId = newActiveLayerId;
}

export function getActiveLayer() {
    return activeLayerId;
}

export function updateMicVariant(newVariant) {
    const currentState = stateManager.get();

    if (activeLayerId === 'shockmount' && (!currentState.shockmount?.enabled || !currentState.shockmount?.available)) {
        activeLayerId = null;
        initCameraEffect(newVariant || currentState.currentModelCode, 'global-view');
        return;
    }

    if (activeLayerId) {
        switchLayer(activeLayerId);
    } else if (newVariant) {
        initCameraEffect(newVariant, 'global-view');
    }
}
