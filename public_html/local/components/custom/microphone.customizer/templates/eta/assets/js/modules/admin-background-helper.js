import { ADMIN_BACKGROUND_FILTERS, ADMIN_BACKGROUND_PRESETS } from '../config/background-presets.js';
import SceneController, { DEFAULT_SCENE_STATE, SCENE_PRESETS } from './scene-controller.js';

const PANEL_ID = 'admin-bg-helper';
const PREVIEW_ID = 'preview-area';
const SCENE_ID = 'camera-scene';
const FILTER_DEFS_ID = 'admin-bg-filter-defs';
const PRESET_CLASS_PREFIX = 'admin-bg-filter-';
const HELPER_ACTIVE_CLASS = 'admin-bg-helper-active';
const FLOOR_CLASS = 'admin-bg-has-floor';
const COLLAPSED_CLASS = 'is-collapsed';
const CUSTOM_SCENE_PRESET_ID = 'custom';

let sceneController = null;
let currentScenePresetId = 'neutral';

function resolveSceneController(preview, scene) {
    if (window.sceneController instanceof SceneController) {
        return window.sceneController;
    }

    const controller = new SceneController({
        preview,
        scene
    });
    window.sceneController = controller;
    return controller;
}

function isAdminUser() {
    return Boolean(window.BX_USER_DATA?.IS_ADMIN);
}

function getPanel() {
    return document.getElementById(PANEL_ID);
}

function getPreview() {
    return document.getElementById(PREVIEW_ID);
}

function getScene() {
    return document.getElementById(SCENE_ID);
}

function getAvailableBackgroundImages() {
    const items = Array.isArray(window.CUSTOMIZER_ADMIN_DATA?.backgroundTestImages)
        ? window.CUSTOMIZER_ADMIN_DATA.backgroundTestImages
        : [];

    return items.filter((item) => item?.path);
}

function findPreset(presetId) {
    return ADMIN_BACKGROUND_PRESETS.find((preset) => preset.id === presetId) || ADMIN_BACKGROUND_PRESETS[0];
}

function findFilter(filterId) {
    return ADMIN_BACKGROUND_FILTERS.find((filter) => filter.id === filterId) || ADMIN_BACKGROUND_FILTERS[0];
}

function sanitizeAssetPath(path) {
    if (!path) {
        return '';
    }

    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
        return path;
    }

    const assetBase = String(window.CUSTOMIZER_ASSETS_PATH || '').replace(/\/$/, '');
    const relativePath = String(path).replace(/^\//, '');
    return assetBase ? `${assetBase}/${relativePath}` : relativePath;
}

function parseHexColor(color) {
    const normalized = String(color || '').trim();
    const hex = normalized.startsWith('#') ? normalized.slice(1) : normalized;

    if (hex.length === 3) {
        const [r, g, b] = hex.split('');
        return [
            Number.parseInt(`${r}${r}`, 16),
            Number.parseInt(`${g}${g}`, 16),
            Number.parseInt(`${b}${b}`, 16)
        ];
    }

    if (hex.length === 6) {
        return [
            Number.parseInt(hex.slice(0, 2), 16),
            Number.parseInt(hex.slice(2, 4), 16),
            Number.parseInt(hex.slice(4, 6), 16)
        ];
    }

    return null;
}

function toHexColor(rgb) {
    return `#${rgb
        .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0'))
        .join('')}`;
}

function mixHexColors(baseColor, mixColor, ratio = 0.5) {
    const source = parseHexColor(baseColor);
    const target = parseHexColor(mixColor);

    if (!source || !target) {
        return baseColor || mixColor || '#000000';
    }

    const mixRatio = Math.max(0, Math.min(1, Number(ratio) || 0));
    const mixed = source.map((channel, index) =>
        channel + (target[index] - channel) * mixRatio
    );

    return toHexColor(mixed);
}

function ensureFilterDefs() {
    if (document.getElementById(FILTER_DEFS_ID)) {
        return;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', FILTER_DEFS_ID);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.pointerEvents = 'none';

    svg.innerHTML = `
        <defs>
            <filter id="admin-bg-soft-filter" x="-12%" y="-12%" width="124%" height="124%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="blurred"></feGaussianBlur>
                <feColorMatrix in="blurred" type="matrix"
                    values="1.05 0 0 0 0
                            0 1.04 0 0 0
                            0 0 1.02 0 0
                            0 0 0 1 0" result="tinted"></feColorMatrix>
                <feBlend in="SourceGraphic" in2="tinted" mode="screen"></feBlend>
            </filter>
            <filter id="admin-bg-contrast-filter" x="-15%" y="-15%" width="130%" height="130%">
                <feComponentTransfer>
                    <feFuncR type="gamma" amplitude="1.08" exponent="0.9" offset="0"></feFuncR>
                    <feFuncG type="gamma" amplitude="1.08" exponent="0.9" offset="0"></feFuncG>
                    <feFuncB type="gamma" amplitude="1.08" exponent="0.9" offset="0"></feFuncB>
                </feComponentTransfer>
                <feColorMatrix type="matrix"
                    values="1.18 0 0 0 -0.05
                            0 1.18 0 0 -0.05
                            0 0 1.18 0 -0.05
                            0 0 0 1 0"></feColorMatrix>
            </filter>
        </defs>
    `;

    document.body.appendChild(svg);
}

function clearHelperClasses(preview) {
    const classesToRemove = Array.from(preview.classList).filter((className) =>
        className === HELPER_ACTIVE_CLASS ||
        className === FLOOR_CLASS ||
        className.startsWith(PRESET_CLASS_PREFIX)
    );

    if (classesToRemove.length) {
        preview.classList.remove(...classesToRemove);
    }
}

function resetPreviewStyles(preview) {
    [
        '--admin-bg-color',
        '--admin-bg-gradient',
        '--admin-bg-image',
        '--admin-bg-image-size',
        '--admin-bg-image-position',
        '--admin-bg-image-repeat',
        '--admin-bg-blend-mode',
        '--admin-bg-overlay',
        '--admin-bg-floor-height',
        '--admin-bg-floor-transform',
        '--admin-bg-floor-gradient',
        '--admin-scene-wall-color',
        '--admin-scene-floor-color'
    ].forEach((propertyName) => preview.style.removeProperty(propertyName));
}

function applyFilter(preview, filterId) {
    const nextFilter = findFilter(filterId);

    Array.from(preview.classList)
        .filter((className) => className.startsWith(PRESET_CLASS_PREFIX))
        .forEach((className) => preview.classList.remove(className));

    if (nextFilter.id !== 'none') {
        preview.classList.add(`${PRESET_CLASS_PREFIX}${nextFilter.id}`);
    }

    return nextFilter;
}

function applyPreset(preview, presetId, imageOverridePath = '') {
    const preset = findPreset(presetId);
    clearHelperClasses(preview);
    resetPreviewStyles(preview);

    if (preset.id === 'default') {
        return preset;
    }

    const effectiveImagePath = imageOverridePath === '__none__'
        ? ''
        : (imageOverridePath || preset.imagePath);
    const imageUrl = sanitizeAssetPath(effectiveImagePath);

    preview.classList.add(HELPER_ACTIVE_CLASS);
    if (preset.floor) {
        preview.classList.add(FLOOR_CLASS);
    }

    preview.style.setProperty('--admin-bg-color', preset.backgroundColor || 'transparent');
    preview.style.setProperty('--admin-bg-gradient', preset.gradient || 'none');
    preview.style.setProperty('--admin-bg-image', imageUrl ? `url("${imageUrl}")` : 'none');
    preview.style.setProperty('--admin-bg-image-size', preset.imageSize || 'cover');
    preview.style.setProperty('--admin-bg-image-position', preset.imagePosition || 'center center');
    preview.style.setProperty('--admin-bg-image-repeat', preset.imageRepeat || 'no-repeat');
    preview.style.setProperty('--admin-bg-blend-mode', preset.blendMode || 'normal');
    preview.style.setProperty('--admin-bg-overlay', preset.overlay || 'none');
    preview.style.setProperty('--admin-bg-floor-height', preset.floorHeight || '34%');
    preview.style.setProperty('--admin-bg-floor-transform', preset.floorTransform || 'perspective(900px) rotateX(74deg) translateY(36%)');
    preview.style.setProperty('--admin-bg-floor-gradient', preset.floorGradient || 'radial-gradient(circle at 50% 25%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 18%, rgba(255,255,255,0) 40%), linear-gradient(180deg, rgba(53, 38, 27, 0.04) 0%, rgba(53, 38, 27, 0.44) 100%)');
    preview.style.setProperty('--admin-scene-wall-color', preset.sceneWallColor || mixHexColors(preset.backgroundColor || '#e9e1d6', '#ffffff', 0.22));
    preview.style.setProperty('--admin-scene-floor-color', preset.sceneFloorColor || mixHexColors(preset.backgroundColor || '#cdbda8', '#6f5c4b', 0.22));

    return preset;
}

function collectEffectiveConfig(state) {
    const preset = findPreset(state.presetId);
    const filter = findFilter(state.filterId);
    const selectedImage = state.imagePath || '';

    return {
        presetId: preset.id,
        filterId: filter.id,
        imagePath: selectedImage || preset.imagePath || '',
        preset,
        filter
    };
}

function updateButtonState(panel, state) {
    panel.querySelectorAll('[data-bg-preset]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.bgPreset === state.presetId);
    });

    panel.querySelectorAll('[data-bg-filter]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.bgFilter === state.filterId);
    });

    const status = panel.querySelector('[data-bg-helper-status]');
    if (status) {
        const preset = findPreset(state.presetId);
        const filter = findFilter(state.filterId);
        const imageLabel = state.imagePath === '__none__'
            ? 'No image'
            : (state.imagePath || preset.imagePath || 'Preset image');
        const sceneState = sceneController?.getState?.() || DEFAULT_SCENE_STATE;
        status.textContent = `Preset: ${preset.label} | Filter: ${filter.label} | Image: ${imageLabel} | Camera: ${sceneState.cameraPitch}deg / ${sceneState.lightAngle}deg`;
    }

    const imageSelect = panel.querySelector('[data-bg-image-select]');
    if (imageSelect) {
        imageSelect.value = state.imagePath ?? '';
    }
}

function formatSceneValue(sceneState, valueKey) {
    switch (valueKey) {
        case 'cameraPitch':
            return `${sceneState.cameraPitch}deg`;
        case 'lightAngle':
            return `${sceneState.lightAngle}deg`;
        case 'horizonY':
            return `${sceneState.horizonY}%`;
        case 'shadowIntensity':
            return Number(sceneState.shadowIntensity).toFixed(2);
        case 'shadowColor':
            return sceneState.shadowColor;
        default:
            return '';
    }
}

function renderPanel(panel, state, sceneState = DEFAULT_SCENE_STATE) {
    const testImages = getAvailableBackgroundImages();
    panel.innerHTML = `
        <div class="admin-bg-helper__header">
            <div>
                <h3>Background Lab</h3>
                <p>Admin-only helper for preview background presets.</p>
            </div>
            <button type="button" class="admin-bg-helper__collapse" data-bg-helper-collapse aria-label="Collapse helper">-</button>
        </div>
        <div class="admin-bg-helper__body">
            <div class="admin-bg-helper__section">
                <span class="admin-bg-helper__section-title">Presets</span>
                <div class="admin-bg-helper__button-grid">
                    ${ADMIN_BACKGROUND_PRESETS.map((preset) => `
                        <button type="button"
                            class="admin-bg-helper__button"
                            data-bg-preset="${preset.id}"
                            title="${preset.description}">
                            ${preset.label}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="admin-bg-helper__section">
                <span class="admin-bg-helper__section-title">Test Image</span>
                <label class="admin-bg-helper__select-wrap">
                    <select class="admin-bg-helper__select" data-bg-image-select>
                        <option value="">Preset image</option>
                        <option value="__none__">No image</option>
                        ${testImages.map((item) => `
                            <option value="${item.path}">${item.label}</option>
                        `).join('')}
                    </select>
                </label>
            </div>
            <div class="admin-bg-helper__section">
                <span class="admin-bg-helper__section-title">Filter</span>
                <div class="admin-bg-helper__button-grid admin-bg-helper__button-grid--filters">
                    ${ADMIN_BACKGROUND_FILTERS.map((filter) => `
                        <button type="button"
                            class="admin-bg-helper__button"
                            data-bg-filter="${filter.id}"
                            title="${filter.description}">
                            ${filter.label}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="admin-bg-helper__section">
                <span class="admin-bg-helper__section-title">Camera & Light</span>
                <div class="admin-bg-helper__slider-group">
                    <label for="admin-bg-camera-pitch">
                        <span>Camera Pitch</span>
                        <span data-bg-scene-value="cameraPitch">${formatSceneValue(sceneState, 'cameraPitch')}</span>
                    </label>
                    <input class="admin-bg-helper__range" type="range" id="admin-bg-camera-pitch" min="0" max="45" step="1" value="${sceneState.cameraPitch}" data-bg-scene-range="cameraPitch">
                </div>
                <div class="admin-bg-helper__slider-group">
                    <label for="admin-bg-light-angle">
                        <span>Light Angle</span>
                        <span data-bg-scene-value="lightAngle">${formatSceneValue(sceneState, 'lightAngle')}</span>
                    </label>
                    <input class="admin-bg-helper__range" type="range" id="admin-bg-light-angle" min="0" max="360" step="5" value="${sceneState.lightAngle}" data-bg-scene-range="lightAngle">
                </div>
                <div class="admin-bg-helper__slider-group">
                    <label for="admin-bg-horizon">
                        <span>Horizon</span>
                        <span data-bg-scene-value="horizonY">${formatSceneValue(sceneState, 'horizonY')}</span>
                    </label>
                    <input class="admin-bg-helper__range" type="range" id="admin-bg-horizon" min="30" max="70" step="1" value="${sceneState.horizonY}" data-bg-scene-range="horizonY">
                </div>
                <div class="admin-bg-helper__button-grid admin-bg-helper__button-grid--quad">
                    <button type="button" class="admin-bg-helper__button" data-bg-scene-preset="neutral">Neutral</button>
                    <button type="button" class="admin-bg-helper__button" data-bg-scene-preset="studio">Studio</button>
                    <button type="button" class="admin-bg-helper__button" data-bg-scene-preset="low-angle">Low Angle</button>
                    <button type="button" class="admin-bg-helper__button" data-bg-scene-preset="overhead">Overhead</button>
                </div>
            </div>
            <div class="admin-bg-helper__section">
                <span class="admin-bg-helper__section-title">Shadow</span>
                <div class="admin-bg-helper__slider-group">
                    <label for="admin-bg-shadow-intensity">
                        <span>Intensity</span>
                        <span data-bg-scene-value="shadowIntensity">${formatSceneValue(sceneState, 'shadowIntensity')}</span>
                    </label>
                    <input class="admin-bg-helper__range" type="range" id="admin-bg-shadow-intensity" min="0.08" max="0.8" step="0.01" value="${sceneState.shadowIntensity}" data-bg-scene-range="shadowIntensity">
                </div>
                <label class="admin-bg-helper__color-field" for="admin-bg-shadow-color">
                    <span class="admin-bg-helper__field-label">
                        <span>Shadow Color</span>
                        <span data-bg-scene-value="shadowColor">${formatSceneValue(sceneState, 'shadowColor')}</span>
                    </span>
                    <input class="admin-bg-helper__color" type="color" id="admin-bg-shadow-color" value="${sceneState.shadowColor}" data-bg-scene-color="shadowColor">
                </label>
                <div class="admin-bg-helper__button-grid admin-bg-helper__button-grid--filters">
                    <button type="button" class="admin-bg-helper__button" data-bg-shadow-elevation="low">Low</button>
                    <button type="button" class="admin-bg-helper__button" data-bg-shadow-elevation="medium">Medium</button>
                    <button type="button" class="admin-bg-helper__button" data-bg-shadow-elevation="high">High</button>
                </div>
            </div>
            <div class="admin-bg-helper__section admin-bg-helper__section--actions">
                <button type="button" class="admin-bg-helper__action" data-bg-reset>Reset</button>
                <button type="button" class="admin-bg-helper__action" data-bg-log>Log Config</button>
            </div>
            <div class="admin-bg-helper__status" data-bg-helper-status></div>
        </div>
    `;

    updateButtonState(panel, state);
}

function updateSceneControlState(panel) {
    if (!panel || !sceneController) {
        return;
    }

    const sceneState = sceneController.getState();

    panel.querySelectorAll('[data-bg-scene-range]').forEach((input) => {
        const key = input.dataset.bgSceneRange;
        if (Object.prototype.hasOwnProperty.call(sceneState, key)) {
            input.value = sceneState[key];
        }
    });

    panel.querySelectorAll('[data-bg-scene-color]').forEach((input) => {
        const key = input.dataset.bgSceneColor;
        if (Object.prototype.hasOwnProperty.call(sceneState, key)) {
            input.value = sceneState[key];
        }
    });

    panel.querySelectorAll('[data-bg-scene-value]').forEach((element) => {
        const key = element.dataset.bgSceneValue;
        element.textContent = formatSceneValue(sceneState, key);
    });

    panel.querySelectorAll('[data-bg-scene-preset]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.bgScenePreset === currentScenePresetId);
    });

    panel.querySelectorAll('[data-bg-shadow-elevation]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.bgShadowElevation === sceneState.shadowElevation);
    });
}

function applyState(panel, preview, state, overrides = {}) {
    const nextState = {
        presetId: overrides.presetId ?? state.presetId,
        filterId: overrides.filterId ?? state.filterId,
        imagePath: Object.prototype.hasOwnProperty.call(overrides, 'imagePath')
            ? overrides.imagePath
            : state.imagePath
    };

    const preset = applyPreset(preview, nextState.presetId, nextState.imagePath);
    const filter = applyFilter(preview, overrides.filterId ?? preset.defaultFilter ?? nextState.filterId);

    const resolvedState = {
        presetId: preset.id,
        filterId: filter.id,
        imagePath: nextState.imagePath ?? ''
    };

    updateButtonState(panel, resolvedState);
    return resolvedState;
}

function logCurrentConfig(state) {
    const payload = collectEffectiveConfig(state);
    payload.scene = {
        presetId: currentScenePresetId,
        ...sceneController?.getState?.()
    };
    console.log('[AdminBackgroundHelper] Current config:', payload);
    return payload;
}

export function initAdminBackgroundHelper() {
    if (!isAdminUser()) {
        const panel = getPanel();
        if (panel) {
            panel.hidden = true;
            panel.removeAttribute('data-admin-ready');
        }
        return;
    }

    const panel = getPanel();
    const preview = getPreview();
    const scene = getScene();

    if (!panel || !preview || !scene) {
        return;
    }

    panel.hidden = false;
    panel.setAttribute('data-admin-ready', '1');
    ensureFilterDefs();
    sceneController = resolveSceneController(preview, scene);
    currentScenePresetId = 'neutral';

    let currentState = {
        presetId: 'default',
        filterId: 'none',
        imagePath: ''
    };

    renderPanel(panel, currentState, sceneController.getState());
    currentState = applyState(panel, preview, currentState);
    updateSceneControlState(panel);

    panel.addEventListener('click', (event) => {
        const presetButton = event.target.closest('[data-bg-preset]');
        if (presetButton) {
            currentState = applyState(panel, preview, currentState, {
                presetId: presetButton.dataset.bgPreset,
                filterId: findPreset(presetButton.dataset.bgPreset).defaultFilter || currentState.filterId
            });
            return;
        }

        const filterButton = event.target.closest('[data-bg-filter]');
        if (filterButton) {
            currentState = applyState(panel, preview, currentState, {
                filterId: filterButton.dataset.bgFilter
            });
            return;
        }

        const scenePresetButton = event.target.closest('[data-bg-scene-preset]');
        if (scenePresetButton && sceneController) {
            currentScenePresetId = scenePresetButton.dataset.bgScenePreset || CUSTOM_SCENE_PRESET_ID;
            sceneController.setPreset(currentScenePresetId);
            updateSceneControlState(panel);
            updateButtonState(panel, currentState);
            return;
        }

        const shadowElevationButton = event.target.closest('[data-bg-shadow-elevation]');
        if (shadowElevationButton && sceneController) {
            sceneController.setShadowElevation(shadowElevationButton.dataset.bgShadowElevation);
            currentScenePresetId = CUSTOM_SCENE_PRESET_ID;
            updateSceneControlState(panel);
            updateButtonState(panel, currentState);
            return;
        }

        if (event.target.closest('[data-bg-reset]')) {
            currentState = applyState(panel, preview, currentState, {
                presetId: 'default',
                filterId: 'none',
                imagePath: ''
            });
            if (sceneController) {
                sceneController.applySceneState(DEFAULT_SCENE_STATE, { preserveManualHorizon: true });
                currentScenePresetId = 'neutral';
                updateSceneControlState(panel);
            }
            updateButtonState(panel, currentState);
            return;
        }

        if (event.target.closest('[data-bg-log]')) {
            logCurrentConfig(currentState);
            return;
        }

        if (event.target.closest('[data-bg-helper-collapse]')) {
            panel.classList.toggle(COLLAPSED_CLASS);
            const collapseButton = panel.querySelector('[data-bg-helper-collapse]');
            if (collapseButton) {
                collapseButton.textContent = panel.classList.contains(COLLAPSED_CLASS) ? '+' : '-';
            }
        }
    });

    panel.addEventListener('input', (event) => {
        if (!sceneController) {
            return;
        }

        const rangeInput = event.target.closest('[data-bg-scene-range]');
        if (rangeInput) {
            const key = rangeInput.dataset.bgSceneRange;
            const value = Number(rangeInput.value);

            if (key === 'horizonY') {
                sceneController.applySceneState({ horizonY: value }, { preserveManualHorizon: true });
            } else {
                sceneController.applySceneState({ [key]: value });
            }

            currentScenePresetId = CUSTOM_SCENE_PRESET_ID;
            updateSceneControlState(panel);
            updateButtonState(panel, currentState);
            return;
        }

        const colorInput = event.target.closest('[data-bg-scene-color]');
        if (colorInput) {
            const key = colorInput.dataset.bgSceneColor;
            sceneController.applySceneState({ [key]: colorInput.value }, { preserveManualHorizon: true });
            currentScenePresetId = CUSTOM_SCENE_PRESET_ID;
            updateSceneControlState(panel);
            updateButtonState(panel, currentState);
        }
    });

    panel.addEventListener('change', (event) => {
        const imageSelect = event.target.closest('[data-bg-image-select]');
        if (!imageSelect) {
            return;
        }

        currentState = applyState(panel, preview, currentState, {
            imagePath: imageSelect.value
        });
    });

    window.applyBackgroundPreset = (presetId) => {
        currentState = applyState(panel, preview, currentState, { presetId });
        return logCurrentConfig(currentState);
    };

    window.applyBackgroundFilter = (filterId) => {
        currentState = applyState(panel, preview, currentState, { filterId });
        return logCurrentConfig(currentState);
    };

    window.applyBackgroundImage = (imagePath = '') => {
        currentState = applyState(panel, preview, currentState, { imagePath });
        return logCurrentConfig(currentState);
    };

    window.applyBackgroundScenePreset = (presetId = 'neutral') => {
        if (!sceneController || !SCENE_PRESETS[presetId]) {
            return logCurrentConfig(currentState);
        }

        currentScenePresetId = presetId;
        sceneController.setPreset(presetId);
        updateSceneControlState(panel);
        updateButtonState(panel, currentState);
        return logCurrentConfig(currentState);
    };

    window.dumpBackgroundHelperConfig = () => logCurrentConfig(currentState);
    window.ADMIN_BACKGROUND_PRESETS = ADMIN_BACKGROUND_PRESETS;
    window.ADMIN_BACKGROUND_FILTERS = ADMIN_BACKGROUND_FILTERS;
}
