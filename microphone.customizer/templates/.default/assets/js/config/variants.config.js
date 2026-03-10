import { MALFA_SILVER_RAL, RAL_PALETTE } from './ral.config.js';

export const DEFAULT_MIC_CONFIGS = {
    '023-the-bomblet': {
        spheres: { variant: '2', color: null, colorValue: '#a1a1a0' },
        body: { variant: '2', color: null, colorValue: '#a1a1a0' },
        logo: { variant: 'silver', bgColor: '3001', bgColorValue: RAL_PALETTE['3001'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: '9005', color: null, colorValue: '#f3eade', pins: { variant: 'pins-ral9005-free', colorValue: '#F4F4F4', material: null } }
    },
    '023-malfa': {
        spheres: { variant: '2', color: null, colorValue: '#a1a1a0' },
        body: { variant: '1', color: null, colorValue: '#000000' },
        logo: { variant: 'malfasilver', bgColor: MALFA_SILVER_RAL, bgColorValue: RAL_PALETTE[MALFA_SILVER_RAL], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: '9005', color: null, colorValue: '#f3eade', pins: { variant: 'pins-ral9005-free', colorValue: '#F4F4F4', material: null } }
    },
    '023-deluxe': {
        spheres: { variant: '2', color: null, colorValue: '#a1a1a0' },
        body: { variant: '2', color: null, colorValue: '#a1a1a0' },
        logo: { variant: 'silver', bgColor: '3001', bgColorValue: RAL_PALETTE['3001'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: '9005', color: null, colorValue: '#f3eade', pins: { variant: 'pins-ral9005-free', colorValue: '#F4F4F4', material: null } }
    },
    '017-fet': {
        spheres: { variant: '1', color: null, colorValue: '#d4af37' },
        body: { variant: '1', color: 'RAL 1013', colorValue: RAL_PALETTE['1013'] },
        logo: { variant: 'gold', bgColor: '6001', bgColorValue: RAL_PALETTE['6001'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: '9005', color: null, colorValue: '#f3eade', pins: { variant: 'pins-ral9005-free', colorValue: '#F4F4F4', material: null } }
    },
    '017-tube': {
        spheres: { variant: '1', color: null, colorValue: '#d4af37' },
        body: { variant: '1', color: 'RAL 1013', colorValue: RAL_PALETTE['1013'] },
        logo: { variant: 'gold', bgColor: '5017', bgColorValue: RAL_PALETTE['5017'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: '9005', color: null, colorValue: '#f3eade', pins: { variant: 'pins-ral9005-free', colorValue: '#F4F4F4', material: null } }
    }
};
