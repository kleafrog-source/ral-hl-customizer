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
    
    // Применяем значения по умолчанию для текущей модели
    const currentModelCode = stateManager.get('currentModelCode') || window.CUSTOMIZER_DATA?.currentModelCode;
    if (currentModelCode) {
        // Инициализация state для shockmount на основе HL-полей модели
        const model = window.CUSTOMIZER_DATA.modelsByCode[currentModelCode];
        if (model) {
            stateManager.batch(batch => {
                // Правильная интерпретация HL полей:
                batch('shockmount.canToggle', model.shockmountToggle === 1);
                batch('shockmount.enabled', model.shockmountEnabled === 1);
                batch('shockmount.visible', model.shockmountVisible === 1);
                batch('shockmount.price', model.shockmountPrice || 0);
                batch(
                  'shockmount.included',
                  model.shockmountEnabled === 1 && (model.shockmountPrice || 0) === 0
                );

                batch('shockmount.variant', model.defaultShockmount || null);
                batch('shockmountPins.variant', model.defaultShockmountPins || null);
            });
        }
        
        applyModelDefaults(currentModelCode);
    }
    
    initCameraEffect(currentModelCode);
    initEventListeners();
    initLogo();
    initializeWoodCase();
    initShockmount();
    // НЕ вызываем initToggles() здесь - это делается в ui-core при переключении моделей

    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();

    updateSVG();
    updateUI();
    initDebugHelper();
    initValidation();
});
