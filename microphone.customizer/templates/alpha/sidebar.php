   <? if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  ?>
 <div class="sidebar" id="sidebar">
                <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
                    <button id="help-btn" class="service-reset" title="Показать справку">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </button>
                </div>
                <!-- VARIANT SWITCH -->
                <div class="variant-switch" id="variant-switch">
                    <button class="variant-button active" data-series="023" data-variant="023-the-bomblet">023 the BOMBLET</button>
                    <button class="variant-button" data-series="023" data-variant="023-malfa">023 MALFA</button>
                    <button class="variant-button" data-series="023" data-variant="023-deluxe">023 DELUXE</button>
                    <button class="variant-button" data-series="017" data-variant="017-fet">017 FET</button>
                    <button class="variant-button" data-series="017" data-variant="017-tube">017 TUBE</button>
                </div>
                <div class="menu-item" data-section="spheres" tabindex="0">
                    <div class="item-icon"><div class="color-circle" id="spheres-color-display" style="background-color: rgb(161, 161, 160);"></div></div>
                    <div class="item-content">
                        <p class="item-label">Цвет силуэта</p>
                        <p class="item-subtitle" id="spheres-subtitle">Сатинированная сталь</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    <div class="option-price" id="spheres-price">+0₽</div>
                </div>
                <div class="submenu" id="submenu-spheres">
                    <div class="submenu-header">
                        <h3 class="submenu-title">Выберите цвет для верхней и нижней полусфер</h3>
                        <button class="submenu-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><span>Назад</span></button>
                    </div>
                    <div class="submenu-section">
                        <h4 class="section-title">Материал и цвет</h4>
                        <div class="variants" id="quick-select-spheres"></div>
                    </div>
                    <div class="submenu-section">
                        <button class="palette-toggle-btn" aria-expanded="false">
                            <span>RAL K7</span>
                            <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </button>
                        <div class="palette-wrapper" id="palette-wrapper-spheres">
                            <div class="palette-content">
                                <div class="palette" id="pal-spheres"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BODY SECTION -->
                <div class="menu-item" data-section="body" tabindex="0">
                    <div class="item-icon"><div class="color-circle" id="body-color-display" style="background-color: rgb(161, 161, 160);"></div></div>
                    <div class="item-content">
                        <p class="item-label">Цвет корпуса</p>
                        <p class="item-subtitle" id="body-subtitle">Сатинированная сталь</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    <div class="option-price" id="body-price">+0₽</div>
                </div>
                <div class="submenu" id="submenu-body">
                    <div class="submenu-header">
                        <h3 class="submenu-title">Определите цвет центральной части корпуса</h3>
                        <button class="submenu-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><span>Назад</span></button>
                    </div>
                    <div class="submenu-section">
                        <h4 class="section-title">Цвет корпуса</h4>
                        <div class="variants" id="quick-select-body"></div>
                    </div>
                    <div class="submenu-section">
                        <button class="palette-toggle-btn" aria-expanded="false"><span>RAL K7</span><svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
                        <div class="palette-wrapper" id="palette-wrapper-body"><div class="palette-content"><div class="palette" id="pal-body"></div></div></div>
                    </div>
                </div>

                <!-- LOGO TOGGLE SECTION -->
                <div class="menu-item toggle-logo-section">
                    <div class="toggle-flexbox-option-text">
                        <h4 class="section-title" style="margin:0;">
                            Собственная эмблема
                        </h4>
                        <input type="checkbox" class="liquid-toggle" id="logo-mode-toggle">
                    </div>
                    <p style="font-size:11px; color:var(--text-light); margin-top:5px;">
                        Замените стандартную эмблему Soyuz на собственный дизайн. Загрузите PNG/SVG, размер до 3 МБ. Цвет эмали в этом случае не применяется.
                    </p>
                    <div id="custom-logo-upload-area" style="display: none; width: 100%; margin-top: 10px; padding: 15px; background: rgba(255, 255, 255, 0.5); border-radius: 8px; border: 1px dashed var(--brass); text-align: center;">
                        <div class="variant-item" tabindex="0" style="justify-content:center; width:100%;">
                            <span class="variant-label" style="color: var(--accent);">
                                Загрузить файл (PNG, SVG)
                            </span>
                        </div>
                        <button class="remove-logo-btn" style="display:none; width:100%; margin-top:10px; padding:8px; border:1px solid #ef4444; color:#ef4444; background:none; border-radius:6px; cursor:pointer; font-size:11px;">
                            Удалить логотип
                        </button>
                    </div>
                </div>

                <!-- STANDARD LOGO SECTION -->
                <div class="menu-item hidden" data-section="logo" tabindex="0" id="logo-section">
                    <div class="item-icon"><div class="color-circle" id="logo-color-display" style="background-color: #A1A1A0;"></div></div>
                    <div class="item-content">
                        <p class="item-label">Эмблема</p>
                        <p class="item-subtitle" id="logo-subtitle">Холодный хром</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    <div class="option-price" id="logo-price">+0₽</div>
                </div>
                <div class="submenu" id="submenu-logo">
                    <div class="submenu-header">
                        <h3 class="submenu-title">Эмблема на микрофоне</h3>
                        <button class="submenu-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><span>Назад</span></button>
                    </div>
                    <div style="position: relative;">
                        <div class="logo-options-overlay" id="logo-overlay"><div class="logo-overlay-text">Используется загруженное изображение</div></div>
                        <div class="submenu-section">
                            <h4 class="section-title">Исполнение эмблемы</h4>
                            <div class="variants">
                                <div class="variant-item" data-variant="standard-gold" tabindex="0">
                                    <div class="variant-info"><div class="variant-icon" style="background-color: #D4AF37;"></div><span class="variant-label">Классическая латунь</span></div>
                                    <span class="variant-price">+0₽</span>
                                </div>
                                <div class="variant-item selected" data-variant="standard-silver" tabindex="0">
                                    <div class="variant-info"><div class="variant-icon" style="background-color: #A1A1A0;"></div><span class="variant-label">Холодный хром</span></div>
                                    <span class="variant-price">+0₽</span>
                                </div>
                                <div class="variant-item malfa-logo" data-variant="malfasilver" tabindex="0" style="display: none;">
                                    <div class="variant-info"><div class="variant-icon" style="background-color: #9A9D9D;"></div><span class="variant-label">MALFA (Серебро)</span></div>
                                    <span class="variant-price">+0₽</span>
                                </div>
                                <div class="variant-item malfa-logo" data-variant="malfagold" tabindex="0" style="display: none;">
                                    <div class="variant-info"><div class="variant-icon" style="background-color: #746341;"></div><span class="variant-label">MALFA (Золото)</span></div>
                                    <span class="variant-price">+0₽</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LOGO BG SECTION -->
                <div class="menu-item hidden" data-section="logobg" tabindex="0" id="logobg-section">
                    <div class="item-icon"><div class="color-circle" id="logobg-color-display" style="background-color: rgb(143, 30, 36);"></div></div>
                    <div class="item-content">
                        <p class="item-label">Цвет эмали логотипа</p>
                        <p class="item-subtitle" id="logo-bg-subtitle">RAL 3001 Сигнальный красный</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    <div class="option-price" id="logobg-price">+0₽</div>
                </div>
                <div class="submenu" id="submenu-logobg">
                    <div class="submenu-header">
                        <h3 class="submenu-title">Цвет эмали фона логотипа на микрофоне</h3>
                        <button class="submenu-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><span>Назад</span></button>
                    </div>
                    <div style="position: relative;">
                        <div class="logo-options-overlay" id="logobg-overlay"><div class="logo-overlay-text">Используется загруженное изображение</div></div>
                        <div class="submenu-section">
                            <h4 class="section-title">Фоновая заливка эмблемы</h4>
                            <div class="variants" id="quick-select-logobg" style="margin-bottom: 10px;"></div>
                            <button class="palette-toggle-btn" aria-expanded="false"><span class="palette-toggle-text">Премиум цвета RAL</span><svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
                            <div class="palette-wrapper" id="palette-wrapper-logobg"><div class="palette-content"><div class="palette" id="pal-logobg"></div></div></div>
                        </div>
                    </div>
                </div>

                <!-- CASE SECTION -->
                <div class="menu-item" data-section="case" tabindex="0">
                    <div class="item-icon"><div class="color-circle" id="case-color-display" style="background-color: #8B4513;"></div></div>
                    <div class="item-content">
                        <p class="item-label">Деревянный футляр</p>
                        <p class="item-subtitle" id="case-subtitle">Классический футляр СОЮЗ.</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    <div class="option-price" id="case-price">+0₽</div>
                </div>
                <div class="submenu" id="submenu-case">
                    <div class="submenu-header">
                        <h3 class="submenu-title">Футляр</h3>
                        <button class="submenu-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><span>Назад</span></button>
                    </div>
                    <div class="submenu-section">
                        <h4 class="section-title">Добавить персональную лазерную гравировку</h4>
                        <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                            <h4 class="section-title" style="margin:0;">Собственная гравировка</h4>
                            <input type="checkbox" class="liquid-toggle" id="laser-engraving-toggle">
                        </div>
                        <p style="font-size:11px; color:var(--text-light); margin-top:5px;">Добавьте собственное изображение для лазерной гравировки на крышке футляра. Загрузите PNG/SVG с прозрачным фоном, разместите и масштабируйте прямо на макете.</p>
                    </div>
                    <div class="toggle-laser-engraving-data" id="laser-engraving-data" style="display: none;">
                        <div class="submenu-section">
                            <h4 class="section-title">Загрузите изображение</h4>
                            <input type="file" id="case-file-input" hidden accept="image/png, image/webp, image/gif, image/svg+xml, image/tiff">
                            <div class="variant-item" tabindex="0" id="case-upload-btn" style="justify-content: center; border-style: dashed;"><span class="variant-label" style="color: var(--accent);">Загрузить файл (PNG, SVG)</span></div>
                            <p style="font-size:11px; color:var(--text-light); margin-top:5px;">Изображения без прозрачности будут обработаны фильтром.</p>
                            <button id="case-clear-btn" class="remove-logo-btn" style="display:none; width:100%; margin-top:10px; padding:10px; border:1px solid #ef4444; color:#ef4444; background:none; border-radius:8px; cursor:pointer;">Удалить загруженный файл</button>
                        </div>
                        <div class="submenu-section" id="case-positioning-controls" style="display: none;">
                            <h4 class="section-title">Позиционирование</h4>
                            <div class="manual-inputs" style="display: flex; flex-direction: column; gap: 10px;">
                                <div class="input-group" style="display: flex; justify-content: space-between; align-items: center;"><label for="input-case-top">Отступ сверху (мм)</label><input type="number" id="input-case-top" value="0" style="width: 60px;"></div>
                                <div class="input-group" style="display: flex; justify-content: space-between; align-items: center;"><label for="input-case-left">Отступ слева (мм)</label><input type="number" id="input-case-left" value="0" style="width: 60px;"></div>
                                <div class="input-group" style="display: flex; justify-content: space-between; align-items: center;"><label for="input-case-width">Ширина (мм)</label><input type="number" id="input-case-width" value="100" style="width: 60px;"></div>
                            </div>
                        </div>
                        <div class="submenu-section">
                            <h4 class="section-title">Информация</h4>
                            <div class="info" style="font-family: 'Consolas', monospace; font-size: 12px; color: #999; display: flex; flex-direction: column; gap: 5px;">
                                <span>Размер холста: <span id="info-res-tag" class="highlight">-</span></span>
                                <span>Ширина футляра: <span id="info-mm-tag" class="highlight">-</span></span>
                                <span>Отступ сверху: <span id="info-top-tag" class="highlight">-</span></span>
                                <span>Отступ слева: <span id="info-left-tag" class="highlight">-</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SHOCKMOUNT TOGGLE -->
                <div class="menu-item" id="shockmount-toggle">
                    <div class="toggle-flexbox-option-text" style="width: 100%;">
                        <h4 class="section-title" style="margin:0;">Добавить подвес</h4>
                        <div class="switch-container" id="shockmount-switch-container" style="width: auto;">
                            <span class="toggle-price-hint" id="shockmount-toggle-price">+10 000 ₽</span>
                            <input type="checkbox" class="liquid-toggle" id="shockmount-switch">
                        </div>
                    </div>
                    <div id="shockmount-included-text" style="display: none;"><span style="color: #2c5282; font-size: 14px;">Подвес включен в комплект</span></div>
                </div>

                <!-- SHOCKMOUNT SECTION -->
                 <!-- скрываем секцию так как выбранный микрофон при загрузке страницы 023-the-bomblet у которого shockmount не включен в комплектацию, а возможен как дополнительная опция за 10000рублей -->
                <div class="menu-item" data-section="shockmount" tabindex="0" id="shockmount-menu-item" style="display: none;">
                    <div class="item-icon"><div class="color-circle" id="shockmount-color-display" style="background-color: #f5f5f5;"></div></div>
                    <div class="item-content">
                        <p class="item-label">Антивибрационный подвес</p>
                        <p class="item-subtitle" id="shockmount-subtitle">RAL 9010 Чистый белый</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    <div class="option-price" id="shockmount-price">+0₽</div>
                </div>
                <div class="submenu" id="submenu-shockmount">
                    <div class="submenu-header">
                        <h3 class="submenu-title">Антивибрационный подвес (каркас)</h3>
                        <button class="submenu-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><span>Назад</span></button>
                    </div>
                    <div class="submenu-section" id="shockmount-options-section">
                        <h4 class="section-title">Цвет каркаса</h4>
                        <div class="variants" id="quick-select-shockmount"></div>
                    </div>
                    <div class="submenu-section">
                        <button class="palette-toggle-btn" aria-expanded="false"><span>Цвет по палитре RAL</span><svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
                        <div class="palette-wrapper" id="palette-wrapper-shockmount"><div class="palette-content"><div class="palette" id="pal-shockmount"></div></div></div>
                    </div>
                </div>

                <!-- SHOCKMOUNT PINS SECTION -->
                <div class="menu-item" data-section="pins" tabindex="0" id="pins-menu-item" style="display: none;">
                    <div class="item-icon"><div class="color-circle" id="shockmount-pins-color-display" style="background-color: #f5f5f5;"></div></div>
                    <div class="item-content">
                        <p class="item-label">Цвет пинов антивибрационного подвеса</p>
                        <p class="item-subtitle" id="shockmount-pins-subtitle">Полированная латунь</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    <div class="option-price" id="pins-price">+0₽</div>
                </div>
                <div class="submenu" id="submenu-pins">
                    <div class="submenu-header">
                        <h3 class="submenu-title">Цвет пинов подвеса</h3>
                        <button class="submenu-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><span>Назад</span></button>
                    </div>
                    <div class="submenu-section" id="pins-options-section">
                        <h4 class="section-title">Цвет пинов</h4>
                        <div class="variants" id="quick-select-pins"></div>
                    </div>
                    <div class="submenu-section" id="pins-palette-section">
                        <button class="palette-toggle-btn" aria-expanded="false"><span>Цвет по палитре RAL</span><svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
                        <div class="palette-wrapper" id="palette-wrapper-pins"><div class="palette-content"><div class="palette" id="pal-pins"></div></div></div>
                    </div>
                </div>

                <!-- сброс настроек -->
                <div class="menu-item" data-section="reset-settings" tabindex="0" id="reset-settings-btn">
                    <div class="item-icon" style="display:flex; align-items:center; justify-content:center; font-size:20px;">⚙</div>
                    <div class="item-content">
                        <p class="item-label">Сброс настроек</p>
                        <p class="item-subtitle">Вернуть к стандартным</p>
                    </div>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6"></path>
                    </svg>
                </div>

                <div class="total-price">
                    <div class="price-row"><span>Базовая цена:</span><span id="base-price">150 000 ₽</span></div>
                    <div class="price-row"><span>Силуэт:</span><span id="spheres-price-row">0 ₽</span></div>
                    <div class="price-row"><span>Корпус:</span><span id="body-price-row">0 ₽</span></div>
                    <div class="price-row"><span>Эмблема:</span><span id="logo-price-row">0 ₽</span></div>
                    <div class="price-row"><span>Футляр:</span><span id="case-price-row">0 ₽</span></div>
                    <div class="price-row" id="shockmount-price-row-container" style="display: none;"><span>Подвес:</span><span id="shockmount-price-row">0 ₽</span></div>
                    <div class="price-row price-total"><span>Итого:</span><span id="total-price">150 000 ₽</span></div>
                    <button class="order-button">Отправить конфигурацию</button>
                </div>
            </div>