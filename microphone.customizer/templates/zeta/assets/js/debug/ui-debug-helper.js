import { stateManager } from '../core/state.js';
import { switchLayer, getActiveLayer, getAnimationPreset } from '../modules/camera-effect.js';
import { getBreakdown, calculateTotal } from '../modules/price-calculator.js';
import { applyModelDefaults } from '../modules/model-defaults.js';

const DEBUG_STORAGE_KEY = 'zeta-debug-enabled';
const VARIANT_KEYS = ['spheres', 'body', 'logo', 'logobg', 'case', 'shockmount', 'shockmountPins', 'shockmountOption'];

function isDebugEnabled() {
    const params = new URLSearchParams(window.location.search);
    const queryFlag = params.get('debug');

    if (queryFlag === '1') {
        localStorage.setItem(DEBUG_STORAGE_KEY, '1');
        return true;
    }

    if (queryFlag === '0') {
        localStorage.removeItem(DEBUG_STORAGE_KEY);
        return false;
    }

    return window.DEBUG_UI_HELPER || localStorage.getItem(DEBUG_STORAGE_KEY) === '1';
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

function readTransform(id) {
    const element = document.getElementById(id);
    return element ? (element.style.transform || getComputedStyle(element).transform || 'none') : 'missing';
}

function getVariantSummary(state) {
    return VARIANT_KEYS.reduce((acc, key) => {
        const sectionState = state?.[key];
        acc[key] = sectionState?.variantCode || sectionState?.variant || '-';
        return acc;
    }, {
        customLogo: state?.logo?.useCustom ? 'on' : 'off',
        customEngraving: state?.case?.laserEngravingEnabled ? 'on' : 'off',
        shockmountEnabled: state?.shockmount?.enabled ? 'on' : 'off'
    });
}

function buildExportPayload(state) {
    const preset = getAnimationPreset(state.currentModelCode, state);
    return {
        modelCode: state.currentModelCode,
        cameraPreset: preset.model,
        activeLayer: getActiveLayer() || 'global-view',
        selectedVariants: getVariantSummary(state),
        breakdown: getBreakdown(state),
        transforms: {
            microphone: readTransform('microphone-svg-container'),
            shockmount: readTransform('shockmount-svg-container'),
            case: readTransform('case-preview-container')
        },
        presetStates: preset.states
    };
}

export function initDebugHelper() {
    if (!isDebugEnabled()) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${window.CUSTOMIZER_ASSETS_PATH}/css/debug/debug-helper.css`;
    document.head.appendChild(link);

    const panel = document.createElement('div');
    panel.className = 'debug-panel';
    panel.innerHTML = `
        <h3>Dev Debug Panel <button id="debug-collapse">_</button></h3>
        <div id="debug-content">
            <div class="debug-section">
                <h4>Session</h4>
                <div class="debug-row debug-row-wrap">
                    <label class="debug-toggle">
                        <input type="checkbox" id="debug-persist-toggle" checked>
                        <span>Persist debug</span>
                    </label>
                    <button id="debug-reapply-defaults">Reapply Defaults</button>
                    <button id="debug-copy-state">Copy State JSON</button>
                    <button id="debug-copy-preset">Copy Camera Preset</button>
                </div>
            </div>

            <div class="debug-section">
                <h4>Camera View</h4>
                <div class="debug-row debug-row-wrap">
                    <button data-view="microphone">Mic View</button>
                    <button data-view="shockmount">Shockmount</button>
                    <button data-view="case">Case</button>
                    <button data-view="logo">Logo View</button>
                </div>
            </div>

            <div class="debug-section">
                <h4>Runtime Summary</h4>
                <div class="debug-kv"><span>Model</span><strong id="debug-model-code">-</strong></div>
                <div class="debug-kv"><span>Camera Preset</span><strong id="debug-camera-model">-</strong></div>
                <div class="debug-kv"><span>Active Layer</span><strong id="debug-active-layer">-</strong></div>
                <div class="debug-kv"><span>Total</span><strong id="debug-total-price">0 ₽</strong></div>
            </div>

            <div class="debug-section">
                <h4>Selected Variants</h4>
                <div class="debug-breakdown" id="debug-variants-breakdown"></div>
            </div>

            <div class="debug-section">
                <h4>Price Breakdown</h4>
                <div class="debug-breakdown" id="debug-price-breakdown"></div>
            </div>

            <div class="debug-section">
                <h4>Transforms</h4>
                <div class="debug-breakdown" id="debug-transform-breakdown"></div>
            </div>

            <div class="debug-section">
                <h4>Live Transform Lab</h4>
                <div class="debug-row">
                    <label for="debug-transform-input-microphone">Microphone</label>
                    <input type="text" id="debug-transform-input-microphone" class="debug-transform-input">
                    <button data-apply-transform="microphone-svg-container">Apply</button>
                </div>
                <div class="debug-row">
                    <label for="debug-transform-input-shockmount">Shockmount</label>
                    <input type="text" id="debug-transform-input-shockmount" class="debug-transform-input">
                    <button data-apply-transform="shockmount-svg-container">Apply</button>
                </div>
                <div class="debug-row">
                    <label for="debug-transform-input-case">Case</label>
                    <input type="text" id="debug-transform-input-case" class="debug-transform-input">
                    <button data-apply-transform="case-preview-container">Apply</button>
                </div>
            </div>

            <div class="debug-section">
                <h4>Overlay Stencil</h4>
                <div class="debug-row">
                    <input type="file" id="debug-stencil-upload" accept="image/*">
                </div>
                <div class="debug-row">
                    <label>Opacity</label>
                    <input type="range" id="debug-stencil-opacity" min="0" max="1" step="0.1" value="0.5">
                </div>
            </div>

            <div class="debug-section">
                <h4>State Viewer</h4>
                <div class="debug-state-viewer" id="debug-state-json"></div>
            </div>

            <div class="debug-section">
                <h4>Export Config</h4>
                <textarea id="debug-export-area" class="debug-export-area"></textarea>
                <button id="debug-copy-config">Copy Export JSON</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const stateViewer = document.getElementById('debug-state-json');
    const variantsBreakdown = document.getElementById('debug-variants-breakdown');
    const priceBreakdown = document.getElementById('debug-price-breakdown');
    const transformBreakdown = document.getElementById('debug-transform-breakdown');
    const modelCodeEl = document.getElementById('debug-model-code');
    const cameraModelEl = document.getElementById('debug-camera-model');
    const activeLayerEl = document.getElementById('debug-active-layer');
    const totalPriceEl = document.getElementById('debug-total-price');
    const exportArea = document.getElementById('debug-export-area');
    const persistToggle = document.getElementById('debug-persist-toggle');
    const transformInputs = {
        'microphone-svg-container': document.getElementById('debug-transform-input-microphone'),
        'shockmount-svg-container': document.getElementById('debug-transform-input-shockmount'),
        'case-preview-container': document.getElementById('debug-transform-input-case')
    };

    persistToggle.checked = true;

    const renderKeyValueList = (container, data) => {
        container.innerHTML = Object.entries(data).map(([key, value]) => `
            <div class="debug-kv${String(value).length > 42 ? ' debug-kv-multiline' : ''}">
                <span>${escapeHtml(key)}</span>
                <strong>${escapeHtml(value)}</strong>
            </div>
        `).join('');
    };

    const renderDebugState = (state) => {
        const cleanState = { ...state };
        delete cleanState.savedMicConfigs;
        delete cleanState.initialConfig;
        stateViewer.textContent = JSON.stringify(cleanState, null, 2);

        renderKeyValueList(variantsBreakdown, getVariantSummary(state));
        renderKeyValueList(priceBreakdown, getBreakdown(state));
        renderKeyValueList(transformBreakdown, {
            microphone: readTransform('microphone-svg-container'),
            shockmount: readTransform('shockmount-svg-container'),
            case: readTransform('case-preview-container')
        });

        Object.entries(transformInputs).forEach(([id, input]) => {
            if (input) {
                input.value = readTransform(id);
            }
        });

        modelCodeEl.textContent = state.currentModelCode || '-';
        cameraModelEl.textContent = getAnimationPreset(state.currentModelCode, state).model;
        activeLayerEl.textContent = getActiveLayer() || 'global-view';
        totalPriceEl.textContent = `${calculateTotal(state)} ₽`;
        exportArea.value = JSON.stringify(buildExportPayload(state), null, 2);
    };

    stateManager.subscribe((state) => {
        renderDebugState(state);
    });
    renderDebugState(stateManager.get());

    const stencil = document.createElement('img');
    stencil.className = 'debug-overlay-stencil';
    stencil.style.display = 'none';
    document.body.appendChild(stencil);

    document.getElementById('debug-stencil-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            stencil.src = event.target.result;
            stencil.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('debug-stencil-opacity').addEventListener('input', (e) => {
        stencil.style.opacity = e.target.value;
    });

    document.getElementById('debug-collapse').addEventListener('click', () => {
        const content = document.getElementById('debug-content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('debug-reapply-defaults').addEventListener('click', () => {
        const currentState = stateManager.get();
        if (currentState.currentModelCode) {
            applyModelDefaults(currentState.currentModelCode);
        }
    });

    document.getElementById('debug-copy-state').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(stateManager.get(), null, 2));
        } catch (error) {
            console.warn('Clipboard copy failed', error);
        }
    });

    document.getElementById('debug-copy-preset').addEventListener('click', async () => {
        try {
            const currentState = stateManager.get();
            await navigator.clipboard.writeText(JSON.stringify(getAnimationPreset(currentState.currentModelCode, currentState), null, 2));
        } catch (error) {
            console.warn('Clipboard copy failed', error);
        }
    });

    document.getElementById('debug-copy-config').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(exportArea.value || '');
        } catch (error) {
            console.warn('Clipboard copy failed', error);
        }
    });

    persistToggle.addEventListener('change', (event) => {
        if (event.target.checked) {
            localStorage.setItem(DEBUG_STORAGE_KEY, '1');
            return;
        }

        localStorage.removeItem(DEBUG_STORAGE_KEY);
    });

    panel.querySelectorAll('[data-view]').forEach((btn) => {
        btn.addEventListener('click', () => {
            switchLayer(btn.dataset.view);
            renderDebugState(stateManager.get());
        });
    });

    panel.querySelectorAll('[data-apply-transform]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.applyTransform;
            const input = transformInputs[targetId];
            const target = document.getElementById(targetId);

            if (!input || !target) {
                return;
            }

            target.style.transform = input.value || 'none';
            renderDebugState(stateManager.get());
        });
    });

    window.__ZETA_DEBUG__ = {
        render: () => renderDebugState(stateManager.get()),
        getState: () => stateManager.get(),
        getPreset: () => getAnimationPreset(stateManager.get().currentModelCode, stateManager.get()),
        getExport: () => buildExportPayload(stateManager.get())
    };
}
