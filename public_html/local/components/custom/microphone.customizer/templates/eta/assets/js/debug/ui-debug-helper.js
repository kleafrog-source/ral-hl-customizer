import { stateManager } from '../core/state.js';
import { switchLayer, getActiveLayer, getAnimationPreset, initCameraEffect } from '../modules/camera-effect.js';
import { getBreakdown, calculateTotal } from '../modules/price-calculator.js';
import { applyModelDefaults } from '../modules/model-defaults.js';
import { debugWarn, isDebugUIEnabled } from '../utils/debug.js';

const DEBUG_STORAGE_KEY = 'customizer-debug-enabled';
const VARIANT_KEYS = ['spheres', 'body', 'logo', 'logobg', 'case', 'shockmount', 'shockmountPins', 'shockmountOption'];
const LAYER_CONTROLS = [
    { targetId: 'microphone-svg-container', key: 'microphone', label: 'Microphone' },
    { targetId: 'shockmount-svg-container', key: 'shockmount', label: 'Shockmount' },
    { targetId: 'case-preview-container', key: 'case', label: 'Case' }
];
const CAMERA_VIEWS = [
    { value: 'global-view', label: 'Global View' },
    { value: 'microphone', label: 'Mic View' },
    { value: 'shockmount', label: 'Shockmount' },
    { value: 'case', label: 'Case' },
    { value: 'logo', label: 'Logo View' }
];
const TRANSFORM_LIMITS = {
    x: { min: -400, max: 400, step: 1 },
    y: { min: -400, max: 400, step: 1 },
    scale: { min: 0.05, max: 4, step: 0.01 },
    opacity: { min: 0, max: 1, step: 0.01 }
};
const STENCIL_LIMITS = {
    x: { min: 0, max: 100, step: 0.5 },
    y: { min: 0, max: 100, step: 0.5 },
    scale: { min: 0.1, max: 3, step: 0.01 },
    opacity: { min: 0, max: 1, step: 0.01 }
};

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

function clamp(value, limits) {
    return Math.min(limits.max, Math.max(limits.min, value));
}

function readTransform(id) {
    const element = document.getElementById(id);
    return element ? (element.style.transform || getComputedStyle(element).transform || 'none') : 'missing';
}

function parseEditableTransform(transform) {
    const source = transform && transform !== 'none'
        ? transform
        : 'translateX(0%) translateY(0%) scale(1)';
    const readValue = (pattern, fallback) => {
        const match = source.match(pattern);
        return match ? parseFloat(match[1]) : fallback;
    };

    return {
        x: readValue(/translateX\((-?\d+(?:\.\d+)?)%\)/, 0),
        y: readValue(/translateY\((-?\d+(?:\.\d+)?)%\)/, 0),
        scale: readValue(/scale\((-?\d+(?:\.\d+)?)\)/, 1)
    };
}

function formatEditableTransform({ x, y, scale }) {
    const safeScale = clamp(scale, TRANSFORM_LIMITS.scale);
    return `translateX(${x.toFixed(2)}%) translateY(${y.toFixed(2)}%) scale(${safeScale.toFixed(2)})`;
}

function readLayerState(targetId) {
    const element = document.getElementById(targetId);
    const parsed = parseEditableTransform(readTransform(targetId));
    const opacity = element ? parseFloat(element.style.opacity || getComputedStyle(element).opacity || '1') : 1;

    return {
        ...parsed,
        opacity: Number.isFinite(opacity) ? opacity : 1
    };
}

function applyLayerState(targetId, nextState) {
    const element = document.getElementById(targetId);
    if (!element) {
        return;
    }

    const safeState = {
        x: clamp(Number(nextState.x ?? 0), TRANSFORM_LIMITS.x),
        y: clamp(Number(nextState.y ?? 0), TRANSFORM_LIMITS.y),
        scale: clamp(Number(nextState.scale ?? 1), TRANSFORM_LIMITS.scale),
        opacity: clamp(Number(nextState.opacity ?? 1), TRANSFORM_LIMITS.opacity)
    };

    element.style.transform = formatEditableTransform(safeState);
    element.style.opacity = String(safeState.opacity);
}

function formatCameraView(view) {
    const matched = CAMERA_VIEWS.find((item) => item.value === view);
    return matched ? matched.label : 'Global View';
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
    const activeView = getActiveLayer() || 'global-view';

    return {
        modelCode: state.currentModelCode,
        cameraPreset: preset.model,
        activeLayer: activeView,
        activeLayerLabel: formatCameraView(activeView),
        selectedVariants: getVariantSummary(state),
        breakdown: getBreakdown(state),
        transforms: Object.fromEntries(LAYER_CONTROLS.map((layer) => [
            layer.key,
            {
                transform: readTransform(layer.targetId),
                opacity: readLayerState(layer.targetId).opacity
            }
        ])),
        presetStates: preset.states
    };
}

function buildTransformCardMarkup(layer) {
    const axes = [
        { axis: 'x', label: 'X', delta: 5 },
        { axis: 'y', label: 'Y', delta: 5 },
        { axis: 'scale', label: 'Scale', delta: 0.05 },
        { axis: 'opacity', label: 'Opacity', delta: 0.05 }
    ];

    return `
        <div class="debug-transform-card" data-transform-target="${layer.targetId}">
            <div class="debug-transform-card-header">
                <strong>${layer.label}</strong>
                <button type="button" data-reset-transform="${layer.targetId}">Reset</button>
            </div>
            ${axes.map(({ axis, label, delta }) => {
                const limits = TRANSFORM_LIMITS[axis];
                const isSigned = axis === 'x' || axis === 'y';
                const negativeLabel = isSigned ? `-${label}` : `-${label[0]}`;
                const positiveLabel = isSigned ? `+${label}` : `+${label[0]}`;

                return `
                    <div class="debug-transform-field">
                        <label>${label}</label>
                        <div class="debug-transform-controls">
                            <button type="button" data-transform-nudge="${layer.targetId}" data-axis="${axis}" data-delta="${-delta}">${negativeLabel}</button>
                            <input type="range" data-transform-slider="${layer.targetId}" data-axis="${axis}" min="${limits.min}" max="${limits.max}" step="${limits.step}">
                            <input type="number" data-transform-number="${layer.targetId}" data-axis="${axis}" min="${limits.min}" max="${limits.max}" step="${limits.step}">
                            <button type="button" data-transform-nudge="${layer.targetId}" data-axis="${axis}" data-delta="${delta}">${positiveLabel}</button>
                        </div>
                    </div>
                `;
            }).join('')}
            <div class="debug-transform-field">
                <label>Transform</label>
                <div class="debug-transform-controls">
                    <input type="text" id="debug-transform-input-${layer.key}" class="debug-transform-input">
                    <button type="button" data-apply-transform="${layer.targetId}">Apply</button>
                </div>
            </div>
        </div>
    `;
}

function makePanelDraggable(panel, header) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onPointerMove = (event) => {
        if (!dragging) {
            return;
        }

        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.left = `${event.clientX - offsetX}px`;
        panel.style.top = `${event.clientY - offsetY}px`;
    };

    const stopDragging = () => {
        dragging = false;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', stopDragging);
    };

    header.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button')) {
            return;
        }

        dragging = true;
        const rect = panel.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', stopDragging);
    });
}

export function initDebugHelper() {
    if (!isDebugUIEnabled()) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${window.CUSTOMIZER_ASSETS_PATH}/css/debug/debug-helper.css`;
    document.head.appendChild(link);

    const panel = document.createElement('div');
    panel.className = 'debug-panel';
    panel.innerHTML = `
        <div class="debug-panel-header">
            <h3>Dev Debug Panel</h3>
            <div class="debug-header-actions">
                <button type="button" id="debug-collapse">_</button>
            </div>
        </div>
        <div id="debug-content" class="debug-content">
            <div class="debug-section">
                <h4>Session</h4>
                <div class="debug-row debug-row-wrap">
                    <label class="debug-toggle">
                        <input type="checkbox" id="debug-persist-toggle" checked>
                        <span>Persist debug</span>
                    </label>
                    <button type="button" id="debug-reapply-defaults">Reapply Defaults</button>
                    <button type="button" id="debug-copy-state">Copy State JSON</button>
                    <button type="button" id="debug-copy-preset">Copy Camera Preset</button>
                </div>
            </div>

            <div class="debug-section">
                <h4>Live Transform Lab</h4>
                <div class="debug-transform-grid">
                    ${LAYER_CONTROLS.map(buildTransformCardMarkup).join('')}
                </div>
            </div>

            <div class="debug-section">
                <h4>Camera View</h4>
                <div class="debug-row debug-row-wrap">
                    ${CAMERA_VIEWS.map((view) => `
                        <button type="button" data-view="${view.value}">${view.label}</button>
                    `).join('')}
                </div>
            </div>

            <div class="debug-section">
                <h4>Runtime Summary</h4>
                <div class="debug-kv"><span>Model</span><strong id="debug-model-code">-</strong></div>
                <div class="debug-kv"><span>Camera Preset</span><strong id="debug-camera-model">-</strong></div>
                <div class="debug-kv"><span>Camera View</span><strong id="debug-active-layer">Global View</strong></div>
                <div class="debug-kv"><span>Total</span><strong id="debug-total-price">0 RUB</strong></div>
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
                <h4>Overlay Stencil</h4>
                <div class="debug-row">
                    <input type="file" id="debug-stencil-upload" accept="image/*">
                </div>
                <div class="debug-transform-card debug-transform-card-compact">
                    <div class="debug-transform-field">
                        <label>Stencil X</label>
                        <div class="debug-transform-controls">
                            <button type="button" data-stencil-nudge="x" data-delta="-1">-X</button>
                            <input type="range" id="debug-stencil-x-range" min="${STENCIL_LIMITS.x.min}" max="${STENCIL_LIMITS.x.max}" step="${STENCIL_LIMITS.x.step}">
                            <input type="number" id="debug-stencil-x-number" min="${STENCIL_LIMITS.x.min}" max="${STENCIL_LIMITS.x.max}" step="${STENCIL_LIMITS.x.step}">
                            <button type="button" data-stencil-nudge="x" data-delta="1">+X</button>
                        </div>
                    </div>
                    <div class="debug-transform-field">
                        <label>Stencil Y</label>
                        <div class="debug-transform-controls">
                            <button type="button" data-stencil-nudge="y" data-delta="-1">-Y</button>
                            <input type="range" id="debug-stencil-y-range" min="${STENCIL_LIMITS.y.min}" max="${STENCIL_LIMITS.y.max}" step="${STENCIL_LIMITS.y.step}">
                            <input type="number" id="debug-stencil-y-number" min="${STENCIL_LIMITS.y.min}" max="${STENCIL_LIMITS.y.max}" step="${STENCIL_LIMITS.y.step}">
                            <button type="button" data-stencil-nudge="y" data-delta="1">+Y</button>
                        </div>
                    </div>
                    <div class="debug-transform-field">
                        <label>Stencil Scale</label>
                        <div class="debug-transform-controls">
                            <button type="button" data-stencil-nudge="scale" data-delta="-0.05">-S</button>
                            <input type="range" id="debug-stencil-scale" min="${STENCIL_LIMITS.scale.min}" max="${STENCIL_LIMITS.scale.max}" step="${STENCIL_LIMITS.scale.step}">
                            <input type="number" id="debug-stencil-scale-number" min="${STENCIL_LIMITS.scale.min}" max="${STENCIL_LIMITS.scale.max}" step="${STENCIL_LIMITS.scale.step}">
                            <button type="button" data-stencil-nudge="scale" data-delta="0.05">+S</button>
                        </div>
                    </div>
                    <div class="debug-transform-field">
                        <label>Stencil Opacity</label>
                        <div class="debug-transform-controls">
                            <button type="button" data-stencil-nudge="opacity" data-delta="-0.05">-O</button>
                            <input type="range" id="debug-stencil-opacity" min="${STENCIL_LIMITS.opacity.min}" max="${STENCIL_LIMITS.opacity.max}" step="${STENCIL_LIMITS.opacity.step}">
                            <input type="number" id="debug-stencil-opacity-number" min="${STENCIL_LIMITS.opacity.min}" max="${STENCIL_LIMITS.opacity.max}" step="${STENCIL_LIMITS.opacity.step}">
                            <button type="button" data-stencil-nudge="opacity" data-delta="0.05">+O</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="debug-section">
                <h4>State Viewer</h4>
                <div class="debug-state-viewer" id="debug-state-json"></div>
            </div>

            <div class="debug-section">
                <h4>Export Config</h4>
                <textarea id="debug-export-area" class="debug-export-area"></textarea>
                <button type="button" id="debug-copy-config">Copy Export JSON</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const header = panel.querySelector('.debug-panel-header');
    const content = document.getElementById('debug-content');
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
    const transformInputs = Object.fromEntries(LAYER_CONTROLS.map((layer) => [
        layer.targetId,
        document.getElementById(`debug-transform-input-${layer.key}`)
    ]));

    const stencil = document.createElement('img');
    stencil.className = 'debug-overlay-stencil';
    stencil.style.display = 'none';
    document.body.appendChild(stencil);

    const stencilState = {
        x: 50,
        y: 50,
        scale: 1,
        opacity: 0.5
    };

    const renderKeyValueList = (container, data) => {
        container.innerHTML = Object.entries(data).map(([key, value]) => `
            <div class="debug-kv${String(value).length > 42 ? ' debug-kv-multiline' : ''}">
                <span>${escapeHtml(key)}</span>
                <strong>${escapeHtml(value)}</strong>
            </div>
        `).join('');
    };

    const syncTransformControls = (targetId) => {
        const state = readLayerState(targetId);
        const rawInput = transformInputs[targetId];

        ['x', 'y', 'scale', 'opacity'].forEach((axis) => {
            const value = state[axis];
            const slider = panel.querySelector(`[data-transform-slider="${targetId}"][data-axis="${axis}"]`);
            const number = panel.querySelector(`[data-transform-number="${targetId}"][data-axis="${axis}"]`);

            if (slider) slider.value = String(value);
            if (number) number.value = String(Number(value.toFixed(axis === 'opacity' || axis === 'scale' ? 2 : 1)));
        });

        if (rawInput) {
            rawInput.value = formatEditableTransform(state);
        }
    };

    const syncAllTransformControls = () => {
        LAYER_CONTROLS.forEach((layer) => syncTransformControls(layer.targetId));
    };

    const applyStencilTransform = () => {
        stencil.style.opacity = String(stencilState.opacity);
        stencil.style.left = `${stencilState.x}%`;
        stencil.style.top = `${stencilState.y}%`;
        stencil.style.transform = `translate(-50%, -50%) scale(${stencilState.scale})`;
    };

    const syncStencilControls = () => {
        [
            ['x', 'debug-stencil-x-range', 'debug-stencil-x-number'],
            ['y', 'debug-stencil-y-range', 'debug-stencil-y-number'],
            ['scale', 'debug-stencil-scale', 'debug-stencil-scale-number'],
            ['opacity', 'debug-stencil-opacity', 'debug-stencil-opacity-number']
        ].forEach(([key, rangeId, numberId]) => {
            const value = stencilState[key];
            const range = document.getElementById(rangeId);
            const number = document.getElementById(numberId);
            if (range) range.value = String(value);
            if (number) number.value = String(Number(value.toFixed(key === 'x' || key === 'y' ? 1 : 2)));
        });
    };

    const renderDebugState = (state) => {
        const cleanState = { ...state };
        delete cleanState.savedMicConfigs;
        delete cleanState.initialConfig;
        stateViewer.textContent = JSON.stringify(cleanState, null, 2);

        renderKeyValueList(variantsBreakdown, getVariantSummary(state));
        renderKeyValueList(priceBreakdown, getBreakdown(state));
        renderKeyValueList(transformBreakdown, Object.fromEntries(LAYER_CONTROLS.map((layer) => {
            const layerState = readLayerState(layer.targetId);
            return [
                layer.label,
                `${formatEditableTransform(layerState)} | opacity ${layerState.opacity.toFixed(2)}`
            ];
        })));

        syncAllTransformControls();

        const activeView = getActiveLayer() || 'global-view';
        modelCodeEl.textContent = state.currentModelCode || '-';
        cameraModelEl.textContent = getAnimationPreset(state.currentModelCode, state).model;
        activeLayerEl.textContent = formatCameraView(activeView);
        totalPriceEl.textContent = `${calculateTotal(state)} RUB`;
        exportArea.value = JSON.stringify(buildExportPayload(state), null, 2);
    };

    const updateLayerAxis = (targetId, axis, rawValue) => {
        const currentState = readLayerState(targetId);
        currentState[axis] = clamp(parseFloat(rawValue || '0'), TRANSFORM_LIMITS[axis]);
        applyLayerState(targetId, currentState);
        renderDebugState(stateManager.get());
    };

    persistToggle.checked = true;
    syncStencilControls();
    applyStencilTransform();
    makePanelDraggable(panel, header);

    stateManager.subscribe((state) => {
        renderDebugState(state);
    });
    renderDebugState(stateManager.get());

    document.getElementById('debug-stencil-upload').addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            stencil.src = loadEvent.target.result;
            stencil.style.display = 'block';
            applyStencilTransform();
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('debug-collapse').addEventListener('click', () => {
        content.style.display = content.style.display === 'none' ? 'flex' : 'none';
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
            debugWarn('Clipboard copy failed', error);
        }
    });

    document.getElementById('debug-copy-preset').addEventListener('click', async () => {
        try {
            const currentState = stateManager.get();
            await navigator.clipboard.writeText(JSON.stringify(getAnimationPreset(currentState.currentModelCode, currentState), null, 2));
        } catch (error) {
            debugWarn('Clipboard copy failed', error);
        }
    });

    document.getElementById('debug-copy-config').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(exportArea.value || '');
        } catch (error) {
            debugWarn('Clipboard copy failed', error);
        }
    });

    persistToggle.addEventListener('change', (event) => {
        if (event.target.checked) {
            localStorage.setItem(DEBUG_STORAGE_KEY, '1');
            return;
        }

        localStorage.removeItem(DEBUG_STORAGE_KEY);
    });

    panel.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) {
            return;
        }

        if (button.dataset.view) {
            const currentState = stateManager.get();
            if (button.dataset.view === 'global-view') {
                initCameraEffect(currentState.currentModelCode, 'global-view');
            } else {
                switchLayer(button.dataset.view);
            }
            renderDebugState(stateManager.get());
            return;
        }

        if (button.dataset.applyTransform) {
            const targetId = button.dataset.applyTransform;
            const input = transformInputs[targetId];
            const target = document.getElementById(targetId);

            if (!input || !target) {
                return;
            }

            const currentState = readLayerState(targetId);
            target.style.transform = input.value || 'none';
            target.style.opacity = String(currentState.opacity);
            renderDebugState(stateManager.get());
            return;
        }

        if (button.dataset.resetTransform) {
            const targetId = button.dataset.resetTransform;
            applyLayerState(targetId, { x: 0, y: 0, scale: 1, opacity: 1 });
            renderDebugState(stateManager.get());
            return;
        }

        if (button.dataset.transformNudge) {
            const targetId = button.dataset.transformNudge;
            const axis = button.dataset.axis;
            const delta = parseFloat(button.dataset.delta || '0');
            const currentState = readLayerState(targetId);
            currentState[axis] = clamp(currentState[axis] + delta, TRANSFORM_LIMITS[axis]);
            applyLayerState(targetId, currentState);
            renderDebugState(stateManager.get());
            return;
        }

        if (button.dataset.stencilNudge) {
            const key = button.dataset.stencilNudge;
            const delta = parseFloat(button.dataset.delta || '0');
            stencilState[key] = clamp(stencilState[key] + delta, STENCIL_LIMITS[key]);
            syncStencilControls();
            applyStencilTransform();
        }
    });

    panel.addEventListener('input', (event) => {
        const target = event.target;

        if (target.dataset.transformSlider || target.dataset.transformNumber) {
            const targetId = target.dataset.transformSlider || target.dataset.transformNumber;
            const axis = target.dataset.axis;
            updateLayerAxis(targetId, axis, target.value);
            return;
        }

        const stencilMap = {
            'debug-stencil-x-range': 'x',
            'debug-stencil-x-number': 'x',
            'debug-stencil-y-range': 'y',
            'debug-stencil-y-number': 'y',
            'debug-stencil-scale': 'scale',
            'debug-stencil-scale-number': 'scale',
            'debug-stencil-opacity': 'opacity',
            'debug-stencil-opacity-number': 'opacity'
        };

        const stencilKey = stencilMap[target.id];
        if (stencilKey) {
            stencilState[stencilKey] = clamp(parseFloat(target.value || '0'), STENCIL_LIMITS[stencilKey]);
            syncStencilControls();
            applyStencilTransform();
        }
    });

    window.__CUSTOMIZER_DEBUG__ = {
        render: () => renderDebugState(stateManager.get()),
        getState: () => stateManager.get(),
        getPreset: () => getAnimationPreset(stateManager.get().currentModelCode, stateManager.get()),
        getExport: () => buildExportPayload(stateManager.get())
    };
    window.__ETA_DEBUG__ = window.__CUSTOMIZER_DEBUG__;
    window.__ZETA_DEBUG__ = window.__CUSTOMIZER_DEBUG__;
}
