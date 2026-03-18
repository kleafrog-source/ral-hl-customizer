import { initEventListeners, updateUI } from './ui-core.js';
import { initHLDataManager } from './modules/hl-data-manager.js';
import { initShockmount, updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from './modules/shockmount-new.js';
import { syncToggles } from './modules/toggles.js';
import { loadSVG, updateSVG } from './engine.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { init as initLogo } from './modules/logo.js';
import { initCameraEffect, updateMicVariant } from './modules/camera-effect.js';
import { applyModelDefaults } from './modules/model-defaults.js';
import { stateManager } from './core/state.js';
import { applyModelRuntimeState } from './modules/model-runtime.js';
import { initDebugHelper } from './debug/ui-debug-helper.js';
import { initValidation } from './services/validation.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appRoot = document.getElementById('customizer-app-root');
    if (!appRoot) return;

    const startScreen = document.getElementById('start-screen');
    const hasSeenStart = sessionStorage.getItem('customizer_start_seen');
    if (startScreen && !hasSeenStart) {
        startScreen.classList.remove('hidden');
    }

    const startCta = document.querySelector('.start-screen-hero-cta');
    if (startCta && startScreen) {
        startCta.addEventListener('click', (e) => {
            e.preventDefault();
            startScreen.classList.add('hidden');
            sessionStorage.setItem('customizer_start_seen', 'true');
        });
    }

    stateManager.set('ajaxPath', appRoot.dataset.ajaxPath || '');
    stateManager.set('sessid', appRoot.dataset.sessid || '');

    await loadSVG();

    initHLDataManager();

    const currentModelCode = stateManager.get('currentModelCode') || window.CUSTOMIZER_DATA?.currentModelCode;
    if (currentModelCode) {
        setTimeout(() => {
            const runtimeData = applyModelRuntimeState(currentModelCode);
            console.log('[Main.js] Model runtime data:', runtimeData);

            if (!runtimeData) {
                console.error('[Main.js] Model runtime data not found for code:', currentModelCode);
                return;
            }

            syncToggles();
            applyModelDefaults(currentModelCode);
            updateMicVariant(currentModelCode);
            updateUI();
        }, 100);
    } else {
        updateUI();
    }

    initCameraEffect(currentModelCode);
    initEventListeners();
    initLogo();
    initializeWoodCase();
    initShockmount();

    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();

    updateSVG();
    initDebugHelper();
    initValidation();
});
