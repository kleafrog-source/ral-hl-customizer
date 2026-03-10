import { currentState, setState } from '../state.js';
import { updateUI } from '../ui-core.js';
import { initShockmount } from './shockmount.js';

// --- CORE INITIALIZATION ---
export function initCaseAndShockmount() {
    // Shockmount инициализируется в main.js, здесь не нужно дублировать
    // initShockmount();

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
    `;

    previewArea.insertBefore(switchContainer, previewArea.firstChild);

    switchContainer.querySelectorAll('.preview-switch-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchPreview(this.dataset.preview);
        });
    });
}

export function switchPreview(previewType) {
    document.querySelectorAll('.preview-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-preview="${previewType}"]`).classList.add('active');

    document.getElementById('svg-wrapper').style.display = 'none';
    document.getElementById('case-preview-container').style.display = 'none';
    document.getElementById('shockmount-preview-container').style.display = 'none';

    switch(previewType) {
        case 'microphone':
            document.getElementById('svg-wrapper').style.display = 'flex';
            break;
        case 'case':
            document.getElementById('case-preview-container').style.display = 'flex';
            break;
        case 'shockmount':
            document.getElementById('shockmount-preview-container').style.display = 'flex';
            break;
    }
}

// Legacy functions - больше не используются
export function handleCaseVariantSelection() {
    // Устаревшая функция
}
export function uploadCaseLogo() {
    // Устаревшая функция
}
