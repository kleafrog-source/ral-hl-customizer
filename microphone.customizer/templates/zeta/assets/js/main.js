// Main entry (delta)

import { initEventListeners, updateUI } from './ui-core.js';
import { initHLDataManager } from './modules/hl-data-manager.js';
import { initShockmount, updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from './modules/shockmount-new.js';
import { initToggles, syncToggles } from './modules/toggles.js';
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
        // Сначала ждем загрузки HL данных
        setTimeout(() => {
            const hlData = stateManager.get('hlData');
            console.log('[Main.js] HL Data:', hlData);
            console.log('[Main.js] Current Model Code:', currentModelCode);
            const model = hlData?.modelsByCode?.[currentModelCode];
            console.log('[Main.js] Model from HL Data:', model);
            
            if (model) {
                console.log('[Main.js] Setting shockmount state from model:', {
                    shockmountToggle: model.shockmountToggle,
                    shockmountEnabled: model.shockmountEnabled,
                    shockmountVisible: model.shockmountVisible,
                    shockmountPrice: model.shockmountPrice
                });
                
                // Проверяем типы данных
                console.log('[Main.js] Data types:', {
                    shockmountToggle: typeof model.shockmountToggle,
                    shockmountEnabled: typeof model.shockmountEnabled,
                    shockmountVisible: typeof model.shockmountVisible,
                    shockmountPrice: typeof model.shockmountPrice
                });
                
                stateManager.batch(batch => {
                    // Правильная интерпретация HL полей - приводим к числам
                    batch('shockmount.canToggle', parseInt(model.shockmountToggle) === 1);
                    batch('shockmount.enabled', parseInt(model.shockmountEnabled) === 1);
                    batch('shockmount.visible', parseInt(model.shockmountVisible) === 1);
                    batch('shockmount.price', parseInt(model.shockmountPrice) || 0);
                    batch(
                      'shockmount.included',
                      parseInt(model.shockmountEnabled) === 1 && (parseInt(model.shockmountPrice) || 0) === 0
                    );

                    batch('shockmount.variant', model.defaultShockmount || null);
                    batch('shockmountPins.variant', model.defaultShockmountPins || null);
                });
                
                console.log('[Main.js] Shockmount state set:', {
                    canToggle: parseInt(model.shockmountToggle) === 1,
                    enabled: parseInt(model.shockmountEnabled) === 1,
                    visible: parseInt(model.shockmountVisible) === 1,
                    price: parseInt(model.shockmountPrice) || 0,
                    included: parseInt(model.shockmountEnabled) === 1 && (parseInt(model.shockmountPrice) || 0) === 0
                });
                
                // Синхронизируем UI с установленным состоянием
                syncToggles();
                
                // Применяем значения по умолчанию для текущей модели
                applyModelDefaults(currentModelCode);
            } else {
                console.error('[Main.js] Model not found in HL Data for code:', currentModelCode);
            }
        }, 100); // Небольшая задержка для гарантии загрузки данных
    }
    
    initCameraEffect(currentModelCode);
    initEventListeners();
    initLogo();
    initializeWoodCase();
    initShockmount();
    initToggles(); // Добавляем вызов для инициализации обработчиков

    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateShockmountPreview();
    updateShockmountPinsPreview();

    updateSVG();
    updateUI();
    initDebugHelper();
    initValidation();
});
