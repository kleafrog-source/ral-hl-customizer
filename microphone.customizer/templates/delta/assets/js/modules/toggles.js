// Toggle handlers (delta)

import { stateManager } from '../core/state.js';
import { updateUI } from '../ui-core.js';
import { updateShockmountVisibility, updateShockmountLayers, updateShockmountPreview, updateShockmountPinsPreview } from './shockmount-new.js';
import { updateSVG } from '../engine.js';

export function initToggles() {
    const logoToggle = document.getElementById('logo-mode-toggle');
    if (logoToggle) {
        logoToggle.checked = !!stateManager.get('logo.useCustom');
        const uploadArea = document.getElementById('custom-logo-upload-area');
        if (uploadArea) uploadArea.style.display = logoToggle.checked ? 'block' : 'none';
        logoToggle.addEventListener('change', () => {
            const enabled = logoToggle.checked;
            stateManager.set('logo.useCustom', enabled);
            const logoSection = document.querySelector('[data-section="logo"]');
            const logobgSection = document.querySelector('[data-section="logobg"]');
            if (logoSection) logoSection.classList.toggle('disabled', enabled);
            if (logobgSection) logobgSection.classList.toggle('disabled', enabled);
            if (uploadArea) uploadArea.style.display = enabled ? 'block' : 'none';
            updateSVG();
            updateUI();
        });
    }

    const engravingToggle = document.getElementById('laser-engraving-toggle');
    if (engravingToggle) {
        engravingToggle.checked = !!stateManager.get('case.laserEngravingEnabled');
        const dataSection = document.getElementById('laser-engraving-data');
        if (dataSection) dataSection.style.display = engravingToggle.checked ? 'block' : 'none';
        engravingToggle.addEventListener('change', () => {
            const enabled = engravingToggle.checked;
            stateManager.set('case.laserEngravingEnabled', enabled);
            if (dataSection) dataSection.style.display = enabled ? 'block' : 'none';
            updateUI();
        });
    }

    const shockmountToggle = document.getElementById('shockmount-switch');
    if (shockmountToggle) {
        const included = !!stateManager.get('shockmount.included');
        shockmountToggle.checked = !!stateManager.get('shockmount.enabled');
        shockmountToggle.disabled = included;
        shockmountToggle.addEventListener('change', () => {
            const enabled = shockmountToggle.checked;
            stateManager.set('shockmount.enabled', enabled);
            updateShockmountVisibility();
            updateShockmountLayers(stateManager.get());
            updateShockmountPreview();
            updateShockmountPinsPreview();
            updateUI();
        });
    }
}
