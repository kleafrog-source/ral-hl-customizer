import { currentState, setState } from '../state.js';
import { CONFIG } from '../config.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';
import { calculateLuminance, updateFilter } from './appearance.js';

export function init() {
    const uploadButton = document.querySelector('#submenu-logo .variant-item[style*="border-style: dashed"]');
    if (uploadButton) {
        uploadButton.addEventListener('click', uploadCustomLogo);
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

    if (currentState.variant === 'malfa') {
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
    const customLayer = svg.querySelector('#custom-logo-layer');
    if (customLayer) customLayer.remove();



    if (currentState.logo.customLogo) {
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
        img.setAttribute('href', currentState.logo.customLogo);
        g.appendChild(img);
        svg.appendChild(g);
        return;
    }

    const malfaLogo = svg.querySelector('#malfa-logo');
    const malfaLogoTextPath = svg.querySelector('#malfa-logo-text-path');
    const clipLogoBgMalfa = svg.querySelector('#clip-logo-bg-malfa');

    if (currentState.variant === 'malfa') {
        // Hide all standard logo elements initially
        ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'none';
        });
        
        // Always show MALFA logo initially
        if (malfaLogo) malfaLogo.style.display = 'inline';

        if (malfaLogoTextPath && clipLogoBgMalfa) {
            // Check if standard options are selected (renamed for MALFA)
            const isStandardGold = (currentState.logo.variant === 'classicbrass');
            const isStandardSilver = (currentState.logo.variant === 'coldchrome');
            
            // If standard options are selected, hide MALFA logo and show standard logo
            if (isStandardGold || isStandardSilver) {
                if (malfaLogo) malfaLogo.style.display = 'none';
                
                ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
                    const el = svg.querySelector(`#${id}`);
                    if (el) el.style.display = 'inline';
                });

                const letters = svg.querySelector('#logo-letters-and-frame');
                if (letters) letters.style.filter = (isStandardSilver) ? 'grayscale(1) brightness(1.5)' : 'none';
            } else {
                // Show MALFA logo with proper gradient
                const isGold = (currentState.logo.variant === '1036');
                malfaLogoTextPath.style.fill = isGold ? 'url(#grad-malfa-gold)' : 'url(#grad-malfa-silver)';

                // Update Enamel Background dynamically
                if (currentState.logo.bgColorValue) {
                    clipLogoBgMalfa.style.fill = currentState.logo.bgColorValue;
                } else {
                    clipLogoBgMalfa.style.fill = 'url(#grad-malfa-bg)';
                }
            }
        }
    } else {
        if (malfaLogo) malfaLogo.style.display = 'none';

        // Показываем overlay только если есть кастомное лого
        const overlay = svg.querySelector('#logo-overlay');
        if (overlay) {
            overlay.style.display = currentState.logo.customLogo ? 'inline' : 'none';
        }

        ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'inline';
        });

        const letters = svg.querySelector('#logo-letters-and-frame');
        if (letters) letters.style.filter = (currentState.logo.variant === 'coldchrome') ? 'grayscale(1) brightness(1.5)' : 'none';

        const bgBlack = svg.querySelector('#logo-bg-black');
        const bgColor = svg.querySelector('#logo-bg-colorized');
        const bgMono = svg.querySelector('#logo-bg-monochrome');

        if (currentState.logo.bgColor === 'black') {
            if (bgBlack) bgBlack.style.display = 'inline';
            if (bgColor) bgColor.style.display = 'none';
            if (bgMono) bgMono.style.display = 'none';
        } else {
            if (bgBlack) bgBlack.style.display = 'none';
            if (bgColor) bgColor.style.display = 'inline';
            if (bgMono) bgMono.style.display = 'inline';

            const lum = calculateLuminance(currentState.logo.bgColorValue);
            const opacity = Math.max(0.15, 1 - (lum * 0.8));
            if (bgMono) bgMono.style.opacity = opacity;

            updateFilter('logobg', currentState.logo.bgColorValue);
        }
    }
}

export function updateLogoItemsLockState() {
    const hasCustomLogo = currentState.logo.customLogo;
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
                    setState('logo.customLogo', event.target.result);
                    setState('prices.logo', CONFIG.optionPrice);
                    document.querySelector('.remove-logo-btn').style.display = 'block';

                    document.getElementById('logo-overlay').classList.add('active');

                    updateLogoItemsLockState();
                    updateSVG();
                    updateUI();
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
