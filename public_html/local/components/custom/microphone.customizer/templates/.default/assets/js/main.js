import { initEventListeners, selectModelVariant, updateUI } from './ui-core.js';
import { initHLDataManager } from './modules/hl-data-manager.js';
import { initShockmount } from './modules/shockmount-new.js';
import { loadSVG, updateSVG } from './engine.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { init as initLogo } from './modules/logo.js';
import { initCameraEffect } from './modules/camera-effect.js';
import { stateManager } from './core/state.js';
import { initDebugHelper } from './debug/ui-debug-helper.js';
import { initValidation } from './services/validation.js';
import { isDebugUIEnabled } from './utils/debug.js';

function getAppRoot() {
    return document.getElementById('customizer-app-root');
}

function getInitialModelCode() {
    return stateManager.get('currentModelCode') || window.CUSTOMIZER_DATA?.currentModelCode || '';
}

function initStartScreen() {
    const startScreen = document.getElementById('start-screen');
    if (!startScreen) {
        return;
    }

    const hasSeenStart = sessionStorage.getItem('customizer_start_seen');
    if (!hasSeenStart) {
        startScreen.classList.remove('hidden');
    }

    const startCta = document.querySelector('.start-screen-hero-cta');
    if (!startCta) {
        return;
    }

    startCta.addEventListener('click', (e) => {
        e.preventDefault();
        startScreen.classList.add('hidden');
        sessionStorage.setItem('customizer_start_seen', 'true');
    });
}

function initAppRuntimeState(appRoot) {
    stateManager.batch((batch) => {
        batch('ajaxPath', appRoot.dataset.ajaxPath || '');
        batch('sessid', appRoot.dataset.sessid || '');
    });
}

function initializeCurrentModelSelection(currentModelCode) {
    if (!currentModelCode) {
        updateUI();
        return;
    }

    setTimeout(() => {
        const selection = selectModelVariant(currentModelCode);
        if (!selection?.runtimeData) {
            console.error('[Main.js] Model runtime data not found for code:', currentModelCode);
        }
    }, 100);
}

function initCustomizerModules(currentModelCode) {
    initCameraEffect(currentModelCode);
    initEventListeners();
    initLogo();
    initializeWoodCase();
    initShockmount();
    updateSVG();
    if (isDebugUIEnabled()) {
        initDebugHelper();
    }
    initValidation();
}

document.addEventListener('DOMContentLoaded', async () => {
    const appRoot = getAppRoot();
    if (!appRoot) return;

    initStartScreen();
    initAppRuntimeState(appRoot);

    await loadSVG();

    initHLDataManager();

    const currentModelCode = getInitialModelCode();
    initializeCurrentModelSelection(currentModelCode);
    initCustomizerModules(currentModelCode);
});
