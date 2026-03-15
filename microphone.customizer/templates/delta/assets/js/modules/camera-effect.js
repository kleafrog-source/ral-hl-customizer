import { stateManager } from '../core/state.js';
import { getModelData } from '../config.js';

const microphoneAnimations = {
    '017-TUBE': {
        'global-view': {
            microphone: { transform: 'translateX(310%) translateY(-1%) scale(0.9)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(50%) translateY(63%) scale(0.75)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(4%) translateY(-7%) scale(0.9)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(325%) translateY(2%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(6%) translateY(54%) scale(0.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(-17%) translateY(-13%) scale(0.9)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(-3%) translateY(-9%) scale(1.2)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(114%) translateY(33%) scale(1.3)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(10%) translateY(-5%) scale(1.15)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(340%) translateY(-45%) scale(1.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(241%) translateY(33%) scale(1)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '017-FET': {
        'global-view': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(10%) translateY(-12%) scale(1)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(325%) translateY(2%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(241%) translateY(33%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(-3%) translateY(-9%) scale(1.2)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(114%) translateY(33%) scale(1.3)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(10%) translateY(-5%) scale(1.15)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(340%) translateY(-45%) scale(1.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(241%) translateY(33%) scale(1)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '023-BOMBLET': {
        'global-view': {
            microphone: { transform: 'translateX(310%) translateY(-1%) scale(0.9)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(50%) translateY(63%) scale(0.75)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(4%) translateY(-7%) scale(0.9)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(325%) translateY(2%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(241%) translateY(33%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(-3%) translateY(-9%) scale(1.2)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(114%) translateY(33%) scale(1.3)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(10%) translateY(-5%) scale(1.15)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(340%) translateY(-45%) scale(1.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(241%) translateY(33%) scale(1)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '023-MALFA': {
        'global-view': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(10%) translateY(-12%) scale(1)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(325%) translateY(2%) scale(1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(6%) translateY(54%) scale(0.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(-17%) translateY(-13%) scale(0.9)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(362%) translateY(-1%) scale(1.1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(114%) translateY(33%) scale(1.3)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(10%) translateY(-5%) scale(1.15)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(340%) translateY(-45%) scale(1.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(6%) translateY(54%) scale(0.8)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(-17%) translateY(-13%) scale(0.9)', opacity: 0, duration: 800, easing: 'easeInQuad' }
        }
    },
    '023-DELUXE': {
        'global-view': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' },
            case: { transform: 'translateX(10%) translateY(-12%) scale(1)', opacity: 1, duration: 1000, easing: 'easeInOutQuad' }
        },
        'mic-active': {
            microphone: { transform: 'translateX(344%) translateY(0%) scale(1.1)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(0%) translateY(68%) scale(0.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(-23%) translateY(-11%) scale(0.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(-3%) translateY(-9%) scale(1.2)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(114%) translateY(33%) scale(1.3)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            case: { transform: 'translateX(46%) translateY(-33%) scale(1.33)', opacity: 1, duration: 1200, easing: 'easeOutCubic' }
        },
        'case-active': {
            microphone: { transform: 'translateX(116%) translateY(12%) scale(0.7)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(10%) translateY(-5%) scale(1.15)', opacity: 1, duration: 1000, easing: 'easeOutQuad', pointerEvents: 'auto' }
        },
        'logo-view': {
            microphone: { transform: 'translateX(340%) translateY(-45%) scale(1.8)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
            shockmount: { transform: 'translateX(103%) translateY(35%) scale(0.66)', opacity: 0, duration: 800, easing: 'easeInQuad' },
            case: { transform: 'translateX(10%) translateY(-12%) scale(1)', opacity: 0, duration: 800, easing: 'easeInQuad' }
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

function normalizeMicModel(modelCode) {
    if (!modelCode) return '017-TUBE';

    const modelData = getModelData(modelCode);
    if (modelData?.CODE) {
        return modelData.CODE.toUpperCase().replace('THE-BOMBLET', 'BOMBLET');
    }

    switch (modelCode) {
        case '023-the-bomblet':
            return '023-BOMBLET';
        case '023-malfa':
            return '023-MALFA';
        case '023-deluxe':
            return '023-DELUXE';
        case '017-fet':
            return '017-FET';
        case '017-tube':
            return '017-TUBE';
        default:
            return modelCode.toUpperCase();
    }
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

    const initialMicModel = normalizeMicModel(initialVariant);
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
                : 'case';
}

export function switchLayer(newActiveLayerId) {
    if (typeof window.anime !== 'function') {
        console.error('anime.js is not loaded. Cannot switch layers.');
        return;
    }

    if (!layers[newActiveLayerId]) {
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
    const micModel = normalizeMicModel(currentState.currentModelCode);

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
