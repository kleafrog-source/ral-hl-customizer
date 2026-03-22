import { stateManager } from '../core/state.js';
import { getAnimationModelKey, getBaseAnimationModelKey } from '../config/model-capabilities.js';
import { DIRECT_CAMERA_VIEW_OVERRIDES, SCENE_CAMERA_PRESETS } from '../config/camera-presets.js';
import { debugWarn } from '../utils/debug.js';

const layers = {
    microphone: null,
    shockmount: null,
    case: null
};

let sceneElement = null;

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

const ENABLE_CAMERA_FOCUS_STATES = false;

let activeLayerId = null;
let currentTimeline = null;
let currentStateName = 'global-view';
let resizeRafId = null;
let resizeListenersBound = false;
let cameraInitialized = false;

function getCameraPresetDevice() {
    if (typeof window === 'undefined') {
        return 'desktop';
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const shortSide = Math.min(width, height);
    const isLandscape = width > height;

    if (shortSide <= 767) {
        return isLandscape ? 'mobile-landscape' : 'mobile-portrait';
    }

    if (width <= 1180) {
        return 'tablet';
    }

    return 'desktop';
}

function isMobileCameraDevice() {
    return getCameraPresetDevice().startsWith('mobile');
}

export function normalizeMicModel(modelCode) {
    return getBaseAnimationModelKey(modelCode);
}

export function resolveAnimationModel(modelCode, state = stateManager.get()) {
    return getAnimationModelKey(modelCode, state);
}

export function getAnimationPreset(modelCode, state = stateManager.get()) {
    const normalizedModel = resolveAnimationModel(modelCode, state);
    const presetDevice = getCameraPresetDevice();
    return {
        model: normalizedModel,
        device: presetDevice,
        states: SCENE_CAMERA_PRESETS[presetDevice]?.[normalizedModel] || null
    };
}

function isAnimeReady() {
    return typeof window.anime === 'function';
}

function syncLayerElements() {
    sceneElement = document.getElementById('camera-scene');

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

        debugWarn(`Camera effect layer element with ID for '${id}' not found.`);
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
    const directConfig = DIRECT_CAMERA_VIEW_OVERRIDES[preset.device]?.[preset.model]?.[stateName] || null;

    if (directConfig) {
        return {
            model: preset.model,
            device: preset.device,
            config: directConfig
        };
    }

    return {
        model: preset.model,
        device: preset.device,
        config: preset.states?.states?.[stateName]
            ? {
                baseLayers: preset.states.baseLayers,
                state: preset.states.states[stateName]
            }
            : null
    };
}

function hasDirectViewOverride(modelCode, stateName, state = stateManager.get()) {
    const preset = getAnimationPreset(modelCode, state);
    return Boolean(DIRECT_CAMERA_VIEW_OVERRIDES[preset.device]?.[preset.model]?.[stateName]);
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

function formatPercentValue(value) {
    return `${Number((Number(value) || 0).toFixed(2))}%`;
}

function buildTransformString({ x = 0, y = 0, scale = 1 } = {}) {
    return `translateX(${formatPercentValue(x)}) translateY(${formatPercentValue(y)}) scale(${Number((Number(scale) || 1).toFixed(2))})`;
}

function isDirectRenderedConfig(config) {
    return Boolean(config?.renderedLayers);
}

function getRenderedLayerState(config, layerId) {
    if (isDirectRenderedConfig(config)) {
        return config.renderedLayers[layerId] || null;
    }

    const baseLayer = config?.baseLayers?.[layerId];
    const stateLayer = config?.state?.layers?.[layerId];
    if (!baseLayer || !stateLayer) {
        return null;
    }

    return {
        transform: buildTransformString({
            x: (baseLayer.x || 0) + (stateLayer.x || 0),
            y: (baseLayer.y || 0) + (stateLayer.y || 0),
            scale: (baseLayer.scale || 1) * (stateLayer.scale || 1)
        }),
        opacity: typeof stateLayer.opacity === 'number' ? stateLayer.opacity : baseLayer.opacity,
        duration: stateLayer.duration ?? baseLayer.duration,
        easing: stateLayer.easing ?? baseLayer.easing,
        pointerEvents: stateLayer.pointerEvents ?? baseLayer.pointerEvents
    };
}

function getSceneTransformString(config) {
    if (isDirectRenderedConfig(config)) {
        return config.sceneTransform || 'translateX(0vw) translateY(0vw) scale(1)';
    }

    return buildTransformString(config?.state?.scene);
}

function getSceneAnimationMeta(config, stateName) {
    if (isDirectRenderedConfig(config)) {
        return {
            duration: config.sceneMeta?.duration ?? 1000,
            easing: config.sceneMeta?.easing ?? 'easeInOutQuad'
        };
    }

    const activeLayerId = getActiveLayerFromState(stateName) || 'microphone';
    const layerState = config?.state?.layers?.[activeLayerId];

    return {
        duration: layerState?.duration ?? 1000,
        easing: layerState?.easing ?? 'easeInOutQuad'
    };
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
        const layerState = getRenderedLayerState(animationConfig, layerId);

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

    if ((stateName === 'case-active' || layerId === 'case') && layers.case) {
        layers.case.style.pointerEvents = 'auto';
    }
}

function applyStaticState(animationConfig, stateName, activeLayerOverride = null) {
    if (!animationConfig) {
        return;
    }

    resetLayerPointerEvents();

    if (sceneElement) {
        sceneElement.style.transform = getSceneTransformString(animationConfig);
    }

    forEachConfiguredLayer(animationConfig, (layerElement, layerState) => {
        layerElement.style.transform = layerState.transform;
        layerElement.style.opacity = layerState.opacity;
    });

    syncActiveClasses(activeLayerOverride ?? getActiveLayerFromState(stateName), stateName);
}

function reapplyCameraState() {
    const currentState = stateManager.get();
    const modelCode = currentState.currentModelCode;

    if (!modelCode) {
        return;
    }

    const { model: micModel, config: animationConfig } = getPresetState(modelCode, currentStateName, currentState);
    if (!animationConfig) {
        debugWarn(`Animation state '${currentStateName}' for model '${micModel}' not found.`);
        return;
    }

    if (currentTimeline) {
        currentTimeline.pause();
        currentTimeline = null;
    }

    applyStaticState(
        animationConfig,
        currentStateName,
        ENABLE_CAMERA_FOCUS_STATES ? null : activeLayerId
    );
    activeLayerId = ENABLE_CAMERA_FOCUS_STATES ? getActiveLayerFromState(currentStateName) : activeLayerId;
}

function bindCameraViewportListeners() {
    if (typeof window === 'undefined' || resizeListenersBound) {
        return;
    }

    const scheduleReapply = () => {
        if (resizeRafId) {
            window.cancelAnimationFrame(resizeRafId);
        }

        resizeRafId = window.requestAnimationFrame(() => {
            resizeRafId = window.requestAnimationFrame(() => {
                reapplyCameraState();
                resizeRafId = null;
            });
        });
    };

    window.addEventListener('resize', scheduleReapply);
    window.addEventListener('orientationchange', scheduleReapply);
    resizeListenersBound = true;
}

function animateCameraState(modelCode, stateName, newActiveLayerId, state = stateManager.get()) {
    const { model: micModel, config: animationConfig } = getPresetState(modelCode, stateName, state);
    if (!animationConfig) {
        debugWarn(`Animation state '${stateName}' for model '${micModel}' not found.`);
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

    if (sceneElement) {
        const sceneMeta = getSceneAnimationMeta(animationConfig, stateName);
        timeline.add({
            targets: sceneElement,
            ...parseTransform(getSceneTransformString(animationConfig)),
            duration: sceneMeta.duration,
            easing: sceneMeta.easing
        }, 0);
    }

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
    bindCameraViewportListeners();

    const { config: initialConfig } = getPresetState(initialVariant, initialState);
    applyStaticState(initialConfig, initialState);

    activeLayerId = getActiveLayerFromState(initialState);
    currentStateName = initialState;
    cameraInitialized = true;
}

export function resetCameraToGlobalView(modelCode = stateManager.get().currentModelCode, state = stateManager.get()) {
    if (!modelCode) {
        return;
    }

    const { model: micModel, config: animationConfig } = getPresetState(modelCode, 'global-view', state);
    if (!animationConfig) {
        debugWarn(`Animation state 'global-view' for model '${micModel}' not found.`);
        return;
    }

    if (currentTimeline) {
        currentTimeline.pause();
        currentTimeline = null;
    }

    if (isAnimeReady() && cameraInitialized && (currentStateName !== 'global-view' || activeLayerId !== null)) {
        animateCameraState(modelCode, 'global-view', null, state);
    } else {
        applyStaticState(animationConfig, 'global-view', null);
    }

    activeLayerId = null;
    currentStateName = 'global-view';
    cameraInitialized = true;
}

export function transitionToGlobalView(modelCode = stateManager.get().currentModelCode, state = stateManager.get()) {
    if (!modelCode) {
        return;
    }

    syncLayerElements();

    if (!isAnimeReady() || !cameraInitialized) {
        initCameraEffect(modelCode, 'global-view');
        return;
    }

    const { model: micModel, config: animationConfig } = getPresetState(modelCode, 'global-view', state);
    if (!animationConfig) {
        debugWarn(`Animation state 'global-view' for model '${micModel}' not found.`);
        return;
    }

    activeLayerId = null;
    currentStateName = 'global-view';
    animateCameraState(modelCode, 'global-view', null, state);
}

export function switchLayer(newActiveLayerId) {
    if (!isAnimeReady()) {
        console.error('anime.js is not loaded. Cannot switch layers.');
        return;
    }

    if (newActiveLayerId !== 'logo' && !layers[newActiveLayerId]) {
        debugWarn(`Cannot switch to layer '${newActiveLayerId}': element not found.`);
        return;
    }

    const stateName = getLayerStateName(newActiveLayerId);
    if (!stateName) {
        return;
    }

    const interactionLayerId = newActiveLayerId === 'logo' ? 'microphone' : newActiveLayerId;
    if (interactionLayerId === activeLayerId && stateName === currentStateName && interactionLayerId !== null) {
        return;
    }

    const currentState = stateManager.get();
    const directFocusStateEnabled = hasDirectViewOverride(currentState.currentModelCode, stateName, currentState);

    if (!ENABLE_CAMERA_FOCUS_STATES && !directFocusStateEnabled) {
        if (newActiveLayerId === 'shockmount' && (!currentState.shockmount?.enabled || !currentState.shockmount?.available)) {
            return;
        }

        const { model: micModel, config: animationConfig } = getPresetState(currentState.currentModelCode, 'global-view', currentState);
        if (!animationConfig) {
            debugWarn(`Animation state 'global-view' for model '${micModel}' not found.`);
            return;
        }

        if (currentTimeline) {
            currentTimeline.pause();
            currentTimeline = null;
        }

        applyStaticState(animationConfig, 'global-view', interactionLayerId);
        activeLayerId = interactionLayerId;
        currentStateName = 'global-view';
        return;
    }

    if (newActiveLayerId === 'shockmount') {
        if (currentState.shockmount?.enabled === true && currentState.shockmount?.available) {
            animateCameraState(currentState.currentModelCode, stateName, interactionLayerId, currentState);
            activeLayerId = interactionLayerId;
            currentStateName = stateName;
        }
        return;
    }

    animateCameraState(currentState.currentModelCode, stateName, interactionLayerId, currentState);
    activeLayerId = interactionLayerId;
    currentStateName = stateName;
}

export function getActiveLayer() {
    return activeLayerId;
}

export function updateMicVariant(newVariant) {
    const currentState = stateManager.get();

    if (activeLayerId === 'shockmount' && (!currentState.shockmount?.enabled || !currentState.shockmount?.available)) {
        activeLayerId = null;
        currentStateName = 'global-view';
        initCameraEffect(newVariant || currentState.currentModelCode, 'global-view');
        return;
    }

    if (activeLayerId) {
        switchLayer(activeLayerId);
    } else if (newVariant) {
        currentStateName = 'global-view';
        initCameraEffect(newVariant, 'global-view');
    }
}
