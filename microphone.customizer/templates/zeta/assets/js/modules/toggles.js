// Toggle handlers (delta)

import { stateManager } from '../core/state.js';
import { updateUI } from '../ui-core.js';
import { updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from './shockmount-new.js';
import { updateSVG } from '../engine.js';
import { updateLogoSVG } from './logo.js';

let listenersBound = false;

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
            
            // Даем время на обновление state перед вызовом UI
            setTimeout(() => {
                updateShockmountVisibility();
                updateShockmountLayers(stateManager.get());
                updateShockmountPreview();
                updateShockmountPinsPreview();
                updateUI();
                updateShockmountVisibility(); // Повторный вызов для гарантии обновления меню
            }, 10);
        });
    }

    // НЕ вызываем syncToggles() здесь - она вызывается из ui-core при инициализации
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
        shockmountToggle.checked = !!stateManager.get('shockmount.enabled');
        shockmountToggle.disabled = included || !canToggle;
    }

    updateShockmountVisibility();
}
