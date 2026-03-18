export const CAMERA_PRESETS = {
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
