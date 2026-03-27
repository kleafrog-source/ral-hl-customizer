import { ADMIN_BACKGROUND_FILTERS, ADMIN_BACKGROUND_PRESETS } from '../config/background-presets.js';

const PANEL_ID = 'admin-bg-helper';
const PREVIEW_ID = 'preview-area';
const SCENE_ID = 'camera-scene';
const FILTER_DEFS_ID = 'admin-bg-filter-defs';
const PRESET_CLASS_PREFIX = 'admin-bg-filter-';
const HELPER_ACTIVE_CLASS = 'admin-bg-helper-active';
const FLOOR_CLASS = 'admin-bg-has-floor';
const COLLAPSED_CLASS = 'is-collapsed';

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
        '--admin-bg-floor-gradient'
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
        status.textContent = `Preset: ${preset.label} | Filter: ${filter.label} | Image: ${imageLabel}`;
    }

    const imageSelect = panel.querySelector('[data-bg-image-select]');
    if (imageSelect) {
        imageSelect.value = state.imagePath ?? '';
    }
}

function renderPanel(panel, state) {
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
            <div class="admin-bg-helper__section admin-bg-helper__section--actions">
                <button type="button" class="admin-bg-helper__action" data-bg-reset>Reset</button>
                <button type="button" class="admin-bg-helper__action" data-bg-log>Log Config</button>
            </div>
            <div class="admin-bg-helper__status" data-bg-helper-status></div>
        </div>
    `;

    updateButtonState(panel, state);
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

    let currentState = {
        presetId: 'default',
        filterId: 'none',
        imagePath: ''
    };

    renderPanel(panel, currentState);
    currentState = applyState(panel, preview, currentState);

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

        if (event.target.closest('[data-bg-reset]')) {
            currentState = applyState(panel, preview, currentState, {
                presetId: 'default',
                filterId: 'none'
            });
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

    window.dumpBackgroundHelperConfig = () => logCurrentConfig(currentState);
    window.ADMIN_BACKGROUND_PRESETS = ADMIN_BACKGROUND_PRESETS;
    window.ADMIN_BACKGROUND_FILTERS = ADMIN_BACKGROUND_FILTERS;
}
