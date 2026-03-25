// Toggle handlers (eta)

import { stateManager } from '../core/state.js';
import { buildShockmountState, getShockmountOptionVariantCode } from '../config/model-capabilities.js';
import { updateUI } from '../ui-core.js';
import { refreshShockmountUI, updateShockmountVisibility } from './shockmount-new.js';
import { updateSVG } from '../engine.js';
import { activateCustomLogoEditing, finishCustomLogoEditing, updateLogoSVG } from './logo.js';
import { switchLayer, updateMicVariant } from './camera-effect.js';

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

function syncLogoToggleState(enabled) {
    const logoSection = document.querySelector('[data-section="logo"]');
    const logobgSection = document.querySelector('[data-section="logobg"]');
    const customLogoUploadArea = document.getElementById('custom-logo-upload-area');
    const customLogoDescription = document.getElementById('custom-logo-description');
    const customLogoEditButton = document.getElementById('custom-logo-edit');

    if (logoSection) logoSection.classList.toggle('disabled', enabled);
    if (logobgSection) logobgSection.classList.toggle('disabled', enabled);
    if (customLogoUploadArea) {
        const isCollapsed = customLogoUploadArea.dataset.collapsed === '1';
        customLogoUploadArea.style.display = enabled && !isCollapsed ? 'block' : 'none';
    }
    if (!enabled && customLogoDescription) customLogoDescription.style.display = '';
    if (!enabled && customLogoEditButton) customLogoEditButton.style.display = 'none';
}

function syncEngravingToggleState(enabled) {
    const dataSection = document.getElementById('laser-engraving-data');
    if (dataSection) {
        dataSection.style.display = enabled ? 'block' : 'none';
    }
}

function scheduleShockmountRefresh() {
    // Give state a moment to settle before the UI refresh.
    setTimeout(() => {
        refreshShockmountUI(stateManager.get());
        updateUI();
    }, 10);
}

function handleShockmountToggle(enabled) {
    stateManager.batch((batch) => {
        batch('shockmount.enabled', enabled);
    });
    syncShockmountOptionState(enabled);
    updateMicVariant(stateManager.get('currentModelCode'));
    scheduleShockmountRefresh();
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
            if (enabled) {
                stateManager.batch((batch) => {
                    batch('logo.useCustom', true);
                });
                syncLogoToggleState(true);
                switchLayer('logo');
                activateCustomLogoEditing();
            } else {
                finishCustomLogoEditing();
                stateManager.batch((batch) => {
                    batch('logo.useCustom', false);
                    batch('miclogoState', null);
                });
                syncLogoToggleState(false);
            }
            updateSVG();
            updateLogoSVG();
            updateUI();
        });
    }

    const engravingToggle = document.getElementById('laser-engraving-toggle');
    if (engravingToggle) {
        engravingToggle.addEventListener('change', () => {
            const enabled = engravingToggle.checked;
            stateManager.batch((batch) => {
                batch('case.laserEngravingEnabled', enabled);
            });
            syncEngravingToggleState(enabled);
            window.WoodCase?.render?.({ syncBackground: false });
            window.WoodCase?.syncEditingState?.();
            updateUI();
        });
    }

    const shockmountToggle = document.getElementById('shockmount-switch');
    if (shockmountToggle) {
        shockmountToggle.addEventListener('change', () => {
            handleShockmountToggle(shockmountToggle.checked);
        });
    }
}

export function syncToggles() {
    const logoToggle = document.getElementById('logo-mode-toggle');
    if (logoToggle) {
        const enabled = !!stateManager.get('logo.useCustom');
        logoToggle.checked = enabled;
        syncLogoToggleState(enabled);
    }

    const engravingToggle = document.getElementById('laser-engraving-toggle');
    if (engravingToggle) {
        const enabled = !!stateManager.get('case.laserEngravingEnabled');
        engravingToggle.checked = enabled;
        syncEngravingToggleState(enabled);
        window.WoodCase?.render?.({ syncBackground: false });
        window.WoodCase?.syncEditingState?.();
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
