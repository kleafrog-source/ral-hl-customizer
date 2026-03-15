// ============================================
// MAIN ENTRY POINT (HL Data Oriented)
// ============================================

import { initEventListeners } from './ui-core.js';
import { initPalettes, initPaletteWrappers } from './modules/appearance-new.js';
import { init as initLogo } from './modules/logo.js';
import { initCaseAndShockmount } from './modules/accessories.js';
import { initShockmount } from './modules/shockmount-new.js';
import { loadSVG } from './engine.js';
import { initValidation } from './services/validation.js';
import { stateManager } from './core/state.js';
import { render } from './core/render.js';
import * as cameraEffect from './modules/camera-effect.js';
import { toggleFaq } from './modules/faq-utils.js';
import { startSessionRefresh } from './utils/bitrix.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { initToggles as initToggleStates } from './modules/toggles.js';
import { initHLDataManager } from './modules/hl-data-manager.js';
import { initDebugHelper } from './debug/ui-debug-helper.js';

// Make toggleFaq global for onclick attributes in start-screen.php
window.toggleFaq = toggleFaq;

/**
 * Restrict page zoom on mobile devices to keep SVG/layout stable.
 * NOTE: zoom disabled intentionally to keep SVG/layout stable on mobile.
 */
function restrictZoom() {
    // 1. Viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    } else {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.getElementsByTagName('head')[0].appendChild(viewport);
    }

    // 2. Prevent pinch-zoom via touch events
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });

    // 3. Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Apply zoom restrictions
    restrictZoom();

    const appRoot = document.getElementById('customizer-app-root');
    if (!appRoot) {
        console.log('Customizer app root not found, customizer will not load.');
        return;
    }

    // Store initial backend data in state
    stateManager.set('ajaxPath', appRoot.dataset.ajaxPath);
    stateManager.set('sessid', appRoot.dataset.sessid);
    
    const elementId = parseInt(appRoot.dataset.elementId) || 0;
    
    // Subscribe main render function to all state changes
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
    console.log('[Main] Initializing HL data manager...');
    initHLDataManager();

    // Initialize camera effect for variant switching
    cameraEffect.initCameraEffect(stateManager.get('variant'));

    // Initialize UI components with HL data
    console.log('[Main] Initializing palettes...');
    initPalettes();
    
    console.log('[Main] Initializing event listeners...');
    initEventListeners();
    
    console.log('[Main] Initializing case and shockmount...');
    initCaseAndShockmount();
    
    console.log('[Main] Initializing validation...');
    initValidation();
    
    console.log('[Main] Initializing logo...');
    initLogo();
    
    console.log('[Main] Initializing wood case...');
    initializeWoodCase();
    
    console.log('[Main] Initializing shockmount...');
    initShockmount();
    
    console.log('[Main] Initializing palette wrappers...');
    initPaletteWrappers();
    
    console.log('[Main] Initializing toggle states...');
    initToggleStates();

    // Initialize Debug Helper
    initDebugHelper();

    // Final render after all initialization is complete
    console.log('[Main] Performing final render...');
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

    console.log('[Main] Customizer initialization complete!');
});
