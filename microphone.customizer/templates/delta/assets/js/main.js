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
        // Инициализация state для shockmount на основе HL-полей модели
        const model = window.CUSTOMIZER_DATA.modelsByCode[currentModelCode];
        if (model) {
            // Детальное логирование HL-значений для модели при загрузке
            console.group(`[Model] ${currentModelCode} - HL Values (initial load)`);
            console.log('SHOCKMOUNT_ENABLED:', model.SHOCKMOUNT_ENABLED, '=>', model.SHOCKMOUNT_ENABLED === 1 ? 'включен в комплект' : 'не включен в комплект');
            console.log('SHOCKMOUNT_TOGGLE:', model.SHOCKMOUNT_TOGGLE, '=>', model.SHOCKMOUNT_TOGGLE === 1 ? 'можно переключать' : 'нельзя переключать');
            console.log('SHOCKMOUNT_VISIBLE:', model.SHOCKMOUNT_VISIBLE, '=>', model.SHOCKMOUNT_VISIBLE === 1 ? 'доступен в UI' : 'скрыт в UI');
            console.log('SHOCKMOUNT_PRICE:', model.SHOCKMOUNT_PRICE, '=>', model.SHOCKMOUNT_PRICE > 0 ? `+${model.SHOCKMOUNT_PRICE}₽` : 'бесплатно');
            console.log('DEFAULTS:', model.DEFAULTS);
            console.groupEnd();
            
            const batch = stateManager.startBatch();
            batch('shockmount.available', model.SHOCKMOUNT_VISIBLE === 1);
            batch('shockmount.canToggle', model.SHOCKMOUNT_TOGGLE === 1);
            batch('shockmount.price', model.SHOCKMOUNT_PRICE || 0);
            batch('shockmount.included', model.SHOCKMOUNT_ENABLED === 1 && (model.SHOCKMOUNT_PRICE || 0) === 0);
            batch('shockmount.enabled', model.SHOCKMOUNT_ENABLED === 1);
            stateManager.endBatch();
        }
        
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
