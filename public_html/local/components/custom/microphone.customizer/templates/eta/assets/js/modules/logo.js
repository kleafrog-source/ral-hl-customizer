import { eventRegistry } from '../core/events.js';
import { stateManager } from '../core/state.js';
import { isMalfaModel } from '../config/model-capabilities.js';
import { getMicLogoGeometry } from '../config.js';
import { updateFilter } from './appearance-new.js';
import { resetCameraToGlobalView, switchLayer } from './camera-effect.js';
import { debugLog } from '../utils/debug.js';
import { showNotification } from '../utils/notifications.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/webp', 'image/x-icon'];
const ALLOWED_EXTENSIONS = ['.png', '.svg', '.jpg', '.jpeg', '.bmp', '.webp', '.ico'];
const CUSTOM_LOGO_LAYER_ID = 'custom-logo-layer';
const CUSTOM_LOGO_MOVABLE_ID = 'custom-logo-movable';
const CUSTOM_LOGO_DRAG_SURFACE_ID = 'custom-logo-drag-surface';
const CUSTOM_LOGO_IMAGE_ID = 'custom-logo-image';
const CUSTOM_LOGO_HITBOX_ID = 'custom-logo-hitbox';
const CUSTOM_LOGO_OUTLINE_ID = 'custom-logo-outline';
const CUSTOM_LOGO_RULERS_ID = 'custom-logo-rulers-group';
const CUSTOM_LOGO_FILTER_ID = 'svg-burn-charcoal';
const DEFAULT_LOGO_META = Object.freeze({ width: 300, height: 300, sourceType: 'image/png', needsBurnFilter: false });
const BODY_BOUNDS_FALLBACK = Object.freeze({ x: 22.76, y: 1035.92, width: 533.28, height: 843.36 });

let activeLogoMeta = null;
let activeLogoBounds = null;
let activeLogoTransform = null;
let activeLogoRenderUrl = '';
let pendingCommitTimer = null;
let customLogoRulerTimer = null;
let pointerDragState = null;
let touchDragState = null;
let touchPinchState = null;
let customLogoEditMode = false;
let microphoneLayerObserver = null;

const BURN_FILTERS_MARKUP = `
<filter id="svg-burn-natural">
<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0
0.33 0.33 0.33 0 0
0.33 0.33 0.33 0 0
1 1 1 0 -1.2"></feColorMatrix>
<feColorMatrix type="matrix" values="0.4 0 0 0 0.15
0 0.25 0 0 0.08
0 0 0.15 0 0.04
0 0 0 1 0"></feColorMatrix>
</filter>
<filter id="svg-burn-charcoal">
<feColorMatrix type="matrix" values="1 1 1 0 -1.6
1 1 1 0 -1.6
1 1 1 0 -1.6
0 0 0 1 0" result="base"></feColorMatrix>
<feFlood flood-color="#120a07" result="color"></feFlood>
<feComposite in="color" in2="base" operator="in"></feComposite>
</filter>
<filter id="svg-burn-lines">
<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 1 1 1 0 -1"></feColorMatrix>
<feTurbulence type="fractalNoise" baseFrequency="0 0.6" numOctaves="1" result="lines"></feTurbulence>
<feComponentTransfer in="lines" result="mask">
<feFuncR type="discrete" tableValues="0 1"></feFuncR>
</feComponentTransfer>
<feComposite in="SourceGraphic" in2="mask" operator="in"></feComposite>
<feColorMatrix type="matrix" values="0.2 0 0 0 0 0 0.1 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix>
</filter>
`;

function clamp(value, min, max) {
    if (max < min) {
        return (min + max) / 2;
    }

    return Math.min(Math.max(value, min), max);
}

function round(value, digits = 2) {
    return Number((Number(value) || 0).toFixed(digits));
}

function dataUrlToBlob(dataUrl) {
    if (typeof dataUrl !== 'string' || !dataUrl.includes(';base64,')) {
        return null;
    }

    try {
        const [header, encoded] = dataUrl.split(';base64,');
        const contentType = header.split(':')[1] || 'image/png';
        const binary = window.atob(encoded);
        const bytes = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }

        return new Blob([bytes], { type: contentType });
    } catch (error) {
        return null;
    }
}

function revokeActiveLogoRenderUrl() {
    if (activeLogoRenderUrl && activeLogoRenderUrl.startsWith('blob:')) {
        URL.revokeObjectURL(activeLogoRenderUrl);
    }

    activeLogoRenderUrl = '';
}

function updateActiveLogoRenderUrl(dataUrl) {
    revokeActiveLogoRenderUrl();

    const blob = dataUrlToBlob(dataUrl);
    activeLogoRenderUrl = blob ? URL.createObjectURL(blob) : (dataUrl || '');
    return activeLogoRenderUrl;
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result || '');
        reader.onerror = () => reject(new Error('Failed to read file as data URL'));
        reader.readAsDataURL(file);
    });
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result || '');
        reader.onerror = () => reject(new Error('Failed to read file as text'));
        reader.readAsText(file);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
    });
}

function parseSvgDimension(rawValue) {
    if (!rawValue) {
        return 0;
    }

    const numeric = Number.parseFloat(String(rawValue).replace(/[^\d.-]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
}

function parseSvgMeta(svgText) {
    try {
        const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) {
            return { ...DEFAULT_LOGO_META, sourceType: 'image/svg+xml' };
        }

        const viewBox = svg.getAttribute('viewBox')?.trim().split(/\s+/).map(Number);
        const width = parseSvgDimension(svg.getAttribute('width'));
        const height = parseSvgDimension(svg.getAttribute('height'));
        const intrinsicWidth = viewBox?.[2] || width || DEFAULT_LOGO_META.width;
        const intrinsicHeight = viewBox?.[3] || height || DEFAULT_LOGO_META.height;

        return {
            width: intrinsicWidth,
            height: intrinsicHeight,
            sourceType: 'image/svg+xml',
            needsBurnFilter: false
        };
    } catch (error) {
        return { ...DEFAULT_LOGO_META, sourceType: 'image/svg+xml' };
    }
}

async function removeWhiteBackground(sourceDataUrl) {
    const image = await loadImage(sourceDataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width || DEFAULT_LOGO_META.width;
    canvas.height = image.naturalHeight || image.height || DEFAULT_LOGO_META.height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const alpha = data[index + 3];

        if (alpha === 0) {
            continue;
        }

        const luminance = (red + green + blue) / 3;
        const spread = Math.max(Math.abs(red - green), Math.abs(green - blue), Math.abs(red - blue));

        if (luminance >= 232 && spread <= 28) {
            const fade = clamp((255 - luminance) / 23, 0, 1);
            data[index + 3] = Math.round(alpha * fade);
        }
    }

    context.putImageData(imageData, 0, 0);

    return {
        data: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height
    };
}

async function processLogoFile(file) {
    const fileName = file.name.toLowerCase();
    const isSvg = file.type === 'image/svg+xml' || fileName.endsWith('.svg');
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');

    if (isSvg) {
        const svgText = await readFileAsText(file);
        const meta = parseSvgMeta(svgText);
        return {
            data: await readFileAsDataURL(file),
            meta
        };
    }

    const sourceData = await readFileAsDataURL(file);
    if (isJpeg) {
        const processed = await removeWhiteBackground(sourceData);
        return {
            data: processed.data,
            meta: {
                width: processed.width,
                height: processed.height,
                sourceType: file.type || 'image/jpeg',
                needsBurnFilter: false
            }
        };
    }

    const image = await loadImage(sourceData);
    return {
        data: sourceData,
        meta: {
            width: image.naturalWidth || image.width || DEFAULT_LOGO_META.width,
            height: image.naturalHeight || image.height || DEFAULT_LOGO_META.height,
            sourceType: file.type || 'image/png',
            needsBurnFilter: false
        }
    };
}

function setDisplayForIds(svg, ids, display) {
    ids.forEach((id) => {
        const element = svg.querySelector(`#${id}`);
        if (element) {
            element.style.display = display;
        }
    });
}

function getMicrophoneSvg() {
    return document.getElementById('microphone-svg-container')?.querySelector('svg') || null;
}

function isMicrophoneLayerActive() {
    return document.getElementById('microphone-svg-container')?.classList.contains('active');
}

function getBodyBounds(svg) {
    const reference = svg.querySelector('#clip-body-grayscale')
        || svg.querySelector('#body-original')
        || svg.querySelector('#body-original-3')
        || svg.querySelector('#body-original-1')
        || svg.querySelector('#body-color-3')
        || svg.querySelector('#body-mono-3');

    if (!reference || typeof reference.getBBox !== 'function') {
        return { ...BODY_BOUNDS_FALLBACK };
    }

    try {
        const bbox = reference.getBBox();
        if (!bbox || !bbox.width || !bbox.height) {
            return { ...BODY_BOUNDS_FALLBACK };
        }

        return bbox;
    } catch (error) {
        return { ...BODY_BOUNDS_FALLBACK };
    }
}

function getCustomLogoBounds(svg) {
    const bodyBox = getBodyBounds(svg);
    return {
        x: round(bodyBox.x),
        y: round(bodyBox.y),
        width: round(bodyBox.width),
        height: round(bodyBox.height)
    };
}

function normalizeLogoMeta(rawMeta) {
    if (!rawMeta || !rawMeta.width || !rawMeta.height) {
        return { ...DEFAULT_LOGO_META };
    }

    return {
        width: Math.max(1, Number(rawMeta.width) || DEFAULT_LOGO_META.width),
        height: Math.max(1, Number(rawMeta.height) || DEFAULT_LOGO_META.height),
        sourceType: rawMeta.sourceType || DEFAULT_LOGO_META.sourceType,
        needsBurnFilter: false
    };
}

function getDefaultLogoTransform(bounds, meta) {
    const maxScaleX = bounds.width / meta.width;
    const maxScaleY = bounds.height / meta.height;
    const defaultWidth = bounds.width * 0.68;
    const defaultScale = Math.min(defaultWidth / meta.width, maxScaleX, maxScaleY);

    return {
        x: round(bounds.x + (bounds.width / 2)),
        y: round(bounds.y + (bounds.height * 0.34)),
        scale: round(defaultScale)
    };
}

function clampLogoTransform(transform, bounds, meta) {
    const maxScaleX = bounds.width / meta.width;
    const maxScaleY = bounds.height / meta.height;
    const maxScale = Math.max(0.05, Math.min(maxScaleX, maxScaleY));
    const minScale = Math.max(0.05, Math.min(maxScale, (bounds.width * 0.18) / meta.width));
    const scale = clamp(Number(transform?.scale) || minScale, minScale, maxScale);
    const renderHeight = meta.height * scale;
    const x = round(bounds.x + (bounds.width / 2));
    const y = clamp(
        Number(transform?.y) || (bounds.y + (bounds.height / 2)),
        bounds.y + (renderHeight / 2),
        bounds.y + bounds.height - (renderHeight / 2)
    );

    return {
        x: round(x),
        y: round(y),
        scale: round(scale, 4)
    };
}

function buildMiclogoState(metrics) {
    const mm = metrics?.mm || {};
    return `\u0421\u0432\u043e\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u044d\u043c\u0431\u043b\u0435\u043c\u044b \u043b\u043e\u0433\u043e\u0442\u0438\u043f\u0430 \u043c\u0438\u043a\u0440\u043e\u0444\u043e\u043d\u0430. \u0428\u0438\u0440\u0438\u043d\u0430 \u0432 \u043c\u043c: ${mm.width ?? 0}, \u0432\u044b\u0441\u043e\u0442\u0430 \u0432 \u043c\u043c: ${mm.height ?? 0}; \u043e\u0442\u0441\u0442\u0443\u043f \u0441\u0432\u0435\u0440\u0445\u0443 \u0432 \u043c\u043c: ${mm.top ?? 0}`;
}

function getPositioningHintText(hint, state) {
    if (!hint) {
        return '';
    }

    if (state === 'active') {
        return hint.dataset.activeText || '\u041f\u0435\u0440\u0435\u0442\u0430\u0441\u043a\u0438\u0432\u0430\u0439\u0442\u0435 \u043b\u043e\u0433\u043e\u0442\u0438\u043f \u0432 \u043f\u0440\u0435\u0432\u044c\u044e. \u041a\u043e\u043b\u0435\u0441\u043e \u043c\u044b\u0448\u0438 \u0438\u043b\u0438 \u0449\u0438\u043f\u043e\u043a \u043c\u0435\u043d\u044f\u044e\u0442 \u043c\u0430\u0441\u0448\u0442\u0430\u0431.';
    }

    return hint.dataset.idleText || '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u0430\u0439\u043b, \u0447\u0442\u043e\u0431\u044b \u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043f\u043e\u0437\u0438\u0446\u0438\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0432 \u043f\u0440\u0435\u0432\u044c\u044e.';
}

function buildLogoMetrics(transform, bounds, meta) {
    const width = round(meta.width * transform.scale);
    const height = round(meta.height * transform.scale);
    const topPx = (transform.y - (height / 2)) - bounds.y;
    const leftPx = (transform.x - (width / 2)) - bounds.x;
    const geometry = getMicLogoGeometry(stateManager.get('currentModelCode'));
    const widthMm = round((width / bounds.width) * geometry.diameterMm, 1);
    const heightMm = round((height / bounds.height) * geometry.heightMm, 1);
    const topMm = round((topPx / bounds.height) * geometry.heightMm, 1);
    const leftMm = round((leftPx / bounds.width) * geometry.diameterMm, 1);

    return {
        width,
        height,
        bodyWidthPercent: round((width / bounds.width) * 100),
        offset: {
            x: round(transform.x - (bounds.x + (bounds.width / 2))),
            y: round(transform.y - bounds.y)
        },
        mm: {
            width: widthMm,
            height: heightMm,
            top: topMm,
            left: leftMm
        },
        cylinder: geometry
    };
}

function ensureSvgDefs(svg) {
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(SVG_NS, 'defs');
        svg.insertBefore(defs, svg.firstChild);
    }

    if (!defs.querySelector(`#${CUSTOM_LOGO_FILTER_ID}`)) {
        const parsed = new DOMParser().parseFromString(
            `<svg xmlns="${SVG_NS}"><defs>${BURN_FILTERS_MARKUP}</defs></svg>`,
            'image/svg+xml'
        );
        Array.from(parsed.querySelector('defs')?.children || []).forEach((node) => {
            defs.appendChild(svg.ownerDocument.importNode(node, true));
        });
    }

}

function isCustomLogoEditMode() {
    return !!stateManager.get('logo.useCustom') && customLogoEditMode;
}

function syncCustomLogoOutlineVisibility() {
    const outline = getMicrophoneSvg()?.querySelector(`#${CUSTOM_LOGO_OUTLINE_ID}`);
    if (!outline) {
        return;
    }

    const opacity = isCustomLogoEditMode() ? '1' : '0';
    outline.setAttribute('opacity', opacity);
    outline.style.opacity = opacity;
}

function ensureMicrophoneLayerObserver() {
    if (microphoneLayerObserver) {
        return;
    }

    const microphoneLayer = document.getElementById('microphone-svg-container');
    if (!microphoneLayer || typeof MutationObserver === 'undefined') {
        return;
    }

    microphoneLayerObserver = new MutationObserver(() => {
        if (!isMicrophoneLayerActive()) {
            hideCustomLogoRulers();
        }
    });

    microphoneLayerObserver.observe(microphoneLayer, {
        attributes: true,
        attributeFilter: ['class']
    });
}

export function activateCustomLogoEditing() {
    customLogoEditMode = !!stateManager.get('logo.useCustom');
    if (customLogoEditMode) {
        switchLayer('logo');
    }
    syncCustomModeSections(!!stateManager.get('logo.useCustom'));
    syncCustomLogoUi();
}

export function finishCustomLogoEditing() {
    persistActiveTransform();
    customLogoEditMode = false;
    hideCustomLogoRulers();
    resetCameraToGlobalView();
    syncCustomModeSections(true);
    syncCustomLogoUi();
}

function syncCustomLogoAuxiliaryUi(enabled, expanded) {
    const description = document.getElementById('custom-logo-description');
    const editButton = document.getElementById('custom-logo-edit');
    const uploadArea = document.getElementById('custom-logo-upload-area');
    const hasCustomLogoData = !!stateManager.get('logo.customLogoData');

    if (uploadArea) {
        uploadArea.dataset.collapsed = enabled && !expanded ? '1' : '0';
    }

    if (description) {
        description.style.display = (!enabled || expanded || !hasCustomLogoData) ? '' : 'none';
    }

    if (editButton) {
        editButton.style.display = enabled && hasCustomLogoData && !expanded ? 'inline-flex' : 'none';
    }
}

function updatePositioningUi(metrics = null) {
    ensurePositioningControls();
    ensureExtendedPositioningControls();
    ensureCustomLogoManualInputs();

    const controls = document.getElementById('custom-logo-positioning-controls');
    const widthInput = document.getElementById('custom-logo-input-width-mm');
    const heightInput = document.getElementById('custom-logo-input-height-mm');
    const topInput = document.getElementById('custom-logo-input-top-mm');
    const hint = document.getElementById('custom-logo-positioning-hint');
    const removeButton = document.getElementById('custom-logo-remove');
    const doneButton = document.getElementById('custom-logo-done');
    const actionRow = document.getElementById('custom-logo-actions');
    const hasCustomLogo = !!activeLogoMeta;

    if (controls) {
        controls.style.display = hasCustomLogo ? 'block' : 'none';
    }

    if (removeButton) {
        removeButton.style.display = hasCustomLogo ? '' : 'none';
    }

    if (doneButton) {
        doneButton.style.display = hasCustomLogo ? '' : 'none';
    }

    if (actionRow) {
        actionRow.style.display = hasCustomLogo ? 'flex' : 'none';
    }

    if (hint) {
        hint.textContent = getPositioningHintText(hint, hasCustomLogo ? 'active' : 'idle');
    }

    if (widthInput && document.activeElement !== widthInput) {
        widthInput.value = metrics?.mm ? `${Math.round(metrics.mm.width)}` : '0';
    }

    if (heightInput && document.activeElement !== heightInput) {
        heightInput.value = metrics?.mm ? `${Math.round(metrics.mm.height)}` : '0';
    }

    if (topInput && document.activeElement !== topInput) {
        topInput.value = metrics?.mm ? `${Math.round(metrics.mm.top)}` : '0';
    }
}

function getCustomLayer(svg) {
    return svg.querySelector(`#${CUSTOM_LOGO_LAYER_ID}`);
}

function getCustomLogoInsertAnchor(svg) {
    return svg?.querySelector('#logotype-gold')
        || svg?.querySelector('#logo-letters-and-frame')
        || svg?.querySelector('#malfa-logo')
        || null;
}

function ensurePositioningControls() {
    return document.getElementById('custom-logo-positioning-controls');
}

function ensureExtendedPositioningControls() {
    const removeButton = document.getElementById('custom-logo-remove');
    const doneButton = document.getElementById('custom-logo-done');
    const actionRow = document.getElementById('custom-logo-actions');

    if (removeButton) {
        removeButton.classList.add('positioning-action-button', 'positioning-action-button-danger');
    }

    if (doneButton) {
        doneButton.classList.add('positioning-action-button', 'positioning-action-button-success');
    }

    if (actionRow) {
        actionRow.classList.add('positioning-actions');
    }
}

function stepNumberInput(input, delta) {
    if (!input) {
        return;
    }

    const currentValue = Number.parseFloat(input.value || '0') || 0;
    input.value = String(Math.max(0, currentValue + delta));
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

function applyCustomLogoMetricInput(metric) {
    if (!activeLogoTransform || !activeLogoMeta || !activeLogoBounds) {
        return;
    }

    const geometry = getMicLogoGeometry(stateManager.get('currentModelCode'));
    const widthInput = document.getElementById('custom-logo-input-width-mm');
    const heightInput = document.getElementById('custom-logo-input-height-mm');
    const topInput = document.getElementById('custom-logo-input-top-mm');

    if (metric === 'width' && widthInput) {
        const targetWidthPx = (Math.max(0, Number.parseFloat(widthInput.value) || 0) / geometry.diameterMm) * activeLogoBounds.width;
        activeLogoTransform = {
            ...activeLogoTransform,
            scale: targetWidthPx / activeLogoMeta.width
        };
    }

    if (metric === 'height' && heightInput) {
        const targetHeightPx = (Math.max(0, Number.parseFloat(heightInput.value) || 0) / geometry.heightMm) * activeLogoBounds.height;
        activeLogoTransform = {
            ...activeLogoTransform,
            scale: targetHeightPx / activeLogoMeta.height
        };
    }

    if (metric === 'top' && topInput) {
        const currentScale = activeLogoTransform.scale;
        const renderHeight = activeLogoMeta.height * currentScale;
        const targetTopPx = (Math.max(0, Number.parseFloat(topInput.value) || 0) / geometry.heightMm) * activeLogoBounds.height;
        activeLogoTransform = {
            ...activeLogoTransform,
            y: activeLogoBounds.y + targetTopPx + (renderHeight / 2)
        };
    }

    applyActiveTransform();
    showCustomLogoRulers();
    scheduleTransformPersist();
}

function ensureCustomLogoManualInputs() {
    const manualInputs = document.getElementById('custom-logo-manual-inputs');
    if (!manualInputs || manualInputs.dataset.ready === '1') {
        return;
    }

    manualInputs.dataset.ready = '1';

    manualInputs.querySelectorAll('input[type="number"]').forEach((input) => {
        const metric = input.dataset.metric;
        if (!metric) {
            return;
        }

        input.addEventListener('input', () => applyCustomLogoMetricInput(metric));
    });

    manualInputs.querySelectorAll('[data-step-target]').forEach((button) => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.stepTarget || '');
            stepNumberInput(input, Number(button.dataset.stepDelta || '0'));
        });
    });
}

function updateCustomLogoRulers(transform, bounds, meta) {
    const svg = getMicrophoneSvg();
    const rulersGroup = svg?.querySelector(`#${CUSTOM_LOGO_RULERS_ID}`);
    if (!svg || !rulersGroup || !transform || !bounds || !meta) {
        return;
    }

    if (!isCustomLogoEditMode() || !isMicrophoneLayerActive()) {
        hideCustomLogoRulers();
        return;
    }

    const metrics = buildLogoMetrics(transform, bounds, meta);
    const width = meta.width * transform.scale;
    const height = meta.height * transform.scale;
    const left = transform.x - (width / 2);
    const right = transform.x + (width / 2);
    const top = transform.y - (height / 2);
    const bottom = transform.y + (height / 2);
    const widthY = top - 22;
    const heightX = left - 18;
    const topX = right + 18;

    rulersGroup.style.pointerEvents = 'none';
    rulersGroup.style.transition = 'opacity 0.2s ease';
    rulersGroup.innerHTML = `
        <line class="ruler-line" x1="${left}" y1="${widthY}" x2="${right}" y2="${widthY}" />
        <line class="ruler-tick" x1="${left}" y1="${top}" x2="${left}" y2="${widthY}" />
        <line class="ruler-tick" x1="${right}" y1="${top}" x2="${right}" y2="${widthY}" />
        <text class="r-text" x="${(left + right) / 2}" y="${widthY - 6}" text-anchor="middle">${metrics.mm.width} mm</text>

        <line class="ruler-line" x1="${heightX}" y1="${top}" x2="${heightX}" y2="${bottom}" />
        <line class="ruler-tick" x1="${left}" y1="${top}" x2="${heightX}" y2="${top}" />
        <line class="ruler-tick" x1="${left}" y1="${bottom}" x2="${heightX}" y2="${bottom}" />
        <text class="r-text" x="${heightX - 8}" y="${(top + bottom) / 2}" text-anchor="end" dominant-baseline="middle">${metrics.mm.height} mm</text>

        <line class="ruler-line" x1="${topX}" y1="${bounds.y}" x2="${topX}" y2="${top}" />
        <line class="ruler-tick" x1="${right}" y1="${bounds.y}" x2="${topX}" y2="${bounds.y}" />
        <line class="ruler-tick" x1="${right}" y1="${top}" x2="${topX}" y2="${top}" />
        <text class="r-text" x="${topX + 8}" y="${(bounds.y + top) / 2}" text-anchor="start" dominant-baseline="middle">${metrics.mm.top} mm</text>
    `;
}

function hideCustomLogoRulers() {
    clearTimeout(customLogoRulerTimer);
    customLogoRulerTimer = null;

    const rulersGroup = getMicrophoneSvg()?.querySelector(`#${CUSTOM_LOGO_RULERS_ID}`);
    if (rulersGroup) {
        rulersGroup.style.opacity = '0';
    }
}

function showCustomLogoRulers() {
    if (!isCustomLogoEditMode() || !isMicrophoneLayerActive()) {
        hideCustomLogoRulers();
        return;
    }

    const rulersGroup = getMicrophoneSvg()?.querySelector(`#${CUSTOM_LOGO_RULERS_ID}`);
    if (rulersGroup) {
        rulersGroup.style.opacity = '1';
        clearTimeout(customLogoRulerTimer);
        customLogoRulerTimer = window.setTimeout(() => {
            rulersGroup.style.opacity = '0';
        }, 3000);
    }
}

function getSvgClientPoint(svg, clientX, clientY) {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svg.getScreenCTM();

    if (!matrix) {
        return { x: clientX, y: clientY };
    }

    return point.matrixTransform(matrix.inverse());
}

function getSvgDeltaFromClientDelta(svg, dx, dy) {
    const matrix = svg?.getScreenCTM();
    if (!matrix) {
        return { x: dx, y: dy };
    }

    return {
        x: dx / (matrix.a || 1),
        y: dy / (matrix.d || 1)
    };
}

function applyActiveTransform() {
    const svg = getMicrophoneSvg();
    const movable = svg?.querySelector(`#${CUSTOM_LOGO_MOVABLE_ID}`);
    const outline = svg?.querySelector(`#${CUSTOM_LOGO_OUTLINE_ID}`);
    if (!movable || !activeLogoTransform || !activeLogoMeta || !activeLogoBounds) {
        return;
    }

    const clamped = clampLogoTransform(activeLogoTransform, activeLogoBounds, activeLogoMeta);
    activeLogoTransform = clamped;

    movable.setAttribute(
        'transform',
        `matrix(${clamped.scale} 0 0 ${clamped.scale} ${clamped.x} ${clamped.y})`
    );

    if (outline) {
        outline.style.opacity = isCustomLogoEditMode() ? '1' : '0';
    }

    if (!isCustomLogoEditMode() || !isMicrophoneLayerActive()) {
        hideCustomLogoRulers();
        return;
    }

    const metrics = buildLogoMetrics(clamped, activeLogoBounds, activeLogoMeta);
    updatePositioningUi(metrics);
    updateCustomLogoRulers(clamped, activeLogoBounds, activeLogoMeta);
}

function persistActiveTransform() {
    if (!activeLogoTransform || !activeLogoMeta || !activeLogoBounds || !stateManager.get('logo.customLogoData')) {
        return;
    }

    const clamped = clampLogoTransform(activeLogoTransform, activeLogoBounds, activeLogoMeta);
    const metrics = buildLogoMetrics(clamped, activeLogoBounds, activeLogoMeta);

    stateManager.batch((batch) => {
        batch('logo.customLogoTransform', clamped);
        batch('logo.customLogoMetrics', metrics);
        batch('miclogoState', buildMiclogoState(metrics));
    });
}

function scheduleTransformPersist(delay = 140) {
    clearTimeout(pendingCommitTimer);
    pendingCommitTimer = window.setTimeout(() => {
        persistActiveTransform();
    }, delay);
}

function isLogoTarget(target) {
    return !!target?.closest?.(`#${CUSTOM_LOGO_LAYER_ID}`);
}

function clearInteractionState() {
    pointerDragState = null;
    touchDragState = null;
    touchPinchState = null;
}

function destroyCustomLogoInteractions(layer) {
    if (!layer) {
        return;
    }

    if (layer.__customLogoWheelHandler) {
        layer.removeEventListener('wheel', layer.__customLogoWheelHandler);
        delete layer.__customLogoWheelHandler;
    }

    if (layer.__customLogoRulerHoverHandler) {
        layer.removeEventListener('mouseover', layer.__customLogoRulerHoverHandler);
        delete layer.__customLogoRulerHoverHandler;
    }

    if (layer.__customLogoRulerClickHandler) {
        layer.removeEventListener('click', layer.__customLogoRulerClickHandler);
        delete layer.__customLogoRulerClickHandler;
    }

    if (typeof window.interact === 'function') {
        window.interact(layer).unset();
    }

    delete layer.dataset.customLogoInteractionsReady;
}

function setupCustomLogoInteractions(layer) {
    if (!layer || layer.dataset.customLogoInteractionsReady === '1') {
        return;
    }

    const interact = window.interact;
    if (typeof interact !== 'function') {
        return;
    }

    const svg = getMicrophoneSvg();
    if (!svg) {
        return;
    }

    layer.dataset.customLogoInteractionsReady = '1';

    const rulerHoverHandler = () => showCustomLogoRulers();
    const rulerClickHandler = () => showCustomLogoRulers();
    layer.__customLogoRulerHoverHandler = rulerHoverHandler;
    layer.__customLogoRulerClickHandler = rulerClickHandler;
    layer.addEventListener('mouseover', rulerHoverHandler);
    layer.addEventListener('click', rulerClickHandler);

    interact(layer)
        .gesturable({
            listeners: {
                move: (event) => {
                    if (!isCustomLogoEditMode() || !activeLogoTransform) {
                        return;
                    }

                    activeLogoTransform = {
                        ...activeLogoTransform,
                        scale: activeLogoTransform.scale * (1 + event.ds)
                    };

                    applyActiveTransform();
                    showCustomLogoRulers();
                },
                end: () => {
                    persistActiveTransform();
                    showCustomLogoRulers();
                }
            }
        })
        .draggable({
            listeners: {
                move: (event) => {
                    if (!isCustomLogoEditMode() || !activeLogoTransform) {
                        return;
                    }

                    const delta = getSvgDeltaFromClientDelta(svg, event.dx, event.dy);
                    activeLogoTransform = {
                        ...activeLogoTransform,
                        y: activeLogoTransform.y + delta.y
                    };

                    applyActiveTransform();
                    showCustomLogoRulers();
                },
                end: () => {
                    persistActiveTransform();
                    showCustomLogoRulers();
                }
            }
        });

    const wheelHandler = (event) => {
        if (!isCustomLogoEditMode() || !activeLogoTransform) {
            return;
        }

        event.preventDefault();
        activeLogoTransform = {
            ...activeLogoTransform,
            scale: activeLogoTransform.scale * (event.deltaY > 0 ? 0.95 : 1.05)
        };

        applyActiveTransform();
        showCustomLogoRulers();
        scheduleTransformPersist();
    };

    layer.__customLogoWheelHandler = wheelHandler;
    layer.addEventListener('wheel', wheelHandler, { passive: false });
}

function buildBodyDragSurface(svg) {
    const clipBodyPath = svg?.querySelector('#clip-body-grayscale');
    const pathData = clipBodyPath?.getAttribute('d');
    if (!pathData) {
        return null;
    }

    const dragSurface = document.createElementNS(SVG_NS, 'path');
    dragSurface.id = CUSTOM_LOGO_DRAG_SURFACE_ID;
    dragSurface.setAttribute('d', pathData);
    dragSurface.setAttribute('fill', '#ffffff');
    dragSurface.setAttribute('opacity', '0.001');
    dragSurface.setAttribute('style', 'cursor:ns-resize; pointer-events:all; touch-action:none;');

    return dragSurface;
}

function buildCustomLogoLayer(svg, imageSource, meta) {
    const layer = document.createElementNS(SVG_NS, 'g');
    layer.id = CUSTOM_LOGO_LAYER_ID;
    layer.setAttribute('style', 'pointer-events:all; touch-action:none;');
    layer.setAttribute('clip-path', 'url(#clip-path-2)');

    const dragSurface = buildBodyDragSurface(svg);
    if (dragSurface) {
        layer.appendChild(dragSurface);
    }

    const movable = document.createElementNS(SVG_NS, 'g');
    movable.id = CUSTOM_LOGO_MOVABLE_ID;
    movable.setAttribute('style', 'pointer-events:all; touch-action:none;');

    const rulers = document.createElementNS(SVG_NS, 'g');
    rulers.id = CUSTOM_LOGO_RULERS_ID;
    rulers.setAttribute('style', 'pointer-events:none; opacity:0; transition:opacity 0.2s ease;');

    const image = document.createElementNS(SVG_NS, 'image');
    image.id = CUSTOM_LOGO_IMAGE_ID;
    image.setAttribute('x', String(-(meta.width / 2)));
    image.setAttribute('y', String(-(meta.height / 2)));
    image.setAttribute('width', String(meta.width));
    image.setAttribute('height', String(meta.height));
    image.setAttribute('href', imageSource);
    image.setAttributeNS(XLINK_NS, 'xlink:href', imageSource);
    image.setAttribute('style', 'overflow:visible; pointer-events:none;');
    if (image.href && typeof image.href.baseVal === 'string') {
        image.href.baseVal = imageSource;
    }
    image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    image.setAttribute('pointer-events', 'none');

    if (meta.needsBurnFilter) {
        image.setAttribute('filter', `url(#${CUSTOM_LOGO_FILTER_ID})`);
        image.setAttribute('style', 'mix-blend-mode:multiply; opacity:0.9; transform-origin:center center; pointer-events:none;');
    }

    const hitbox = document.createElementNS(SVG_NS, 'rect');
    hitbox.id = CUSTOM_LOGO_HITBOX_ID;
    hitbox.setAttribute('x', String(-(meta.width / 2)));
    hitbox.setAttribute('y', String(-(meta.height / 2)));
    hitbox.setAttribute('width', String(meta.width));
    hitbox.setAttribute('height', String(meta.height));
    hitbox.setAttribute('fill', '#ffffff');
    hitbox.setAttribute('opacity', '0.001');
    hitbox.setAttribute('style', 'cursor:ns-resize; pointer-events:all; touch-action:none;');

    const outline = document.createElementNS(SVG_NS, 'rect');
    outline.id = CUSTOM_LOGO_OUTLINE_ID;
    outline.setAttribute('x', String(-(meta.width / 2)));
    outline.setAttribute('y', String(-(meta.height / 2)));
    outline.setAttribute('width', String(meta.width));
    outline.setAttribute('height', String(meta.height));
    outline.setAttribute('rx', '8');
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke', '#0f172a');
    outline.setAttribute('stroke-width', '3');
    outline.setAttribute('stroke-dasharray', '12 8');
    outline.setAttribute('opacity', isCustomLogoEditMode() ? '1' : '0');
    outline.setAttribute('pointer-events', 'none');

    movable.appendChild(image);
    movable.appendChild(hitbox);
    movable.appendChild(outline);
    layer.appendChild(movable);
    layer.appendChild(rulers);

    return layer;
}

function syncCustomLogoUi() {
    syncCustomLogoOutlineVisibility();
    updatePositioningUi(stateManager.get('logo.customLogoMetrics'));
}

function syncLogoToggleCheckbox() {
    const toggle = document.getElementById('logo-mode-toggle');
    if (toggle) {
        toggle.checked = !!stateManager.get('logo.useCustom');
    }
}

function syncCustomModeSections(enabled) {
    const logoSection = document.querySelector('[data-section="logo"]');
    const logobgSection = document.querySelector('[data-section="logobg"]');
    const uploadArea = document.getElementById('custom-logo-upload-area');
    const expanded = enabled && (customLogoEditMode || !stateManager.get('logo.customLogoData'));

    if (logoSection) {
        logoSection.classList.toggle('disabled', enabled);
    }

    if (logobgSection) {
        logobgSection.classList.toggle('disabled', enabled);
    }

    if (uploadArea) {
        uploadArea.style.display = expanded ? 'block' : 'none';
    }

    syncCustomLogoAuxiliaryUi(enabled, expanded);
}

// Utility functions for MALFA detection using Bitrix data
export function isMalfaMic(state = null) {
    return isMalfaModel(state || stateManager.get());
}

export function isMalfaLogo(state = null) {
    const currentState = state || stateManager.get();
    const logoVariant = currentState.logo?.variant;
    return logoVariant === 'malfasilver' || logoVariant === 'malfagold';
}

function bindLogoUploadArea(uploadArea) {
    if (!uploadArea) {
        return;
    }

    uploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (event) => {
        event.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleLogoFileUpload(file);
        }
    });
}

export function init() {
    ensurePositioningControls();
    ensureExtendedPositioningControls();
    ensureMicrophoneLayerObserver();

    const input = document.getElementById('logo-file-input');
    if (input) {
        input.addEventListener('change', async (event) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            await handleLogoFileUpload(file);
            input.value = '';
        });
    }

    bindLogoUploadArea(document.querySelector('#custom-logo-upload .upload-area'));

    const removeButton = document.getElementById('custom-logo-remove');
    if (removeButton) {
        eventRegistry.add(removeButton, 'click', clearCustomLogo);
    }

    const doneButton = document.getElementById('custom-logo-done');
    if (doneButton) {
        eventRegistry.add(doneButton, 'click', finishCustomLogoEditing);
    }

    const editButton = document.getElementById('custom-logo-edit');
    if (editButton) {
        eventRegistry.add(editButton, 'click', activateCustomLogoEditing);
    }

    syncCustomModeSections(!!stateManager.get('logo.useCustom'));
    syncCustomLogoUi();
    updateLogoItemsLockState();
}

async function handleLogoFileUpload(file) {
    if (file.size > MAX_FILE_SIZE) {
        showNotification('Файл слишком большой. Максимальный размер: 3 МБ', 'error');
        return;
    }

    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
    const hasValidType = ALLOWED_TYPES.includes(file.type);

    if (!hasValidExtension && !hasValidType) {
        showNotification('Неподдерживаемый формат файла. Допустимые: PNG, SVG, JPG, JPEG, BMP, WEBP, ICO', 'error');
        return;
    }

    try {
        const processed = await processLogoFile(file);
        updateActiveLogoRenderUrl(processed.data);

        stateManager.batch((batch) => {
            batch('logo.useCustom', true);
            batch('logo.customLogoData', processed.data);
            batch('logo.customLogoMeta', processed.meta);
            batch('logo.customLogoTransform', null);
            batch('logo.customLogoMetrics', null);
            batch('miclogoState', null);
        });

        syncLogoToggleCheckbox();
        syncCustomModeSections(true);
        updateLogoItemsLockState();
        activateCustomLogoEditing();
        updateLogoSVG();
        requestAnimationFrame(() => persistActiveTransform());

        showNotification(
            processed.meta.needsBurnFilter
                ? 'Логотип загружен. Белый фон JPG/JPEG убран автоматически.'
                : 'Логотип успешно загружен',
            'success'
        );
    } catch (error) {
        showNotification('Не удалось обработать изображение логотипа', 'error');
    }
}

export function updateLogoSVG() {
    const svg = getMicrophoneSvg();
    if (!svg) {
        return;
    }

    const currentLayer = getCustomLayer(svg);
    if (currentLayer) {
        destroyCustomLogoInteractions(currentLayer);
        currentLayer.remove();
    }

    const state = stateManager.get();
    const malfaLogo = svg.querySelector('#malfa-logo');
    const malfaLogoTextPath = svg.querySelector('#malfa-logo-text-path');
    const clipLogoBgMalfa = svg.querySelector('#clip-logobg-malfa');

    if (state.logo.useCustom) {
        setDisplayForIds(
            svg,
            ['logotype-gold', 'logobg-black', 'logobg-colorized', 'logobg-monochrome', 'logo-letters-and-frame', 'malfa-logo'],
            'none'
        );

        if (!state.logo.customLogoData) {
            activeLogoMeta = null;
            activeLogoBounds = null;
            activeLogoTransform = null;
            clearInteractionState();
            syncCustomLogoUi();

            const overlay = document.getElementById('logo-overlay');
            if (overlay) {
                overlay.innerHTML = '<div class="logo-overlay-text">Р—Р°РіСЂСѓР·РёС‚Рµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ РґР»СЏ Р»РѕРіРѕС‚РёРїР°</div>';
                overlay.style.display = 'block';
            }

            return;
        }

        const imageSource = activeLogoRenderUrl || updateActiveLogoRenderUrl(state.logo.customLogoData);

        activeLogoMeta = normalizeLogoMeta(state.logo.customLogoMeta);
        activeLogoBounds = getCustomLogoBounds(svg);
        activeLogoTransform = clampLogoTransform(
            state.logo.customLogoTransform || getDefaultLogoTransform(activeLogoBounds, activeLogoMeta),
            activeLogoBounds,
            activeLogoMeta
        );

        const customLayer = buildCustomLogoLayer(svg, imageSource, activeLogoMeta);
        const insertAnchor = getCustomLogoInsertAnchor(svg);
        if (insertAnchor) {
            svg.insertBefore(customLayer, insertAnchor);
        } else {
            svg.appendChild(customLayer);
        }
        setupCustomLogoInteractions(customLayer);
        applyActiveTransform();
        debugLog('[Logo] Custom logo rendered');
        return;
    }

    activeLogoMeta = null;
    activeLogoBounds = null;
    activeLogoTransform = null;
    clearInteractionState();
    syncCustomLogoUi();

    if (state.logo.useCustom && !state.logo.customLogoData) {
        const overlay = document.getElementById('logo-overlay');
        if (overlay) {
            overlay.innerHTML = '<div class="logo-overlay-text">Загрузите изображение для логотипа</div>';
            overlay.style.display = 'block';
        }
    }

    const malfaMic = isMalfaMic(state);
    const malfaLogoSelected = isMalfaLogo(state);

    if (!malfaMic || !malfaLogoSelected) {
        if (malfaLogo) {
            malfaLogo.style.display = 'none';
        }

        setDisplayForIds(
            svg,
            ['logotype-gold', 'logobg-black', 'logobg-colorized', 'logobg-monochrome', 'logo-letters-and-frame'],
            'inline'
        );

        const letters = svg.querySelector('#logo-letters-and-frame');
        if (letters) {
            letters.style.filter = (state.logo.variant === 'standard-silver') ? 'grayscale(1) brightness(1.5)' : 'none';
        }

        const bgBlack = svg.querySelector('#logobg-black');
        const bgColor = svg.querySelector('#logobg-colorized');
        const bgMono = svg.querySelector('#logobg-monochrome');

        if (state.logo.bgColor === 'black') {
            if (bgBlack) bgBlack.style.display = 'inline';
            if (bgColor) bgColor.style.display = 'none';
            if (bgMono) bgMono.style.display = 'none';
        } else {
            if (bgBlack) bgBlack.style.display = 'none';
            if (bgColor) bgColor.style.display = 'inline';
            if (bgMono) bgMono.style.display = 'inline';
            updateFilter('feFlood4', 'logobg', state.logo.bgColorValue);
        }

        const overlay = svg.querySelector('#logo-overlay');
        if (overlay) {
            overlay.style.display = state.logo.useCustom ? 'inline' : 'none';
        }

        return;
    }

    setDisplayForIds(
        svg,
        ['logotype-gold', 'logobg-black', 'logobg-colorized', 'logobg-monochrome', 'logo-letters-and-frame'],
        'none'
    );

    if (malfaLogo) {
        malfaLogo.style.display = 'inline';
    }

    if (malfaLogoTextPath && clipLogoBgMalfa) {
        const isGold = state.logo.variant === 'malfagold';
        malfaLogoTextPath.style.fill = isGold ? 'url(#grad-malfa-gold)' : 'url(#grad-malfa-silver)';

        const bgColor = state.logobg?.colorValue || state.logo?.bgColorValue;
        clipLogoBgMalfa.style.fill = bgColor || '#770033';
    }
}

export function updateLogoItemsLockState() {
    // Locking is handled by section-level disabled state in the UI.
}

export function clearCustomLogo() {
    clearTimeout(pendingCommitTimer);
    pendingCommitTimer = null;
    clearInteractionState();
    customLogoEditMode = false;
    activeLogoMeta = null;
    activeLogoBounds = null;
    activeLogoTransform = null;
    revokeActiveLogoRenderUrl();

    stateManager.batch((batch) => {
        batch('logo.useCustom', false);
        batch('logo.customLogoData', null);
        batch('logo.customLogoMeta', null);
        batch('logo.customLogoTransform', null);
        batch('logo.customLogoMetrics', null);
        batch('miclogoState', null);
    });

    syncLogoToggleCheckbox();
    syncCustomModeSections(false);
    hideCustomLogoRulers();
    resetCameraToGlobalView();

    const input = document.getElementById('logo-file-input');
    if (input) {
        input.value = '';
    }

    const overlay = document.getElementById('logo-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }

    updateLogoItemsLockState();
    updateLogoSVG();
    debugLog('[Logo] Custom logo cleared');
}

// РЈРїСЂР°РІР»РµРЅРёРµ РІРёРґРёРјРѕСЃС‚СЊСЋ MALFA РІР°СЂРёР°РЅС‚РѕРІ Р»РѕРіРѕС‚РёРїР°.
export function updateMalfaLogoOptionsVisibility() {
    const isMalfa = isMalfaMic();
    document.querySelectorAll('.malfa-logo-options').forEach((group) => {
        group.style.display = isMalfa ? '' : 'none';
    });
}

