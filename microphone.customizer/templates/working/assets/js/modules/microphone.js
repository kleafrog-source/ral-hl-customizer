import { switchVariant } from '../strategies/VariantStrategy.js';

/**
 * Applies a new microphone variant preset by delegating to the VariantStrategy.
 * @param {string} newVariant - The variant ID to switch to.
 */
export function applyVariantPreset(newVariant) {
    switchVariant(newVariant);
}

/**
 * Selects a variant item in the UI for a given section.
 * @param {string} section 
 * @param {string} variant 
 */
export function selectVariant(section, variant) {
    const submenu = document.getElementById('submenu-' + section);
    if (!submenu) return;
    const selected = submenu.querySelector(`[data-variant="${variant}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
    }
}

/**
 * Selects a RAL color swatch in the UI for a given section.
 * @param {string} section 
 * @param {string} ralCode 
 */
export function selectRALVariant(section, ralCode) {
    const submenu = document.getElementById('submenu-' + section);
    if (!submenu) return;
    const selected = submenu.querySelector(`[data-variant="${ralCode}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
    }
}
