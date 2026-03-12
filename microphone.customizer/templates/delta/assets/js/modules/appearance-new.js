// Appearance helpers (delta)

import { SECTION_LAYER_MAP } from '../config/layer-mapping.config.js';

export function updateSectionLayers(section, state) {
    const svg = document.querySelector('.svg-wrapper svg');
    if (!svg) return;

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
