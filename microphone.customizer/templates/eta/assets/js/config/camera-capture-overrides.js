export const CAMERA_CAPTURE_OVERRIDE_META = Object.freeze({
    schema: 'eta-camera-captures.v2',
    sources: [
        'templates/eta/data/camera_capture_candidates_part1.json',
        'templates/eta/data/camera_capture_candidates_part2.json'
    ],
    experimentalSources: [
        'templates/eta/data/camera_capture_candidate-PART2-need-to-check.json'
    ],
    selectionRule: 'Later approved capture overrides earlier capture by preset/view pair.',
    experimentalRule: 'Need-to-check captures stay isolated from normal runtime and are not applied automatically.'
});

export const CAMERA_CAPTURE_OVERRIDES = Object.freeze({
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
