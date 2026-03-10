// data-attributes-handler.js
// Модуль для работы с data-атрибутами из HTML, сгенерированного через PHP

import { stateManager } from '../core/state.js';
import { eventRegistry } from '../core/events.js';
import { applyColorToSection } from './color-utils.js';
import { updateStateFromOption } from './hl-data-manager.js';

/**
 * Чтение данных из data-атрибутов элемента
 * @param {HTMLElement} element - DOM элемент с data-атрибутами
 * @returns {Object} - Объект с данными из атрибутов
 */
export function readDataAttributes(element) {
    const data = {};
    
    // Основные атрибуты
    data.optionPart = element.dataset.optionPart || '';
    data.variantCode = element.dataset.variantCode || '';
    data.variantName = element.dataset.variantName || '';
    data.isRal = parseInt(element.dataset.isRal || 0);
    data.price = parseInt(element.dataset.price || 0);
    data.modelId = parseInt(element.dataset.modelId || 0);
    data.optionId = parseInt(element.dataset.optionId || 0);
    
    // SVG атрибуты
    data.svgTargetMode = element.dataset.svgTargetMode || '';
    data.svgLayerGroup = element.dataset.svgLayerGroup || '';
    data.svgFilterId = element.dataset.svgFilterId || '';
    data.svgSpecialKey = element.dataset.svgSpecialKey || '';
    
    // RAL атрибуты (если есть)
    if (data.isRal) {
        data.ralId = element.dataset.ralId || '';
        data.ralHex = element.dataset.ralHex || '';
        data.ralName = element.dataset.ralName || '';
    }
    
    return data;
}

/**
 * Создание объекта состояния из data-атрибутов
 * @param {Object} data - Данные из readDataAttributes
 * @returns {Object} - Объект состояния для сохранения в stateManager
 */
export function createStateFromDataAttributes(data) {
    const state = {
        variant: data.variantCode,
        isRal: data.isRal,
        price: data.price,
        modelId: data.modelId,
        svgTargetMode: data.svgTargetMode,
        svgLayerGroup: data.svgLayerGroup,
        svgFilterId: data.svgFilterId,
        svgSpecialKey: data.svgSpecialKey
    };
    
    // Добавляем RAL данные если это RAL вариант
    if (data.isRal) {
        state.color = data.ralHex;
        state.colorValue = data.ralHex;
        state.colorName = data.ralName;
        state.ralId = data.ralId;
    }
    
    return state;
}

/**
 * Обработчик клика по варианту с data-атрибутами
 * @param {HTMLElement} element - Элемент по которому кликнули
 */
export function handleVariantClick(element) {
    // Читаем data-атрибуты
    const data = readDataAttributes(element);
    
    if (!data.optionPart || !data.variantCode) {
        console.warn('[Data Attributes] Missing required data attributes', data);
        return;
    }
    
    console.log('[Data Attributes] Processing variant click:', data);
    
    // Создаем состояние
    const newState = createStateFromDataAttributes(data);
    
    // Обновляем state manager
    stateManager.set(data.optionPart, newState);
    
    // Применяем цвет если нужно
    if (data.isRal && data.ralHex) {
        applyColorToSection(data.optionPart, {
            color: data.ralHex,
            colorValue: data.ralHex,
            colorName: data.ralName,
            variant: data.variantCode,
            isRal: data.isRal
        });
    }
    
    // Обновляем UI
    updateVariantUI(element, data);
    
    // Генерируем событие
    eventRegistry.emit('variantChanged', {
        section: data.optionPart,
        variant: data.variantCode,
        data: data
    });
    
    console.log('[Data Attributes] State updated for', data.optionPart, ':', newState);
}

/**
 * Обновление UI после выбора варианта
 * @param {HTMLElement} selectedElement - Выбранный элемент
 * @param {Object} data - Данные варианта
 */
export function updateVariantUI(selectedElement, data) {
    // Убираем active класс у всех вариантов в этой секции
    const sectionContainer = selectedElement.closest('.submenu, .radio-set');
    if (sectionContainer) {
        const allButtons = sectionContainer.querySelectorAll('.option-button');
        allButtons.forEach(btn => btn.classList.remove('active'));
    }
    
    // Добавляем active класс выбранному элементу
    selectedElement.classList.add('active');
    
    // Обновляем отображение цены если нужно
    updatePriceDisplay();
}

/**
 * Обновление отображения цены
 */
export function updatePriceDisplay() {
    const currentState = stateManager.get();
    const basePrice = window.CUSTOMIZER_DATA?.modelsByCode?.[currentState.model]?.BASE_PRICE || 0;
    
    // Суммируем все дополнительные цены
    let additionalPrice = 0;
    
    // Основные секции
    ['spheres', 'body', 'logo', 'logobg', 'case', 'shockmount', 'shockmountPins'].forEach(section => {
        const sectionState = currentState[section];
        if (sectionState && sectionState.price) {
            additionalPrice += sectionState.price;
        }
    });
    
    // Liquid toggle опции
    if (currentState.customLogo?.enabled) {
        // Добавить цену за кастомный логотип
        const customLogoPrice = findPriceForRule('custom-microphone-logo');
        if (customLogoPrice) additionalPrice += customLogoPrice;
    }
    
    if (currentState.laserEngraving?.enabled) {
        // Добавить цену за гравировку
        const engravingPrice = findPriceForRule('custom-woodcase-image');
        if (engravingPrice) additionalPrice += engravingPrice;
    }
    
    if (currentState.shockmount?.enabled && !currentState.shockmount?.included) {
        // Добавить цену за подвес если он не включен в комплект
        const shockmountPrice = currentState.shockmount?.price || 0;
        additionalPrice += shockmountPrice;
    }
    
    const totalPrice = basePrice + additionalPrice;
    
    // Обновляем отображение
    const priceElement = document.getElementById('total-price');
    if (priceElement) {
        priceElement.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    }
    
    console.log('[Price] Updated:', { basePrice, additionalPrice, totalPrice });
}

/**
 * Поиск цены по правилу
 * @param {string} rule - Правло для цены
 * @returns {number} - Цена или 0
 */
function findPriceForRule(rule) {
    const prices = window.CUSTOMIZER_DATA?.prices || {};
    
    // Ищем в секции 'custom' или других подходящих секциях
    for (const [sectionCode, sectionPrices] of Object.entries(prices)) {
        if (sectionPrices['_ral_surcharge']) continue; // Пропускаем надбавки
        
        for (const [modelCode, modelPrices] of Object.entries(sectionPrices)) {
            if (modelCode === '' || modelCode === stateManager.get('currentModelCode')) {
                for (const [variantCode, price] of Object.entries(modelPrices)) {
                    if (variantCode === rule) {
                        return price;
                    }
                }
            }
        }
    }
    
    return 0;
}

/**
 * Инициализация обработчиков для всех элементов с data-атрибутами
 */
export function initDataAttributesHandlers() {
    console.log('[Data Attributes] Initializing handlers...');
    
    // Находим все кнопки с data-option-part
    const variantButtons = document.querySelectorAll('[data-option-part]');
    
    variantButtons.forEach(button => {
        // Удаляем старые обработчики если есть
        button.removeEventListener('click', handleVariantClickHandler);
        
        // Добавляем новый обработчик
        button.addEventListener('click', handleVariantClickHandler);
        
        console.log('[Data Attributes] Handler attached to:', button.dataset.optionPart, button.dataset.variantCode);
    });
    
    // Инициализация liquid toggle обработчиков
    initLiquidToggleHandlers();
    
    console.log('[Data Attributes] Initialized', variantButtons.length, 'variant handlers');
}

/**
 * Обработчик клика с правильным контекстом
 */
function handleVariantClickHandler(event) {
    event.preventDefault();
    handleVariantClick(event.currentTarget);
}

/**
 * Инициализация liquid toggle обработчиков
 */
function initLiquidToggleHandlers() {
    // Кастомный логотип
    const logoToggle = document.getElementById('logo-mode-toggle');
    if (logoToggle) {
        logoToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            const logoSection = document.querySelector('#logo-submenu');
            
            if (isEnabled) {
                // Включаем кастомный логотип
                stateManager.set('customLogo', { enabled: true });
                
                // Скрываем стандартные варианты логотипа
                if (logoSection) logoSection.style.display = 'none';
                
                // Показываем область загрузки
                const uploadArea = document.getElementById('custom-logo-upload-area');
                if (uploadArea) uploadArea.style.display = 'block';
            } else {
                // Выключаем кастомный логотип
                stateManager.set('customLogo', { enabled: false });
                
                // Показываем стандартные варианты логотипа
                if (logoSection) logoSection.style.display = 'block';
                
                // Скрываем область загрузки
                const uploadArea = document.getElementById('custom-logo-upload-area');
                if (uploadArea) uploadArea.style.display = 'none';
            }
            
            updatePriceDisplay();
        });
    }
    
    // Гравировка футляра
    const engravingToggle = document.getElementById('laser-engraving-toggle');
    if (engravingToggle) {
        engravingToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            
            if (isEnabled) {
                stateManager.set('laserEngraving', { enabled: true });
                
                // Показываем блок гравировки
                const engravingData = document.getElementById('laser-engraving-data');
                if (engravingData) engravingData.style.display = 'block';
            } else {
                stateManager.set('laserEngraving', { enabled: false });
                
                // Скрываем блок гравировки
                const engravingData = document.getElementById('laser-engraving-data');
                if (engravingData) engravingData.style.display = 'none';
            }
            
            updatePriceDisplay();
        });
    }
    
    // Подвес
    const shockmountToggle = document.getElementById('shockmount-switch');
    if (shockmountToggle) {
        shockmountToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            const currentModel = window.CUSTOMIZER_DATA?.modelsByCode?.[stateManager.get('currentModelCode')];
            const isShockmountIncluded = currentModel?.SHOCKMOUNT_ENABLED === 1;
            
            if (isEnabled || isShockmountIncluded) {
                stateManager.set('shockmount', { 
                    enabled: true, 
                    included: isShockmountIncluded,
                    price: isShockmountIncluded ? 0 : (currentModel?.SHOCKMOUNT_PRICE || 10000)
                });
                
                // Показываем пины подвеса
                const pinsSubmenu = document.getElementById('shockmount-pins-submenu');
                if (pinsSubmenu) pinsSubmenu.style.display = 'block';
                
                // Выбираем первый вариант пинов по умолчанию
                const firstPinButton = pinsSubmenu?.querySelector('[data-option-part="shockmountPins"]');
                if (firstPinButton) {
                    handleVariantClick(firstPinButton);
                }
            } else {
                stateManager.set('shockmount', { enabled: false, included: false, price: 0 });
                
                // Скрываем пины подвеса
                const pinsSubmenu = document.getElementById('shockmount-pins-submenu');
                if (pinsSubmenu) pinsSubmenu.style.display = 'none';
            }
            
            updatePriceDisplay();
        });
    }
    
    console.log('[Data Attributes] Liquid toggle handlers initialized');
}
