import { stateManager } from './core/state.js';
import { CONFIG } from './config.js';
import { updateSectionLayers } from './modules/appearance-new.js';
import { updateLogoSVG } from './modules/logo.js';
import { getAssetSuffix } from './utils.js';
import { eventRegistry } from './core/events.js';
import { debugLog, debugWarn } from './utils/debug.js';

function getMicrophoneContainer() {
    return document.getElementById('microphone-svg-container');
}

function getMicrophoneSvg() {
    return getMicrophoneContainer()?.querySelector('svg') || null;
}

function setLayerDisplay(layer, display, important = false) {
    if (!layer) {
        return;
    }

    if (important) {
        layer.style.setProperty('display', display, 'important');
        return;
    }

    layer.style.display = display;
}

function updateGrillVisibility(svg, spheresState = {}) {
    const showGrills = !!spheresState.isRal && spheresState.svgTargetMode !== 'original';

    for (let i = 1; i <= 3; i++) {
        setLayerDisplay(svg.querySelector(`#img-grill-mic${i}`), showGrills ? 'inline' : 'none');
    }
}

function updateDefaultSectionLayers(state) {
    updateSectionLayers('spheres', state.spheres || {});
    updateSectionLayers('body', state.body || {});
    updateSectionLayers('logobg', state.logobg || {});
    updateSectionLayers('logo', state.logo || {});
}

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
        const svg = getMicrophoneSvg();
        if (!svg) {
            debugWarn('[SVG] SVG element not found in #microphone-svg-container, skipping update');
            return;
        }

        const state = stateManager.get();
        if (!state) {
            debugWarn('[SVG] State manager not initialized, skipping update');
            return;
        }

        const currentModelCode = state.currentModelCode || '';
        svg.style.transform = currentModelCode.startsWith('023') ? `scale(${CONFIG.scaleFactor})` : 'scale(1)';

        updateGrillVisibility(svg, state.spheres || {});

        updateDefaultSectionLayers(state);
        updateLogoSVG();
    } catch (e) {
        console.error("SVG Update Error:", e);
        console.error("Visualization update error");
    }
}

export function initSVGVisibility(svg, initialState) {
    if (!svg || !initialState) return;
    
    debugLog('[SVG] Initializing visibility for initial state:', initialState);
    
    // Показать правильные "original" слои для начального состояния
    const spheresVariant = initialState.spheres?.variant;
    const bodyVariant = initialState.body?.variant;
    const logobgVariant = initialState.logobg?.variant;
    const logoVariant = initialState.logo?.variant;
    
    // Для spheres: если variant 'satinsteel', '3' или 'non-ral', показать spheres-original-3
    if (spheresVariant === 'satinsteel' || spheresVariant === '3' || spheresVariant === 'non-ral') {
        const spheresOriginal3 = svg.querySelector('#spheres-original-3');
        if (spheresOriginal3) {
            setLayerDisplay(spheresOriginal3, 'inline', true);
            debugLog('[SVG] Set spheres-original-3 to visible');
        }
    }
    
    // Для body: если variant 'satinsteel', '3' или 'non-ral', показать body-original-3  
    if (bodyVariant === 'satinsteel' || bodyVariant === '3' || bodyVariant === 'non-ral') {
        const bodyOriginal3 = svg.querySelector('#body-original-3');
        if (bodyOriginal3) {
            setLayerDisplay(bodyOriginal3, 'inline', true);
            debugLog('[SVG] Set body-original-3 to visible');
        }
    }
    
    // Для logobg: если variant не RAL, показать logobg-black
    if (!logobgVariant || !logobgVariant.includes('RAL')) {
        const logobgBlack = svg.querySelector('#logobg-black');
        if (logobgBlack) {
            setLayerDisplay(logobgBlack, 'inline', true);
            debugLog('[SVG] Set logobg-black to visible');
        }
    }
    
    // Для logo: показать начальный слой или скрыть при custom logo
    if (initialState.logo?.useCustom) {
        const logotypeGold = svg.querySelector('#logotype-gold');
        if (logotypeGold) {
            setLayerDisplay(logotypeGold, 'none', true);
            debugLog('[SVG] Hide logotype-gold for custom logo');
        }
    } else if (!logoVariant || logoVariant === 'brass-logo') {
        const logotypeGold = svg.querySelector('#logotype-gold');
        if (logotypeGold) {
            setLayerDisplay(logotypeGold, 'inline', true);
            debugLog('[SVG] Set logotype-gold to visible');
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
            setLayerDisplay(layer, 'none', true);
        }
    });
    
    debugLog('[SVG] Visibility initialization completed');
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
        
        debugLog('Loading SVG from path:', svgPath);
        
        const response = await fetch(svgPath);
        if (!response.ok) {
            throw new Error(`Failed to load SVG: ${response.status}`);
        }
        const svgText = await response.text();
        
        const container = getMicrophoneContainer();
        if (!container) {
            console.error('SVG container not found: #microphone-svg-container');
            return;
        }
        
        container.innerHTML = svgText;
        debugLog('SVG loaded successfully');
        
        // Инициализация видимости слоев после загрузки SVG
        const svg = container.querySelector('svg');
        if (svg) {
            const initialState = stateManager.get();
            initSVGVisibility(svg, initialState);
        }
    } catch (e) {
        console.error("Failed to load SVG:", e);
        // Fallback - создаем базовый SVG если загрузка не удалась
        const container = getMicrophoneContainer();
        if (container) {
            container.innerHTML = `
                <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                    <rect width="800" height="600" fill="#f0f0f0"/>
                    <text x="400" y="300" text-anchor="middle" fill="#666">SVG загрузка не удалась</text>
                </svg>
            `;
        }
    }

    const svg = getMicrophoneSvg();
    if (svg) {
        svg.style.transformOrigin = 'center bottom';
        updateResponsiveAssets(svg);
    }
    updateSVG();

    // Re-update assets on window resize
    eventRegistry.add(window, 'resize', () => {
        const currentSvg = getMicrophoneSvg();
        if (currentSvg) updateResponsiveAssets(currentSvg);
    });
}
