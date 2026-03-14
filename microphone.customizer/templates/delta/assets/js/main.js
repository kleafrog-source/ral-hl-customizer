// Main entry (delta)

import { initEventListeners, updateUI } from './ui-core.js';
import { initHLDataManager } from './modules/hl-data-manager.js';
import { initShockmount, updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from './modules/shockmount-new.js';
import { initToggles } from './modules/toggles.js';
import { loadSVG, updateSVG } from './engine.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { init as initLogo } from './modules/logo.js';
import { initCameraEffect } from './modules/camera-effect.js';
import { applyModelDefaults, isDefaultModel } from './modules/model-defaults.js';
import { stateManager } from './core/state.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appRoot = document.getElementById('customizer-app-root');
    if (!appRoot) return;

    stateManager.set('ajaxPath', appRoot.dataset.ajaxPath || '');
    stateManager.set('sessid', appRoot.dataset.sessid || '');

    await loadSVG();

    initHLDataManager();
    
    // Применяем значения по умолчанию для текущей модели
    const currentModelCode = stateManager.get('currentModelCode') || window.CUSTOMIZER_DATA?.currentModelCode;
    if (currentModelCode) {
        applyModelDefaults(currentModelCode);
    }
    
    initCameraEffect(currentModelCode);
    initEventListeners();
    initLogo();
    initializeWoodCase();
    initShockmount();
    initToggles();

    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();

    updateSVG();
    updateUI();
});
