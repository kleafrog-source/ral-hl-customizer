import { eventRegistry } from '../core/events.js';
import { stateManager } from '../core/state.js';
import { CONFIG, getModelData } from '../config.js';
import { updateFilter } from './appearance-new.js';

// Utility functions for MALFA detection using Bitrix data
export function isMalfaMic(state = null) {
    const currentState = state || stateManager.get();
    
    // Проверяем разные способы хранения модели в state
    const modelCode = currentState.currentModelCode || currentState.variant || currentState.model?.code || currentState.model?.slug;
    
    // Используем данные из Bitrix для определения MALFA
    const modelData = getModelData(modelCode);
    return modelData?.MODEL_SERIES === 'MALFA' || modelCode === '023-malfa' || modelCode === '023-MALFA';
}

export function isMalfaLogo(state = null) {
    const currentState = state || stateManager.get();
    const logoVariant = currentState.logo?.variant;
    return logoVariant === 'malfasilver' || logoVariant === 'malfagold';
}

// Toggle for custom logo feature
export function toggleCustomLogo() {
    const currentState = stateManager.get();
    const isCustomLogoEnabled = currentState.logo?.customLogo || false;
    
    const uploadArea = document.getElementById('custom-logo-upload');
    const enabled = uploadArea.style.display === 'block';
    uploadArea.style.display = enabled ? 'none' : 'block';

    // Toggle the state
    const newState = !isCustomLogoEnabled;
    stateManager.set('logo.customLogo', newState);
    
    // Price will be calculated by price calculator based on logo.useCustom state
    
    // Update UI prices
    // const logoPriceRow = document.getElementById('logo-price-row');
    // if (logoPriceRow) {
    //     logoPriceRow.textContent = logoPrice > 0 ? `+${logoPrice}₽` : '0₽';
    // }
    
    // const customLogoPrice = document.getElementById('custom-logo-price');
    // if (customLogoPrice) {
    //     customLogoPrice.textContent = logoPrice > 0 ? `+${logoPrice}₽` : '+0₽';
    // }
    
    // Show/hide sections based on toggle state
    const logoSection = document.querySelector('[data-section="logo"]');
    const logobgSection = document.querySelector('[data-section="logobg"]');
    const customLogoSection = document.querySelector('.toggle-logo-section');
    
    // Close any open submenus
    const logoSubmenu = document.getElementById('submenu-logo');
    const logobgSubmenu = document.getElementById('submenu-logobg');
    
    if (newState) {
        // Custom logo enabled - hide standard sections, show custom upload
        if (logoSection) logoSection.style.display = 'block';
        if (logobgSection) logobgSection.style.display = 'block';
        if (customLogoSection) customLogoSection.style.display = 'block';
        
        // Close submenus
        if (logoSubmenu) logoSubmenu.classList.remove('active');
        if (logobgSubmenu) logobgSubmenu.classList.remove('active');
    } else {
        // Custom logo disabled - show standard sections, hide custom upload
        if (logoSection) logoSection.style.display = '';
        if (logobgSection) logobgSection.style.display = '';
        if (customLogoSection) customLogoSection.style.display = 'none';
    }
    
    console.log(`[Logo] Custom logo ${newState ? 'enabled' : 'disabled'}, price: ${logoPrice}₽`);
}

export function init() {
    // Убираем обработчик клика на всю область, чтобы избежать множественных вызовов
    // Клик обрабатывается через inline onclick в HTML

    const input = document.getElementById('logo-file-input');
    if (input) {
        input.addEventListener('change', e => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleLogoFileUpload(file);
        });
    }
    
    // Добавляем drag&drop для логотипа
    const uploadArea = document.querySelector('#custom-logo-upload .upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files?.[0];
            if (file) {
                handleLogoFileUpload(file);
            }
        });
    }
    
    // Добавляем обработчик для кнопки удаления кастомного логотипа
    const removeButton = document.getElementById('custom-logo-remove');
    if (removeButton) {
        eventRegistry.add(removeButton, 'click', clearCustomLogo);
    }
    
    // Initialize lock state
    updateLogoItemsLockState();
}

// Handle logo file upload with validation
function handleLogoFileUpload(file) {
    // Check file size (3MB limit)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('Файл слишком большой. Максимальный размер: 3 МБ', 'error');
        return;
    }
    
    // Check file type
    const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/webp', 'image/x-icon'];
    const allowedExtensions = ['.png', '.svg', '.jpg', '.jpeg', '.bmp', '.webp', '.ico'];
    
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    const hasValidType = allowedTypes.includes(file.type);
    
    if (!hasValidExtension && !hasValidType) {
        showNotification('Неподдерживаемый формат файла. Допустимые: PNG, SVG, JPG, BMP, WEBP, ICO', 'error');
        return;
    }
    
    // Process file
    const reader = new FileReader();
    reader.onload = event => {
        // Устанавливаем state для кастомного логотипа
        stateManager.set('logo.useCustom', true);
        stateManager.set('logo.customLogoData', event.target.result);
        
        // Показываем кнопку удаления
        const removeBtn = document.getElementById('custom-logo-remove');
        if (removeBtn) removeBtn.style.display = '';
        
        updateLogoItemsLockState();
        updateLogoSVG();
        showNotification('Логотип успешно загружен', 'success');
    };
    reader.readAsDataURL(file);
}

// Show notification helper
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

//Управляет видимостью и стилями элементов эмблемы(логотипа микрофона)
export function updateLogoSVG() {
    const svg = document.querySelector('.svg-wrapper svg');
    if (!svg) return;
    
    const customLayer = svg.querySelector('#custom-logo-layer');
    if (customLayer) customLayer.remove();

    // Get current state
    const state = stateManager.get();
    const malfaLogo = svg.querySelector('#malfa-logo');
    const malfaLogoTextPath = svg.querySelector('#malfa-logo-text-path');
    const clipLogoBgMalfa = svg.querySelector('#clip-logobg-malfa');

    // Handle custom logo (единый для всех вариантов)
    if (state.logo.useCustom && state.logo.customLogoData) {
        // Скрываем все стандартные логотипы
        ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame', 'malfa-logo'].forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'none';
        });

        // Создаем слой для кастомного логотипа
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = 'custom-logo-layer';
        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute('width', '300');
        img.setAttribute('height', '350');
        img.setAttribute('x', '150');
        img.setAttribute('y', '1117');
        img.setAttribute('href', state.logo.customLogoData);
        g.appendChild(img);
        svg.appendChild(g);
        
        console.log('[Logo] Custom logo applied to all variants');
        return;
    }

    // Если кастомный логотип не включен, скрываем слой кастомного логотипа
    if (state.logo.useCustom && !state.logo.customLogoData) {
        // Показываем overlay, что логотип не загружен
        const overlay = document.getElementById('logo-overlay');
        if (overlay) {
            overlay.innerHTML = '<div class="logo-overlay-text">Загрузите изображение для логотипа</div>';
            overlay.style.display = 'block';
        }
    }

    // Стандартная логика для MALFA логотипа
    const malfaMic = isMalfaMic(state);
    const malfaLogoSelected = isMalfaLogo(state);
    
    if (!malfaMic || !malfaLogoSelected) {
        // Hide MALFA logo for non-MALFA mics or non-MALFA logos
        if (malfaLogo) {
            malfaLogo.style.display = 'none';
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

                // const lum = calculateLuminance(state.logo.bgColorValue);
                // const opacity = Math.max(0.15, 1 - (lum * 0.8));
                // if (bgMono) bgMono.style.opacity = opacity;

                updateFilter('feFlood4', 'logobg', state.logo.bgColorValue);
            }
        }
        
        // Handle overlay
        const overlay = svg.querySelector('#logo-overlay');
        if (overlay) {
            overlay.style.display = state.logo.useCustom ? 'inline' : 'none';
        }
        
        return;
    }

    // We're here only if: MALFA mic + MALFA logo selected
    
    // Hide all standard logo elements
    ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
        const el = svg.querySelector(`#${id}`);
        if (el) el.style.display = 'none';
    });
    
    // Show MALFA logo
    if (malfaLogo) {
        malfaLogo.style.display = 'inline';
    }

    // Apply gradient and background
    if (malfaLogoTextPath && clipLogoBgMalfa) {
        const isGold = state.logo.variant === 'malfagold';
        malfaLogoTextPath.style.fill = isGold ? 'url(#grad-malfa-gold)' : 'url(#grad-malfa-silver)';

        // Update Enamel Background dynamically
        const bgColor = state.logobg?.colorValue || state.logo?.bgColorValue;
        if (bgColor) {
            clipLogoBgMalfa.style.fill = bgColor;
        } else {
            clipLogoBgMalfa.style.fill = '#770033';
        }
    }
}

export function updateLogoItemsLockState() {
    // Упрощаем логику - убираем .locked с variant-item
    // Управление происходит через .disabled на самих секциях
    // CSS будет блокировать клики через pointer-events: none на .disabled секциях
    
    // Эта функция оставлена для совместимости, но больше не добавляет .locked
    // Блокировка происходит на уровне секций через CSS
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
                    // Сохраняем кастомный логотип в StateManager (единый для всех вариантов)
                    stateManager.set('logo.customLogoData', event.target.result);
                    
                    // Показываем кнопку удаления
                    const removeBtn = document.querySelector('.remove-logo-btn');
                    if (removeBtn) {
                        removeBtn.style.display = 'block';
                    }

                    // Показываем overlay
                    const overlay = document.getElementById('logo-overlay');
                    if (overlay) {
                        overlay.classList.add('active');
                    }

                    // Обновляем состояние lock
                    updateLogoItemsLockState();
                    
                    // Обновляем SVG для отображения кастомного логотипа
                    updateLogoSVG();
                    
                    console.log('[Logo] Custom logo uploaded successfully');
                } catch (err) {
                    console.error('[Logo] Error uploading custom logo:', err);
                    showNotification('Ошибка при загрузке логотипа', 'error');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

export function clearCustomLogo() {
    // Сбрасываем state кастомного логотипа
    stateManager.set('logo.useCustom', false);
    stateManager.set('logo.customLogoData', null);
    
    // Скрываем кнопку удаления
    const removeBtn = document.getElementById('custom-logo-remove');
    if (removeBtn) {
        removeBtn.style.display = 'none';
    }

    // Скрываем overlay
    const overlay = document.getElementById('logo-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }

    // Обновляем состояние lock
    updateLogoItemsLockState();
    
    // Обновляем SVG
    updateLogoSVG();
    
    console.log('[Logo] Custom logo cleared');
}

// Управление видимостью MALFA вариантов логотипа
export function updateMalfaLogoOptionsVisibility() {
    const state = stateManager.get();
    const isMalfaModel = isMalfaMic(state);
    
    // Управляем видимостью MALFA группы
    const malfaGroup = document.getElementById('malfa-logo-group');
    if (malfaGroup) {
        malfaGroup.style.display = isMalfaModel ? 'block' : 'none';
    }
}
