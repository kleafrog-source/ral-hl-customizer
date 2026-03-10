import { stateManager } from '../core/state.js';
import { eventRegistry } from '../core/events.js';
import { switchLayer } from './camera-effect.js';

// --- CORE INITIALIZATION ---
export function initCaseAndShockmount() {
    // Unified Preview Switching
    initPreviewSwitching();
}

// --- PREVIEW SWITCHING LOGIC ---

export function initPreviewSwitching() {
    const previewArea = document.querySelector('.preview-area');
    const switchContainer = document.createElement('div');
    switchContainer.className = 'preview-switch-container';
    switchContainer.innerHTML = `
        <button class="preview-switch-btn active" data-preview="microphone">Микрофон</button>
        <button class="preview-switch-btn" data-preview="case">Деревянный футляр</button>
        <button class="preview-switch-btn" data-preview="shockmount" id="shockmount-preview-btn">Подвес</button>
         <button class="preview-switch-btn" data-preview="global-view" id="global-view-preview-btn">Общий вид</button>
    `;

    previewArea.insertBefore(switchContainer, previewArea.firstChild);

    switchContainer.querySelectorAll('.preview-switch-btn').forEach(btn => {
        eventRegistry.add(btn, 'click', function() {
            switchPreview(this.dataset.preview);
        });
    });
}

export function switchPreview(previewType) {
    // Update active class on buttons
    document.querySelectorAll('.preview-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetButton = document.querySelector(`[data-preview="${previewType}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    // Call cameraEffect to switch layers
    switchLayer(previewType);
}

// Legacy functions - not used
export function handleCaseVariantSelection() {}
export function uploadCaseLogo() {}
