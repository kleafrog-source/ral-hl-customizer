// components/Palette.js

import { stateManager } from '../core/state.js';
import { handleColorSelection } from '../modules/appearance-new.js';

/**
 * Creates and appends a color palette to a container element.
 * @param {string} section - The section name (e.g., 'spheres', 'logo').
 * @param {HTMLElement} container - The DOM element to append the palette to.
 */
export function createPalette(section, container) {
    if (!container) return;
    
    container.innerHTML = ''; // Clear previous content

    const hlData = stateManager.get('hlData');
    const ralPalette = hlData?.ralColors || {};

    // RAL 1013 exclusion for body
    const exclusions = section === 'body' ? ['1013'] : [];

    for (const [id, colorData] of Object.entries(ralPalette)) {
        const name = colorData.UF_CODE;
        const color = colorData.UF_HEX;

        if (exclusions.includes(name)) {
            continue;
        }

        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = color;
        swatch.title = `RAL ${name}`;
        swatch.dataset.color = color;
        swatch.dataset.ral = name;
        swatch.setAttribute('role', 'button');
        swatch.setAttribute('tabindex', '0');
        swatch.setAttribute('aria-label', `RAL ${name} ${color}`);
        
        const handler = () => handleColorSelection(section, color, name);
        swatch.onclick = handler;
        swatch.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handler();
            }
        };

        container.appendChild(swatch);
    }
}
