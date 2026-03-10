import { stateManager } from '../core/state.js';

// --- Configuration: Full animation configs for all 5 models ---
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
        }
    }
};

// --- State ---
const layers = {
    microphone: null,
    shockmount: null,
    case: null
};
let activeLayerId = null;
let currentTimeline = null;

// --- Private Functions ---

function normalizeMicModel(variant) {
    if (!variant) return '017-TUBE';
    switch (variant) {
        case '023-the-bomblet': return '023-BOMBLET';
        case '023-malfa': return '023-MALFA';
        case '023-deluxe': return '023-DELUXE';
        case '017-fet': return '017-FET';
        case '017-tube': return '017-TUBE';
        default: return variant.toUpperCase();
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
                easing: state.easing,
            }, 0);
        }
    }
    currentTimeline = timeline;
}

// --- Public API ---

export function initCameraEffect(initialVariant, initialState = 'global-view') {
    if (typeof window.anime !== 'function') {
        console.error("anime.js is not loaded. Camera effect cannot be initialized.");
        return;
    }

    layers.microphone = document.getElementById('svg-wrapper');
    layers.shockmount = document.getElementById('shockmount-preview-container');
    layers.case = document.getElementById('case-preview-container');

    for (const [id, el] of Object.entries(layers)) {
        if (el) {
            el.classList.add('layer');
            // Ensure elements are visible before animation
            el.style.opacity = '1';
            el.style.display = 'block';
        } else {
            console.warn(`Camera effect layer element with ID for '${id}' not found.`);
        }
    }
    
    const initialMicModel = normalizeMicModel(initialVariant);
    
    // Set initial state without animation for instant load
    const initialConfig = microphoneAnimations[initialMicModel]?.[initialState];
    if (initialConfig) {
        for (const layerId of Object.keys(layers)) {
            const layerElement = layers[layerId];
            const state = initialConfig[layerId];
            if (layerElement && state) {
                const transformProps = parseTransform(state.transform);
                Object.assign(layerElement.style, {
                    transform: state.transform,
                    opacity: state.opacity
                });
            }
        }
        if (initialState === 'case-active' && layers.case) {
            layers.case.style.pointerEvents = 'auto';
            layers.case.classList.add('active');
        }
    }
    
    activeLayerId = initialState === 'global-view' ? null : 
                   initialState === 'mic-active' ? 'microphone' :
                   initialState === 'shockmount-active' ? 'shockmount' : 'case';
}

export function switchLayer(newActiveLayerId) {
    if (typeof window.anime !== 'function') {
        console.error("anime.js is not loaded. Cannot switch layers.");
        return;
    }

    if (!layers[newActiveLayerId]) {
        console.warn(`Cannot switch to layer '${newActiveLayerId}': element not found.`);
        return;
    }
    
    if (newActiveLayerId === activeLayerId && newActiveLayerId !== null) return;

    const stateMap = {
        'microphone': 'mic-active',
        'shockmount': 'shockmount-active',
        'case': 'case-active'
    };
    const stateName = stateMap[newActiveLayerId];
    
    if (!stateName) {
        console.warn(`No active state mapping for layer ID: ${newActiveLayerId}`);
        return;
    }

    // For shockmount-active mode, ensure we use the correct layer based on current variant
    if (newActiveLayerId === 'shockmount') {
        const currentState = stateManager.get();
        const micModel = normalizeMicModel(currentState.variant);
        
        // Only show shockmount if it's enabled
        if (currentState.shockmount && currentState.shockmount.enabled === true) {
            animateMicrophoneState(micModel, stateName, newActiveLayerId);
        } else {
            console.warn('Shockmount is not enabled, cannot switch to shockmount layer');
            return;
        }
    } else {
        const micModel = normalizeMicModel(stateManager.get('variant'));
        animateMicrophoneState(micModel, stateName, newActiveLayerId);
    }
    
    activeLayerId = newActiveLayerId;
}

// Helper: Get current active layer
export function getActiveLayer() {
    return activeLayerId;
}

// Helper: Force update animations if variant changes
export function updateMicVariant(newVariant) {
    if (activeLayerId) {
        switchLayer(activeLayerId);
    }
}