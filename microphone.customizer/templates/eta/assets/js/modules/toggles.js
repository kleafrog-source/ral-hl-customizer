// Toggle handlers (eta)

import { stateManager } from '../core/state.js';
import { buildShockmountState, getShockmountOptionVariantCode } from '../config/model-capabilities.js';
import { updateUI } from '../ui-core.js';
import { updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from './shockmount-new.js';
import { updateSVG } from '../engine.js';
import { updateLogoSVG } from './logo.js';
import { updateMicVariant } from './camera-effect.js';

let listenersBound = false;

function syncShockmountOptionState(enabled) {
    const currentState = stateManager.get();
    const modelCode = currentState.currentModelCode || '';
    const optionCode = getShockmountOptionVariantCode(modelCode, enabled);
    if (!optionCode) {
        return;
    }

    const optionState = (window.CUSTOMIZER_DATA?.sectionOptions?.shockmountOption || [])
        .find(option => option.variantCode === optionCode) || {};
    const optionPrice = enabled
        ? buildShockmountState(window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode] || modelCode).price
        : 0;

    stateManager.batch(batch => {
        batch('shockmountOption.variantCode', optionCode);
        batch('shockmountOption.variant', optionCode);
        batch('shockmountOption.variantName', optionState.variantName || optionCode);
        batch('shockmountOption.isRal', !!optionState.isRal);
        batch('shockmountOption.color', optionState.color || null);
        batch('shockmountOption.colorValue', optionState.colorValue || null);
        batch('shockmountOption.colorName', optionState.colorName || null);
        batch('shockmountOption.modelId', optionState.modelId || currentState.currentModelId || 0);
        batch('shockmountOption.svgTargetMode', optionState.svgTargetMode || null);
        batch('shockmountOption.svgLayerGroup', optionState.svgLayerGroup || null);
        batch('shockmountOption.svgFilterId', optionState.svgFilterId || null);
        batch('shockmountOption.svgSpecialKey', optionState.svgSpecialKey || null);
        batch('shockmountOption.price', optionPrice);
    });
}

export function initToggles() {
    if (listenersBound) {
        return;
    }
    listenersBound = true;

    const logoToggle = document.getElementById('logo-mode-toggle');
    if (logoToggle) {
        logoToggle.addEventListener('change', () => {
            const enabled = logoToggle.checked;
            stateManager.set('logo.useCustom', enabled);
            const logoSection = document.querySelector('[data-section="logo"]');
            const logobgSection = document.querySelector('[data-section="logobg"]');
            if (logoSection) logoSection.classList.toggle('disabled', enabled);
            if (logobgSection) logobgSection.classList.toggle('disabled', enabled);
            const customLogoUploadArea = document.getElementById('custom-logo-upload-area');
            if (customLogoUploadArea) customLogoUploadArea.style.display = enabled ? 'block' : 'none';
            updateSVG();
            updateLogoSVG();
            updateUI();
        });
    }

    const engravingToggle = document.getElementById('laser-engraving-toggle');
    if (engravingToggle) {
        engravingToggle.addEventListener('change', () => {
            const enabled = engravingToggle.checked;
            stateManager.set('case.laserEngravingEnabled', enabled);
            const dataSection = document.getElementById('laser-engraving-data');
            if (dataSection) dataSection.style.display = enabled ? 'block' : 'none';
            updateUI();
        });
    }

    const shockmountToggle = document.getElementById('shockmount-switch');
    if (shockmountToggle) {
        shockmountToggle.addEventListener('change', () => {
            const enabled = shockmountToggle.checked;
            stateManager.set('shockmount.enabled', enabled);
            syncShockmountOptionState(enabled);
            updateMicVariant(stateManager.get('currentModelCode'));

            // Give state a moment to settle before the UI refresh.
            setTimeout(() => {
                updateShockmountVisibility();
                updateShockmountLayers(stateManager.get());
                updateShockmountPreview();
                updateShockmountPinsPreview();
                updateUI();
                updateShockmountVisibility();
            }, 10);
        });
    }
}

export function syncToggles() {
    const logoToggle = document.getElementById('logo-mode-toggle');
    if (logoToggle) {
        logoToggle.checked = !!stateManager.get('logo.useCustom');
        const customLogoUploadArea = document.getElementById('custom-logo-upload-area');
        if (customLogoUploadArea) customLogoUploadArea.style.display = logoToggle.checked ? 'block' : 'none';
        const logoSection = document.querySelector('[data-section="logo"]');
        const logobgSection = document.querySelector('[data-section="logobg"]');
        if (logoSection) logoSection.classList.toggle('disabled', logoToggle.checked);
        if (logobgSection) logobgSection.classList.toggle('disabled', logoToggle.checked);
    }

    const engravingToggle = document.getElementById('laser-engraving-toggle');
    const dataSection = document.getElementById('laser-engraving-data');
    if (engravingToggle) {
        engravingToggle.checked = !!stateManager.get('case.laserEngravingEnabled');
        if (dataSection) dataSection.style.display = engravingToggle.checked ? 'block' : 'none';
    }

    const shockmountToggle = document.getElementById('shockmount-switch');
    if (shockmountToggle) {
        const included = !!stateManager.get('shockmount.included');
        const canToggle = !!stateManager.get('shockmount.canToggle');
        const enabled = !!stateManager.get('shockmount.enabled');
        shockmountToggle.checked = enabled;
        shockmountToggle.disabled = included || !canToggle;
        syncShockmountOptionState(enabled);
    }

    updateShockmountVisibility();
}
