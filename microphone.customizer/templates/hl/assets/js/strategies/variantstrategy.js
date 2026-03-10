// strategies/VariantStrategy.js

import { stateManager } from '../core/state.js';
import { eventRegistry } from '../core/events.js';
import { updateMALFAVisibility, updateLogoSVG } from '../modules/logo.js';
import { updateShockmountVisibility, updateShockmountLayers } from '../modules/shockmount-new.js';
import * as cameraEffect from '../modules/camera-effect.js';
import { selectVariant, selectRALVariant } from '../modules/microphone.js';

/**
 * Saves the current microphone's customizable state.
 * @param {string} variantId - The ID of the variant to save (e.g., '017-fet').
 */
function saveCurrentState(variantId) {
    const currentState = stateManager.get();
    const configToSave = {
        spheres: currentState.spheres,
        body: currentState.body,
        logo: currentState.logo,
        logobg: currentState.logobg,
        case: currentState.case,
        shockmount: currentState.shockmount,
        shockmountPins: currentState.shockmountPins,
        prices: currentState.prices
    };
    stateManager.set(`savedMicConfigs.${variantId}`, configToSave);
}

/**
 * Loads a preset configuration for a given variant.
 * @param {string} variantId - The ID of the variant to load.
 */
function loadPreset(variantId) {
    const savedConfigs = stateManager.get('savedMicConfigs');
    const configToApply = savedConfigs?.[variantId];
    
    if (configToApply) {
        // Start batch operation to prevent multiple renders
        const batchSet = stateManager.startBatch();
        
        Object.keys(configToApply).forEach(section => {
            if (section === 'shockmountPins') {
                // Special handling for shockmountPins
                batchSet('shockmountPins', configToApply[section]);
            } else {
                batchSet(section, configToApply[section]);
            }
        });
        
        // End batch and apply all changes at once
        stateManager.endBatch();
        stateManager.setInitialConfig(configToApply); // Reset 'hasChanged' flag
    }
    return configToApply;
}

/**
 * Applies visual updates to the DOM based on the newly loaded state.
 * This is a crucial step to synchronize the UI after a state change.
 */
function applyVisualUpdates() {
    const newState = stateManager.get();

    // Reset all visual selections
    document.querySelectorAll('.variant-item.selected, .swatch.selected').forEach(el => {
        el.classList.remove('selected');
        el.setAttribute('aria-selected', 'false');
    });

    // Manage Logo Variants Visibility
    const isMalfa = newState.variant === '023-malfa';
    const logoSubmenu = document.getElementById('submenu-logo');
    const allLogoVariants = logoSubmenu.querySelectorAll('.variants .variant-item');
    
    allLogoVariants.forEach(item => {
        const variant = item.dataset.variant;
        if (isMalfa) {
            // For Malfa, only show the 4 specific options
            const malfaOptions = ['malfasilver', 'malfagold', 'gold', 'silver'];
            if (malfaOptions.includes(variant)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        } else {
            // For other mics, hide Malfa-specific options
            if (variant === 'malfasilver' || variant === 'malfagold') {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        }
    });

    // Also hide/show the free RAL colors section based on variant
    const freeRalSection = logoSubmenu.querySelector('.variants[style*="margin-bottom: 10px;"]');
    if (freeRalSection) {
        freeRalSection.style.display = isMalfa ? 'none' : 'flex';
    }

    document.getElementById('logo-overlay').style.display = isMalfa ? 'block' : 'none';

    // Update MALFA logo visibility in SVG
    updateLogoSVG();

    // Re-select the correct variants in the UI
    selectVariant('spheres', newState.spheres.variant);
    if (newState.spheres.color) selectRALVariant('spheres', newState.spheres.color);
    selectVariant('body', newState.body.variant);
    if (newState.body.color) selectRALVariant('body', newState.body.color);
    selectVariant('logo', newState.logo.variant);
    selectVariant('case', newState.case.variant);
    selectVariant('shockmount', newState.shockmount.variant);
    if (newState.shockmount.color) selectRALVariant('shockmount', newState.shockmount.color);
    selectVariant('shockmount-pins', newState.shockmountPins.variant);
    if (newState.shockmountPins.colorName && newState.shockmountPins.material === 'custom') {
        const palettePins = document.getElementById('pal-pins');
        const swatch = palettePins?.querySelector(`[data-ral="${newState.shockmountPins.colorName.replace('RAL ', '')}"]`);
        if (swatch) swatch.classList.add('selected');
    }

    // Update shockmount switch state
    const shockmountSwitch = document.getElementById('shockmount-switch');
    if (shockmountSwitch) {
        shockmountSwitch.checked = newState.shockmount.enabled;
    }

    // Update other components
    updateMALFAVisibility();
    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    if (window.WoodCase) {
        window.WoodCase.setCase(newState.variant);
    }
    cameraEffect.switchLayer('microphone');
}

/**
 * Main strategy function to switch variants.
 * @param {string} newVariant - The ID of the new variant to switch to.
 */
export function switchVariant(newVariant) {
    const previousVariant = stateManager.get('variant');
    if (previousVariant === newVariant) return;

    // 1. Cleanup
    if (window.WoodCase?.destroy) window.WoodCase.destroy();
    eventRegistry.cleanup();
    
    // 2. Save old state
    if (previousVariant) {
        saveCurrentState(previousVariant);
    }
    
    // 3. Update state to new variant
    stateManager.set('variant', newVariant);
    
    // 4. Load preset for new variant
    loadPreset(newVariant);
    
    // 4.5. Update shockmount layers with new state
    updateShockmountLayers(stateManager.get());
    
    // 5. Apply visual updates based on the new state
    applyVisualUpdates();

    // 6. Re-initialize listeners
    initEventListeners();
}
