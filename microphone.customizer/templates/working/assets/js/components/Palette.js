// components/Palette.js

import { RAL_PALETTE, RAL_EXCLUSIONS } from '../config/ral.config.js';
import { handleColorSelection } from '../modules/appearance.js';

/**
 * Creates and appends a color palette to a container element.
 * @param {string} section - The section name (e.g., 'spheres', 'logo').
 * @param {HTMLElement} container - The DOM element to append the palette to.
 */
export function createPalette(section, container) {
    if (!container) return;
    
    container.innerHTML = ''; // Clear previous content
    const exclusions = RAL_EXCLUSIONS[section] || [];

    for (const [name, color] of Object.entries(RAL_PALETTE)) {
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
