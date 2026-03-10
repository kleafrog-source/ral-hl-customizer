import { currentState } from './state.js';
import { CONFIG } from './config.js';
import { SVG_STORAGE } from './svg-assets.js';
import { getCorrectiveFilters, calculateLuminance, updateFilter, hexToRgb, hexToRgbValues, updateSectionLayers } from './modules/appearance.js';
import { showNotification } from './ui-core.js';
import { updateLogoSVG } from './modules/logo.js';
import { getAssetSuffix } from './utils.js';

export function updateResponsiveAssets(svg) {
    if (!svg) return;
    const suffix = getAssetSuffix();
    const images = svg.querySelectorAll('image');
    images.forEach(img => {
        let href = img.getAttribute('xlink:href') || img.getAttribute('href');
        if (href && href.includes('/image/custom/')) {
            // Replace existing suffix or add new one before extension
            const newHref = href.replace(/(_4k|_tablet|_hdmob|_hd|_mobile|_desktop)?\.(png|jpg|webp|jpeg)$/i, `${suffix}.$2`);
            if (href !== newHref) {
                img.setAttribute('xlink:href', newHref);
                img.setAttribute('href', newHref);
            }
        }
    });
}

export function updateSVG() {
    try {
        const svg = document.querySelector('#svg-wrapper svg');
        if (!svg) return;

        svg.style.transform = currentState.model === '023' ? `scale(${CONFIG.scaleFactor})` : 'scale(1)';

        for (let i = 1; i <= 3; i++) {
            const grill = svg.querySelector(`#img-grill-mic${i}`);
            if (grill) {
                // Show grill image only if spheres are set to a custom RAL color
                // Standard variants 1, 2, 3 should have the grill hidden
                const isCustomColor = !!currentState.spheres.color;
                grill.style.display = (isCustomColor && currentState.spheres.variant === String(i)) ? 'inline' : 'none';
            }
        }

        updateSectionLayers('spheres', currentState.spheres);
        updateSectionLayers('body', currentState.body);
        updateLogoSVG();
    } catch (e) {
        console.error("SVG Update Error:", e);
        showNotification("Ошибка обновления визуализации", "error");
    }
}

export async function loadSVG(svgPath = null) {
    try {
        // Используем путь, установленный в template.php
        if (!svgPath && window.CUSTOMIZER_SVG_PATH) {
            svgPath = window.CUSTOMIZER_SVG_PATH;
        } else if (!svgPath) {
            // Fallback для автономной работы
            svgPath = 'assets/mic-017.svg';
        }
        
        const response = await fetch(svgPath);
        if (!response.ok) {
            throw new Error(`Failed to load SVG: ${response.status}`);
        }
        const svgText = await response.text();
        document.getElementById('svg-wrapper').innerHTML = svgText;
    } catch (e) {
        console.error("Failed to load SVG:", e);
        // Fallback - создаем базовый SVG если загрузка не удалась
        document.getElementById('svg-wrapper').innerHTML = `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="600" fill="#f0f0f0"/>
                <text x="400" y="300" text-anchor="middle" fill="#666">SVG загрузка не удалась</text>
            </svg>
        `;
    }

    document.getElementById('theme-toggle').innerHTML = SVG_STORAGE.THEME_TOGGLE;

    document.querySelectorAll('.chevron-icon').forEach(el => el.innerHTML = SVG_STORAGE.CHEVRON_ICON);
    document.querySelectorAll('.submenu-back > svg').forEach(el => el.innerHTML = SVG_STORAGE.SUBMENU_BACK);
    document.querySelectorAll('.palette-toggle-btn > svg').forEach(el => el.innerHTML = SVG_STORAGE.PALETTE_TOGGLE_CHEVRON);
    const svg = document.querySelector('#svg-wrapper svg');
    if (svg) {
        svg.style.transformOrigin = 'center bottom';
        updateResponsiveAssets(svg);
    }
    updateSVG();

    // Re-update assets on window resize
    window.addEventListener('resize', () => {
        const currentSvg = document.querySelector('#svg-wrapper svg');
        if (currentSvg) updateResponsiveAssets(currentSvg);
    });
}
