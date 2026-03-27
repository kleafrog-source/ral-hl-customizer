// Admin-only helper presets for scene background experiments.
// Keep this file declarative so new presets can be added without touching UI logic.

export const ADMIN_BACKGROUND_PRESETS = [
    {
        id: 'default',
        label: 'Public Default',
        description: 'No overrides. Uses the public scene background as-is.',
        backgroundColor: '',
        gradient: '',
        imagePath: '',
        imageSize: 'cover',
        imagePosition: 'center center',
        imageRepeat: 'no-repeat',
        blendMode: 'normal',
        overlay: '',
        floor: false,
        defaultFilter: 'none'
    },
    {
        id: 'warm-studio',
        label: 'Warm Studio',
        description: 'Soft CSS-only gradient with a subtle floor plane.',
        backgroundColor: '#e6ddd2',
        gradient: 'radial-gradient(circle at 28% 14%, rgba(255,250,241,0.95) 0%, rgba(255,250,241,0.55) 18%, rgba(255,250,241,0) 40%), linear-gradient(140deg, #f5eee6 0%, #d8cbbb 44%, #a49584 100%)',
        imagePath: '',
        imageSize: 'cover',
        imagePosition: 'center center',
        imageRepeat: 'no-repeat',
        blendMode: 'normal',
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 26%, rgba(46,34,25,0.18) 100%)',
        floor: true,
        defaultFilter: 'none'
    },
    {
        id: 'variant-1',
        label: 'Variant 1',
        description: 'Clean warm beige gradient with lightweight perspective floor illusion.',
        backgroundColor: '#f0ede8',
        gradient: 'linear-gradient(180deg, #f8f6f3 0%, #f5f2ee 35%, #f0ede8 100%)',
        imagePath: '',
        imageSize: 'cover',
        imagePosition: 'center center',
        imageRepeat: 'no-repeat',
        blendMode: 'normal',
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 30%, rgba(240,237,232,0.22) 100%)',
        floor: true,
        floorHeight: '45%',
        floorTransform: 'perspective(1200px) rotateX(18deg)',
        floorGradient: 'linear-gradient(to bottom, transparent 60%, rgba(240, 237, 232, 0.45) 100%)',
        defaultFilter: 'none'
    },
    {
        id: 'raster-wash',
        label: 'Raster Wash',
        description: 'Gradient plus component image asset for quick raster tests.',
        backgroundColor: '#ddd2c5',
        gradient: 'radial-gradient(circle at 34% 10%, rgba(255,249,238,0.92) 0%, rgba(255,249,238,0.35) 18%, rgba(255,249,238,0) 42%), linear-gradient(160deg, #efe5d9 0%, #cfc0ad 50%, #8a7a69 100%)',
        imagePath: 'image/badge_bg_color.png',
        imageSize: '420px auto',
        imagePosition: 'center 12%',
        imageRepeat: 'no-repeat',
        blendMode: 'soft-light',
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 24%, rgba(64,45,31,0.26) 100%)',
        floor: true,
        defaultFilter: 'soft'
    },
    {
        id: 'contrast-lab',
        label: 'Contrast Lab',
        description: 'Darker stage with stronger contrast and texture blend.',
        backgroundColor: '#1c1712',
        gradient: 'radial-gradient(circle at 50% 16%, rgba(241,227,198,0.34) 0%, rgba(241,227,198,0.08) 16%, rgba(0,0,0,0) 38%), linear-gradient(180deg, #463c34 0%, #1d1713 64%, #120f0c 100%)',
        imagePath: 'image/badge_bg_mono.png',
        imageSize: '360px auto',
        imagePosition: 'center 10%',
        imageRepeat: 'no-repeat',
        blendMode: 'overlay',
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 18%, rgba(0,0,0,0.34) 100%)',
        floor: true,
        defaultFilter: 'contrast'
    }
];

export const ADMIN_BACKGROUND_FILTERS = [
    {
        id: 'none',
        label: 'No Filter',
        description: 'Scene stays unfiltered.'
    },
    {
        id: 'soft',
        label: 'Soft Wash',
        description: 'Gentle blur and saturation lift via SVG filter.'
    },
    {
        id: 'contrast',
        label: 'Contrast',
        description: 'Crisper highlights and deeper shadows via SVG filter.'
    }
];
