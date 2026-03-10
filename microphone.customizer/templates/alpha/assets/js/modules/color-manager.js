// ============================================
// COLOR MANAGER - Управление цветами через StateManager
// ============================================

import { stateManager } from '../core/state.js';
import { FREE_VARIANTS, isFreeVariant, getFreeVariantByValue } from '../config/free-variants.config.js';

/**
 * Инициализация менеджера цветов
 */
export function initColorManager() {
    // Устанавливаем начальные значения для бесплатных вариантов
    Object.keys(FREE_VARIANTS).forEach(section => {
        const currentState = stateManager.get();
        const sectionState = currentState[section];
        
        if (!sectionState || !sectionState.color) {
            // Устанавливаем первый бесплатный вариант как значение по умолчанию
            const firstVariant = FREE_VARIANTS[section][0];
            if (firstVariant) {
                const value = firstVariant.ralCode || firstVariant.labelen;
                const variant = firstVariant.dataVariant || firstVariant.isNonRal ? 'non-ral' : 'ral';
                stateManager.set(`${section}.color`, value);
                stateManager.set(`${section}.colorValue`, firstVariant.hex);
                stateManager.set(`${section}.variant`, variant);
            }
        }
    });
}

/**
 * Обработчик выбора цвета для секции
 */
export function handleColorSelection(section, value, hex, variant = 'ral', label = '') {
    // Обновляем состояние через StateManager
    stateManager.set(`${section}.color`, value);
    stateManager.set(`${section}.colorValue`, hex || '');
    stateManager.set(`${section}.variant`, variant);
    
    // Price will be calculated by price calculator based on state
    // No direct price setting here to avoid conflicts
    
    // Обновляем UI только если есть hex
    if (hex) {
        updateColorDisplay(section, hex, label);
    }
    
    console.log(`[Color Manager] ${section}: ${value} (${hex || 'no hex'})`);
}

/**
 * Обновление отображения цвета в UI
 */
export function updateColorDisplay(section, hex, label) {
    const displayElement = document.getElementById(`${section}-color-display`);
    const subtitleElement = document.getElementById(`${section}-subtitle`);
    
    if (displayElement) {
        displayElement.style.backgroundColor = hex || '';
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = label || '';
    }
}

/**
 * Создание quick-select вариантов для секции
 */
export function createQuickSelect(section) {
    const container = document.getElementById(`quick-select-${section}`);
    if (!container) return;
    
    const variants = FREE_VARIANTS[section];
    if (!variants) return;
    
    container.innerHTML = '';
    
    variants.forEach(variant => {
        const value = variant.ralCode || variant.labelen;
        const variantType = variant.dataVariant || (variant.isNonRal ? 'non-ral' : 'ral');
        const div = document.createElement('div');
        div.className = 'variant-item variant-button';
        div.dataset.value = value;
        div.dataset.variant = variantType;
        div.dataset.section = section;
        div.tabIndex = 0;
        
        div.innerHTML = `
            <div class="variant-info">
                <div class="variant-icon" style="background: ${variant.hex};"></div>
                <span class="variant-label">${variant.label}</span>
            </div>
            <span class="variant-price">+0₽</span>
        `;
        
        // Добавляем обработчик клика
        div.addEventListener('click', () => {
            handleColorSelection(section, value, variant.hex, variantType, variant.labelen);
        });
        
        container.appendChild(div);
    });
}

/**
 * Инициализация всех quick-select контейнеров
 */
export function initAllQuickSelects() {
    Object.keys(FREE_VARIANTS).forEach(section => {
        createQuickSelect(section);
    });
}

/**
 * Получение текущего состояния цвета для секции
 */
export function getCurrentColorState(section) {
    const state = stateManager.get();
    return {
        color: state[section]?.color,
        colorValue: state[section]?.colorValue,
        variant: state[section]?.variant,
        price: state.prices?.[section] || 0
    };
}

/**
 * Сброс цвета к бесплатному варианту
 */
export function resetToFreeVariant(section) {
    const firstVariant = FREE_VARIANTS[section][0];
    if (firstVariant) {
        const value = firstVariant.ralCode || firstVariant.labelen;
        const variantType = firstVariant.dataVariant || (firstVariant.isNonRal ? 'non-ral' : 'ral');
        handleColorSelection(section, value, firstVariant.hex, variantType, firstVariant.labelen);
    }
}
