import { initEventListeners } from './ui-core.js';
import { initPalettes, initPaletteWrappers } from './modules/appearance-new.js';
import { init as initLogo } from './modules/logo.js';
import { initCaseAndShockmount} from './modules/accessories.js';
import { initShockmount } from './modules/shockmount-new.js';
import { loadSVG } from './engine.js';
import { initValidation } from './services/validation.js';
import { stateManager } from './core/state.js';
import { render } from './core/render.js';
import * as cameraEffect from './modules/camera-effect.js';
import { startSessionRefresh } from './utils/bitrix.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { initToggles as initToggleStates } from './modules/toggles.js';
import { initColorManager, initAllQuickSelects } from './modules/color-manager.js';
import { initHLDataManager } from './modules/hl-data-manager.js';
import './debugger.js';

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
        // Set initial config for change tracking
        const currentState = stateManager.get();
        stateManager.setInitialConfig(currentState);
    }

    // Load SVG FIRST, then initialize everything else
    await loadSVG();

    // Initialize HL data manager first to load data from Bitrix HL blocks
    initHLDataManager();

    cameraEffect.initCameraEffect(stateManager.get('variant'));

    initPalettes();
    initEventListeners();
    initCaseAndShockmount();
    initColorManager();
    initPaletteWrappers();
    initValidation();
    initLogo();
    initializeWoodCase();
    initShockmount();
    initAllQuickSelects();
    initToggleStates();

    // Final render after all initialization is complete
    render();

    // Start session refresh mechanism
    startSessionRefresh();

    // Start screen logic
    const startScreen = document.getElementById('start-screen');
    const ctaButton = document.querySelector('.start-screen-hero-cta');

    // Check if start screen has been shown this session
    const startScreenShown = sessionStorage.getItem('customizer_start_screen_shown');

    if (startScreen && !startScreenShown) {
        startScreen.style.display = 'flex';
        startScreen.classList.remove('hidden');
    } else if (startScreen) {
        startScreen.classList.add('hidden');
    }

    if (ctaButton && startScreen) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            startScreen.classList.add('hidden');
            sessionStorage.setItem('customizer_start_screen_shown', 'true');
        });
    }

    // Help button in UI to reopen start screen
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn && startScreen) {
        helpBtn.addEventListener('click', () => {
            startScreen.classList.remove('hidden');
        });
    }
});
