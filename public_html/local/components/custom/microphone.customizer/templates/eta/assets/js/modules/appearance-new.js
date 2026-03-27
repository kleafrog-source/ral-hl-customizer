// Appearance helpers (eta)

import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';

function getMicrophoneSvg() {
    return document
        .getElementById('microphone-svg-container')
        ?.querySelector('svg');
}

function getSectionConfig(section) {
    return SECTION_LAYER_MAP[section] || null;
}

function getLayer(svg, layerId) {
    return layerId ? svg.querySelector(`#${layerId}`) : null;
}

function setLayerDisplay(svg, layerId, display) {
    const layer = getLayer(svg, layerId);
    if (layer) {
        layer.style.display = display;
    }
    return layer;
}

export function updateSectionLayers(section, state) {
    const svg = getMicrophoneSvg();
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
    const sectionConfig = getSectionConfig(section);
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.originals && Array.isArray(config.originals)) {
                config.originals.forEach(layerId => {
                    setLayerDisplay(svg, layerId, 'none');
                });
            }
        });
    }

    if (svgLayerGroup) {
        const targetLayer = getLayer(svg, svgLayerGroup);
        if (targetLayer) {
            targetLayer.style.display = 'inline';
            targetLayer.style.setProperty('display', 'inline', 'important');
        }
    }
}

function applyFilterMode(svg, section, svgFilterId, colorValue) {
    resetSectionGroups(svg, section);
    const sectionConfig = getSectionConfig(section);
    if (sectionConfig) {
        Object.values(sectionConfig).forEach(config => {
            if (config.colorizedGroup) {
                setLayerDisplay(svg, config.colorizedGroup, 'inline');
            }
            if (config.monoGroup) {
                setLayerDisplay(svg, config.monoGroup, 'inline');
            }
        });
    }
    if (!svgFilterId || !colorValue) return;
  const flood = getLayer(svg, svgFilterId);
  if (flood) {
    flood.setAttribute('flood-color', colorValue);
    flood.setAttribute('flood-opacity', '1');
  }

  // ДОП. ЛОГИКА ДЛЯ MALFA: синхронизировать эллипс-клиппер
  if (section === 'logobg') {
    const malfaClip = svg.querySelector('#clip-logo-bg-malfa');
    if (malfaClip) {
      malfaClip.setAttribute('fill', colorValue);
    }
  }
}

function applyColorizedMode(svg, section, colorValue) {
    if (!colorValue) return;
    const sectionConfig = getSectionConfig(section);
    if (!sectionConfig) return;

    resetSectionGroups(svg, section);
    Object.values(sectionConfig).forEach(config => {
        if (config.colorizedGroup) {
            const layer = getLayer(svg, config.colorizedGroup);
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
            setLayerDisplay(svg, config.monoGroup, 'inline');
        }
    });
}

function resetSectionGroups(svg, section) {
    const sectionConfig = getSectionConfig(section);
    if (!sectionConfig) return;

    Object.values(sectionConfig).forEach(config => {
        if (config.originals && Array.isArray(config.originals)) {
            config.originals.forEach(layerId => {
                setLayerDisplay(svg, layerId, 'none');
            });
        }
        if (config.colorizedGroup) {
            setLayerDisplay(svg, config.colorizedGroup, 'none');
        }
        if (config.monoGroup) {
            setLayerDisplay(svg, config.monoGroup, 'none');
        }
    });
}

function updateLogoLayers(svg, state) {
    const sectionConfig = getSectionConfig('logo');
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
            config.malfaGroup // malfa-logo
        ];
        allLayers.forEach(layerId => {
            setLayerDisplay(svg, layerId, 'none');
        });
        
        // Show custom layer
        const customLayer = getLayer(svg, config.customGroup);
        if (customLayer) {
            customLayer.style.display = 'inline';
        }
        return;
    }

    // Hide custom layer for non-custom modes
    const customLayer = getLayer(svg, config.customGroup);
    if (customLayer) {
        customLayer.style.display = 'none';
    }

    // Handle standard logo modes
    switch (svgTargetMode) {
        case 'original':
            // Hide MALFA group, show standard group
            const malfaLayer = getLayer(svg, config.malfaGroup);
            if (malfaLayer) malfaLayer.style.display = 'none';
            
            const standardLayer = getLayer(svg, config.standardGroup);
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
            const standardLayer2 = getLayer(svg, config.standardGroup);
            if (standardLayer2) standardLayer2.style.display = 'none';
            
            const malfaLayer2 = getLayer(svg, config.malfaGroup);
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
            const malfaLayer3 = getLayer(svg, config.malfaGroup);
            if (malfaLayer3) malfaLayer3.style.display = 'none';
            
            const fallbackLayer = getLayer(svg, config.standardGroup);
            if (fallbackLayer) {
                fallbackLayer.style.display = 'inline';
            }
            break;
    }
}

export function updateFilter(filterId, section, colorValue) {
  if (!colorValue || !filterId) return;
  const svg = getMicrophoneSvg();
  if (!svg) return;
 const flood = getLayer(svg, filterId);
  if (flood) {
    flood.setAttribute('flood-color', colorValue);
    flood.setAttribute('flood-opacity', '1');
  }

  // ДОП. ЛОГИКА ДЛЯ MALFA: синхронизировать эллипс-клиппер
  if (section === 'logobg') {
    const malfaClip = svg.querySelector('#clip-logo-bg-malfa');
    if (malfaClip) {
      malfaClip.setAttribute('fill', colorValue);
    }
  }
}
