<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

/**
 * @var array $arParams
 * @var array $arResult
 * @var CMain $APPLICATION
 * @var CBitrixComponent $component
 */

// Получаем опции из HL данных
$options = $arResult['OPTIONS'] ?? [];
$viewTypeMap = [
    1 => 'spheres',
    2 => 'body', 
    3 => 'logo',
    34 => 'logobg',
    5 => 'case',
    6 => 'shockmount',
    7 => 'shockmountPins',
];

// Названия секций для отображения
$sectionNames = [
    'spheres' => 'Силуэт',
    'body' => 'Корпус',
    'logo' => 'Эмблема',
    'logobg' => 'Фон логотипа',
    'case' => 'Футляр',
    'shockmount' => 'Подвес',
    'shockmountPins' => 'Подвес (пины)',
];

// Описания секций
$sectionDescriptions = [
    'spheres' => 'Выберите силуэт микрофона из доступных вариантов',
    'body' => 'Выберите цвет корпуса микрофона',
    'logo' => 'Настройте эмблему микрофона',
    'logobg' => 'Выберите цвет фона для эмблемы',
    'case' => 'Добавьте деревянный футляр с гравировкой',
    'shockmount' => 'Выберите подвес для микрофона',
    'shockmountPins' => 'Выберите цвет пинов подвеса',
];
?>

<div class="sidebar" id="customization-sidebar">
    <div class="sidebar-content">
        
        <?php foreach ($viewTypeMap as $viewId => $sectionKey): ?>
            <?php 
            $sectionOptions = $options[$sectionKey] ?? [];
            if (empty($sectionOptions)) continue; // Пропускаем пустые секции
            ?>
            
            <div class="menu-item" data-section="<?= htmlspecialchars($sectionKey) ?>" tabindex="0" id="<?= htmlspecialchars($sectionKey) ?>-section">
                <div class="item-icon">
                    <div class="color-circle" id="<?= htmlspecialchars($sectionKey) ?>-color-display" style="background-color: #A1A1A0;"></div>
                </div>
                <div class="item-content">
                    <p class="item-label"><?= htmlspecialchars($sectionNames[$sectionKey] ?? $sectionKey) ?></p>
                    <p class="item-subtitle" id="<?= htmlspecialchars($sectionKey) ?>-subtitle">Выберите вариант</p>
                </div>
                <div class="item-arrow">
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M2 2L6 6L2 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>

            <!-- Submenu for this section -->
            <div class="submenu" id="submenu-<?= htmlspecialchars($sectionKey) ?>" style="display: none;">
                <div class="submenu-header">
                    <button class="back-button" data-back="<?= htmlspecialchars($sectionKey) ?>">
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path d="M6 2L2 6L6 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span><?= htmlspecialchars($sectionNames[$sectionKey] ?? $sectionKey) ?></span>
                    </button>
                </div>
                
                <div class="submenu-content">
                    <div class="section-description">
                        <p><?= htmlspecialchars($sectionDescriptions[$sectionKey] ?? '') ?></p>
                    </div>

                    <?php if ($sectionKey === 'logo'): ?>
                        <!-- Special logo section with custom upload -->
                        <div class="logo-options">
                            <div class="option-group">
                                <h4>Стандартная эмблема</h4>
                                <?php foreach ($sectionOptions as $option): ?>
                                    <?php if ($option['UF_IS_CUSTOM_LOGO'] ?? false) continue; ?>
                                    <button
                                        class="option-button"
                                        data-option-part="<?= htmlspecialchars($sectionKey) ?>"
                                        data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                        data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>"
                                        data-price="<?= (int)($option['UF_PRICE'] ?? 0) ?>"
                                        data-is-ral="<?= (int)($option['UF_IS_RAL'] ?? 0) ?>"
                                        data-option-id="<?= (int)($option['ID'] ?? 0) ?>"
                                    >
                                        <span class="option-name"><?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?></span>
                                        <?php if ((int)($option['UF_PRICE'] ?? 0) > 0): ?>
                                            <span class="option-price">+<?= number_format($option['UF_PRICE'], 0, '', ' ') ?>₽</span>
                                        <?php endif; ?>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                            
                            <div class="option-group">
                                <h4>Кастомная эмблема</h4>
                                <?php foreach ($sectionOptions as $option): ?>
                                    <?php if (!($option['UF_IS_CUSTOM_LOGO'] ?? false)) continue; ?>
                                    <button
                                        class="option-button custom-logo-btn"
                                        data-option-part="<?= htmlspecialchars($sectionKey) ?>"
                                        data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                        data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>"
                                        data-price="<?= (int)($option['UF_PRICE'] ?? 0) ?>"
                                        data-is-ral="<?= (int)($option['UF_IS_RAL'] ?? 0) ?>"
                                        data-option-id="<?= (int)($option['ID'] ?? 0) ?>"
                                        data-is-custom-logo="1"
                                    >
                                        <span class="option-name"><?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?></span>
                                        <span class="option-price">+<?= number_format($option['UF_PRICE'], 0, '', ' ') ?>₽</span>
                                    </button>
                                <?php endforeach; ?>
                                
                                <!-- Custom logo upload area -->
                                <div class="custom-logo-upload" id="custom-logo-upload" style="display: none;">
                                    <div class="upload-area">
                                        <input type="file" id="logo-file-input" accept="image/*" style="display: none;">
                                        <button class="upload-button" onclick="document.getElementById('logo-file-input').click()">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>Загрузить логотип</span>
                                        </button>
                                        <p class="upload-hint">PNG, JPG, SVG до 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <?php elseif ($sectionKey === 'case'): ?>
                        <!-- Special case section with laser engraving -->
                        <div class="case-options">
                            <div class="option-group">
                                <h4>Варианты футляра</h4>
                                <?php foreach ($sectionOptions as $option): ?>
                                    <?php if ($option['UF_IS_LASER_ENGRAVING'] ?? false) continue; ?>
                                    <button
                                        class="option-button"
                                        data-option-part="<?= htmlspecialchars($sectionKey) ?>"
                                        data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                        data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>"
                                        data-price="<?= (int)($option['UF_PRICE'] ?? 0) ?>"
                                        data-is-ral="<?= (int)($option['UF_IS_RAL'] ?? 0) ?>"
                                        data-option-id="<?= (int)($option['ID'] ?? 0) ?>"
                                    >
                                        <span class="option-name"><?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?></span>
                                        <?php if ((int)($option['UF_PRICE'] ?? 0) > 0): ?>
                                            <span class="option-price">+<?= number_format($option['UF_PRICE'], 0, '', ' ') ?>₽</span>
                                        <?php endif; ?>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                            
                            <div class="option-group">
                                <h4>Лазерная гравировка</h4>
                                <?php foreach ($sectionOptions as $option): ?>
                                    <?php if (!($option['UF_IS_LASER_ENGRAVING'] ?? false)) continue; ?>
                                    <button
                                        class="option-button"
                                        data-option-part="<?= htmlspecialchars($sectionKey) ?>"
                                        data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                        data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>"
                                        data-price="<?= (int)($option['UF_PRICE'] ?? 0) ?>"
                                        data-is-ral="<?= (int)($option['UF_IS_RAL'] ?? 0) ?>"
                                        data-option-id="<?= (int)($option['ID'] ?? 0) ?>"
                                        data-is-laser-engraving="1"
                                    >
                                        <span class="option-name"><?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?></span>
                                        <span class="option-price">+<?= number_format($option['UF_PRICE'], 0, '', ' ') ?>₽</span>
                                    </button>
                                <?php endforeach; ?>
                                
                                <!-- Laser engraving upload area -->
                                <div class="laser-engraving-upload" id="laser-engraving-upload" style="display: none;">
                                    <div class="upload-area">
                                        <input type="file" id="case-file-input" accept="image/*" style="display: none;">
                                        <button class="upload-button" onclick="document.getElementById('case-file-input').click()">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>Загрузить изображение</span>
                                        </button>
                                        <p class="upload-hint">PNG, JPG до 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <?php else: ?>
                        <!-- Standard section with RAL palette -->
                        <div class="option-group">
                            <h4>Бесплатные варианты</h4>
                            <?php 
                            $freeOptions = array_filter($sectionOptions, function($opt) {
                                return ($opt['UF_IS_FREE'] ?? true) && !($opt['UF_IS_RAL'] ?? false);
                            });
                            ?>
                            <?php foreach ($freeOptions as $option): ?>
                                <button
                                    class="option-button variant-button"
                                    data-option-part="<?= htmlspecialchars($sectionKey) ?>"
                                    data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                    data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>"
                                    data-price="0"
                                    data-is-ral="0"
                                    data-option-id="<?= (int)($option['ID'] ?? 0) ?>"
                                    data-hex="<?= htmlspecialchars($option['UF_HEX'] ?? '') ?>"
                                >
                                    <span class="option-name"><?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?></span>
                                </button>
                            <?php endforeach; ?>
                        </div>

                        <?php 
                        // Check if there are RAL options
                        $ralOptions = array_filter($sectionOptions, function($opt) {
                            return ($opt['UF_IS_RAL'] ?? false);
                        });
                        
                        if (!empty($ralOptions)): 
                        ?>
                            <div class="option-group">
                                <h4>RAL цвета</h4>
                                <div class="palette-toggle-btn" data-section="<?= htmlspecialchars($sectionKey) ?>">
                                    <span>Палитра RAL K7</span>
                                    <svg class="chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
                                        <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                
                                <div class="palette-container" id="<?= htmlspecialchars($sectionKey) ?>-palette" style="display: none;">
                                    <div class="palette-tabs">
                                        <button class="palette-tab active" data-palette="k7">RAL K7</button>
                                    </div>
                                    <div class="palette-content">
                                        <div class="swatches-container" id="<?= htmlspecialchars($sectionKey) ?>-swatches">
                                            <!-- RAL swatches will be populated by JS from CUSTOMIZER_DATA.ralColors -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>

                        <?php 
                        // Check if there are paid non-RAL options
                        $paidOptions = array_filter($sectionOptions, function($opt) {
                            return !($opt['UF_IS_FREE'] ?? true) && !($opt['UF_IS_RAL'] ?? false);
                        });
                        
                        if (!empty($paidOptions)): 
                        ?>
                            <div class="option-group">
                                <h4>Платные варианты</h4>
                                <?php foreach ($paidOptions as $option): ?>
                                    <button
                                        class="option-button"
                                        data-option-part="<?= htmlspecialchars($sectionKey) ?>"
                                        data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                        data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>"
                                        data-price="<?= (int)($option['UF_PRICE'] ?? 0) ?>"
                                        data-is-ral="0"
                                        data-option-id="<?= (int)($option['ID'] ?? 0) ?>"
                                        data-hex="<?= htmlspecialchars($option['UF_HEX'] ?? '') ?>"
                                    >
                                        <span class="option-name"><?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?></span>
                                        <span class="option-price">+<?= number_format($option['UF_PRICE'], 0, '', ' ') ?>₽</span>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>

        <!-- Price Section -->
        <div class="sidebar-section price-section">
            <div class="price-display">
                <div class="total-price">
                    <div class="price-row">
                        <span>Базовая цена:</span>
                        <span id="base-price">159 990₽</span>
                    </div>
                    <div class="price-row">
                        <span>Силуэт:</span>
                        <span id="spheres-price-row">0₽</span>
                    </div>
                    <div class="price-row">
                        <span>Корпус:</span>
                        <span id="body-price-row">0₽</span>
                    </div>
                    <div class="price-row">
                        <span>Эмблема:</span>
                        <span id="logo-price-row">0₽</span>
                    </div>
                    <div class="price-row">
                        <span>Футляр:</span>
                        <span id="case-price-row">0₽</span>
                    </div>
                    <div class="price-row" id="shockmount-price-row-container" style="display: none;">
                        <span>Подвес:</span>
                        <span id="shockmount-price-row">0₽</span>
                    </div>
                    <div class="price-row price-total">
                        <span>Итого:</span>
                        <span id="total-price">159 990₽</span>
                    </div>
                    <button class="order-button">Отправить конфигурацию</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Initialize sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.back;
            const submenu = document.getElementById(`submenu-${section}`);
            const mainItem = document.getElementById(`${section}-section`);
            
            if (submenu) submenu.style.display = 'none';
            if (mainItem) mainItem.focus();
        });
    });

    // Menu item click to open submenu
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            const submenu = document.getElementById(`submenu-${section}`);
            
            // Close all other submenus
            document.querySelectorAll('.submenu').forEach(sm => {
                if (sm.id !== `submenu-${section}`) {
                    sm.style.display = 'none';
                }
            });
            
            // Open this submenu
            if (submenu) submenu.style.display = 'block';
        });
    });

    // Palette toggle functionality
    document.querySelectorAll('.palette-toggle-btn').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            const palette = document.getElementById(`${section}-palette`);
            const isActive = this.classList.contains('active');
            
            // Toggle palette
            if (palette) {
                palette.style.display = isActive ? 'none' : 'block';
                this.classList.toggle('active');
            }
        });
    });
});
</script>
