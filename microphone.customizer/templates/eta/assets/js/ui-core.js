// UI Core (eta)

import { stateManager } from './core/state.js';
import { updateSVG } from './engine.js';
import { updateSectionLayers } from './modules/appearance-new.js';
import { updateLogoSVG, updateMalfaLogoOptionsVisibility } from './modules/logo.js';
import { refreshShockmountUI, updateShockmountVisibility } from './modules/shockmount-new.js';
import { syncToggles, initToggles } from './modules/toggles.js';
import { applyModelDefaults } from './modules/model-defaults.js';
import { calculateTotal, getBreakdown, formatPrice, debugPrices } from './modules/price-calculator.js';
import { syncCurrentModelOptionData } from './modules/hl-data-manager.js';
import { switchLayer, updateMicVariant } from './modules/camera-effect.js';
import { applyModelRuntimeState } from './modules/model-runtime.js';
import { sendOrder } from './services/report.js';
import { validateForm } from './services/validation.js';

export function updateUI() {
    // Update MALFA logo options visibility based on current model
    updateMalfaLogoOptionsVisibility();
    
    const state = stateManager.get();
    const breakdown = getBreakdown(state);
    const total = calculateTotal(state);
    
    // Логирование цен для отладки
    debugPrices(state);

    const basePriceEl = document.getElementById('base-price');
    if (basePriceEl) basePriceEl.textContent = `${(state.basePrice || 0).toLocaleString('ru-RU')}₽`;

    const setPrice = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatPrice(value);
    };

    setPrice('spheres-price-row', breakdown.spheres);
    setPrice('body-price-row', breakdown.body);
    setPrice('logo-price-row', breakdown.logo + breakdown.logobg);
    setPrice('case-price-row', breakdown.case);
    setPrice('shockmount-price-row', breakdown.shockmount);

    const shockmountMenuPrice = document.getElementById('shockmount-price');
    if (shockmountMenuPrice) shockmountMenuPrice.textContent = formatPrice(breakdown.shockmount);

    const totalEl = document.getElementById('total-price');
    if (totalEl) totalEl.textContent = `${total.toLocaleString('ru-RU')}₽`;

    // const shockmountRow = document.getElementById('shockmount-price-row-container');
    // if (shockmountRow) {
    //     const showShockmount = !!state.shockmount?.enabled && !state.shockmount?.included && !!state.shockmount?.available;
    //     shockmountRow.style.display = showShockmount ? 'flex' : 'none';
    // }

    // Обновление строки Shockmount в ценах на основе HL-полей
    const shockRow = document.getElementById('shockmount-price-row-container');
    const shockValue = document.getElementById('shockmount-price-row');

    if (shockRow && shockValue) {
        const s = state.shockmount || {};
        const price = breakdown.shockmount || 0;

        const showRow = s.visible && s.enabled && price > 0;

        shockRow.style.display = showRow ? 'flex' : 'none';
        shockValue.textContent = showRow ? formatPrice(price) : formatPrice(0);
    }

    // Обновление видимости меню-пунктов shockmount/shockmountPins
    const shockMenu = document.getElementById('shockmount-section');
    if (shockMenu) {
        const s = state.shockmount || {};
        shockMenu.style.display = s.visible ? '' : 'none';
    }

    const shockPinsMenu = document.getElementById('shockmountPins-section');
    if (shockPinsMenu) {
        const s = state.shockmount || {};
        // Pins показываем только если подвес вообще доступен
        shockPinsMenu.style.display = s.visible ? '' : 'none';
    }

    const setColorDisplay = (id, color) => {
        const el = document.getElementById(id);
        if (el && color) el.style.backgroundColor = color;
    };

    setColorDisplay('spheres-color-display', state.spheres?.colorValue);
    setColorDisplay('body-color-display', state.body?.colorValue);
    setColorDisplay('logo-color-display', state.logo?.useCustom ? '#000000' : state.logobg?.colorValue);
    setColorDisplay('logobg-color-display', state.logobg?.colorValue);
    setColorDisplay('shockmount-color-display', state.shockmount?.colorValue);
    setColorDisplay('shockmountPins-color-display', state.shockmountPins?.colorValue);

    const setSubtitle = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || 'Выберите вариант';
    };

    const getLabel = (sectionState) => {
        if (!sectionState) return 'Выберите вариант';
        if (sectionState.isRal && sectionState.colorName) return sectionState.colorName;
        if (sectionState.variantName) return sectionState.variantName;
        return 'Выберите вариант';
    };

    setSubtitle('spheres-subtitle', getLabel(state.spheres));
    setSubtitle('body-subtitle', getLabel(state.body));
    setSubtitle('logo-subtitle', state.logo?.useCustom ? 'Кастомный логотип' : getLabel(state.logo));
    setSubtitle('logobg-subtitle', getLabel(state.logobg));
    setSubtitle('case-subtitle', getLabel(state.case));
    setSubtitle('shockmount-subtitle', getLabel(state.shockmount));
    setSubtitle('shockmountPins-subtitle', getLabel(state.shockmountPins));

    // Update selected states for swatches and option buttons
    document.querySelectorAll('.variant-item, .swatch, .option-button').forEach(el => {
        const section = el.dataset.optionPart;
        if (!section) return;

        const currentVariant = state[section]?.variant;
        const isSelected = el.dataset.variantCode === currentVariant || el.dataset.variant === currentVariant;

        // el.classList.toggle('selected', isSelected); // Убрано добавление класса .selected
    });
}

function applyOptionFromElement(element) {
    const section = element.dataset.optionPart;
    if (!section) return;
    if ((section === 'logo' || section === 'logobg') && stateManager.get('logo.useCustom')) return;

    // Handle custom logo special case
    const isCustomLogo = element.dataset.isCustomLogo === '1';
    if (section === 'logo' && isCustomLogo) {
        const batch = stateManager.startBatch();
        batch('logo.useCustom', true);
        batch('logo.variantCode', element.dataset.variantCode || '');
        batch('logo.variantName', element.querySelector('.option-name')?.textContent?.trim() || '');
        batch('logo.price', parseInt(element.dataset.price || '0', 10));
        stateManager.endBatch();
        
        updateSVG();
        updateLogoSVG();
        updateUI();
        return;
    }

    const isRal = element.dataset.isRal === '1';
    const colorValue = element.dataset.ralRgb || null;
    const colorName = element.dataset.ralName || null;

    const batch = stateManager.startBatch();
    const variantCode = element.dataset.variantCode || '';
    const variantName = element.dataset.variantName
        || element.dataset.ralName
        || element.querySelector('.option-name')?.textContent?.trim()
        || variantCode;
    const ralCode = element.dataset.ral || element.dataset.ralCode || (isRal ? variantCode : null);
    const price = parseInt(element.dataset.price || '0', 10);

    batch(`${section}.variantCode`, variantCode);
    batch(`${section}.variant`, variantCode);
    batch(`${section}.variantName`, variantName);
    batch(`${section}.isRal`, isRal);
    batch(`${section}.color`, ralCode);
    batch(`${section}.colorValue`, colorValue);
    batch(`${section}.colorName`, colorName ? `RAL ${colorName}` : null);
    batch(`${section}.modelId`, parseInt(element.dataset.modelId || '0', 10));
    batch(`${section}.svgTargetMode`, element.dataset.svgTargetMode || null);
    batch(`${section}.svgLayerGroup`, element.dataset.svgLayerGroup || null);
    batch(`${section}.svgFilterId`, element.dataset.svgFilterId || null);
    batch(`${section}.svgSpecialKey`, element.dataset.svgSpecialKey || null);
    batch(`${section}.price`, price);
    stateManager.endBatch();

    if (section === 'logobg') {
        stateManager.set('logo.bgColor', ralCode || null);
        stateManager.set('logo.bgColorValue', colorValue || null);
    }

    updateSVG();
    updateLogoSVG();
    
    // Update section layers for logo to handle original/gradient modes
    if (section === 'logo') {
        updateSectionLayers('logo', stateManager.get().logo);
    }
    
    refreshShockmountUI(stateManager.get());
    updateUI();
}

export function initEventListeners() {
    // NOTE: zoom disabled intentionally to keep SVG/layout stable on mobile
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    initSidebarControls();
    initThemeControl();
    initFullscreenControl();
    initControlAnimations();
    initPriceSectionToggle();
    initToggles();
    initOrderModal();
    initHelpButton();

    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.addEventListener('click', () => {
            toggleSubmenu(item.dataset.section);
            focusSection(item.dataset.section);
        });
    });

    document.querySelectorAll('.back-button, .submenu-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.back || btn.closest('.submenu')?.id?.replace('submenu-', '');
            if (section) toggleSubmenu(section, true);
        });
    });

    document.querySelectorAll('.palette-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            const container = document.getElementById(`${section}-palette`);
            if (!container) return;
            const isOpen = container.style.display === 'block';
            container.style.display = isOpen ? 'none' : 'block';
        });
    });

    document.querySelectorAll('.option-button, .swatch').forEach(btn => {
        btn.addEventListener('click', () => applyOptionFromElement(btn));
    });

    document.querySelectorAll('.variant-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const oldModelCode = window.CUSTOMIZER_DATA.currentModelCode;
            const modelCode = btn.dataset.variant;
            if (!modelCode || !window.CUSTOMIZER_DATA?.modelsByCode?.[modelCode]) return;

            // Save old state
            stateManager.saveCurrentModelState(oldModelCode);

            document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            syncCurrentModelOptionData(modelCode);

            // Restore any saved per-model customization before applying capabilities.
            const restored = stateManager.restoreModelState(modelCode);
            // Normalize model-specific runtime state in one place.
            const runtimeData = applyModelRuntimeState(modelCode, { preserveShockmountSelection: restored });

            console.log('[UI-Core] Model switch to:', modelCode, {
                restored,
                modelId: runtimeData?.modelId,
                modelSeries: runtimeData?.modelSeries,
                basePrice: runtimeData?.basePrice,
                shockmountState: runtimeData?.shockmountState
            });

            if (!restored) {
                applyModelDefaults(modelCode);
            }

            syncToggles();

            // Сразу обновляем UI чтобы цены применились
            updateUI();

            // Обновляем SVG превью
            updateSVG();
            refreshShockmountUI(stateManager.get());
            
            // Дополнительное обновление видимости меню после всех изменений
            setTimeout(() => {
                updateShockmountVisibility();
            }, 50);
            updateMicVariant(modelCode);

            if (window.WoodCase) {
                window.WoodCase.setCase(modelCode);
            }
        });
    });
}

function focusSection(section) {
    if (!section) return;
    if (section === 'case') {
        switchLayer('case');
        return;
    }
    if (section === 'shockmount' || section === 'shockmountPins') {
        switchLayer('shockmount');
        return;
    }
    switchLayer('microphone');
}

function initPriceSectionToggle() {
    const section = document.querySelector('.price-section');
    const toggle = document.getElementById('price-section-toggle');
    const body = document.getElementById('price-section-body');
    if (!section || !toggle || !body) return;

    const toggleText = toggle.querySelector('.price-section-toggle-text');
    const saved = localStorage.getItem('priceSectionCollapsed') === '1';

    const applyState = (collapsed, animate = true) => {
        const startHeight = body.offsetHeight;
        section.classList.toggle('is-collapsed', collapsed);
        toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        if (toggleText) toggleText.textContent = collapsed ? 'Показать детали' : 'Скрыть детали';
        localStorage.setItem('priceSectionCollapsed', collapsed ? '1' : '0');

        const targetHeight = body.scrollHeight;
        body.style.height = `${startHeight}px`;
        if (window.anime && animate) {
            window.anime.remove(body);
            window.anime({
                targets: body,
                height: targetHeight,
                duration: 260,
                easing: 'easeOutQuad',
                complete: () => {
                    body.style.height = 'auto';
                }
            });
        } else {
            body.style.height = 'auto';
        }
    };

    applyState(saved, false);

    toggle.addEventListener('click', () => {
        const next = !section.classList.contains('is-collapsed');
        applyState(next, true);
    });
}

function serializeConfig() {
    const state = stateManager.get();
    const breakdown = getBreakdown(state);
    const total = calculateTotal(state);

    const config = {
        modelCode: state.currentModelCode,
        options: {
            spheres: state.spheres?.variantCode,
            body: state.body?.variantCode,
            logo: state.logo?.variantCode,
            logobg: state.logobg?.variantCode,
            case: state.case?.variantCode,
            shockmount: state.shockmount?.variantCode,
            shockmountPins: state.shockmountPins?.variantCode
        },
        prices: {
            base: state.basePrice,
            spheres: breakdown.spheres,
            body: breakdown.body,
            logo: breakdown.logo,
            logobg: breakdown.logobg,
            case: breakdown.case,
            shockmount: breakdown.shockmount,
            total: total
        },
        woodCaseEngraving: {
            enabled: state.case?.laserEngravingEnabled,
            logoTransform: state.case?.logoTransform,
            logoWidthMM: state.case?.logoWidthMM,
            logoOffsetMM: state.case?.logoOffsetMM
        }
    };

    const configJson = JSON.stringify(config);
    const input = document.getElementById('customizer-config-json');
    if (input) input.value = configJson;

    return config;
}

function initOrderModal() {
    const modal = document.getElementById('order-modal');
    const openBtn = document.querySelector('.price-section .order-button');
    if (!modal || !openBtn) return;

    const closeBtn = modal.querySelector('[data-modal-close]') || modal.querySelector('button');
    const open = () => {
        serializeConfig();
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
    };
    const close = () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    };

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    const form = document.getElementById('order-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            try {
                const formData = new FormData(form);
                const clientData = Object.fromEntries(formData.entries());

                await sendOrder(clientData);
                alert('Заказ успешно отправлен!');
                close();
                form.reset();
            } catch (error) {
                alert('Ошибка при отправке заказа: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

export function toggleSubmenu(section, forceClose = false) {
    const submenu = document.getElementById(`submenu-${section}`);
    const menuItem = document.querySelector(`[data-section="${section}"]`);
    if (!submenu || !menuItem) return;

    const isOpen = submenu.classList.contains('active');
    document.querySelectorAll('.submenu').forEach(sm => {
        sm.classList.remove('active');
        sm.style.display = 'none';
    });
    if (!forceClose && !isOpen) {
        submenu.style.display = 'block';
        requestAnimationFrame(() => submenu.classList.add('active'));
    }
}

function initSidebarControls() {
    const sidebar = document.getElementById('customization-sidebar');
    if (!sidebar) return;

    const edgeControls = document.getElementById('sidebar-edge-controls');
    if (edgeControls && !sidebar.contains(edgeControls)) {
        sidebar.appendChild(edgeControls);
    }

    const buttons = sidebar.querySelectorAll('[data-sidebar-state-btn]');
    if (!buttons.length) return;

    const savedState = localStorage.getItem('sidebarState');
    const initialState = savedState || sidebar.dataset.sidebarState || 'normal';
    applySidebarState(initialState, false);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetState = btn.dataset.sidebarStateBtn;
            applySidebarState(targetState, true);
        });
    });

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', () => {
        applySidebarState(sidebar.dataset.sidebarState || 'normal', false);
    });
}

function applySidebarState(state, animate = true) {
    const sidebar = document.getElementById('customization-sidebar');
    if (!sidebar) return;

    const allowedStates = ['compact', 'normal'];
    const nextState = allowedStates.includes(state) ? state : 'normal';
    sidebar.dataset.sidebarState = nextState;
    localStorage.setItem('sidebarState', nextState);

    sidebar.querySelectorAll('[data-sidebar-state-btn]').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.sidebarStateBtn === nextState);
    });

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const styles = getComputedStyle(sidebar);
    const widthMap = {
        compact: styles.getPropertyValue('--sidebar-width-compact').trim() || '88px',
        normal: styles.getPropertyValue('--sidebar-width-normal').trim() || '420px',
        expanded: styles.getPropertyValue('--sidebar-width-expanded').trim() || '480px'
    };
    const heightMap = {
        compact: styles.getPropertyValue('--sidebar-height-compact').trim() || '72px',
        normal: styles.getPropertyValue('--sidebar-height-normal').trim() || '50vh',
        expanded: styles.getPropertyValue('--sidebar-height-expanded').trim() || '62vh'
    };

    const targetSize = isMobile ? heightMap[nextState] : widthMap[nextState];
    const paddingMap = {
        compact: isMobile ? '10px 12px' : '12px',
        normal: isMobile ? '16px' : '20px',
        expanded: isMobile ? '18px' : '24px'
    };

    if (window.anime && animate) {
        window.anime.remove(sidebar);
        window.anime({
            targets: sidebar,
            width: isMobile ? undefined : targetSize,
            height: isMobile ? targetSize : undefined,
            padding: paddingMap[nextState],
            duration: 360,
            easing: 'easeOutQuad'
        });

        const fadeTargets = sidebar.querySelectorAll('[data-sidebar-fade]');
        window.anime.remove(fadeTargets);
        window.anime({
            targets: fadeTargets,
            opacity: nextState === 'compact' ? 0 : 1,
            duration: 220,
            easing: 'linear'
        });
    } else {
        const fadeTargets = sidebar.querySelectorAll('[data-sidebar-fade]');
        fadeTargets.forEach(el => {
            el.style.opacity = nextState === 'compact' ? '0' : '1';
        });
        if (isMobile) {
            sidebar.style.height = targetSize;
        } else {
            sidebar.style.width = targetSize;
        }
        sidebar.style.padding = paddingMap[nextState];
    }
}

function initThemeControl() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    if (!themeToggle) return;

    const storedTheme = localStorage.getItem('customizerTheme');
    root.setAttribute('data-theme', storedTheme || 'light');

    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('customizerTheme', next);
    });
}

function initFullscreenControl() {
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (!fullscreenToggle) return;

    const updateState = () => {
        fullscreenToggle.classList.toggle('is-active', !!document.fullscreenElement);
    };

    fullscreenToggle.addEventListener('click', async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.warn('Fullscreen toggle failed', error);
        }
    });

    document.addEventListener('fullscreenchange', updateState);
    updateState();
}

function initControlAnimations() {
    const buttons = document.querySelectorAll('#fullscreen-toggle, #theme-toggle, #sidebar-help-btn');
    if (!buttons.length || !window.anime) return;

    buttons.forEach(btn => {
        const animateIn = () => {
            window.anime.remove(btn);
            window.anime({
                targets: btn,
                scale: 1.06,
                translateY: -2,
                duration: 180,
                easing: 'easeOutQuad'
            });
        };
        const animateOut = () => {
            window.anime.remove(btn);
            window.anime({
                targets: btn,
                scale: 1,
                translateY: 0,
                duration: 200,
                easing: 'easeOutQuad'
            });
        };
        btn.addEventListener('mouseenter', animateIn);
        btn.addEventListener('focus', animateIn);
        btn.addEventListener('mouseleave', animateOut);
        btn.addEventListener('blur', animateOut);
    });
}

function initHelpButton() {
    const helpBtn = document.getElementById('sidebar-help-btn');
    const startScreen = document.getElementById('start-screen');
    if (!helpBtn || !startScreen) return;

    helpBtn.addEventListener('click', () => {
        startScreen.classList.remove('hidden');
    });
}
