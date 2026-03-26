function mergeLayerState(baseLayer = {}, overrideLayer = {}) {
    return {
        ...baseLayer,
        ...overrideLayer
    };
}

function mergeViewState(baseView = {}, overrideView = {}) {
    return {
        microphone: mergeLayerState(baseView.microphone, overrideView.microphone),
        shockmount: mergeLayerState(baseView.shockmount, overrideView.shockmount),
        case: mergeLayerState(baseView.case, overrideView.case)
    };
}

function mergePresetStates(basePreset = {}, overridePreset = {}) {
    const merged = { ...basePreset };

    Object.entries(overridePreset).forEach(([viewKey, overrideView]) => {
        merged[viewKey] = mergeViewState(basePreset[viewKey], overrideView);
    });

    return merged;
}

function buildCameraPresets(basePresets, overridePresets) {
    const mergedPresets = { ...basePresets };

    Object.entries(overridePresets).forEach(([presetKey, overridePreset]) => {
        mergedPresets[presetKey] = mergePresetStates(basePresets[presetKey], overridePreset);
    });

    return Object.freeze(mergedPresets);
}

/*
 * Camera preset inventory (eta)
 * Models: 017-TUBE, 017-FET, 023-BOMBLET-NO-SHOCKMOUNT,
 * 023-BOMBLET-WITH-SHOCKMOUNT, 023-MALFA, 023-DELUXE.
 * Shared camera states: global-view, mic-active, shockmount-active,
 * case-active, logo-view.
 * Declarative layout migration status: all user-facing model/state/device
 * combinations now resolve through layout-presets.js first.
 *
 * Legacy notes:
 * layout-presets.js is calibrated from the archived vw-based direct-view
 * overrides that matched production positioning. The percent-based transforms
 * below are retained only as semantic fallback metadata for durations/easing
 * and rollback safety; they are not the source of truth for layout geometry.
 * Device-specific override collections below are intentionally minimal and are
 * candidates for full removal once the layout engine no longer needs any
 * legacy fallback metadata.
 */
export const BASE_CAMERA_PRESETS = {
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
            microphone: { transform: 'translateX(20.00%) translateY(-17.00%) scale(1.15)', opacity: 1, duration: 1200, easing: 'easeOutCubic' },
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

// Legacy positional desktop deltas have been migrated into layout-presets.js.
// This collection now stays empty and acts only as a rollback seam.
export const DESKTOP_CAMERA_PRESET_OVERRIDES = Object.freeze({});

export const DEBUG_CAMERA_CAPTURE_EXPERIMENTS = Object.freeze({
    enabled: false,
    notes: 'Raw need-to-check captures remain isolated and are not applied to eta runtime automatically.',
    presets: {
        '017-FET': {
            'mic-active': {
                microphone: { transform: 'translateX(400%) translateY(1%) scale(1)', opacity: 1 },
                shockmount: { transform: 'translateX(-1%) translateY(74%) scale(1.07)', opacity: 1 },
                case: { transform: 'translateX(-28%) translateY(-19%) scale(1.92)', opacity: 1 }
            },
            'shockmount-active': {
                microphone: { transform: 'translateX(10%) translateY(-11%) scale(1.2)', opacity: 1 },
                shockmount: { transform: 'translateX(104%) translateY(45%) scale(1.22)', opacity: 1 },
                case: { transform: 'translateX(-29%) translateY(-58%) scale(1.76)', opacity: 0.62 }
            },
            'case-active': {
                microphone: { transform: 'translateX(66%) translateY(11%) scale(0.7)', opacity: 0 },
                shockmount: { transform: 'translateX(142%) translateY(42%) scale(0.8)', opacity: 0 },
                case: { transform: 'translateX(-2%) translateY(12%) scale(1.22)', opacity: 1 }
            },
            'logo-view': {
                microphone: { transform: 'translateX(400%) translateY(-15%) scale(1.57)', opacity: 1 },
                shockmount: { transform: 'translateX(-179%) translateY(42%) scale(0.82)', opacity: 0 },
                case: { transform: 'translateX(18%) translateY(-8%) scale(1.72)', opacity: 0 }
            }
        },
        '023-MALFA': {
            notes: 'Need-to-check file contained duplicate full-state snapshots matching the approved 023-MALFA capture set.'
        }
    }
});

export const CAMERA_PRESETS = buildCameraPresets(BASE_CAMERA_PRESETS, DESKTOP_CAMERA_PRESET_OVERRIDES);

// Tablet starts from the approved desktop layer; tune only the deltas here.
export const TABLET_CAMERA_PRESET_OVERRIDES = Object.freeze({});
export const TABLET_CAMERA_PRESETS = buildCameraPresets(CAMERA_PRESETS, TABLET_CAMERA_PRESET_OVERRIDES);

// Mobile positional deltas are also declarative now; keep this empty unless a
// layout state is intentionally rolled back to the legacy preset system.
export const MOBILE_CAMERA_PRESET_OVERRIDES = Object.freeze({});

export const MOBILE_CAMERA_PRESETS = buildCameraPresets(CAMERA_PRESETS, MOBILE_CAMERA_PRESET_OVERRIDES);

function buildDirectLayerMetaState(duration = 1000, easing = 'easeInOutQuad') {
    return Object.freeze({
        duration,
        easing
    });
}

function buildDirectMetaViewState(duration = 1000, easing = 'easeInOutQuad') {
    const sharedLayerMeta = buildDirectLayerMetaState(duration, easing);

    return Object.freeze({
        sceneTransform: 'translateX(0vw) translateY(0vw) scale(1)',
        sceneMeta: Object.freeze({ duration, easing }),
        renderedLayers: Object.freeze({
            microphone: sharedLayerMeta,
            shockmount: sharedLayerMeta,
            case: sharedLayerMeta
        })
    });
}

const CAMERA_MODEL_KEYS = Object.freeze([
    '017-TUBE',
    '017-FET',
    '023-BOMBLET-NO-SHOCKMOUNT',
    '023-BOMBLET-WITH-SHOCKMOUNT',
    '023-MALFA',
    '023-DELUXE'
]);

const CAMERA_STATE_KEYS = Object.freeze([
    'global-view',
    'mic-active',
    'shockmount-active',
    'case-active',
    'logo-view'
]);

function buildSharedDirectMetaStateMap(duration = 1000, easing = 'easeInOutQuad') {
    const sharedViewState = buildDirectMetaViewState(duration, easing);
    const modelStateMap = Object.freeze(
        Object.fromEntries(CAMERA_STATE_KEYS.map((stateKey) => [stateKey, sharedViewState]))
    );

    return Object.freeze(
        Object.fromEntries(CAMERA_MODEL_KEYS.map((modelKey) => [modelKey, modelStateMap]))
    );
}

const SHARED_DIRECT_CAMERA_META_OVERRIDES = buildSharedDirectMetaStateMap();

// Final direct overrides are metadata-only now. Layout presets own runtime
// positioning; this map only preserves the legacy anime timing contract and
// remains the final escape hatch if a migrated state needs a non-layout tweak.
export const DIRECT_CAMERA_VIEW_OVERRIDES = Object.freeze({
    desktop: SHARED_DIRECT_CAMERA_META_OVERRIDES,
    tablet: SHARED_DIRECT_CAMERA_META_OVERRIDES,
    'mobile-landscape': SHARED_DIRECT_CAMERA_META_OVERRIDES,
    'mobile-portrait': SHARED_DIRECT_CAMERA_META_OVERRIDES
});

const CAMERA_LAYERS = ['microphone', 'shockmount', 'case'];

const VIEW_PRIMARY_LAYER = Object.freeze({
    'mic-active': 'microphone',
    'shockmount-active': 'shockmount',
    'case-active': 'case',
    'logo-view': 'microphone'
});

function clampPrecision(value, digits = 2) {
    const numericValue = Number(value) || 0;
    const rounded = Number(numericValue.toFixed(digits));
    return Object.is(rounded, -0) ? 0 : rounded;
}

function parsePercentValue(rawValue) {
    return Number.parseFloat(String(rawValue).replace('%', '').trim()) || 0;
}

function parseLegacyTransform(transformStr = '') {
    const parsed = { x: 0, y: 0, scale: 1 };
    const regex = /(translateX|translateY|scale)\(([^)]+)\)/g;
    let match;

    while ((match = regex.exec(transformStr)) !== null) {
        const [, key, value] = match;
        if (key === 'translateX') {
            parsed.x = parsePercentValue(value);
        } else if (key === 'translateY') {
            parsed.y = parsePercentValue(value);
        } else if (key === 'scale') {
            parsed.scale = Number.parseFloat(value) || 1;
        }
    }

    return parsed;
}

function formatPercentValue(value) {
    return `${clampPrecision(value)}%`;
}

function formatScaleValue(value) {
    return clampPrecision(value);
}

function buildLegacyTransform({ x = 0, y = 0, scale = 1 } = {}) {
    return `translateX(${formatPercentValue(x)}) translateY(${formatPercentValue(y)}) scale(${formatScaleValue(scale)})`;
}

function getLayerFallbackMeta(layerConfig = {}) {
    return {
        opacity: typeof layerConfig.opacity === 'number' ? layerConfig.opacity : 1,
        duration: layerConfig.duration,
        easing: layerConfig.easing,
        pointerEvents: layerConfig.pointerEvents
    };
}

function decomposeSceneCollection(legacyCollection) {
    const sceneCollection = {};

    Object.entries(legacyCollection).forEach(([modelKey, legacyStates]) => {
        const globalView = legacyStates['global-view'] || {};
        const baseLayers = {};

        CAMERA_LAYERS.forEach((layerId) => {
            const globalLayer = globalView[layerId] || {};
            const parsedTransform = parseLegacyTransform(globalLayer.transform);
            baseLayers[layerId] = {
                x: parsedTransform.x,
                y: parsedTransform.y,
                scale: parsedTransform.scale,
                ...getLayerFallbackMeta(globalLayer)
            };
        });

        const states = {};

        Object.entries(legacyStates).forEach(([stateName, legacyView]) => {
            const primaryLayerId = VIEW_PRIMARY_LAYER[stateName] || null;
            const primaryBase = primaryLayerId ? baseLayers[primaryLayerId] : null;
            const primaryTarget = primaryLayerId ? parseLegacyTransform(legacyView?.[primaryLayerId]?.transform) : null;

            const scene = primaryLayerId && primaryBase && primaryTarget
                ? {
                    x: clampPrecision(primaryTarget.x - primaryBase.x),
                    y: clampPrecision(primaryTarget.y - primaryBase.y),
                    scale: clampPrecision(primaryTarget.scale / (primaryBase.scale || 1))
                }
                : {
                    x: 0,
                    y: 0,
                    scale: 1
                };

            const layers = {};

            CAMERA_LAYERS.forEach((layerId) => {
                const targetLayer = legacyView?.[layerId] || {};
                const targetTransform = parseLegacyTransform(targetLayer.transform);
                const baseLayer = baseLayers[layerId];
                const sceneScale = scene.scale || 1;
                const baseScale = baseLayer.scale || 1;

                layers[layerId] = {
                    x: clampPrecision(targetTransform.x - baseLayer.x - scene.x),
                    y: clampPrecision(targetTransform.y - baseLayer.y - scene.y),
                    scale: clampPrecision(targetTransform.scale / (baseScale * sceneScale || 1)),
                    opacity: typeof targetLayer.opacity === 'number' ? targetLayer.opacity : baseLayer.opacity,
                    duration: targetLayer.duration ?? baseLayer.duration,
                    easing: targetLayer.easing ?? baseLayer.easing,
                    pointerEvents: targetLayer.pointerEvents ?? baseLayer.pointerEvents
                };
            });

            states[stateName] = { scene, layers };
        });

        sceneCollection[modelKey] = {
            baseLayers,
            states
        };
    });

    return Object.freeze(sceneCollection);
}

function composeSceneState(sceneCollection, modelKey, stateName) {
    const modelPreset = sceneCollection[modelKey];
    const sceneState = modelPreset?.states?.[stateName];
    if (!modelPreset || !sceneState) {
        return null;
    }

    const composedState = {};
    const { scene } = sceneState;

    CAMERA_LAYERS.forEach((layerId) => {
        const baseLayer = modelPreset.baseLayers[layerId];
        const layerState = sceneState.layers[layerId] || {};
        const finalTransform = {
            x: clampPrecision(baseLayer.x + scene.x + (layerState.x || 0)),
            y: clampPrecision(baseLayer.y + scene.y + (layerState.y || 0)),
            scale: clampPrecision((baseLayer.scale || 1) * (scene.scale || 1) * (layerState.scale || 1))
        };

        composedState[layerId] = {
            transform: buildLegacyTransform(finalTransform),
            opacity: typeof layerState.opacity === 'number' ? layerState.opacity : baseLayer.opacity,
            duration: layerState.duration,
            easing: layerState.easing,
            ...(layerState.pointerEvents ? { pointerEvents: layerState.pointerEvents } : {})
        };
    });

    return composedState;
}

function createSceneRuntimeCollection(legacyCollection) {
    const sceneCollection = decomposeSceneCollection(legacyCollection);
    const runtimeCollection = {};

    Object.keys(sceneCollection).forEach((modelKey) => {
        runtimeCollection[modelKey] = {};
        Object.keys(sceneCollection[modelKey].states).forEach((stateName) => {
            runtimeCollection[modelKey][stateName] = composeSceneState(sceneCollection, modelKey, stateName);
        });
    });

    return {
        scene: sceneCollection,
        runtime: Object.freeze(runtimeCollection)
    };
}

const DESKTOP_SCENE_RUNTIME = createSceneRuntimeCollection(CAMERA_PRESETS);
const TABLET_SCENE_RUNTIME = createSceneRuntimeCollection(TABLET_CAMERA_PRESETS);
const MOBILE_PORTRAIT_SCENE_RUNTIME = createSceneRuntimeCollection(MOBILE_CAMERA_PRESETS);
const MOBILE_LANDSCAPE_SCENE_RUNTIME = createSceneRuntimeCollection(TABLET_CAMERA_PRESETS);

export const SCENE_CAMERA_PRESETS = Object.freeze({
    desktop: DESKTOP_SCENE_RUNTIME.scene,
    tablet: TABLET_SCENE_RUNTIME.scene,
    'mobile-portrait': MOBILE_PORTRAIT_SCENE_RUNTIME.scene,
    'mobile-landscape': MOBILE_LANDSCAPE_SCENE_RUNTIME.scene
});

export const RUNTIME_CAMERA_PRESETS = Object.freeze({
    desktop: DESKTOP_SCENE_RUNTIME.runtime,
    tablet: TABLET_SCENE_RUNTIME.runtime,
    'mobile-portrait': MOBILE_PORTRAIT_SCENE_RUNTIME.runtime,
    'mobile-landscape': MOBILE_LANDSCAPE_SCENE_RUNTIME.runtime
});

export function resolveRuntimeCameraPreset(deviceMode, modelKey, stateName) {
    return RUNTIME_CAMERA_PRESETS[deviceMode]?.[modelKey]?.[stateName] || null;
}


