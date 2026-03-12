// Appearance helpers (delta)

import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';

export function updateSectionLayers(section, state) {
    const svg = document.querySelector('.svg-wrapper svg');
    if (!svg) return;

    // Special handling for logo section
    if (section === 'logo') {
        updateLogoLayers(svg, state);
        return;
    }

    const svgTargetMode = state.svgTargetMode;
    const svgLayerGroup = state.svgLayerGroup;
    const svgFilterId = state.svgFilterId;

    switch (svgTargetMode) {
        case 'original':
            applyOriginalMode(svg, section, svgLayerGroup);
            break;
        case 'filter':
            applyFilterMode(svg, section, svgFilterId, state.colorValue);
            break;
        case 'gradient':
            applyColorizedMode(svg, section, state.colorValue);
            break;
        default:
            applyColorizedMode(svg, section, state.colorValue);
            break;
    }
}

function applyOriginalMode(svg, section, svgLayerGroup) {
    resetSectionGroups(svg, section);
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.originals && Array.isArray(config.originals)) {
                config.originals.forEach(layerId => {
                    const layer = svg.querySelector(`#${layerId}`);
                    if (layer) layer.style.display = 'none';
                });
            }
        });
    }

    if (svgLayerGroup) {
        const targetLayer = svg.querySelector(`#${svgLayerGroup}`);
        if (targetLayer) {
            targetLayer.style.display = 'inline';
            targetLayer.style.setProperty('display', 'inline', 'important');
        }
    }
}

function applyFilterMode(svg, section, svgFilterId, colorValue) {
    resetSectionGroups(svg, section);
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.colorizedGroup) {
                const layer = svg.querySelector(`#${config.colorizedGroup}`);
                if (layer) layer.style.display = 'inline';
            }
            if (config.monoGroup) {
                const layer = svg.querySelector(`#${config.monoGroup}`);
                if (layer) layer.style.display = 'inline';
            }
        });
    }
    if (!svgFilterId || !colorValue) return;
  const flood = svg.querySelector(`#${svgFilterId}`);
  if (flood) {
    flood.setAttribute('flood-color', colorValue);
    flood.setAttribute('flood-opacity', '1');
  }
}

function applyColorizedMode(svg, section, colorValue) {
    if (!colorValue) return;
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (!sectionConfig) return;

    resetSectionGroups(svg, section);
    Object.values(sectionConfig).forEach(config => {
        if (config.colorizedGroup) {
            const layer = svg.querySelector(`#${config.colorizedGroup}`);
            if (layer) {
                layer.style.display = 'inline';
                const colorElements = layer.querySelectorAll('[fill], [stroke]');
                colorElements.forEach(el => {
                    if (el.hasAttribute('fill')) el.setAttribute('fill', colorValue);
                    if (el.hasAttribute('stroke')) el.setAttribute('stroke', colorValue);
                });
            }
        }
        if (config.monoGroup) {
            const layer = svg.querySelector(`#${config.monoGroup}`);
            if (layer) layer.style.display = 'inline';
        }
    });
}

function resetSectionGroups(svg, section) {
    const sectionConfig = SECTION_LAYER_MAP[section];
    if (!sectionConfig) return;

    Object.values(sectionConfig).forEach(config => {
        if (config.originals && Array.isArray(config.originals)) {
            config.originals.forEach(layerId => {
                const layer = svg.querySelector(`#${layerId}`);
                if (layer) layer.style.display = 'none';
            });
        }
        if (config.colorizedGroup) {
            const layer = svg.querySelector(`#${config.colorizedGroup}`);
            if (layer) layer.style.display = 'none';
        }
        if (config.monoGroup) {
            const layer = svg.querySelector(`#${config.monoGroup}`);
            if (layer) layer.style.display = 'none';
        }
    });
}

function updateLogoLayers(svg, state) {
    const sectionConfig = SECTION_LAYER_MAP.logo;
    if (!sectionConfig) return;

    const config = sectionConfig.standard;
    const svgTargetMode = state.svgTargetMode;
    const svgLayerGroup = state.svgLayerGroup;
    const svgSpecialKey = state.svgSpecialKey;

    // Handle custom logo mode
    if (state.useCustom) {
        // Hide all logo layers
        const allLayers = [
            config.originals[0], // logotype-gold
            config.standardGroup, // logo-letters-and-frame
            config.malfaGroup // malfa-logo-text-path
        ];
        allLayers.forEach(layerId => {
            const layer = svg.querySelector(`#${layerId}`);
            if (layer) layer.style.display = 'none';
        });
        
        // Show custom layer
        const customLayer = svg.querySelector(`#${config.customGroup}`);
        if (customLayer) {
            customLayer.style.display = 'inline';
        }
        return;
    }

    // Hide custom layer for non-custom modes
    const customLayer = svg.querySelector(`#${config.customGroup}`);
    if (customLayer) {
        customLayer.style.display = 'none';
    }

    // Handle standard logo modes
    switch (svgTargetMode) {
        case 'original':
            // Hide MALFA group, show standard group
            const malfaLayer = svg.querySelector(`#${config.malfaGroup}`);
            if (malfaLayer) malfaLayer.style.display = 'none';
            
            const standardLayer = svg.querySelector(`#${config.standardGroup}`);
            if (standardLayer) {
                standardLayer.style.display = 'inline';
                
                // Apply grayscale filter if specified
                if (svgSpecialKey === 'grayscale') {
                    standardLayer.style.filter = 'grayscale(100%)';
                } else {
                    standardLayer.style.filter = '';
                }
            }
            break;
            
        case 'gradient':
            // Hide standard group, show MALFA group
            const standardLayer2 = svg.querySelector(`#${config.standardGroup}`);
            if (standardLayer2) standardLayer2.style.display = 'none';
            
            const malfaLayer2 = svg.querySelector(`#${config.malfaGroup}`);
            if (malfaLayer2) {
                malfaLayer2.style.display = 'inline';
                
                // Apply gradient based on special key
                const malfaLogoTextPath = svg.querySelector('#malfa-logo-text-path');
                if (malfaLogoTextPath) {
                    if (svgSpecialKey === 'malfa_silver') {
                        malfaLogoTextPath.style.fill = 'url(#grad-malfa-silver)';
                    } else if (svgSpecialKey === 'malfa_gold') {
                        malfaLogoTextPath.style.fill = 'url(#grad-malfa-gold)';
                    }
                }
            }
            break;
            
        default:
            // Fallback: show standard group
            const malfaLayer3 = svg.querySelector(`#${config.malfaGroup}`);
            if (malfaLayer3) malfaLayer3.style.display = 'none';
            
            const fallbackLayer = svg.querySelector(`#${config.standardGroup}`);
            if (fallbackLayer) {
                fallbackLayer.style.display = 'inline';
            }
            break;
    }
}

export function updateFilter(filterId, section, colorValue) {
  if (!colorValue || !filterId) return;
  const svg = document.querySelector('.svg-wrapper svg');
  if (!svg) return;
 const flood = svg.querySelector(`#${filterId}`);
  if (flood) {
    flood.setAttribute('flood-color', colorValue);
    flood.setAttribute('flood-opacity', '1');
  }
}
