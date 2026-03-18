import { stateManager } from '../core/state.js';
import { getAnimationModelKey, getBaseAnimationModelKey } from '../config/model-capabilities.js';

const microphoneAnimations = {
    '017-TUBE': {
        'global-view': {
            microphone: { transform: 'translateX(78%) translateY(8%) scale(0.78)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(132%) translateY(46%) scale(0.84)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(-8%) translateY(-2%) scale(1.08)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(180%) translateY(-6%) scale(1.18)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(120%) translateY(44%) scale(0.76)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(-18%) translateY(-10%) scale(0.96)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(20%) translateY(-2%) scale(0.9)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(96%) translateY(25%) scale(1.28)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(6%) translateY(-18%) scale(1.08)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(70%) translateY(18%) scale(0.6)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(120%) translateY(44%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(0%) translateY(-4%) scale(1.16)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(245%) translateY(-38%) scale(1.7)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(150%) translateY(42%) scale(0.8)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(-8%) translateY(-2%) scale(1.08)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '017-FET': {
        'global-view': {
            microphone: { transform: 'translateX(66%) translateY(11%) scale(0.82)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(142%) translateY(42%) scale(0.88)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(18%) translateY(-8%) scale(1.02)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(188%) translateY(-6%) scale(1.18)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(88%) translateY(44%) scale(0.84)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(-4%) translateY(-14%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(20%) translateY(-2%) scale(0.92)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(104%) translateY(24%) scale(1.32)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(12%) translateY(-20%) scale(1.08)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(66%) translateY(11%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(142%) translateY(42%) scale(0.8)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(10%) translateY(-4%) scale(1.18)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(250%) translateY(-38%) scale(1.78)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(140%) translateY(42%) scale(0.82)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(18%) translateY(-8%) scale(1.02)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '023-BOMBLET-NO-SHOCKMOUNT': {
        'global-view': {
            microphone: { transform: 'translateX(250%) translateY(6%) scale(0.86)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(4%) translateY(54%) scale(0.72)', opacity: 0, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(22%) translateY(-7%) scale(1.02)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(285%) translateY(-8%) scale(1.12)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(0%) translateY(54%) scale(0.72)', opacity: 0, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(10%) translateY(-12%) scale(0.96)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(115%) translateY(0%) scale(0.9)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(92%) translateY(26%) scale(1.22)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(18%) translateY(-18%) scale(1.06)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(235%) translateY(12%) scale(0.72)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(0%) translateY(54%) scale(0.72)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(18%) translateY(-4%) scale(1.18)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(300%) translateY(-36%) scale(1.85)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(0%) translateY(54%) scale(0.72)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(22%) translateY(-7%) scale(1.02)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '023-BOMBLET-WITH-SHOCKMOUNT': {
        'global-view': {
            microphone: { transform: 'translateX(196%) translateY(8%) scale(0.84)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(24%) translateY(41%) scale(0.88)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(30%) translateY(-8%) scale(1.04)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(240%) translateY(-8%) scale(1.1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(20%) translateY(42%) scale(0.82)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(20%) translateY(-14%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(120%) translateY(0%) scale(0.94)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(90%) translateY(24%) scale(1.34)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(22%) translateY(-20%) scale(1.08)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(196%) translateY(12%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(24%) translateY(41%) scale(0.76)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(20%) translateY(-4%) scale(1.2)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(278%) translateY(-34%) scale(1.82)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(24%) translateY(41%) scale(0.88)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(30%) translateY(-8%) scale(1.04)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '023-MALFA': {
        'global-view': {
            microphone: { transform: 'translateX(214%) translateY(4%) scale(0.84)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(6%) translateY(40%) scale(0.92)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(36%) translateY(-8%) scale(1.05)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(254%) translateY(-8%) scale(1.12)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(0%) translateY(44%) scale(0.84)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(24%) translateY(-14%) scale(0.98)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(134%) translateY(-1%) scale(0.96)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(86%) translateY(22%) scale(1.34)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(28%) translateY(-18%) scale(1.1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(214%) translateY(12%) scale(0.72)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(6%) translateY(40%) scale(0.82)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(30%) translateY(-4%) scale(1.18)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(288%) translateY(-34%) scale(1.84)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(6%) translateY(40%) scale(0.92)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(36%) translateY(-8%) scale(1.05)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '023-DELUXE': {
        'global-view': {
            microphone: { transform: 'translateX(300%) translateY(5%) scale(0.88)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(2%) translateY(56%) scale(0.74)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(6%) translateY(-6%) scale(0.96)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(332%) translateY(-7%) scale(1.12)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(0%) translateY(56%) scale(0.74)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(-8%) translateY(-10%) scale(0.9)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(108%) translateY(0%) scale(0.94)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(82%) translateY(22%) scale(1.28)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(12%) translateY(-18%) scale(1.04)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(290%) translateY(12%) scale(0.72)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(2%) translateY(56%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(4%) translateY(-2%) scale(1.16)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(336%) translateY(-34%) scale(1.86)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(2%) translateY(56%) scale(0.74)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(6%) translateY(-6%) scale(0.96)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    }
};

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
        states: microphoneAnimations[normalizedModel] || null
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
    const animationConfig = microphoneAnimations[micModel]?.[stateName];
    if (!animationConfig) {
        console.warn(`Animation state '${stateName}' for model '${micModel}' not found.`);
        return;
    }

    if (currentTimeline) {
        currentTimeline.pause();
    }

    const timeline = window.anime.timeline({
        complete: () => {
            Object.values(layers).forEach(el => el?.classList.remove('active'));
            if (layers[newActiveLayerId]) {
                layers[newActiveLayerId].classList.add('active');
            }
            if (stateName === 'case-active' && layers.case) {
                layers.case.style.pointerEvents = 'auto';
            }
            currentTimeline = null;
        }
    });

    Object.values(layers).forEach(el => {
        if (el) el.style.pointerEvents = 'none';
    });

    for (const layerId of Object.keys(layers)) {
        const layerElement = layers[layerId];
        const state = animationConfig[layerId];
        if (layerElement && state) {
            const transformProps = parseTransform(state.transform);
            timeline.add({
                targets: layerElement,
                ...transformProps,
                opacity: state.opacity,
                duration: state.duration,
                easing: state.easing
            }, 0);
        }
    }
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

    for (const [id, el] of Object.entries(layers)) {
        if (el) {
            el.classList.add('layer');
            el.style.opacity = '1';
            el.style.display = 'block';
        } else {
            console.warn(`Camera effect layer element with ID for '${id}' not found.`);
        }
    }

    const initialMicModel = resolveAnimationModel(initialVariant);
    const initialConfig = microphoneAnimations[initialMicModel]?.[initialState];
    if (initialConfig) {
        for (const layerId of Object.keys(layers)) {
            const layerElement = layers[layerId];
            const state = initialConfig[layerId];
            if (layerElement && state) {
                layerElement.style.transform = state.transform;
                layerElement.style.opacity = state.opacity;
            }
        }
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

    if (newActiveLayerId === activeLayerId && newActiveLayerId !== null) return;

    const stateMap = {
        microphone: 'mic-active',
        shockmount: 'shockmount-active',
        case: 'case-active',
        logo: 'logo-view'
    };
    const stateName = stateMap[newActiveLayerId];
    if (!stateName) return;

    const currentState = stateManager.get();
    const micModel = resolveAnimationModel(currentState.currentModelCode, currentState);

    if (newActiveLayerId === 'shockmount') {
        if (currentState.shockmount && currentState.shockmount.enabled === true && currentState.shockmount.available) {
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
