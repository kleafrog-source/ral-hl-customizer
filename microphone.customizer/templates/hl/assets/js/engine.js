import { stateManager } from './core/state.js';
import { CONFIG } from './config.js';
import { updateSectionLayers } from './modules/appearance-new.js';
import { showNotification } from './ui-core.js';
import { updateLogoSVG } from './modules/logo.js';
import { getAssetSuffix } from './utils.js';
import { eventRegistry } from './core/events.js';

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
        const svg = document.querySelector('#microphone-svg-container svg');
        if (!svg) {
            console.warn('[SVG] SVG element not found in #microphone-svg-container, skipping update');
            return;
        }

        const state = stateManager.get();
        if (!state) {
            console.warn('[SVG] State manager not initialized, skipping update');
            return;
        }

        svg.style.transform = state.model === '023' ? `scale(${CONFIG.scaleFactor})` : 'scale(1)';

        for (let i = 1; i <= 3; i++) {
            const grill = svg.querySelector(`#img-grill-mic${i}`);
            if (grill) {
                // Show grill image only if spheres are set to a custom RAL color
                // Standard variants 1, 2, 3 should have the grill hidden
                const spheresState = state.spheres || {};
                const isCustomColor = !!spheresState.color;
                grill.style.display = (isCustomColor && spheresState.variant === String(i)) ? 'inline' : 'none';
            }
        }

        //Переключает видимость слоев spheres-original-1, spheres-original-2, spheres-original-3 в SVG
        updateSectionLayers('spheres', state.spheres || {});
        //Переключает видимость слоев body-original-1, body-original-2, body-original-3 в SVG
        updateSectionLayers('body', state.body || {});
        //Обновляет логотип в SVG
        updateLogoSVG();
    } catch (e) {
        console.error("SVG Update Error:", e);
        showNotification("Ошибка обновления визуализации", "error");
    }
}

export function initSVGVisibility(svg, initialState) {
    if (!svg || !initialState) return;
    
    console.log('[SVG] Initializing visibility for initial state:', initialState);
    
    // Показать правильные "original" слои для начального состояния
    const spheresVariant = initialState.spheres?.variant;
    const bodyVariant = initialState.body?.variant;
    
    // Для spheres: если variant 'satinsteel', '3' или 'non-ral', показать spheres-original-3
    if (spheresVariant === 'satinsteel' || spheresVariant === '3' || spheresVariant === 'non-ral') {
        const spheresOriginal3 = svg.querySelector('#spheres-original-3');
        if (spheresOriginal3) {
            spheresOriginal3.style.setProperty('display', 'inline', 'important');
            console.log('[SVG] Set spheres-original-3 to visible');
        }
    }
    
    // Для body: если variant 'satinsteel', '3' или 'non-ral', показать body-original-3  
    if (bodyVariant === 'satinsteel' || bodyVariant === '3' || bodyVariant === 'non-ral') {
        const bodyOriginal3 = svg.querySelector('#body-original-3');
        if (bodyOriginal3) {
            bodyOriginal3.style.setProperty('display', 'inline', 'important');
            console.log('[SVG] Set body-original-3 to visible');
        }
    }
    
    // Скрыть все остальные *-original-* слои, которые не должны быть видны
    const allOriginalLayers = svg.querySelectorAll('[id*="-original-"]');
    allOriginalLayers.forEach(layer => {
        const layerId = layer.id;
        const shouldHide = 
            (layerId.startsWith('spheres-original-') && layerId !== 'spheres-original-3') ||
            (layerId.startsWith('body-original-') && layerId !== 'body-original-3');
            
        if (shouldHide) {
            layer.style.setProperty('display', 'none', 'important');
        }
    });
    
    console.log('[SVG] Visibility initialization completed');
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
        
        console.log('Loading SVG from path:', svgPath);
        
        const response = await fetch(svgPath);
        if (!response.ok) {
            throw new Error(`Failed to load SVG: ${response.status}`);
        }
        const svgText = await response.text();
        
        const container = document.getElementById('microphone-svg-container');
        if (!container) {
            console.error('SVG container not found: #microphone-svg-container');
            return;
        }
        
        container.innerHTML = svgText;
        console.log('SVG loaded successfully');
        
        // Инициализация видимости слоев после загрузки SVG
        const svg = container.querySelector('svg');
        if (svg) {
            const initialState = stateManager.get();
            initSVGVisibility(svg, initialState);
        }
    } catch (e) {
        console.error("Failed to load SVG:", e);
        // Fallback - создаем базовый SVG если загрузка не удалась
        const container = document.getElementById('microphone-svg-container');
        if (container) {
            container.innerHTML = `
                <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                    <rect width="800" height="600" fill="#f0f0f0"/>
                    <text x="400" y="300" text-anchor="middle" fill="#666">SVG загрузка не удалась</text>
                </svg>
            `;
        }
    }

    const svg = document.querySelector('#microphone-svg-container svg');
    if (svg) {
        svg.style.transformOrigin = 'center bottom';
        updateResponsiveAssets(svg);
    }
    updateSVG();

    // Re-update assets on window resize
    eventRegistry.add(window, 'resize', () => {
        const currentSvg = document.querySelector('#microphone-svg-container svg');
        if (currentSvg) updateResponsiveAssets(currentSvg);
    });
}
