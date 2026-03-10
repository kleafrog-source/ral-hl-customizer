import { stateManager } from './core/state.js';
import { eventRegistry } from './core/events.js';
import { variantNames, CONFIG, FREE_LOGO_RALS, MALFA_SILVER_RAL, MALFA_GOLD_RAL, DEFAULT_MIC_CONFIGS } from './config.js';
import { switchPreview } from './modules/accessories.js';
import { updateShockmountVisibility, updateShockmountLayers } from './modules/shockmount.js';
import { togglePalette, handleStyleSelection, hexToRgbValues } from './modules/appearance.js';
import { updateSVG } from './engine.js';
import { validateField } from './services/validation.js';
import { updateMalfaLogoOptionsVisibility } from './modules/logo.js'; // Import the new function
import { calculateTotal, getBreakdown, formatPrice } from './modules/price-calculator.js';

// Global state storage for microphone configurations
const micStates = {};

// Helper function to set state using stateManager
function setState(path, value) {
    stateManager.set(path, value);
    
    // Save current variant state to micStates for persistence
    const currentVariant = stateManager.get('variant');
    if (currentVariant && !micStates[currentVariant]) {
        micStates[currentVariant] = {};
    }
    if (currentVariant) {
        const currentState = stateManager.get();
        micStates[currentVariant] = JSON.parse(JSON.stringify(currentState));
    }
}

// Helper function to restore microphone state
function restoreMicState(variant) {
    const savedState = micStates[variant];
    if (savedState) {
        // Restore saved state
        Object.keys(savedState).forEach(key => {
            if (typeof savedState[key] === 'object' && savedState[key] !== null) {
                Object.keys(savedState[key]).forEach(subKey => {
                    setState(`${key}.${subKey}`, savedState[key][subKey]);
                });
            } else {
                setState(key, savedState[key]);
            }
        });
    } else if (DEFAULT_MIC_CONFIGS[variant]) {
        // Apply default configuration
        const defaultConfig = DEFAULT_MIC_CONFIGS[variant];
        Object.keys(defaultConfig).forEach(key => {
            if (typeof defaultConfig[key] === 'object' && defaultConfig[key] !== null) {
                Object.keys(defaultConfig[key]).forEach(subKey => {
                    setState(`${key}.${subKey}`, defaultConfig[key][subKey]);
                });
            } else {
                setState(key, defaultConfig[key]);
            }
        });
    }
    setState('variant', variant);
}

// === ПРОСТОЕ ЛОГИРОВАНИЕ ===

function logAction(action, data) {
}

function logStateChange(module, func, before, after) {
}

// === ФУНКЦИИ-ОБЕРТКИ ДЛЯ ДЕБАГГА ===

function debugFunction(moduleName, functionName, originalFunction) {
    return originalFunction;
}

// Оборачиваем основные функции для отслеживания
const wrappedUpdateUI = function updateUI() {
    updateMalfaLogoOptionsVisibility(); // Call the new function here

    const currentState = stateManager.get();
    
    // Calculate prices using price calculator
    const priceBreakdown = getBreakdown(currentState);
    const totalPrice = calculateTotal(currentState);
    
    // Update prices in state if they differ
    const currentPrices = currentState.prices;
    const pricesChanged = JSON.stringify(priceBreakdown) !== JSON.stringify(currentPrices);
    
    if (pricesChanged) {
        const batchSet = stateManager.startBatch();
        Object.entries(priceBreakdown).forEach(([section, price]) => {
            batchSet(`prices.${section}`, price);
        });
        stateManager.endBatch();
    }
    
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

    setMutedBg(document.getElementById('spheres'), spheresColor);
    setMutedBg(document.getElementById('body'), bodyColor);
    setMutedBg(document.getElementById('logo'), logoColor);
    setMutedBg(document.getElementById('logobg'), currentState.logobg?.colorValue || '#000000');
    setMutedBg(document.getElementById('shockmount'), shockmountColor);
    setMutedBg(document.getElementById('shockmount-pins'), currentState.shockmountPins?.colorValue || '#D4AF37');

    // Update case and shockmount displays
    const caseDisplay = document.getElementById('case-color-display');
    if (caseDisplay) {
        caseDisplay.style.backgroundColor = '#8B4513';
    }
    
    const shockmountDisplay = document.getElementById('shockmount-color-display');
    if (shockmountDisplay) {
        shockmountDisplay.style.backgroundColor = currentState.shockmount.colorValue;
    }
    
    const pinsDisplay = document.getElementById('shockmount-pins-color-display');
    if (pinsDisplay) {
        pinsDisplay.style.backgroundColor = currentState.shockmountPins?.colorValue || '#D4AF37';
    }

    const logobgDisplay = document.getElementById('logobg-color-display');
    if (logobgDisplay) {
        logobgDisplay.style.backgroundColor = currentState.logobg?.colorValue || '#000000';
    }

    // Task 1: Update labels
    const spheresSubtitle = document.getElementById('spheres-subtitle');
    if (spheresSubtitle) {
        spheresSubtitle.textContent = currentState.spheres.color ? currentState.spheres.color : variantNames[currentState.spheres.variant];
    }
    
    const bodySubtitle = document.getElementById('body-subtitle');
    if (bodySubtitle) {
        bodySubtitle.textContent = currentState.body.color ? currentState.body.color : variantNames[currentState.body.variant];
    }
    
    const logoSubtitle = document.getElementById('logo-subtitle');
    if (logoSubtitle) {
        logoSubtitle.textContent = currentState.logo.customLogo
            ? 'Кастомный'
            : (currentState.logo.variant === 'malfasilver' || currentState.logo.variant === 'malfagold'
                ? (currentState.logobg.color === MALFA_SILVER_RAL ? 'MALFA Edition (Серебро)'
                    : (currentState.logobg.color === MALFA_GOLD_RAL ? 'MALFA Edition (Золото)'
                        : 'MALFA Edition'))
                : (currentState.logo.variant === 'standard-silver' ? 'Холодный хром' 
                    : (currentState.logo.variant === 'standard-gold' ? 'Классическая латунь'
                        : 'Классическая латунь')));
    }
    
    // Update logo-bg subtitle
    const logoBgSubtitle = document.getElementById('logo-bg-subtitle');
    if (logoBgSubtitle) {
        logoBgSubtitle.textContent = currentState.logobg.color === 'black' ? 'RAL 9005 Матовый антрацит' : `RAL ${currentState.logobg.color}`;
    }

    // Update case and shockmount subtitles
    const caseSubtitle = currentState.case.variant === 'custom' ? 'Собственное изображение' : 'Стандартный (Логотип Soyuz)';
    const caseSubtitleElement = document.getElementById('case-subtitle');
    if (caseSubtitleElement) {
        caseSubtitleElement.textContent = caseSubtitle;
    }

    const shockmountColorNames = {
        'white': 'Белый',
        'cream': 'Слоновая кость',
        'black': 'Матовый антрацит'
    };
    let shockmountText = shockmountColorNames[currentState.shockmount.variant] || 'Белый';
    
    if (currentState.shockmount.variant === 'custom' && currentState.shockmount.color) {
        const ralMatch = currentState.shockmount.color.match(/RAL\s*(\d+)/);
        shockmountText = ralMatch ? ralMatch[1] : currentState.shockmount.color;
    }
    const shockmountSubtitle = document.getElementById('shockmount-subtitle');
    if (shockmountSubtitle) {
        shockmountSubtitle.textContent = shockmountText;
    }

    // Shockmount Pins Subtitle
    let pinsText = (currentState.shockmountPins && currentState.shockmountPins.variant === 'brass') ? 'Полированная латунь' : ((currentState.shockmountPins && currentState.shockmountPins.colorName) || 'RAL 9003');
    const pinsSubtitle = document.getElementById('shockmount-pins-subtitle');
    if (pinsSubtitle) pinsSubtitle.textContent = pinsText;

    // Update prices base-price
    const basePrice = document.getElementById('base-price');
    if (basePrice) basePrice.textContent = formatPrice(CONFIG.basePrice);
    
    const spheresPrice = document.getElementById('spheres-price');
    if (spheresPrice) spheresPrice.textContent = formatPrice(priceBreakdown.spheres);
    
    const bodyPrice = document.getElementById('body-price');
    if (bodyPrice) bodyPrice.textContent = formatPrice(priceBreakdown.body);
    
    const logoPrice = document.getElementById('logo-price');
    if (logoPrice) logoPrice.textContent = formatPrice(priceBreakdown.logo);
    
    const casePrice = document.getElementById('case-price');
    if (casePrice) casePrice.textContent = formatPrice(priceBreakdown.case);
    
    const shockmountPrice = document.getElementById('shockmount-price');
    if (shockmountPrice) shockmountPrice.textContent = formatPrice(priceBreakdown.shockmount);

    // Update price rows
    const spheresPriceRow = document.getElementById('spheres-price-row');
    if (spheresPriceRow) spheresPriceRow.textContent = formatPrice(priceBreakdown.spheres);
    
    const bodyPriceRow = document.getElementById('body-price-row');
    if (bodyPriceRow) bodyPriceRow.textContent = formatPrice(priceBreakdown.body);
    
    const logoPriceRow = document.getElementById('logo-price-row');
    if (logoPriceRow) logoPriceRow.textContent = formatPrice(priceBreakdown.logo);
    
    const logobgPriceRow = document.getElementById('logobg-price-row');
    if (logobgPriceRow) logobgPriceRow.textContent = formatPrice(priceBreakdown.logobg);
    
    const casePriceRow = document.getElementById('case-price-row');
    if (casePriceRow) casePriceRow.textContent = formatPrice(priceBreakdown.case);
    
    const shockmountPriceRow = document.getElementById('shockmount-price-row');
    if (shockmountPriceRow) shockmountPriceRow.textContent = formatPrice(priceBreakdown.shockmount);

    const total = CONFIG.basePrice + Object.values(priceBreakdown).reduce((sum, price) => sum + price, 0);
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) totalPriceElement.textContent = `${total}₽`;
}

// Оригинальная функция updateUI для экспорта
export function updateUI() {
    // Вызываем обернутую версию
    return wrappedUpdateUI();
}

// Helper function to update MALFA logo visibility
function updateMALFAVisibility() {
    const currentVariant = stateManager.get('variant');
    const isMALFA = currentVariant === '023-malfa';
    
    // Show/hide MALFA logo variants
    document.querySelectorAll('.malfa-logo').forEach(item => {
        item.style.display = isMALFA ? 'flex' : 'none';
     
        
    });
       // turn on #malfa-logo in svg#svg8
       document.getElementById('malfa-logo').style.display = isMALFA ? 'inline' : 'none';
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
            const wrapper = this.nextElementSibling;
            
            if (wrapper && wrapper.classList.contains('palette-wrapper')) {
                const section = wrapper.id.replace('palette-wrapper-', '');
                togglePalette(section);
            }
        });
    });

    document.querySelectorAll('.submenu-back').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.closest('.submenu').id.replace('submenu-', '');
            toggleSubmenu(section);
        });
    });

    document.querySelectorAll('.menu-item').forEach(item => {
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
                if (DEFAULT_MIC_CONFIGS[currentVariant]) {
                    // Clear saved state for this variant
                    delete micStates[currentVariant];

                    // Re-restore from defaults
                    restoreMicState(currentVariant);

                    updateSVG();
                    updateUI();
                    showNotification('Настройки успешно сброшены!', 'success');
                } else {
                    showNotification('Не удалось найти стандартные настройки для текущего микрофона.', 'error');
                }
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

    document.querySelectorAll('.submenu .variant-item').forEach(item => {
        const handler = function() {
            if(this.onclick) return;
            let section = this.closest('.submenu').id.replace('submenu-', '');
            
            // Special handling for logo background section
            if (section === 'logo-bg') {
                section = 'logobg';
            }
            
            handleStyleSelection(section, this.dataset.variant);

            // Switch to microphone preview when spheres or body options are selected
            if (section === 'spheres' || section === 'body' || section === 'logobg' || section === 'logo' || section === 'logobg') {
                switchPreview('microphone');
            }
            // Switch to case preview when case options are selected
            else if (section === 'case') {
                switchPreview('case');
            }
            // Switch to shockmount preview when shockmount options are selected
            else if (section === 'shockmount' || section === 'shockmount-pins') {
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
    const section = document.getElementById('shockmount-options-section');
    if (!section) {
        console.error('shockmount-options-section not found');
        return;
    }
    section.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));

    setState('shockmount.variant', 'custom');
    setState('shockmount.color', `RAL ${ralName}`);
    setState('shockmount.colorValue', color);
    setState('prices.shockmount', CONFIG.optionPrice);

    updateUI();
    updateShockmountPreview();
}

export function handleShockmountPinSelection(variant, color = null, ralName = null) {
    const section = document.getElementById('shockmount-pins-options-section');
    if (!section) {
        console.error('shockmount-pins-options-section not found');
        return;
    }
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));
    
    const pinsPalette = document.getElementById('pal-pins');
    if (pinsPalette) {
        pinsPalette.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
    }

    if (variant === 'custom') {
        // Check if this is a free RAL color
        const freePinsRals = ['9003', '1013', '9005'];
        const isFree = freePinsRals.includes(ralName);
        
        setState('shockmountPins', { variant: 'custom', material: 'custom', colorValue: color, colorName: `RAL ${ralName}` });
        const targetSwatch = document.getElementById('pal-pins')?.querySelector(`[data-ral="${ralName}"]`);
        if(targetSwatch) targetSwatch.classList.add('selected');
        
        // Set price - free for standard RAL colors, paid for others
        setState('prices.shockmount', isFree ? 0 : CONFIG.optionPrice);

    } else if (variant === 'brass') {
        setState('shockmountPins', { variant: 'brass', material: 'brass', colorValue: null, colorName: 'Polished Brass' });
        // Ищем с префиксом pins-
        let target = section.querySelector(`[data-variant="pins-${variant}"]`);
        if (!target) {
            target = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (target) target.classList.add('selected');
        
        // Brass is free
        setState('prices.shockmount', 0);
        
    } else {
        // Standard color variants (RAL9003, RAL1013, RAL9005)
        const colors = { 'RAL9003': '#F4F4F4', 'RAL1013': '#EAE0C8', 'RAL9005': '#0E0E10' };
        // Remove prefix if present
        const cleanVariant = variant.replace('pins-', '');
        setState('shockmountPins', { 
            variant: variant, 
            material: null, 
            colorValue: colors[cleanVariant], 
            colorName: cleanVariant
        });
        // Ищем с префиксом pins-
        let targetPins = section.querySelector(`[data-variant="pins-${cleanVariant}"]`);
        if (!targetPins) {
            targetPins = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (targetPins) targetPins.classList.add('selected');
        
        // Standard colors are free
        setState('prices.shockmount', 0);
    }

    updateShockmountPinsPreview();
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

export function toggleSubmenu(section) {
    const menuItem = document.querySelector(`[data-section="${section}"]`);
    const submenu = document.getElementById(`submenu-${section}`);

    if (!menuItem || !submenu) return;

    const isExpanded = menuItem.classList.contains('expanded');

    document.querySelectorAll('.submenu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('expanded'));

    if (!isExpanded) {
        submenu.classList.add('active');
        menuItem.classList.add('expanded');

        // Auto-preview switching logic
        if (['spheres', 'body', 'logo', 'logo-bg'].includes(section)) {
            const currentPreview = document.querySelector('.preview-switch-btn.active')?.dataset.preview;
            if (currentPreview === 'case' || currentPreview === 'shockmount') {
                switchPreview('microphone');
            }
        } else if (section === 'case') {
            const currentPreview = document.querySelector('.preview-switch-btn.active')?.dataset.preview;
            if (currentPreview === 'microphone' || currentPreview === 'shockmount') {
                switchPreview('case');
            }
        } else if ((section === 'shockmount' || section === 'shockmount-pins')) {
            const currentState = stateManager.get();
            if (currentState.shockmount.enabled) {
                const currentPreview = document.querySelector('.preview-switch-btn.active')?.dataset.preview;
                if (currentPreview === 'microphone' || currentPreview === 'case') {
                    switchPreview('shockmount');
                }
            }
            else{
                switchPreview('global-view');
            }
        }

        setTimeout(() => {
            const backBtn = submenu.querySelector('.submenu-back');
            if (backBtn) backBtn.focus();
        }, 400);
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
