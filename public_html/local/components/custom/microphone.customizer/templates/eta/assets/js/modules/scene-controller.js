const DEFAULT_SCENE_STATE = Object.freeze({
    cameraPitch: 0,
    cameraZoom: 1,
    horizonY: 50,
    lightAngle: 135,
    shadowIntensity: 0.24,
    shadowColor: '#000000',
    shadowElevation: 'medium'
});

const SCENE_PRESETS = Object.freeze({
    neutral: Object.freeze({
        cameraPitch: 0,
        cameraZoom: 1,
        horizonY: 50,
        lightAngle: 135,
        shadowElevation: 'medium'
    }),
    studio: Object.freeze({
        cameraPitch: 15,
        cameraZoom: 1,
        horizonY: 48,
        lightAngle: 135,
        shadowElevation: 'medium'
    }),
    'low-angle': Object.freeze({
        cameraPitch: 32,
        cameraZoom: 1,
        horizonY: 58,
        lightAngle: 115,
        shadowElevation: 'high'
    }),
    overhead: Object.freeze({
        cameraPitch: 5,
        cameraZoom: 1,
        horizonY: 38,
        lightAngle: 155,
        shadowElevation: 'low'
    })
});

const SHADOW_ELEVATION_SETTINGS = Object.freeze({
    low: Object.freeze({
        directionalLength: 0.8,
        directionalBlur: 0.82,
        ambientBlur: 0.7,
        opacityBoost: 0.9
    }),
    medium: Object.freeze({
        directionalLength: 1,
        directionalBlur: 1,
        ambientBlur: 1,
        opacityBoost: 1
    }),
    high: Object.freeze({
        directionalLength: 1.2,
        directionalBlur: 1.18,
        ambientBlur: 1.12,
        opacityBoost: 1.08
    })
});

const PREVIEW_KINEMATICS_CLASSES = Object.freeze([
    'admin-bg-kinematics-active',
    'scene-kinematics-active'
]);

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function round(value, digits = 2) {
    const numericValue = Number(value) || 0;
    return Number(numericValue.toFixed(digits));
}

function parseHexColor(color) {
    const normalized = String(color || '').trim();
    const hex = normalized.startsWith('#') ? normalized.slice(1) : normalized;

    if (hex.length === 3) {
        const [r, g, b] = hex.split('');
        return [
            Number.parseInt(`${r}${r}`, 16),
            Number.parseInt(`${g}${g}`, 16),
            Number.parseInt(`${b}${b}`, 16)
        ];
    }

    if (hex.length === 6) {
        return [
            Number.parseInt(hex.slice(0, 2), 16),
            Number.parseInt(hex.slice(2, 4), 16),
            Number.parseInt(hex.slice(4, 6), 16)
        ];
    }

    return null;
}

function parseRgbColor(color) {
    const matches = String(color || '').match(/\d+(\.\d+)?/g);
    if (!matches || matches.length < 3) {
        return null;
    }

    return matches.slice(0, 3).map((value) => clamp(Number.parseFloat(value) || 0, 0, 255));
}

function parseColorToRgb(color) {
    return parseHexColor(color) || parseRgbColor(color) || [0, 0, 0];
}

function formatRgbTuple(color) {
    return parseColorToRgb(color).map((channel) => Math.round(channel)).join(' ');
}

function buildDropShadow(x, y, blur, color, opacity) {
    return `drop-shadow(${round(x)}px ${round(y)}px ${round(blur)}px rgb(${color} / ${round(opacity, 3)}))`;
}

function normalizeState(nextState = {}) {
    return {
        cameraPitch: clamp(Number(nextState.cameraPitch) || 0, 0, 45),
        cameraZoom: clamp(Number(nextState.cameraZoom) || 1, 0.8, 1.25),
        horizonY: clamp(Number(nextState.horizonY) || 50, 30, 70),
        lightAngle: ((Number(nextState.lightAngle) || 0) % 360 + 360) % 360,
        shadowIntensity: clamp(Number(nextState.shadowIntensity) || DEFAULT_SCENE_STATE.shadowIntensity, 0.08, 0.8),
        shadowColor: String(nextState.shadowColor || DEFAULT_SCENE_STATE.shadowColor),
        shadowElevation: SHADOW_ELEVATION_SETTINGS[nextState.shadowElevation]
            ? nextState.shadowElevation
            : DEFAULT_SCENE_STATE.shadowElevation
    };
}

function calculateHorizonFromPitch(cameraPitch) {
    const pitchRad = (Number(cameraPitch) || 0) * Math.PI / 180;
    return round(35 + Math.sin(pitchRad) * 25, 1);
}

function ensureKinematicsLayer(sceneElement) {
    if (!sceneElement) {
        return null;
    }

    const existingLayer = sceneElement.querySelector('[data-admin-scene-kinematics]');
    if (existingLayer) {
        return existingLayer;
    }

    const layer = document.createElement('div');
    layer.className = 'admin-scene-kinematics';
    layer.setAttribute('data-admin-scene-kinematics', '1');

    while (sceneElement.firstChild) {
        layer.appendChild(sceneElement.firstChild);
    }

    sceneElement.appendChild(layer);
    return layer;
}

function ensureLayerContentWrapper(layerElement, modifierClass) {
    if (!layerElement) {
        return null;
    }

    const existingWrapper = layerElement.querySelector('[data-scene-layer-content]');
    if (existingWrapper) {
        return existingWrapper;
    }

    const wrapper = document.createElement('div');
    wrapper.className = `scene-layer-content ${modifierClass}`.trim();
    wrapper.setAttribute('data-scene-layer-content', '1');

    while (layerElement.firstChild) {
        wrapper.appendChild(layerElement.firstChild);
    }

    layerElement.appendChild(wrapper);
    return wrapper;
}

export { DEFAULT_SCENE_STATE, SCENE_PRESETS, calculateHorizonFromPitch };

export default class SceneController {
    constructor({
        preview = document.getElementById('preview-area'),
        scene = document.getElementById('camera-scene'),
        microphone = document.getElementById('microphone-svg-container'),
        shockmount = document.getElementById('shockmount-svg-container'),
        caseElement = document.getElementById('case-preview-container')
    } = {}) {
        this.preview = preview;
        this.scene = scene;
        this.microphone = microphone;
        this.shockmount = shockmount;
        this.caseElement = caseElement;
        this.kinematicsLayer = ensureKinematicsLayer(scene);
        this.microphoneContent = ensureLayerContentWrapper(this.microphone, 'scene-layer-content--microphone');
        this.shockmountContent = ensureLayerContentWrapper(this.shockmount, 'scene-layer-content--shockmount');
        this.caseContent = ensureLayerContentWrapper(this.caseElement, 'scene-layer-content--case');
        this.updateQueue = {};
        this.frameRequested = false;
        this.rafId = null;
        this.state = { ...DEFAULT_SCENE_STATE };

        if (this.preview) {
            this.preview.classList.add(...PREVIEW_KINEMATICS_CLASSES);
        }

        this.applySceneState(DEFAULT_SCENE_STATE, { preserveManualHorizon: true });
    }

    queueUpdates(updates) {
        if (!this.preview || !updates || typeof updates !== 'object') {
            return;
        }

        Object.assign(this.updateQueue, updates);

        if (this.frameRequested) {
            return;
        }

        this.frameRequested = true;
        this.rafId = window.requestAnimationFrame(() => this.flushUpdates());
    }

    flushUpdates() {
        if (!this.preview) {
            this.updateQueue = {};
            this.frameRequested = false;
            this.rafId = null;
            return;
        }

        Object.entries(this.updateQueue).forEach(([propertyName, value]) => {
            this.preview.style.setProperty(propertyName, value);
        });

        this.updateQueue = {};
        this.frameRequested = false;
        this.rafId = null;
    }

    buildShadowFilters() {
        const pitchFactor = clamp(this.state.cameraPitch / 45, 0, 1);
        const color = formatRgbTuple(this.state.shadowColor);
        const elevation = SHADOW_ELEVATION_SETTINGS[this.state.shadowElevation] || SHADOW_ELEVATION_SETTINGS.medium;
        const baseLength = (10 + pitchFactor * 18) * elevation.directionalLength;
        const baseBlur = (12 + pitchFactor * 14) * elevation.directionalBlur;
        const ambientBlur = (10 + pitchFactor * 10) * elevation.ambientBlur;
        const shadowAngleRad = (this.state.lightAngle + 180) * Math.PI / 180;
        const directionX = Math.cos(shadowAngleRad);
        const directionY = Math.max(0.24, Math.sin(shadowAngleRad) * 0.55 + 0.72);
        const offsetX = directionX * baseLength;
        const offsetY = directionY * baseLength;
        const opacity = clamp(
            this.state.shadowIntensity * (0.72 + pitchFactor * 0.34) * elevation.opacityBoost,
            0.08,
            0.82
        );
        const ambientOpacity = clamp(opacity * 0.42, 0.04, 0.36);

        return {
            color,
            microphoneFilter: [
                buildDropShadow(0, baseLength * 0.28, ambientBlur, color, ambientOpacity),
                buildDropShadow(offsetX, offsetY, baseBlur, color, opacity)
            ].join(' '),
            shockmountFilter: [
                buildDropShadow(0, baseLength * 0.18, ambientBlur * 0.82, color, ambientOpacity * 0.9),
                buildDropShadow(offsetX * 0.82, offsetY * 0.82, baseBlur * 0.86, color, opacity * 0.82)
            ].join(' '),
            caseFilter: [
                buildDropShadow(0, baseLength * 0.12, ambientBlur * 0.72, color, ambientOpacity * 0.72),
                buildDropShadow(offsetX * 0.55, offsetY * 0.45, baseBlur * 0.78, color, opacity * 0.68)
            ].join(' ')
        };
    }

    buildCssVariables() {
        const pitchFactor = clamp(this.state.cameraPitch / 45, 0, 1);
        const shadows = this.buildShadowFilters();
        const horizonShift = round((50 - this.state.horizonY) * 1.4, 2);

        return {
            '--admin-scene-camera-pitch': `${round(this.state.cameraPitch)}deg`,
            '--admin-scene-camera-pitch-factor': `${round(pitchFactor, 3)}`,
            '--admin-scene-camera-zoom': `${round(this.state.cameraZoom, 3)}`,
            '--admin-scene-horizon-y': `${round(this.state.horizonY, 1)}%`,
            '--admin-scene-horizon-shift': `${horizonShift}px`,
            '--admin-scene-light-angle': `${round(this.state.lightAngle)}deg`,
            '--admin-scene-shadow-intensity': `${round(this.state.shadowIntensity, 3)}`,
            '--admin-scene-shadow-color-rgb': shadows.color,
            '--admin-scene-microphone-filter': shadows.microphoneFilter,
            '--admin-scene-shockmount-filter': shadows.shockmountFilter,
            '--admin-scene-case-filter': shadows.caseFilter
        };
    }

    applySceneState(nextPartialState = {}, options = {}) {
        const nextState = normalizeState({
            ...this.state,
            ...nextPartialState
        });

        if (!options.preserveManualHorizon && Object.prototype.hasOwnProperty.call(nextPartialState, 'cameraPitch') && !Object.prototype.hasOwnProperty.call(nextPartialState, 'horizonY')) {
            nextState.horizonY = calculateHorizonFromPitch(nextState.cameraPitch);
        }

        this.state = nextState;
        this.queueUpdates(this.buildCssVariables());
        return this.getState();
    }

    setShadowElevation(elevation) {
        return this.applySceneState({
            shadowElevation: elevation
        }, { preserveManualHorizon: true });
    }

    setPreset(presetId) {
        const preset = SCENE_PRESETS[presetId];
        if (!preset) {
            return this.getState();
        }

        const nextState = this.applySceneState({
            ...preset,
            shadowElevation: preset.shadowElevation || this.state.shadowElevation
        }, { preserveManualHorizon: true });

        return nextState;
    }

    getState() {
        return {
            ...this.state
        };
    }

    destroy() {
        if (this.preview) {
            [
                '--admin-scene-camera-pitch',
                '--admin-scene-camera-pitch-factor',
                '--admin-scene-camera-zoom',
                '--admin-scene-horizon-y',
                '--admin-scene-horizon-shift',
                '--admin-scene-light-angle',
                '--admin-scene-shadow-intensity',
                '--admin-scene-shadow-color-rgb',
                '--admin-scene-microphone-filter',
                '--admin-scene-shockmount-filter',
                '--admin-scene-case-filter'
            ].forEach((propertyName) => this.preview.style.removeProperty(propertyName));
            this.preview.classList.remove(...PREVIEW_KINEMATICS_CLASSES);
        }

        if (this.rafId) {
            window.cancelAnimationFrame(this.rafId);
        }
    }
}
