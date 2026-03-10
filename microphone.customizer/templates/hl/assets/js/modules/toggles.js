// ============================================
// TOGGLE FUNCTIONS
// ============================================

import { stateManager } from '../core/state.js';
import { getBreakdown } from './price-calculator.js';
import { uploadCustomLogo } from './logo.js';
import { updateShockmountVisibility } from './shockmount-new.js';

/**
 * Toggle Logo Mode
 * Управляет переключением между стандартной эмблемой и кастомным логотипом
 */
export function toggleLogoMode() {
    //находим элементы для изменений
    //checkbox - чекбокс переключения
    const checkbox = document.getElementById('logo-mode-toggle');
    //logoSection - секция стандартной эмблемы
    const logoSection = document.getElementById('logo-section');
    //logobgSection - секция фона эмблемы
    const logobgSection = document.querySelector('[data-section="logobg"]');
    //customLogoSection - секция кастомного логотипа
    const customLogoSection = document.querySelector('.toggle-logo-section');
    //uploadArea - область загрузки кастомного логотипа
    const uploadArea = document.getElementById('custom-logo-upload-area');
    const logoOverlay = document.getElementById('logo-overlay');
    //если чекбокс не найден, выходим
    if (!checkbox) return;
    
    const isChecked = checkbox.checked;
    
    // Update state
    stateManager.set('logo.useCustom', isChecked);
    
    // Update prices using price calculator
    const currentState = stateManager.get();
    // Получаем расчет цены
    const priceBreakdown = getBreakdown(currentState);
    // Обновляем цену логотипа в состоянии
    stateManager.set('prices.logo', priceBreakdown.logo);
    
    // Update UI visibility
    if (isChecked) {
        // Show custom logo, hide standard sections
        if (logoSection) logoSection.classList.add('hidden');
        if (logobgSection) logobgSection.classList.add('hidden');
        if (customLogoSection) customLogoSection.style.display = 'block';
        if (uploadArea) uploadArea.style.display = 'block';
        if (logoOverlay) logoOverlay.style.display = 'block';
    } else {
        // Show standard sections, hide custom logo
        if (logoSection) logoSection.classList.remove('hidden');
        if (logobgSection) logobgSection.classList.remove('hidden');
        if (customLogoSection) customLogoSection.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'none';
        if (logoOverlay) logoOverlay.style.display = 'none';
    }
    
    // Update price - removed direct price setting, will be handled by price calculator
    
    console.log(`[Toggle] Logo mode: ${isChecked ? 'custom' : 'standard'}`);
}

/**
 * Toggle Laser Engraving
 * Управляет переключением лазерной гравировки на футляре
 */
export function toggleLaserEngraving() {
    //находим элементы для изменений
    //checkbox - чекбокс переключения
    const checkbox = document.getElementById('laser-engraving-toggle');
    //dataSection - секция данных для гравировки
    const dataSection = document.getElementById('laser-engraving-data');
    
    //если чекбокс или секция данных не найдены, выходим
    if (!checkbox || !dataSection) return;
    //isChecked - значение чекбокса
    const isChecked = checkbox.checked;
    
    // Update state - Обновляем состояние
    stateManager.set('case.laserEngravingEnabled', isChecked);
    
    // Update prices using price calculator - Обновляем цены
    const currentState = stateManager.get();
    // Получаем расчет цены
    const priceBreakdown = getBreakdown(currentState);
    // Обновляем цену футляра в состоянии
    stateManager.set('prices.case', priceBreakdown.case);
    
    // Update UI visibility - Обновляем видимость UI
    if (isChecked) {
        dataSection.style.display = 'block';
    } else {
        dataSection.style.display = 'none';
    }
    
   
    
    console.log(`[Toggle] Laser engraving: ${isChecked ? 'enabled' : 'disabled'}`);
}

/**
 * Toggle Shockmount
 * Управляет переключением подвеса с ценой 10000₽
 */
export function toggleShockmount() {
    //находим элементы для изменений
    //checkbox - чекбокс переключения
    const checkbox = document.getElementById('shockmount-switch');
    
    //если чекбокс не найден, выходим
    if (!checkbox) return;
    
    const isChecked = checkbox.checked;
    
    // Update state - Обновляем состояние
    stateManager.set('shockmount.enabled', isChecked);
    
    // Update prices using price calculator - Обновляем цены
    const currentState = stateManager.get();
    // Получаем расчет цены
    const priceBreakdown = getBreakdown(currentState);
    // Обновляем цену подвеса в состоянии
    stateManager.set('prices.shockmount', priceBreakdown.shockmount);
    
    // Update visibility through shockmount module
    updateShockmountVisibility();
    
    console.log(`[Toggle] Shockmount: ${isChecked ? 'enabled' : 'disabled'}`);
}

/**
 * Initialize toggle states based on current state
 */
export function initToggles() {
    // Add event listeners for toggle elements
    const logoCheckbox = document.getElementById('logo-mode-toggle');
    if (logoCheckbox) {
        logoCheckbox.addEventListener('change', toggleLogoMode);
        
        const useCustomLogo = stateManager.get('logo.useCustom') || false;
        logoCheckbox.checked = useCustomLogo;
        
        // Set initial UI state
        if (useCustomLogo) {
            const logoSection = document.getElementById('logo-section');
            const logobgSection = document.querySelector('[data-section="logobg"]');
            const customLogoSection = document.querySelector('.toggle-logo-section');
            const uploadArea = document.getElementById('custom-logo-upload-area');
            const logoOverlay = document.getElementById('logo-overlay');
            
            if (logoSection) logoSection.classList.add('hidden');
            if (logobgSection) logobgSection.classList.add('hidden');
            if (customLogoSection) customLogoSection.style.display = 'block';
            if (uploadArea) uploadArea.style.display = 'block';
            if (logoOverlay) logoOverlay.style.display = 'block';
        }
    }
    
    // Initialize laser engraving toggle - Инициализируем переключатель лазерной гравировки
    const laserCheckbox = document.getElementById('laser-engraving-toggle');
    // Если чекбокс найден
    if (laserCheckbox) {
        // Добавляем обработчик события изменения
        laserCheckbox.addEventListener('change', toggleLaserEngraving);
        
        // Получаем состояние лазерной гравировки из состояния приложения
        const laserEnabled = stateManager.get('case.laserEngravingEnabled') || false;
        // Устанавливаем чекбокс в соответствующее состояние
        laserCheckbox.checked = laserEnabled;
        
        // Set initial UI state
        const dataSection = document.getElementById('laser-engraving-data');
        const posControls = document.getElementById('case-positioning-controls');
        if (dataSection) {
            dataSection.style.display = laserEnabled ? 'block' : 'none';
        }
        if (posControls) {
            posControls.style.display = (laserEnabled && stateManager.get('case.customLogo')) ? 'block' : 'none';
        }
    }

    // Add case upload/clear handlers
    const caseUploadBtn = document.getElementById('case-upload-btn');
    if (caseUploadBtn) {
        caseUploadBtn.addEventListener('click', () => {
            if (window.WoodCase) {
                document.getElementById('case-file-input').click();
            }
        });
    }

    const caseClearBtn = document.getElementById('case-clear-btn');
    if (caseClearBtn) {
        caseClearBtn.addEventListener('click', () => {
            if (window.WoodCase) {
                window.WoodCase.clearLogo();
            }
        });
    }
    
    // Initialize shockmount toggle - Инициализируем переключатель подвеса
    const shockmountCheckbox = document.getElementById('shockmount-switch');
    if (shockmountCheckbox) {
        shockmountCheckbox.addEventListener('change', toggleShockmount);
        // Получаем состояние подвеса из состояния приложения
        const shockmountEnabled = stateManager.get('shockmount.enabled') || false;
        // Устанавливаем чекбокс в соответствующее состояние
        shockmountCheckbox.checked = shockmountEnabled;
        
        // Set initial UI state - Устанавливаем начальное состояние UI
        const shockmountSection = document.getElementById('shockmount-section');
        const shockmountPinsSection = document.getElementById('shockmountPins-section');
        const includedText = document.getElementById('shockmount-included-text');
        
        if (shockmountEnabled) {
            if (shockmountSection) shockmountSection.style.display = 'flex';
            if (shockmountPinsSection) shockmountPinsSection.style.display = 'flex';
            if (includedText) includedText.style.display = 'block';
        } else {
            if (shockmountSection) shockmountSection.style.display = 'none';
            if (shockmountPinsSection) shockmountPinsSection.style.display = 'none';
            if (includedText) includedText.style.display = 'none';
        }
    }
    
    // Добавляем обработчик для кнопки загрузки кастомного логотипа
    const uploadButton = document.querySelector('#custom-logo-upload-area .variant-item');
    if (uploadButton) {
        uploadButton.addEventListener('click', uploadCustomLogo);
    }
}
