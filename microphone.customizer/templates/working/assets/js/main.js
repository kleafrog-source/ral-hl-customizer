import { initEventListeners } from './ui-core.js';
import { initPalettes } from './modules/appearance.js';
import { initCaseAndShockmount } from './modules/accessories.js';
import { init as initLogo } from './modules/logo.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { initShockmount } from './modules/shockmount.js';
import { loadSVG } from './engine.js';
import { initValidation } from './services/validation.js';
import { stateManager } from './core/state.js';
import { render } from './core/render.js';
import * as cameraEffect from './modules/camera-effect.js';
import { startSessionRefresh } from './utils/bitrix.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appRoot = document.getElementById('customizer-app-root');
    if (!appRoot) {
        console.log('Customizer app root not found, customizer will not load.');
        return;
    }

    // Store initial backend data in state
    stateManager.set('ajaxPath', appRoot.dataset.ajaxPath);
    stateManager.set('sessid', appRoot.dataset.sessid);
    
    const elementId = parseInt(appRoot.dataset.elementId) || 0;
    
    // Subscribe the main render function to all state changes
    stateManager.subscribe(render);

    if (window.BX_USER_DATA && window.BX_USER_DATA.AUTHORIZED) {
        // Handle user data if needed
    }
    
    if (elementId > 0) {
        // Handle config loading if needed
    } else {
        stateManager.setInitialConfig(stateManager.get());
    }

    await loadSVG();
    console.log('SVG загружен');

    cameraEffect.initCameraEffect(stateManager.get('variant'));
    console.log('Camera effect initialized');

    initPalettes();
    initEventListeners();
    initCaseAndShockmount();
    initValidation();
    initLogo();
    initializeWoodCase();
    initShockmount();

    render(); // Initial UI render based on state

    // Start session refresh mechanism
    startSessionRefresh();
    
    const startScreen = document.getElementById('start-screen');
    const ctaButton = document.querySelector('.hero-cta');
    if (ctaButton && startScreen) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            startScreen.classList.add('hidden');
        });
    }
});
