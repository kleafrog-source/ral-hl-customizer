import { stateManager } from '../core/state.js';
import { getAnimationModelKey, getBaseAnimationModelKey } from '../config/model-capabilities.js';
import { CAMERA_PRESETS } from '../config/camera-presets.js';

const layers = {
    microphone: null,
    shockmount: null,
    case: null
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

function animateMicrophoneState(micModel, stateName, newActiveLayerId) {
    const animationConfig = CAMERA_PRESETS[micModel]?.[stateName];
    if (!animationConfig) {
        console.warn(`Animation state '${stateName}' for model '${micModel}' not found.`);
        return;
    }

    if (currentTimeline) {
        currentTimeline.pause();
    }

    const timeline = window.anime.timeline({
        complete: () => {
            Object.values(layers).forEach((element) => element?.classList.remove('active'));
            if (layers[newActiveLayerId]) {
                layers[newActiveLayerId].classList.add('active');
            }
            if (stateName === 'case-active' && layers.case) {
                layers.case.style.pointerEvents = 'auto';
            }
            currentTimeline = null;
        }
    });

    Object.values(layers).forEach((element) => {
        if (element) {
            element.style.pointerEvents = 'none';
        }
    });

    Object.keys(layers).forEach((layerId) => {
        const layerElement = layers[layerId];
        const layerState = animationConfig[layerId];

        if (!layerElement || !layerState) {
            return;
        }

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
    if (typeof window.anime !== 'function') {
        console.error('anime.js is not loaded. Camera effect cannot be initialized.');
        return;
    }

    layers.microphone = document.getElementById('microphone-svg-container');
    layers.shockmount = document.getElementById('shockmount-svg-container');
    layers.case = document.getElementById('case-preview-container');

    Object.entries(layers).forEach(([id, element]) => {
        if (element) {
            element.classList.add('layer');
            element.style.opacity = '1';
            element.style.display = 'block';
            return;
        }

        console.warn(`Camera effect layer element with ID for '${id}' not found.`);
    });

    const initialMicModel = resolveAnimationModel(initialVariant);
    const initialConfig = CAMERA_PRESETS[initialMicModel]?.[initialState];

    if (initialConfig) {
        Object.keys(layers).forEach((layerId) => {
            const layerElement = layers[layerId];
            const layerState = initialConfig[layerId];
            if (!layerElement || !layerState) {
                return;
            }

            layerElement.style.transform = layerState.transform;
            layerElement.style.opacity = layerState.opacity;
        });

        if (initialState === 'case-active' && layers.case) {
            layers.case.style.pointerEvents = 'auto';
            layers.case.classList.add('active');
        }
    }

    activeLayerId = initialState === 'global-view'
        ? null
        : initialState === 'mic-active'
            ? 'microphone'
            : initialState === 'shockmount-active'
                ? 'shockmount'
                : initialState === 'logo-view'
                    ? 'logo'
                    : 'case';
}

export function switchLayer(newActiveLayerId) {
    if (typeof window.anime !== 'function') {
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

    const stateMap = {
        microphone: 'mic-active',
        shockmount: 'shockmount-active',
        case: 'case-active',
        logo: 'logo-view'
    };
    const stateName = stateMap[newActiveLayerId];
    if (!stateName) {
        return;
    }

    const currentState = stateManager.get();
    const micModel = resolveAnimationModel(currentState.currentModelCode, currentState);

    if (newActiveLayerId === 'shockmount') {
        if (currentState.shockmount?.enabled === true && currentState.shockmount?.available) {
            animateMicrophoneState(micModel, stateName, newActiveLayerId);
        }
        return;
    }

    animateMicrophoneState(micModel, stateName, newActiveLayerId);
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
