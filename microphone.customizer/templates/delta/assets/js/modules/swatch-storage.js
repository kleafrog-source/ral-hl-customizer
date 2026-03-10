// ============================================
// SWATCH STORAGE MANAGER
// ============================================

import { stateManager } from '../core/state.js';
import { CONFIG } from '../config.js';
import { FREE_VARIANTS } from '../config/free-variants.config.js';

/**
 * Manages swatch storage and reuses DOM elements across sections
 */
// Класс для управления хранением и повторного использования элементов swatch
class SwatchStorageManager {
    constructor() {
        this.ralStorage = document.getElementById('ral-storage');
        this.variantStorage = document.getElementById('variant-storage');
        
        if (!this.ralStorage || !this.variantStorage) {
            console.error('[SwatchStorage] Storage containers not found');
            return;
        }
        
        // Storage Maps for caching
        this.ralSwatches = new Map();      // code → DOM element (218 total)
        this.variantItems = new Map();     // uniqueId → DOM element
        
        // Section container configuration
        this.sectionContainers = {
            spheres: { quick: 'quick-select-spheres', palette: 'pal-spheres' },
            body: { quick: 'quick-select-body', palette: 'pal-body' },
            logobg: { quick: 'quick-select-logobg', palette: 'pal-logobg' },
            shockmount: { quick: 'quick-select-shockmount', palette: 'pal-shockmount' },
            pins: { quick: 'quick-select-shockmount-pins', palette: 'pal-pins' }
        };
        
        this.currentOpenSection = null;
        this.init();
    }
    
    /**
     * Initialize storage by creating all swatches once
     */
    // Инициализируем хранилище, создавая все swatch один раз
    init() {
        // Создаем все swatch для RAL
        this.createAllRalSwatches();
        // Создаем все элементы бесплатных вариантов для быстрого выбора
        this.createAllVariantItems();
    }
    
    /**
     * Get container element for section and type
     */
    // Получаем контейнер для секции и типа
    getContainer(section, type) {
        const config = this.sectionContainers[section];
        if (!config) {
            console.error(`[SwatchStorage] No container config for section: ${section}`);
            return null;
        }
        return document.getElementById(config[type]);
    }
    
    /**
     * Get all free RAL codes
     */
    // Получаем все бесплатные коды RAL
    getAllFreeRalCodes() {
        const codes = new Set();
        Object.values(FREE_VARIANTS).forEach(variants => {
            variants.forEach(v => { if (v.ralCode) codes.add(v.ralCode); });
        });
        return codes;
    }
    
    /**
     * Create RAL swatch (218 elements, one time)
     */
    // Создаем swatch для RAL (218 элементов, один раз)
    createRalSwatch(code, hex) {
        if (this.ralSwatches.has(code)) return this.ralSwatches.get(code);
        
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.dataset.ral = code;
        swatch.dataset.color = hex;
        swatch.dataset.type = 'ral';
        swatch.style.backgroundColor = hex;
        swatch.setAttribute('role', 'button');
        swatch.setAttribute('tabindex', '0');
        swatch.setAttribute('aria-label', `RAL ${code} ${hex}`);
        swatch.title = `RAL ${code}`;
        
        // Add click handler
        swatch.addEventListener('click', () => {
            if (this.currentOpenSection) {
                this.handleColorSelection(this.currentOpenSection, hex, code);
            }
        });
        
        // Add keyboard support
        swatch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (this.currentOpenSection) {
                    this.handleColorSelection(this.currentOpenSection, hex, code);
                }
            }
        });
        
        // Store in storage
        this.ralStorage.appendChild(swatch);
        this.ralSwatches.set(code, swatch);
        return swatch;
    }
    
    /**
     * Create all RAL swatches once
     */
    // Создаем все swatch для RAL один раз
    createAllRalSwatches() {
        const hlData = stateManager.get('hlData');
        const ralPalette = hlData?.ralColors || {};

        for (let [id, colorData] of Object.entries(ralPalette)) {
            this.createRalSwatch(colorData.UF_CODE, colorData.UF_HEX);
        }
        console.log(`[SwatchStorage] Created ${this.ralSwatches.size} RAL swatches from HL data`);
    }
    
    /**
     * Create variant item for quick-select
     */
    // Создаем элемент варианта для быстрого выбора (Бесплатные варианты)
    createVariantItem(section, variant) {
        const uniqueId = `${section}-${variant.labelen}`;
        //если элемент уже существует, возвращаем его
        if (this.variantItems.has(uniqueId)) return this.variantItems.get(uniqueId);
        
        // Generate proper data-value based on variant type
        let dataValue;
        if (variant.ralCode) {
            dataValue = variant.ralCode; // Use RAL code for RAL variants
            //или если это не бесплатный RAL, то используем labelen
        } else if (variant.isNonRal) {
            dataValue = variant.labelen;
        } else {
            dataValue = variant.dataVariant;
        }
        //создаем элемент такого вида: 
        // <div class="variant-item variant-button" data-variant="1" data-value="matteblack" data-section="spheres" data-color="#000000"></div>
        const item = document.createElement('div');
        item.className = 'variant-item variant-button';
        item.dataset.variant = variant.dataVariant;
        item.dataset.value = dataValue;
        item.dataset.color = variant.hex;
        item.dataset.section = section;
        item.tabIndex = '0';
        
        // Add custom RAL badge if needed
        if (variant.isNonRal || (variant.ralCode && !this.getAllFreeRalCodes().has(variant.ralCode))) {
            const badge = document.createElement('span');
            badge.className = 'custom-ral-badge';
            badge.textContent = 'RAL';
            item.appendChild(badge);
        }
        
        const info = document.createElement('div');
        info.className = 'variant-info';
        
        if (variant.hex) {
            const icon = document.createElement('div');
            icon.className = 'variant-icon';
            icon.style.backgroundColor = variant.hex;
            info.appendChild(icon);
        }
        
        const label = document.createElement('span');
        label.className = 'variant-label';
        label.textContent = variant.label;
        info.appendChild(label);
        
        item.appendChild(info);
        
        const price = document.createElement('span');
        price.className = 'variant-price';
        price.textContent = variant.isFree ? '0₽' : `+${CONFIG.optionPrice}₽`;
        item.appendChild(price);
        
        // Add click handler
        item.addEventListener('click', () => {
            this.handleVariantSelection(section, variant);
        });
        
        // Store in storage
        this.variantStorage.appendChild(item);
        this.variantItems.set(uniqueId, item);
        return item;
    }
    
    /**
     * Create all variant items for all sections
     */
    // Создаем все элементы вариантов для всех секций
    createAllVariantItems() {
        // Проходим по всем секциям и вариантам
        Object.entries(FREE_VARIANTS).forEach(([section, variants]) => {
            variants.forEach(variant => {
                this.createVariantItem(section, variant);
            });
        });
        
        // Очищаем старые варианты case из storage
        this.cleanupOldVariants();
        
        console.log(`[SwatchStorage] Created ${this.variantItems.size} variant items`);
    }
    
    /**
     * Clean up old variant items that are no longer needed
     */
    cleanupOldVariants() {
        // Удаляем старые варианты case из storage
        const caseVariants = [];
        this.variantItems.forEach((item, uniqueId) => {
            if (uniqueId.startsWith('case-')) {
                caseVariants.push(uniqueId);
                if (item.parentNode === this.variantStorage) {
                    this.variantStorage.removeChild(item);
                }
            }
        });
        
        caseVariants.forEach(uniqueId => {
            this.variantItems.delete(uniqueId);
        });
        
        if (caseVariants.length > 0) {
            console.log(`[SwatchStorage] Cleaned up ${caseVariants.length} old case variants`);
        }
    }
    
    /**
     * Open palette for section (move swatches from storage to palette)
     */
    openPalette(section) {
        this.currentOpenSection = section;
        const paletteContainer = this.getContainer(section, 'palette');
        if (!paletteContainer) return;
        
        // Очищаем палитру (возвращаем swatch в storage)
        while (paletteContainer.firstChild) {
            this.ralStorage.appendChild(paletteContainer.firstChild);
        }
        
        // Получаем бесплатные RAL коды для этой секции
        const freeRalCodes = this.getAllFreeRalCodes();
        
        // Move PAID RAL swatches to palette (skip free variants)
        this.ralSwatches.forEach((swatch, code) => {
            // Skip free RAL codes - they should be in quick-select, not palette
            if (freeRalCodes.has(code)) return;
            
            // Set current section for click handler - устанавливаем текущую секцию для обработчика клика
            swatch.dataset.currentSection = section;
            
            // Check if this swatch is currently selected - проверяем, выбран ли этот swatch
            const currentState = stateManager.get();
            const sectionState = currentState[section];
            if (sectionState && sectionState.color && swatch.dataset.color === sectionState.color) {
                swatch.classList.add('selected');
                swatch.setAttribute('aria-pressed', 'true');
            } else {
                swatch.classList.remove('selected');
                swatch.setAttribute('aria-pressed', 'false');
            }
            
            paletteContainer.appendChild(swatch);
        });
    }
    
    /**
     * Close palette for section (return swatches to storage)
     */
    closePalette(section) {
        const paletteContainer = this.getContainer(section, 'palette');
        if (!paletteContainer) return;
        
        while (paletteContainer.firstChild) {
            const swatch = paletteContainer.firstChild;
            swatch.classList.remove('selected');
            swatch.setAttribute('aria-pressed', 'false');
            delete swatch.dataset.currentSection;
            this.ralStorage.appendChild(swatch);
        }
        
        if (this.currentOpenSection === section) {
            this.currentOpenSection = null;
        }
    }
    
    /**
     * Populate quick-select for section
     */
    populateQuickSelect(section) {
        const quickContainer = this.getContainer(section, 'quick');
        if (!quickContainer) return;
        
        // Очищаем quick-select
        while (quickContainer.firstChild) {
            this.variantStorage.appendChild(quickContainer.firstChild);
        }
        
        // Перемещаем элементы вариантов в quick-select
        const sectionVariants = FREE_VARIANTS[section] || [];
        sectionVariants.forEach(variant => {
            const uniqueId = `${section}-${variant.label}`;
            const item = this.variantItems.get(uniqueId);
            if (item) {
                // Устанавливаем текущую секцию для обработчика клика
                item.dataset.currentSection = section;
                
                // Проверяем, выбран ли этот вариант
                const currentState = stateManager.get();
                const sectionState = currentState[section];
                if (sectionState && sectionState.color && variant.hex === sectionState.color) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
                
                quickContainer.appendChild(item);
            }
        });
    }
    
    /**
     * Handle color selection from RAL palette
     */
    handleColorSelection(section, hex, ralCode) {
        // Import dynamically to avoid circular dependency
        import('./color-manager.js').then(({ handleColorSelection }) => {
            handleColorSelection(section, hex, ralCode);
        });
    }
    
    /**
     * Handle variant selection from quick-select
     */
    handleVariantSelection(section, variant) {
        // Import dynamically to avoid circular dependency
        import('./color-manager.js').then(({ handleColorSelection }) => {
            // Если у варианта есть ralCode или labelen, используем их, иначе используем dataVariant
            const value = variant.ralCode || variant.labelen || variant.dataVariant;
             console.log('handleVariantSelection', section, variant, value);
            handleColorSelection(section, variant.hex, value);
        });
    }
}

// Create singleton instance
export const swatchStorage = new SwatchStorageManager();

// Export functions for backward compatibility
export function openPalette(section) {
    swatchStorage.openPalette(section);
}

export function closePalette(section) {
    swatchStorage.closePalette(section);
}

export function populateQuickSelect(section) {
    swatchStorage.populateQuickSelect(section);
}
