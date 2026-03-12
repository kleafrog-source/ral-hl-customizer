import { currentState, setState } from '../state.js';
import { updateUI } from '../ui-core.js';
import { CONFIG } from '../config.js';
import { switchPreview } from './accessories.js';
import { updateSVG } from '../engine.js';

// Бесплатные цвета для шокмаунта
const FREE_SHOCKMOUNT_COLORS = ['RAL9003', 'RAL1013', 'RAL9005'];

// Helper функция для конвертации hex в rgb
function hexToRgb(hex) {
    if (!hex) return 'rgb(0,0,0)';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 'rgb(0,0,0)';
}

// Обновление цвета SVG элементов
function updateShockmountColor(part, hex) {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const rgb = hexToRgb(hex);
    const floodId = part === 'body' ? 'feFlood6' : 'feFlood8';

    const el = shockmountSvg.querySelector(`#${floodId}`);
    if (el) {
        el.setAttribute('flood-color', rgb);
    }
}

// Инициализация шокмаунта
export function initShockmount() {
    console.log('🔧 Shockmount initialized');
    // Никаких автокликов и принудительных смен при загрузке
    initShockmountEventListeners();
    updateShockmountVisibility();
    updateShockmountLayers();
}

export function updateShockmountVisibility() {
    const shockmountMenuItem = document.getElementById('shockmount-menu-item');
    const shockmountPinsMenuItem = document.getElementById('shockmount-pins-menu-item');
    const shockmountOptionsSection = document.getElementById('shockmount-options-section');
    const switchContainer = document.getElementById('shockmount-switch-container');
    const includedText = document.getElementById('shockmount-included-text');
    const ralSection = document.getElementById('shockmount-pins-ral-section'); // RAL K7 секция

    if (!shockmountMenuItem) return;

    const isBomblet = currentState.variant === '023-the-bomblet';
    const isDeluxe = currentState.variant === '023-deluxe';
    const needsOptionalSwitch = isBomblet; // Только у Bomblet опционально
    
    shockmountMenuItem.style.display = 'flex';
    if (shockmountPinsMenuItem) {
        shockmountPinsMenuItem.style.display = currentState.shockmount.enabled ? 'flex' : 'none';
    }

    // Управляем видимостью RAL K7 для пинов
    if (ralSection) {
        if (isBomblet && !currentState.shockmount.enabled) {
            // Скрываем RAL K7 если Bomblet и шокмаунт выключен
            ralSection.style.display = 'none';
        } else {
            // Показываем RAL K7 для всех остальных случаев
            ralSection.style.display = 'block';
        }
    }

    if (needsOptionalSwitch) {
        if(switchContainer) switchContainer.style.display = 'block';
        // Полностью скрываем текст о включении в комплект
        if(includedText) includedText.style.display = 'none';
        const isEnabled = currentState.shockmount.enabled;
        if(shockmountOptionsSection) shockmountOptionsSection.style.display = isEnabled ? 'block' : 'none';
        const shockmountSwitch = document.getElementById('shockmount-switch');
        if(shockmountSwitch) shockmountSwitch.checked = isEnabled;
        setState('prices.shockmount', isEnabled ? CONFIG.shockmountPrice : 0);
    } else {
        // Для других моделей (включая Deluxe) скрываем свитч (подвес в комплекте)
        if(switchContainer) switchContainer.style.display = 'none';
        // Показываем текст о включении в комплект
        if(includedText) includedText.style.display = 'block';
        if(shockmountOptionsSection) shockmountOptionsSection.style.display = 'block';
        setState('shockmount.enabled', true);
        setState('prices.shockmount', 0);
    }

    if (!currentState.shockmount.enabled && document.querySelector('.preview-switch-btn.active')?.dataset.preview === 'shockmount') {
        switchPreview('microphone');
    }
}

export function toggleShockmount() {
    const isEnabled = document.getElementById('shockmount-switch').checked;
    setState('shockmount.enabled', isEnabled);
    updateShockmountVisibility();
    updateUI();
}

export function updateShockmountLayers() {
    const shockmountSVG = document.getElementById('shockmount-svg');
    if (!shockmountSVG) return;

    const layer017 = shockmountSVG.querySelector('#layer10');
    const layer023 = shockmountSVG.querySelector('#layer9');

    if (!layer017 || !layer023) return;

    if (currentState.model === '017') {
        layer017.style.display = 'inline';
        layer023.style.display = 'none';
    } else { // model is '023'
        layer017.style.display = 'none';
        layer023.style.display = 'inline';
    }
}

export function handleShockmountVariantSelection(variant) {
    const section = document.getElementById('shockmount-options-section');
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));

    // Ищем элемент с учетом префиксов
    let target = section.querySelector(`[data-variant="shock-${variant}"]`);
    if (!target) {
        target = section.querySelector(`[data-variant="${variant}"]`);
    }
    if (target) target.classList.add('selected');

    // Также убираем выбор кастомного цвета из палитры
    document.getElementById('pal-shockmount').querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));

    const colors = { 'RAL9003': '#F4F4F4', 'RAL1013': '#EAE0C8', 'RAL9005': '#0E0E10' };
    const cleanVariant = variant.replace('shock-', '');
    
    setState('shockmount.variant', variant);
    setState('shockmount.color', `RAL ${cleanVariant}`);
    setState('shockmount.colorValue', colors[cleanVariant]);
    
    // Цена: бесплатные цвета - 0, остальные - CONFIG.optionPrice
    const isFree = FREE_SHOCKMOUNT_COLORS.includes(cleanVariant);
    setState('prices.shockmount', isFree ? 0 : CONFIG.optionPrice);

    updateUI();
    updateShockmountPreview();
    updateSVG();
}

export function handleShockmountColorSelection(color, ralName) {
    const section = document.getElementById('shockmount-options-section');
    section.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));

    setState('shockmount.variant', 'custom');
    setState('shockmount.color', `RAL ${ralName}`);
    setState('shockmount.colorValue', color);
    
    // Цена: бесплатные цвета - 0, остальные - CONFIG.optionPrice
    const isFree = FREE_SHOCKMOUNT_COLORS.includes(ralName);
    setState('prices.shockmount', isFree ? 0 : CONFIG.optionPrice);

    updateUI();
    updateShockmountPreview();
    updateSVG();
}

export function handleShockmountPinSelection(variant, color = null, ralName = null) {
    const section = document.getElementById('shockmount-pins-section');
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));
    document.getElementById('pal-pins').querySelectorAll('.shockmount-pins-swatch').forEach(s => s.classList.remove('selected'));

    let pinsState;
    
    if (variant === 'custom') {
        // Пользователь выбрал RAL цвет из палитры
        pinsState = {
            variant: `pins-${ralName}`,
            color: `RAL ${ralName}`,
            colorValue: color
        };
        
        const targetSwatch = document.getElementById('pal-pins').querySelector(`[data-ral="${ralName}"]`);
        if(targetSwatch) targetSwatch.classList.add('selected');
    } else {
        // Стандартный вариант (RAL9003, RAL1013, RAL9005)
        const ralCode = variant.replace('pins-', '');
        const colors = {
            'RAL9003': '#F4F4F4',
            'RAL1013': '#EAE0C8', 
            'RAL9005': '#0E0E10'
        };
        
        pinsState = {
            variant: variant,
            color: `RAL ${ralCode}`,
            colorValue: colors[ralCode]
        };
        
        // Ищем с префиксом pins-
        let targetPins = section.querySelector(`[data-variant="pins-${ralCode}"]`);
        if (!targetPins) {
            targetPins = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (targetPins) targetPins.classList.add('selected');
    }
    
    // Устанавливаем состояние
    setState('shockmount.pins', pinsState);
    
    // Цена: бесплатные цвета - 0, остальные - CONFIG.optionPrice
    const ralCode = pinsState.variant.replace('pins-', '');
    const isFree = FREE_SHOCKMOUNT_COLORS.includes(ralCode);
    setState('prices.pins', isFree ? 0 : CONFIG.optionPrice);

    updateUI();
    updateShockmountPinsPreview();
    updateSVG();
}

export function updateShockmountPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const hasCustomColor = !!currentState.shockmount.colorValue;

    const layers = {
        main017: shockmountSvg.querySelector('#shockmount-017-pins-brass-group'),
        colorize017: shockmountSvg.querySelector('#feFlood6'),
        main023: shockmountSvg.querySelector('#shockmount-023-pins-brass-group'),
        colorize023: shockmountSvg.querySelector('#feFlood8'),
    };

    // Toggle 017 layers
    if (layers.main017) layers.main017.style.display = hasCustomColor ? 'none' : 'inline';
    // if (layers.colorize017) layers.colorize017.style.display = hasCustomColor ? 'inline' : 'none';

    // Toggle 023 layers
    if (layers.main023) layers.main023.style.display = hasCustomColor ? 'none' : 'inline';
    // if (layers.colorize023) layers.colorize023.style.display = hasCustomColor ? 'inline' : 'none';

    if (hasCustomColor) {
        updateShockmountColor('body', currentState.shockmount.colorValue);
    }
}

export function updateShockmountPinsPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const pinsState = currentState.shockmount.pins;
    if (!pinsState || !pinsState.colorValue) return;
    
    console.log('🎨 Updating pins color to:', pinsState.colorValue);
    updateShockmountColor('pins', pinsState.colorValue);
}

function initShockmountEventListeners() {
    document.getElementById('shockmount-switch')?.addEventListener('change', toggleShockmount);

    document.querySelectorAll('#shockmount-options-section .variant-item').forEach(item => {
        item.addEventListener('click', () => handleShockmountVariantSelection(item.dataset.variant));
    });

    document.querySelectorAll('#shockmount-pins-section .variant-item').forEach(item => {
        item.addEventListener('click', () => handleShockmountPinSelection(item.dataset.variant));
    });
}
