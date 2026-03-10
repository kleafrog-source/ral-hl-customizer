import { stateManager } from './core/state.js';
import { eventRegistry } from './core/events.js';
import { switchPreview } from './modules/accessories.js';
import { updateShockmountVisibility, updateShockmountLayers } from './modules/shockmount-new.js';
import { togglePalette, handleStyleSelection, hexToRgbValues } from './modules/appearance-new.js';
import { updateSVG } from './engine.js';
import { validateField } from './services/validation.js';
import { updateMalfaLogoOptionsVisibility } from './modules/logo.js';
import { calculateTotal, getBreakdown, formatPrice } from './modules/price-calculator.js';
import { initHLDataManager } from './modules/hl-data-manager.js';
import { variantNames, CONFIG, MALFA_SILVER_RAL, MALFA_GOLD_RAL } from './config.js';

// Global state storage for microphone configurations
const micStates = {};

// Helper function to set state using stateManager
function setState(path, value) {
    stateManager.set(path, value);

    // Save current variant state to micStates for persistence
    const currentVariant = stateManager.get('currentModelCode');
    if (currentVariant && !micStates[currentVariant]) {
        micStates[currentVariant] = {};
    }
    if (currentVariant) {
        const currentState = stateManager.get();
        micStates[currentVariant] = JSON.parse(JSON.stringify(currentState));
    }
}

// Helper function to restore microphone state using HL data
function restoreMicState(variant) {
    const savedState = micStates[variant];

    // Update global HL data for the new model
    const data = window.CUSTOMIZER_DATA;
    if (data && data.modelsByCode && data.modelsByCode[variant]) {
        data.currentModelCode = variant;
        data.currentModelId = data.modelsByCode[variant].ID;
        data.currentModelOptions = data.options[data.currentModelId] || data.options[0] || {};
    }

    // Re-initialize HL data manager with new model context (sets defaults from HL blocks)
    initHLDataManager();

    if (savedState) {
        // Restore saved state (overrides defaults)
        Object.keys(savedState).forEach(key => {
            // Skip managed keys that are re-initialized by HL Data Manager
            if (['hlData', 'currentModelCode', 'currentModelId', 'currentModelOptions'].includes(key)) {
                return;
            }
            
            // Restore section states
            if (['spheres', 'body', 'shockmount', 'pins', 'logobg', 'logo', 'case'].includes(key)) {
                const sectionState = savedState[key];
                if (sectionState && typeof sectionState === 'object') {
                    Object.keys(sectionState).forEach(subKey => {
                        stateManager.set(`${key}.${subKey}`, sectionState[subKey]);
                    });
                }
            } else {
                // Restore other state properties
                stateManager.set(key, savedState[key]);
            }
        });
    }

    // Update UI components
    updateMALFAVisibility();
    updateShockmountVisibility();
    updateShockmountLayers(stateManager.get());
    updateSVG();
    updateUI();
}

/**
 * Main UI update function
 * Synchronizes DOM elements with current stateManager data
 */
export function updateUI() {
    updateMalfaLogoOptionsVisibility();

    const currentState = stateManager.get();
    const hlData = currentState.hlData;

    // Calculate prices using price calculator
    const priceBreakdown = getBreakdown(currentState);
    const totalPrice = calculateTotal(currentState);

    const spheresColor = currentState.spheres.color ? currentState.spheres.colorValue : null;
    const bodyColor = currentState.body.color ? currentState.body.colorValue : null;
    const logoColor = currentState.logo.customLogo ? null : (currentState.logobg.color === 'black' ? '#000000' : currentState.logobg.colorValue);
    const shockmountColor = currentState.shockmount.colorValue;

    // Apply dimmed background colors to menu items
    const setMutedBg = (el, color) => {
        if (el) {
            if (color) {
                const rgb = hexToRgbValues(color);
                if (rgb) {
                    el.style.backgroundColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.15)`;
                }
            } else {
                el.style.backgroundColor = '';
            }
        }
    };

    setMutedBg(document.querySelector('.menu-item[data-section="spheres"]'), spheresColor);
    setMutedBg(document.querySelector('.menu-item[data-section="body"]'), bodyColor);
    setMutedBg(document.querySelector('.menu-item[data-section="logobg"]'), currentState.logobg?.colorValue || '#000000');

    setMutedBg(document.getElementById('spheres-section'), spheresColor);
    setMutedBg(document.getElementById('body-section'), bodyColor);
    setMutedBg(document.getElementById('logo-section'), logoColor);
    setMutedBg(document.getElementById('logobg-section'), currentState.logobg?.colorValue || '#000000');
    setMutedBg(document.getElementById('shockmount-section'), shockmountColor);
    setMutedBg(document.getElementById('shockmountPins-section'), currentState.shockmountPins?.colorValue || '#D4AF37');

    // Update color indicators
    const updateDisplayColor = (id, color) => {
        const el = document.getElementById(id);
        if (el) el.style.backgroundColor = color || '#A1A1A0';
    };

    updateDisplayColor('spheres-color-display', spheresColor);
    updateDisplayColor('body-color-display', bodyColor);
    updateDisplayColor('logobg-color-display', currentState.logobg?.colorValue);
    updateDisplayColor('shockmount-color-display', shockmountColor);
    updateDisplayColor('shockmountPins-color-display', currentState.shockmountPins?.colorValue || '#D4AF37');

    // Update subtitles/labels
    const updateText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    // Spheres Subtitle
    updateText('spheres-subtitle', currentState.spheres.name || (currentState.spheres.color ? `RAL ${currentState.spheres.color}` : 'Стандартный'));
    
    // Body Subtitle
    updateText('body-subtitle', currentState.body.name || (currentState.body.color ? `RAL ${currentState.body.color}` : 'Стандартный'));

    // Logo Subtitle
    let logoText = 'Классическая латунь';
    if (currentState.logo.customLogo) {
        logoText = 'Кастомный';
    } else if (currentState.logo.variant === 'malfasilver') {
        logoText = 'MALFA Edition (Серебро)';
    } else if (currentState.logo.variant === 'malfagold') {
        logoText = 'MALFA Edition (Золото)';
    } else if (currentState.logo.variant === 'standard-silver') {
        logoText = 'Холодный хром';
    }
    updateText('logo-subtitle', logoText);

    // Logo Background Subtitle
    updateText('logo-bg-subtitle', currentState.logobg.color === 'black' ? 'RAL 9005 Матовый черный' : `RAL ${currentState.logobg.color}`);

    // Case Subtitle
    updateText('case-subtitle', currentState.case.variant === 'custom' ? 'Собственное изображение' : 'Стандартный (Логотип Soyuz)');

    // Shockmount and Pins Subtitles
    updateText('shockmount-subtitle', currentState.shockmount.name || 'Белый');
    updateText('shockmountPins-subtitle', currentState.shockmountPins?.name || 'Латунь');

    // Update prices in sidebar
    const updatePrice = (id, price) => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatPrice(price);
    };

    // Base price
    const basePriceEl = document.getElementById('base-price');
    if (basePriceEl) {
        const currentModel = currentState.currentModel;
        const basePriceValue = currentModel?.basePrice || 0;
        basePriceEl.textContent = `${basePriceValue.toLocaleString('ru-RU')}₽`;
    }

    updatePrice('spheres-price', priceBreakdown.spheres);
    updatePrice('body-price', priceBreakdown.body);
    updatePrice('logo-price', priceBreakdown.logobg);
    updatePrice('case-price', priceBreakdown.case);
    updatePrice('shockmount-price', priceBreakdown.shockmount);

    // Update total price breakdown rows
    updatePrice('spheres-price-row', priceBreakdown.spheres);
    updatePrice('body-price-row', priceBreakdown.body);
    updatePrice('logo-price-row', priceBreakdown.logobg);
    updatePrice('case-price-row', priceBreakdown.case);
    updatePrice('shockmount-price-row', priceBreakdown.shockmount);

    // Final total
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice.toLocaleString('ru-RU')}₽`;
    }
}

// Helper function to update MALFA logo visibility using HL data
function updateMALFAVisibility() {
    const currentModelCode = stateManager.get('currentModelCode');
    const isMALFA = currentModelCode === '023-malfa';

    // Show/hide MALFA logo variants
    document.querySelectorAll('.malfa-logo').forEach(item => {
        item.style.display = isMALFA ? 'flex' : 'none';
    });

    // Turn on #malfa-logo in svg
    const malfaLogo = document.getElementById('malfa-logo');
    if (malfaLogo) {
        malfaLogo.style.display = isMALFA ? 'inline' : 'none';
    }
}

export function initEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    // Fullscreen Toggle
    const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenToggleBtn) {
        fullscreenToggleBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    showNotification(`Ошибка перехода в полноэкранный режим: ${err.message}`, 'error');
                });
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        // Initial icon update
        updateFullscreenIcon();
    }

    // Update UI based on current variant
    updateMALFAVisibility();


    // Variant button handlers
    document.querySelectorAll('.variant-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const variant = this.dataset.variant;
            document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Persistent State: Restore or Apply Default
            restoreMicState(variant);

            // Update Case Preview
            if (window.WoodCase) {
                window.WoodCase.setCase(variant);
            }

            // Ensure UI matches restored state
            updateMALFAVisibility();
            updateShockmountVisibility();
            updateShockmountLayers(stateManager.get());
            updateSVG();
            updateUI();
        });

        // Add keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    document.querySelectorAll('.palette-toggle-btn').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) {
                togglePalette(section);
            }
        });
    });

    // Back buttons in submenus
    document.querySelectorAll('.back-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.back;
            toggleSubmenu(section);
        });
    });

    // Legacy back button support
    document.querySelectorAll('.submenu-back').forEach(item => {
        item.addEventListener('click', function() {
            const submenu = this.closest('.submenu');
            if (submenu) {
                const section = submenu.id.replace('submenu-', '');
                toggleSubmenu(section);
            }
        });
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        // Skip items that don't have submenus (like toggles)
        if (item.classList.contains('no-submenu')) return;

        item.addEventListener('click', function() {
            toggleSubmenu(this.dataset.section);
        });
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSubmenu(this.dataset.section);
            }
        });
    });

    // Reset settings button handler
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            const currentState = stateManager.get();
            let confirmReset = true;
            if (currentState.hasChanged) {
                confirmReset = confirm('Вы действительно хотите сбросить настройки? Все несохраненные изменения будут потеряны.');
            }

            if (confirmReset) {
                const currentVariant = currentState.variant;

                // Clear saved state for this variant
                delete micStates[currentVariant];

                // Re-restore from defaults (Highload data)
                restoreMicState(currentVariant);

                updateSVG();
                updateUI();
                showNotification('Настройки успешно сброшены!', 'success');
            }
        });
    }

    // Remove logo button handler
    document.querySelectorAll('.remove-logo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setState('logo.customLogo', null);
            setState('prices.logo', 0);
            this.style.display = 'none';
            document.getElementById('logo-overlay')?.classList.remove('active');

            // Update logo items lock state
            import('./modules/logo.js').then(m => {
                m.updateLogoItemsLockState();
                m.updateSVG();
                updateUI();
            });
        });
    });

    document.querySelectorAll('.submenu .variant-item, .submenu .option-button').forEach(item => {
        const handler = function() {
            if(this.onclick) return;
            
            // Get section from parent submenu or data attribute
            const submenu = this.closest('.submenu');
            let section = submenu ? submenu.id.replace('submenu-', '') : this.dataset.optionPart;

            if (!section) return;

            // Special handling for logo background section
            if (section === 'logo-bg') {
                section = 'logobg';
            }

            // Special handling for shockmount pins section
            if (section === 'shockmount-pins') {
                section = 'pins';
            }

            // Handle style selection using HL data
            handleStyleSelection(section, this.dataset.variant || this.dataset.variantCode || this.dataset.value);

            // Switch to microphone preview when spheres or body options are selected
            if (['spheres', 'body', 'logobg', 'logo'].includes(section)) {
                switchPreview('microphone');
            }
            // Switch to case preview when case options are selected
            else if (section === 'case') {
                switchPreview('case');
            }
            // Switch to shockmount preview when shockmount options are selected
            else if (['shockmount', 'pins', 'shockmountPins'].includes(section)) {
                switchPreview('shockmount');
            }
        };

        item.addEventListener('click', handler);
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if(this.onclick) { this.click(); return; }
                handler.call(this);
            }
        });
    });

    const modal = document.getElementById('order-modal');
    document.querySelector('.order-button').addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Начинаю валидацию формы');

        const inputs = e.target.querySelectorAll('input');
        let isValid = true;

        inputs.forEach(input => {
            try {
                if (!validateField(input)) isValid = false;
            } catch (error) {
                console.error('Ошибка валидации поля:', error);
            }
        });

        if (!isValid) {
            console.log('Валидация не пройдена');
            showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }

        console.log('Валидация пройдена');
        const formData = new FormData(e.target);
        const clientData = Object.fromEntries(formData.entries());
        import('./services/report.js').then(({ sendOrder }) => {
            sendOrder(clientData);
        }).catch(error => {
            console.error('Ошибка импорта sendOrder:', error);
            alert('Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        });
    });

    document.querySelector('.print-btn').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('order-modal').querySelector('button[style*="background:none"]').addEventListener('click', closeOrderModal);
    document.getElementById('report-modal').querySelector('button[style*="background:none"]').addEventListener('click', closeReportModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        }
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });

    initDragAndDrop();
}

function initDragAndDrop() {
    const dropZones = [
        { id: 'submenu-logo', section: 'logo' },
        { id: 'submenu-case', section: 'case' }
    ];

    dropZones.forEach(zone => {
        const el = document.getElementById(zone.id);
        if (!el) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            el.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
                if (eventName === 'dragenter' || eventName === 'dragover') {
                    el.classList.add('drag-over');
                } else {
                    el.classList.remove('drag-over');
                }
            }, false);
        });

        el.addEventListener('drop', e => {
            el.classList.remove('drag-over');
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (!file.type.startsWith('image/')) {
                    showNotification('Пожалуйста, загрузите изображение', 'error');
                    return;
                }

                if (zone.section === 'logo') {
                    import('./modules/logo.js').then(m => {
                        const reader = new FileReader();
                        reader.onload = event => {
                            setState('logo.customLogo', event.target.result);
                            setState('prices.logo', CONFIG.optionPrice);
                            document.querySelector('.remove-logo-btn').style.display = 'block';
                            document.getElementById('logo-overlay')?.classList.add('active');

                            m.updateLogoItemsLockState();
                            updateSVG();
                            updateUI();
                        };
                        reader.readAsDataURL(file);
                    });
                } else if (zone.section === 'case') {
                    if (window.WoodCase) {
                        window.WoodCase.handleUpload({ target: { files: [file] } });
                    }
                }
            }
        });
    });
}

export function handleShockmountColorSelection(color, ralName) {
    const section = document.getElementById('shockmount-palette')?.parentElement;
    if (!section) return;
    
    section.querySelectorAll('.swatch').forEach(i => i.classList.remove('selected'));

    const batch = stateManager.startBatch();
    batch('shockmount.variant', 'custom');
    batch('shockmount.color', ralName);
    batch('shockmount.colorValue', color);
    batch('shockmount.colorName', `RAL ${ralName}`);
    stateManager.endBatch();

    updateUI();
}

export function handleShockmountPinSelection(variant, color = null, ralName = null) {
    const section = document.getElementById('shockmountPins-palette')?.parentElement;
    if (!section) return;
    
    section.querySelectorAll('.variant-item, .swatch').forEach(item => item.classList.remove('selected'));

    const batch = stateManager.startBatch();
    if (variant === 'custom') {
        batch('shockmountPins', { 
            variant: 'custom', 
            colorValue: color, 
            colorName: `RAL ${ralName}`,
            name: `RAL ${ralName}` 
        });
    } else {
        const pinsNames = { 'brass': 'Латунь', 'RAL9003': 'Белый', 'RAL1013': 'Кремовый', 'RAL9005': 'Черный' };
        batch('shockmountPins', { 
            variant: variant, 
            colorValue: color, 
            colorName: pinsNames[variant] || variant,
            name: pinsNames[variant] || variant 
        });
    }
    stateManager.endBatch();

    updateUI();
}

export function updateFullscreenIcon() {
    const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
    if (!fullscreenToggleBtn) return;

    const icon = fullscreenToggleBtn.querySelector('.fullscreen-icon');
    if (!icon) return;

    if (document.fullscreenElement) {
        icon.innerHTML = '<path d="M15 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-7 0H5a2 2 0 0 1-2-2v-2m0-10V5a2 2 0 0 1 2-2h2"></path>';
    } else {
       icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3m-18 0v3a2 2 0 0 0 2 2h3"></path>';
    }
}

export function closeOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

export function closeReportModal() {
    document.getElementById('report-modal').style.display = 'none';
}

/**
 * Toggle submenu visibility with .active and .expanded classes
 * Ensures only one submenu is visible at a time
 */
export function toggleSubmenu(section) {
    const menuItem = document.querySelector(`[data-section="${section}"]`);
    const submenu = document.getElementById(`submenu-${section}`);

    if (!menuItem || !submenu) return;

    const isCurrentlyActive = submenu.classList.contains('active');

    // 1. Hide ALL submenus first
    document.querySelectorAll('.submenu').forEach(m => {
        m.classList.remove('active');
        m.style.display = 'none';
    });
    
    // 2. Remove .expanded from ALL menu items
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('expanded'));

    // 3. If we were NOT active, show this one
    if (!isCurrentlyActive) {
        submenu.style.display = 'block';
        // Small delay for animation if needed, but display:block must be first
        requestAnimationFrame(() => {
            submenu.classList.add('active');
            menuItem.classList.add('expanded');
        });

        // Auto-preview switching logic
        if (['spheres', 'body', 'logo', 'logobg'].includes(section)) {
            switchPreview('microphone');
        } else if (section === 'case') {
            switchPreview('case');
        } else if (['shockmount', 'shockmountPins'].includes(section)) {
            const currentState = stateManager.get();
            if (currentState.shockmount && currentState.shockmount.enabled) {
                switchPreview('shockmount');
            } else {
                switchPreview('global-view');
            }
        }
    }
}

export function showNotification(msg, type) {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.className = `notification ${type} show`;
    setTimeout(() => n.classList.remove('show'), 3000);
}

// Export helper functions for other modules
export { setState, restoreMicState, micStates };
