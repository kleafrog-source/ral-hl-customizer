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

export const DESKTOP_CAMERA_PRESET_OVERRIDES = Object.freeze({
    '017-TUBE': {
        'global-view': {
            microphone: { transform: 'translateX(79%) translateY(14%) scale(0.66)', opacity: 1 },
            shockmount: { transform: 'translateX(63%) translateY(82%) scale(0.62)', opacity: 1 },
            case: { transform: 'translateX(7%) translateY(7%) scale(1.21)', opacity: 1 }
        },
        'mic-active': {
            microphone: { transform: 'translateX(14%) translateY(-15%) scale(1.22)', opacity: 1 },
            shockmount: { transform: 'translateX(99%) translateY(48%) scale(1.26)', opacity: 1 },
            case: { transform: 'translateX(2%) translateY(-2%) scale(1.17)', opacity: 1 }
        },
        'case-active': {
            microphone: { transform: 'translateX(70%) translateY(18%) scale(0.6)', opacity: 0 },
            shockmount: { transform: 'translateX(120%) translateY(44%) scale(0.7)', opacity: 0 },
            case: { transform: 'translateX(2%) translateY(11%) scale(1.12)', opacity: 1 }
        },
        'logo-view': {
            microphone: { transform: 'translateX(399%) translateY(-15%) scale(1.43)', opacity: 1 },
            shockmount: { transform: 'translateX(221%) translateY(45%) scale(1.05)', opacity: 0.61 },
            case: { transform: 'translateX(4%) translateY(-2%) scale(1.39)', opacity: 0.17 }
        }
    },
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
    '023-BOMBLET-NO-SHOCKMOUNT': {
        'global-view': {
            microphone: { transform: 'translateX(286%) translateY(4%) scale(0.88)', opacity: 1 },
            shockmount: { transform: 'translateX(4%) translateY(54%) scale(0.72)', opacity: 0 },
            case: { transform: 'translateX(8%) translateY(9%) scale(1.29)', opacity: 1 }
        },
        'mic-active': {
            microphone: { transform: 'translateX(400%) translateY(-7%) scale(1.12)', opacity: 1 },
            shockmount: { transform: 'translateX(0%) translateY(52%) scale(0.72)', opacity: 0 },
            case: { transform: 'translateX(-13%) translateY(-1%) scale(1.39)', opacity: 1 }
        }
    },
    '023-BOMBLET-WITH-SHOCKMOUNT': {
        'mic-active': {
            microphone: { transform: 'translateX(200%) translateY(-19%) scale(1.11)', opacity: 1 },
            shockmount: { transform: 'translateX(139%) translateY(31%) scale(1.21)', opacity: 1 },
            case: { transform: 'translateX(48%) translateY(-23%) scale(1.57)', opacity: 0.78 }
        },
        'case-active': {
            microphone: { transform: 'translateX(278%) translateY(12%) scale(0.7)', opacity: 0 },
            shockmount: { transform: 'translateX(24%) translateY(41%) scale(0.76)', opacity: 0 },
            case: { transform: 'translateX(14%) translateY(12%) scale(1.32)', opacity: 1 }
        },
        'logo-view': {
            microphone: { transform: 'translateX(400%) translateY(-35%) scale(1.7)', opacity: 1 },
            shockmount: { transform: 'translateX(24%) translateY(41%) scale(0.88)', opacity: 0 },
            case: { transform: 'translateX(30%) translateY(-8%) scale(1.04)', opacity: 0 }
        }
    },
    '023-MALFA': {
        'global-view': {
            microphone: { transform: 'translateX(214%) translateY(4%) scale(0.84)', opacity: 1 },
            shockmount: { transform: 'translateX(6%) translateY(40%) scale(0.92)', opacity: 1 },
            case: { transform: 'translateX(36%) translateY(-8%) scale(1.05)', opacity: 1 }
        },
        'mic-active': {
            microphone: { transform: 'translateX(254%) translateY(-8%) scale(1.12)', opacity: 1 },
            shockmount: { transform: 'translateX(0%) translateY(44%) scale(0.84)', opacity: 1 },
            case: { transform: 'translateX(24%) translateY(-14%) scale(0.98)', opacity: 1 }
        },
        'shockmount-active': {
            microphone: { transform: 'translateX(134%) translateY(-1%) scale(0.96)', opacity: 1 },
            shockmount: { transform: 'translateX(86%) translateY(22%) scale(1.34)', opacity: 1 },
            case: { transform: 'translateX(28%) translateY(-18%) scale(1.1)', opacity: 1 }
        },
        'case-active': {
            microphone: { transform: 'translateX(214%) translateY(12%) scale(0.72)', opacity: 0 },
            shockmount: { transform: 'translateX(6%) translateY(40%) scale(0.82)', opacity: 0 },
            case: { transform: 'translateX(30%) translateY(-4%) scale(1.18)', opacity: 1 }
        },
        'logo-view': {
            microphone: { transform: 'translateX(288%) translateY(-34%) scale(1.84)', opacity: 1 },
            shockmount: { transform: 'translateX(6%) translateY(40%) scale(0.92)', opacity: 0 },
            case: { transform: 'translateX(36%) translateY(-8%) scale(1.05)', opacity: 0 }
        }
    }
});

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

function buildMobileState(globalView, overrides = {}) {
    return mergeViewState(globalView, overrides);
}

function buildStaticMobilePreset(globalView, overrides = {}) {
    return {
        'global-view': buildMobileState(globalView, overrides['global-view']),
        'mic-active': buildMobileState(globalView, overrides['mic-active']),
        'shockmount-active': buildMobileState(globalView, overrides['shockmount-active']),
        'case-active': buildMobileState(globalView, overrides['case-active']),
        'logo-view': buildMobileState(globalView, overrides['logo-view'])
    };
}

const MOBILE_023_GLOBAL_VIEW = Object.freeze({
    microphone: { transform: 'translateX(201.00%) translateY(-5.00%) scale(1.20)', opacity: 1 },
    case: { transform: 'translateX(33.00%) translateY(59.00%) scale(1.29)', opacity: 1 },
    shockmount: { transform: 'translateX(-26.00%) translateY(-9.00%) scale(0.39)' }
});

const MOBILE_017_GLOBAL_VIEW = Object.freeze({
    microphone: { transform: 'translateX(241.00%) translateY(3.00%) scale(1.05)', opacity: 1 },
    shockmount: { transform: 'translateX(-26.00%) translateY(1.00%) scale(0.39)', opacity: 1 },
    case: { transform: 'translateX(3.00%) translateY(39.00%) scale(1.04)', opacity: 1 }
});

export const MOBILE_CAMERA_PRESET_OVERRIDES = Object.freeze({
    '017-TUBE': buildStaticMobilePreset(MOBILE_017_GLOBAL_VIEW, {
        'shockmount-active': {
            microphone: { transform: 'translateX(468%) translateY(-15%) scale(1.3)', opacity: 0 },
            shockmount: { transform: 'translateX(-9%) translateY(-15%) scale(0.75)', opacity: 1 },
            case: { transform: 'translateX(-9%) translateY(-15%) scale(0.75)', opacity: 0 }
        },
        'case-active': {
            microphone: { transform: 'translateX(468%) translateY(-15%) scale(1.3)', opacity: 0 },
            shockmount: { transform: 'translateX(-91%) translateY(-15%) scale(0.75)', opacity: 0 },
            case: { transform: 'translateX(4%) translateY(51%) scale(1)', opacity: 1 }
        }
    }),
    '017-FET': buildStaticMobilePreset(MOBILE_017_GLOBAL_VIEW, {
        'case-active': {
            microphone: { transform: 'translateX(468%) translateY(-15%) scale(1.3)', opacity: 0 },
            shockmount: { transform: 'translateX(-91%) translateY(-15%) scale(0.75)', opacity: 0 },
            case: { transform: 'translateX(-1%) translateY(73%) scale(1.5)', opacity: 1 }
        }
    }),
    '023-BOMBLET-NO-SHOCKMOUNT': buildStaticMobilePreset(MOBILE_023_GLOBAL_VIEW),
    '023-BOMBLET-WITH-SHOCKMOUNT': buildStaticMobilePreset(MOBILE_023_GLOBAL_VIEW),
    '023-MALFA': buildStaticMobilePreset(MOBILE_023_GLOBAL_VIEW),
    '023-DELUXE': buildStaticMobilePreset(MOBILE_023_GLOBAL_VIEW)
});

export const MOBILE_CAMERA_PRESETS = buildCameraPresets(CAMERA_PRESETS, MOBILE_CAMERA_PRESET_OVERRIDES);

function buildDirectLayerState(transform, opacity = 1, duration = 1000, easing = 'easeInOutQuad') {
    return Object.freeze({
        transform,
        opacity,
        duration,
        easing
    });
}

function buildDirectViewState(layers) {
    return Object.freeze({
        sceneTransform: 'translateX(0vw) translateY(0vw) scale(1)',
        sceneMeta: Object.freeze({
            duration: 1000,
            easing: 'easeInOutQuad'
        }),
        renderedLayers: Object.freeze(layers)
    });
}

function buildDirectSceneViewState(globalView, stateConfig, duration = 1000, easing = 'easeInOutQuad') {
    const normalizedState = typeof stateConfig === 'string'
        ? { sceneTransform: stateConfig }
        : (stateConfig || {});
    const layerOverrides = normalizedState.layers || {};
    const renderedLayers = Object.freeze({
        ...globalView.renderedLayers,
        ...Object.fromEntries(
            Object.entries(layerOverrides).map(([layerId, layerConfig]) => [
                layerId,
                Object.freeze({
                    ...(globalView.renderedLayers[layerId] || {}),
                    ...layerConfig
                })
            ])
        )
    });

    return Object.freeze({
        sceneTransform: normalizedState.sceneTransform || globalView.sceneTransform || 'translateX(0vw) translateY(0vw) scale(1)',
        sceneMeta: Object.freeze({
            duration: normalizedState.duration ?? duration,
            easing: normalizedState.easing ?? easing
        }),
        renderedLayers
    });
}

function buildDirectStateMap(globalView, sceneTransforms = {}) {
    return Object.freeze({
        'global-view': globalView,
        ...Object.fromEntries(
            Object.entries(sceneTransforms).map(([stateName, stateConfig]) => [
                stateName,
                buildDirectSceneViewState(globalView, stateConfig)
            ])
        )
    });
}

const SHARED_GLOBAL_VIEW_LAYER_OVERRIDES = Object.freeze({
    '023-BOMBLET-NO-SHOCKMOUNT': buildDirectStateMap(
        buildDirectViewState({
            microphone: buildDirectLayerState('translateX(36vw) translateY(2vw) scale(0.88)', 1),
            shockmount: buildDirectLayerState('translateX(10vw) translateY(55%) scale(0.88)', 0),
            case: buildDirectLayerState('translateX(22vw) translateY(3vw) scale(1.29)', 1)
        }),
        {
            'mic-active': 'translateX(16vw) translateY(-3vw) scale(1.4)',
            'logo-view': 'translateX(12vw) translateY(-9vw) scale(2)',
            'case-active': {
                sceneTransform: 'translateX(-13vw) translateY(0vw) scale(1.05)',
                layers: {
                    microphone: buildDirectLayerState('translateX(31vw) translateY(3vw) scale(0.9)', 1)
                }
            }
        }
    ),
    '023-BOMBLET-WITH-SHOCKMOUNT': buildDirectStateMap(
        buildDirectViewState({
            microphone: buildDirectLayerState('translateX(36vw) translateY(1vw) scale(0.88)', 1),
            shockmount: buildDirectLayerState('translateX(10vw) translateY(55%) scale(0.88)', 1),
            case: buildDirectLayerState('translateX(22vw) translateY(3vw) scale(1.29)', 1)
        }),
        {
            'mic-active': 'translateX(16vw) translateY(-3vw) scale(1.4)',
            'logo-view': 'translateX(12vw) translateY(-9vw) scale(2)',
            'case-active': {
                sceneTransform: 'translateX(-13vw) translateY(0vw) scale(1.05)',
                layers: {
                    microphone: buildDirectLayerState('translateX(71vw) translateY(3vw) scale(1)', 1),
                    shockmount: buildDirectLayerState('translateX(12vw) translateY(25vw) scale(0.96)', 1)
                }
            },
            'shockmount-active': 'translateX(37vw) translateY(-11vw) scale(1.8)'
        }
    ),
    '023-MALFA': buildDirectStateMap(
        buildDirectViewState({
            microphone: buildDirectLayerState('translateX(38vw) translateY(-1vw) scale(1)', 1),
            shockmount: buildDirectLayerState('translateX(7vw) translateY(16vw) scale(0.92)', 1),
            case: buildDirectLayerState('translateX(21vw) translateY(1vw) scale(1.2)', 1)
        }),
        {
            'mic-active': 'translateX(17vw) translateY(-0.5vw) scale(1.24)',
            'logo-view': 'translateX(4vw) translateY(-9vw) scale(2.1)',
            'case-active': {
                sceneTransform: 'translateX(-10vw) translateY(0vw) scale(1)',
                layers: {
                    microphone: buildDirectLayerState('translateX(70vw) translateY(1vw) scale(1.1)', 1),
                    shockmount: buildDirectLayerState('translateX(12vw) translateY(22vw) scale(1)', 1)
                }
            },
            'shockmount-active': 'translateX(41vw) translateY(-10vw) scale(1.6)'
        }
    ),
    '023-DELUXE': buildDirectStateMap(
        buildDirectViewState({
            microphone: buildDirectLayerState('translateX(50vw) translateY(1vw) scale(0.88)', 1),
            shockmount: buildDirectLayerState('translateX(5vw) translateY(17vw) scale(0.8)', 1),
            case: buildDirectLayerState('translateX(2vw) translateY(0vw) scale(0.96)', 1)
        }),
        {
            'mic-active': 'translateX(1vw) translateY(-3vw) scale(1.4)',
            'logo-view': 'translateX(-17vw) translateY(-10vw) scale(2.2)',
            'case-active': {
                sceneTransform: 'translateX(10vw) translateY(7vw) scale(1.3)',
                layers: {
                    microphone: buildDirectLayerState('translateX(51.2vw) translateY(-2vw) scale(0.58)', 1),
                    shockmount: buildDirectLayerState('translateX(-3vw) translateY(24vw) scale(0.9)', 1)
                }
            },
            'shockmount-active': 'translateX(45vw) translateY(-14vw) scale(1.8)'
        }
    ),
    '017-FET': buildDirectStateMap(
        buildDirectViewState({
            microphone: buildDirectLayerState('translateX(33vw) translateY(6vw) scale(0.82)', 1),
            shockmount: buildDirectLayerState('translateX(43vw) translateY(20vw) scale(0.88)', 1),
            case: buildDirectLayerState('translateX(-9vw) translateY(2vw) scale(1.22)', 1)
        }),
        {
            'mic-active': 'translateX(18vw) translateY(-5vw) scale(1.2)',
            'logo-view': 'translateX(20vw) translateY(-12vw) scale(1.9)',
            'case-active': {
                sceneTransform: 'translateX(17vw) translateY(3vw) scale(1.1)',
                layers: {
                    microphone: buildDirectLayerState('translateX(-6vw) translateY(3vw) scale(0.72)', 1),
                    shockmount: buildDirectLayerState('translateX(47vw) translateY(22vw) scale(0.88)', 1)
                }
            },
            'shockmount-active': 'translateX(20vw) translateY(-12vw) scale(1.9)'
        }
    ),
    '017-TUBE': buildDirectStateMap(
        buildDirectViewState({
            microphone: buildDirectLayerState('translateX(7vw) translateY(8vw) scale(0.66)', 1),
            shockmount: buildDirectLayerState('translateX(18vw) translateY(23vw) scale(0.62)', 1),
            case: buildDirectLayerState('translateX(7vw) translateY(4vw) scale(1.21)', 1)
        }),
        {
            'mic-active': 'translateX(65vw) translateY(-11vw) scale(1.55)',
            'logo-view': 'translateX(79vw) translateY(-20vw) scale(2.3)',
            'case-active': {
                sceneTransform: 'translateX(1vw) translateY(-2vw) scale(1.1)',
                layers: {
                    microphone: buildDirectLayerState('translateX(-3vw) translateY(8vw) scale(0.66)', 1),
                    shockmount: buildDirectLayerState('translateX(57vw) translateY(36vw) scale(0.92)', 1)
                }
            },
            'shockmount-active': 'translateX(79vw) translateY(-20vw) scale(2.3)'
        }
    )
});

export const DIRECT_CAMERA_VIEW_OVERRIDES = Object.freeze({
    desktop: SHARED_GLOBAL_VIEW_LAYER_OVERRIDES,
    tablet: SHARED_GLOBAL_VIEW_LAYER_OVERRIDES,
    'mobile-landscape': SHARED_GLOBAL_VIEW_LAYER_OVERRIDES,
    'mobile-portrait': SHARED_GLOBAL_VIEW_LAYER_OVERRIDES
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
