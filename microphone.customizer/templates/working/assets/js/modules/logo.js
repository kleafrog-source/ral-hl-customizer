import { eventRegistry } from '../core/events.js';
import { stateManager } from '../core/state.js';
import { CONFIG } from '../config.js';
import { calculateLuminance, updateFilter } from './appearance.js';

// Utility functions for MALFA detection
export function isMalfaMic(state = null) {
    const currentState = state || stateManager.get();
    const v = currentState.variant;
    return v === '023-malfa' || v === '023-MALFA';
}

export function isMalfaLogo(state = null) {
    const currentState = state || stateManager.get();
    const logoVariant = currentState.logo?.variant;
    return logoVariant === 'malfasilver' || logoVariant === 'malfagold';
}

export function init() {
    const uploadButton = document.querySelector('#submenu-logo .variant-item[style*="border-style: dashed"]');
    if (uploadButton) {
        eventRegistry.add(uploadButton, 'click', uploadCustomLogo);
    }
    
    // Initialize lock state
    updateLogoItemsLockState();
}

export function updateMalfaLogoOptionsVisibility() {
    const classicBrassOption = document.querySelector('.variant-item[data-variant="classicbrass"]'); // Classic Brass
    const coldChromeOption = document.querySelector('.variant-item[data-variant="coldchrome"]'); // Cold Chrome
    const malfaSilverOption = document.querySelector('.variant-item[data-variant="malfasilver"]'); // MALFA Edition (Серебро)
    const malfaGoldOption = document.querySelector('.variant-item[data-variant="malfagold"]'); // MALFA Edition (Золото)
    
    if (!classicBrassOption || !coldChromeOption || !malfaSilverOption || !malfaGoldOption) return;

    if (isMalfaMic()) {
        // For MALFA microphone: show MALFA options AND standard options
        classicBrassOption.querySelector('.variant-label').textContent = 'MALFA Edition (Золото)';
        coldChromeOption.querySelector('.variant-label').textContent = 'MALFA Edition (Серебро)';
        
        classicBrassOption.style.display = 'flex';
        coldChromeOption.style.display = 'flex';
        malfaSilverOption.style.display = 'flex';
        malfaGoldOption.style.display = 'flex';
    } else {
        // For standard microphones: show only standard options, hide MALFA options
        classicBrassOption.querySelector('.variant-label').textContent = 'Классическая латунь';
        coldChromeOption.querySelector('.variant-label').textContent = 'Холодный хром';
        
        classicBrassOption.style.display = 'flex';
        coldChromeOption.style.display = 'flex';
        malfaSilverOption.style.display = 'none';
        malfaGoldOption.style.display = 'none';
    }
}

export function updateLogoSVG() {
    const svg = document.querySelector('#svg-wrapper svg');
    if (!svg) return;
    
    const customLayer = svg.querySelector('#custom-logo-layer');
    if (customLayer) customLayer.remove();

    // Get current state
    const state = stateManager.get();
    const malfaLogo = svg.querySelector('#malfa-logo');
    const malfaLogoTextPath = svg.querySelector('#malfa-logo-text-path');
    const clipLogoBgMalfa = svg.querySelector('#clip-logobg-malfa');

    // Handle custom logo
    if (state.logo.customLogo) {
        ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame', 'malfa-logo'].forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'none';
        });

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = 'custom-logo-layer';
        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute('width', '300');
        img.setAttribute('height', '350');
        img.setAttribute('x', '150');
        img.setAttribute('y', '1117');
        img.setAttribute('href', state.logo.customLogo);
        g.appendChild(img);
        svg.appendChild(g);
        return;
    }

    // Check if we should show MALFA logo
    const malfaMic = isMalfaMic(state);
    const malfaLogoSelected = isMalfaLogo(state);
    
    console.log(`[Logo] updateLogoSVG - malfaMic: ${malfaMic}, malfaLogoSelected: ${malfaLogoSelected}`);
    
    if (!malfaMic || !malfaLogoSelected) {
        // Hide MALFA logo for non-MALFA mics or non-MALFA logos
        if (malfaLogo) {
            malfaLogo.style.display = 'none';
            console.log(`[Logo] Hiding MALFA logo`);
        }
        
        // Show standard logos for non-MALFA mics OR non-MALFA logos
        if (!malfaMic || !malfaLogoSelected) {
            ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
                const el = svg.querySelector(`#${id}`);
                if (el) el.style.display = 'inline';
            });

            const letters = svg.querySelector('#logo-letters-and-frame');
            if (letters) letters.style.filter = (state.logo.variant === 'standard-silver') ? 'grayscale(1) brightness(1.5)' : 'none';

            const bgBlack = svg.querySelector('#logo-bg-black');
            const bgColor = svg.querySelector('#logo-bg-colorized');
            const bgMono = svg.querySelector('#logo-bg-monochrome');

            if (state.logo.bgColor === 'black') {
                if (bgBlack) bgBlack.style.display = 'inline';
                if (bgColor) bgColor.style.display = 'none';
                if (bgMono) bgMono.style.display = 'none';
            } else {
                if (bgBlack) bgBlack.style.display = 'none';
                if (bgColor) bgColor.style.display = 'inline';
                if (bgMono) bgMono.style.display = 'inline';

                const lum = calculateLuminance(state.logo.bgColorValue);
                const opacity = Math.max(0.15, 1 - (lum * 0.8));
                if (bgMono) bgMono.style.opacity = opacity;

                updateFilter('logobg', state.logo.bgColorValue);
            }
        }
        
        // Handle overlay
        const overlay = svg.querySelector('#logo-overlay');
        if (overlay) {
            overlay.style.display = state.logo.customLogo ? 'inline' : 'none';
        }
        
        return;
    }

    // We're here only if: MALFA mic + MALFA logo selected
    console.log(`[Logo] Showing MALFA logo for variant: ${state.logo.variant}`);
    
    // Hide all standard logo elements
    ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
        const el = svg.querySelector(`#${id}`);
        if (el) el.style.display = 'none';
    });
    
    // Show MALFA logo
    if (malfaLogo) {
        malfaLogo.style.display = 'inline';
        console.log(`[Logo] MALFA logo set to inline`);
    }

    // Apply gradient and background
    if (malfaLogoTextPath && clipLogoBgMalfa) {
        const isGold = state.logo.variant === 'malfagold';
        malfaLogoTextPath.style.fill = isGold ? 'url(#grad-malfa-gold)' : 'url(#grad-malfa-silver)';
        console.log(`[Logo] Applied ${isGold ? 'gold' : 'silver'} gradient to MALFA logo`);

        // Update Enamel Background dynamically
        const bgColor = state.logobg?.colorValue || state.logo?.bgColorValue;
        if (bgColor) {
            clipLogoBgMalfa.style.fill = bgColor;
            console.log(`[Logo] Applied MALFA background color: ${bgColor}`);
        } else {
            clipLogoBgMalfa.style.fill = '#770033';
        }
    }
}

export function updateLogoItemsLockState() {
    const hasCustomLogo = stateManager.get().logo.customLogo;
    const logoItems = document.querySelectorAll('#submenu-logo .variant-item[data-variant]:not([data-variant="custom"])');
    const logoBgItems = document.querySelectorAll('#submenu-logo-bg .variant-item');
    
    // Lock/unlock logo items (3-1, 3-2, 3-3, 3-4)
    logoItems.forEach(item => {
        if (hasCustomLogo) {
            item.classList.add('locked');
        } else {
            item.classList.remove('locked');
        }
    });
    
    // Lock/unlock logo-bg items (4-1, 4-2, 4-3, 4-4, 4-5, 4-6, 4-7)
    logoBgItems.forEach(item => {
        if (hasCustomLogo) {
            item.classList.add('locked');
        } else {
            item.classList.remove('locked');
        }
    });
}

export function uploadCustomLogo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    stateManager.set('logo.customLogo', event.target.result);
                    stateManager.set('prices.logo', CONFIG.optionPrice);
                    document.querySelector('.remove-logo-btn').style.display = 'block';

                    document.getElementById('logo-overlay').classList.add('active');

                    updateLogoItemsLockState();
                } catch (err) {
                    console.error(err);
                    showNotification('Ошибка при загрузке логотипа', 'error');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}
