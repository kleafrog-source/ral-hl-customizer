// Debug configuration for SVG customization flows
export const DEBUG_SVG = true;

export function debugLog(category, message, data = {}) {
    if (!DEBUG_SVG) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${category}]`;
    
    console.group(`${prefix} ${message}`);
    if (Object.keys(data).length > 0) {
        console.table(data);
    }
    console.groupEnd();
}

export function debugSVGState(section, sectionState, action) {
    if (!DEBUG_SVG) return;
    
    debugLog('SVG_STATE', `${action} for section: ${section}`, {
        section,
        variant: sectionState?.variant,
        color: sectionState?.color,
        colorValue: sectionState?.colorValue,
        material: sectionState?.material,
        timestamp: Date.now()
    });
}

export function debugSVGLayers(layers, action) {
    if (!DEBUG_SVG) return;
    
    debugLog('SVG_LAYERS', `${action} - Layer visibility changes`, {
        action,
        layers: layers.map(layer => ({
            id: layer.id,
            display: layer.display,
            filter: layer.filter
        })),
        timestamp: Date.now()
    });
}

export function debugFilters(filterId, color, action) {
    if (!DEBUG_SVG) return;
    
    debugLog('SVG_FILTERS', `${action} - Filter update`, {
        filterId,
        color,
        action,
        timestamp: Date.now()
    });
}

export function debugDeviceTier(deviceTier, activeLayers) {
    if (!DEBUG_SVG) return;
    
    debugLog('DEVICE_TIER', `Device tier: ${deviceTier}`, {
        deviceTier,
        activeLayers,
        windowWidth: window.innerWidth,
        timestamp: Date.now()
    });
}
