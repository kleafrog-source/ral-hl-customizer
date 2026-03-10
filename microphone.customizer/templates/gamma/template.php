<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

// Подключаем result_modifier из beta для получения HL данных
$arResult = include(__DIR__ . '/../beta/result_modifier.php');

// Названия секций для отображения
$viewTypeNames = [
    'spheres' => 'Силуэт',
    'body' => 'Корпус',
    'logo' => 'Логотип',
    'logobg' => 'Фон логотипа',
    'case' => 'Футляр',
    'shockmount' => 'Подвес',
    'shockmountPins' => 'Пины подвеса'
];
?>

<div id="customizer-app-root" class="customizer-app">
    <!-- SVG контейнер -->
    <div class="svg-container">
        <div id="microphone-svg-container">
            <!-- SVG будет загружен динамически -->
        </div>
    </div>
    
    <!-- Сайдбар сгенерированный из HL данных -->
    <div class="sidebar" id="customization-sidebar">
        <div class="sidebar-content">
            
            <!-- VARIANT SWITCH -->
            <div class="variant-switch" id="variant-switch">
                <?php foreach ($arResult['MODELS'] as $model): ?>
                    <?php 
                    $series = substr($model['CODE'], 0, 3);
                    $isActive = $model['CODE'] === $arResult['CURRENT_MODEL_CODE'];
                    $displayName = preg_replace('/\s+\d+/', '', $model['NAME']); // Remove numbers from name
                    $displayName = preg_replace('/(\d+)/', ' $1', $displayName); // Add space before numbers
                    ?>
                    <button class="variant-button<?= $isActive ? ' active' : '' ?>" 
                            data-series="<?= htmlspecialchars($series) ?>" 
                            data-variant="<?= htmlspecialchars($model['CODE']) ?>">
                        <?= htmlspecialchars($displayName) ?>
                    </button>
                <?php endforeach; ?>
            </div>

            <!-- ОСНОВНЫЕ СЕКЦИИ (генерируются из HL данных) -->
            <?php foreach ($arResult['OPTIONS_BY_SECTION'] as $sectionCode => $options): ?>
                <?php if (!in_array($sectionCode, ['shockmountPins'])): // Пины отображаются внутри подвеса ?>
                    <div class="menu-item">
                        <h4 class="section-title">
                            <?= htmlspecialchars($viewTypeNames[$sectionCode] ?? $sectionCode) ?>
                        </h4>
                        
                        <div class="submenu" id="<?= htmlspecialchars($sectionCode) ?>-submenu">
                            <div class="radio-set">
                                <?php foreach ($options as $option): ?>
                                    <?php
                                    $ralHex = '';
                                    $ralName = '';
                                    $ralId = '';
                                    
                                    if ($option['UF_IS_RAL'] && isset($option['RAL_DATA'])) {
                                        $ralHex = $option['RAL_DATA']['UF_HEX'] ?? '';
                                        $ralName = $option['RAL_DATA']['UF_NAME'] ?? '';
                                        $ralId = $option['RAL_DATA']['ID'] ?? '';
                                    }
                                    ?>
                                    
                                    <button class="option-button variant-button"
                                            data-option-part="<?= htmlspecialchars($sectionCode) ?>"
                                            data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                            data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>"
                                            data-is-ral="<?= (int)($option['UF_IS_RAL'] ?? 0) ?>"
                                            data-price="<?= (int)($option['UF_PRICE'] ?? 0) ?>"
                                            data-model-id="<?= (int)($option['UF_MODEL_ID'] ?? 0) ?>"
                                            data-svg-target-mode="<?= htmlspecialchars($option['UF_SVG_TARGET_MODE'] ?? '') ?>"
                                            data-svg-layer-group="<?= htmlspecialchars($option['UF_SVG_LAYER_GROUP'] ?? '') ?>"
                                            data-svg-filter-id="<?= htmlspecialchars($option['UF_SVG_FILTER_ID'] ?? '') ?>"
                                            data-svg-special-key="<?= htmlspecialchars($option['UF_SVG_SPECIAL_KEY'] ?? '') ?>"
                                            <?php if ($option['UF_IS_RAL']): ?>
                                                data-ral-id="<?= htmlspecialchars($ralId) ?>"
                                                data-ral-hex="<?= htmlspecialchars($ralHex) ?>"
                                                data-ral-name="<?= htmlspecialchars($ralName) ?>"
                                            <?php endif; ?>
                                            data-option-id="<?= (int)($option['ID'] ?? 0) ?>">
                                        
                                        <?php if ($option['UF_IS_RAL'] && $ralHex): ?>
                                            <div class="color-swatch" style="background-color: <?= htmlspecialchars($ralHex) ?>;"></div>
                                        <?php endif; ?>
                                        
                                        <span class="option-label">
                                            <?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? '') ?>
                                        </span>
                                        
                                        <?php if ($option['UF_PRICE'] > 0): ?>
                                            <span class="option-price">+<?= number_format($option['UF_PRICE'], 0, '.', ' ') ?> ₽</span>
                                        <?php endif; ?>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>

            <!-- LIQUID TOGGLE БЛОКИ -->

            <!-- 1. Кастомный логотип -->
            <?php if ($arResult['LIQUID_TOGGLES']['custom_logo']['enabled']): ?>
                <div class="menu-item toggle-logo-section">
                    <div class="toggle-flexbox-option-text">
                        <h4 class="section-title" style="margin:0;">
                            <?= htmlspecialchars($arResult['LIQUID_TOGGLES']['custom_logo']['title']) ?>
                        </h4>
                        <input type="checkbox" class="liquid-toggle" id="logo-mode-toggle">
                    </div>
                    <p><?= htmlspecialchars($arResult['LIQUID_TOGGLES']['custom_logo']['description']) ?></p>
                    <div id="custom-logo-upload-area" style="display: none;">
                        <div class="upload-container">
                            <input type="file" id="custom-logo-input" accept="image/*" style="display: none;">
                            <label for="custom-logo-input" class="upload-button">
                                <span>Выберите файл логотипа</span>
                            </label>
                            <div class="upload-preview" id="logo-preview"></div>
                            <div class="upload-controls">
                                <label>Ширина логотипа (мм):</label>
                                <input type="number" id="logo-width-mm" min="5" max="50" value="15" step="1">
                                <label>Смещение сверху (мм):</label>
                                <input type="number" id="logo-offset-mm-top" min="-20" max="20" value="0" step="1">
                                <label>Смещение слева (мм):</label>
                                <input type="number" id="logo-offset-mm-left" min="-20" max="20" value="0" step="1">
                            </div>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- 2. Кастомная гравировка футляра -->
            <?php if ($arResult['LIQUID_TOGGLES']['laser_engraving']['enabled']): ?>
                <div class="submenu-section">
                    <h4 class="section-title"><?= htmlspecialchars($arResult['LIQUID_TOGGLES']['laser_engraving']['title']) ?></h4>
                    <div style="display:flex; align-items: center; justify-content: space-between;">
                        <h4 class="section-title" style="margin:0;">Собственная гравировка</h4>
                        <input type="checkbox" class="liquid-toggle" id="laser-engraving-toggle">
                    </div>
                    <p><?= htmlspecialchars($arResult['LIQUID_TOGGLES']['laser_engraving']['description']) ?></p>
                </div>
                <div class="toggle-laser-engraving-data" id="laser-engraving-data" style="display: none;">
                    <div class="engraving-upload-container">
                        <input type="file" id="engraving-input" accept="image/*" style="display: none;">
                        <label for="engraving-input" class="upload-button">
                            <span>Загрузить изображение для гравировки</span>
                        </label>
                        <div class="engraving-preview" id="engraving-preview"></div>
                        <div class="engraving-controls">
                            <label>Размер гравировки (% от футляра):</label>
                            <input type="range" id="engraving-size" min="10" max="80" value="50" step="5">
                            <label>Позиция X:</label>
                            <input type="range" id="engraving-x" min="0" max="100" value="50" step="1">
                            <label>Позиция Y:</label>
                            <input type="range" id="engraving-y" min="0" max="100" value="50" step="1">
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- 3. Подвес (shockmount toggle) -->
            <?php if ($arResult['LIQUID_TOGGLES']['shockmount']['enabled']): ?>
                <div class="menu-item" id="shockmount-toggle">
                    <div class="toggle-flexbox-option-text" style="width: 100%;">
                        <h4 class="section-title" style="margin:0;"><?= htmlspecialchars($arResult['LIQUID_TOGGLES']['shockmount']['title']) ?></h4>
                        <div class="switch-container" id="shockmount-switch-container" style="width: auto;">
                            <?php if (!$arResult['LIQUID_TOGGLES']['shockmount']['included']): ?>
                                <span class="toggle-price-hint" id="shockmount-toggle-price">
                                    +<?= number_format($arResult['LIQUID_TOGGLES']['shockmount']['price'], 0, '.', ' ') ?> ₽
                                </span>
                                <input type="checkbox" class="liquid-toggle" id="shockmount-switch">
                            <?php endif; ?>
                        </div>
                    </div>
                    <div id="shockmount-included-text" style="display: <?= $arResult['LIQUID_TOGGLES']['shockmount']['included'] ? 'block' : 'none' ?>;">
                        <span>Подвес включен в комплект</span>
                    </div>
                    
                    <!-- Пины подвеса (если подвес активен) -->
                    <div id="shockmount-pins-submenu" style="display: none;">
                        <h5 class="subsection-title">Пины подвеса</h5>
                        <div class="radio-set">
                            <?php if (isset($arResult['OPTIONS_BY_SECTION']['shockmountPins'])): ?>
                                <?php foreach ($arResult['OPTIONS_BY_SECTION']['shockmountPins'] as $option): ?>
                                    <?php
                                    $ralHex = '';
                                    $ralName = '';
                                    $ralId = '';
                                    
                                    if ($option['UF_IS_RAL'] && isset($option['RAL_DATA'])) {
                                        $ralHex = $option['RAL_DATA']['UF_HEX'] ?? '';
                                        $ralName = $option['RAL_DATA']['UF_NAME'] ?? '';
                                        $ralId = $option['RAL_DATA']['ID'] ?? '';
                                    }
                                    ?>
                                    
                                    <button class="option-button variant-button"
                                            data-option-part="shockmountPins"
                                            data-variant-code="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                            data-variant-name="<?= htmlspecialchars($option['UF_VARIANT_CODE'] ?? '') ?>"
                                            data-is-ral="<?= (int)($option['UF_IS_RAL'] ?? 0) ?>"
                                            data-price="<?= (int)($option['UF_PRICE'] ?? 0) ?>"
                                            data-model-id="<?= (int)($option['UF_MODEL_ID'] ?? 0) ?>"
                                            data-svg-target-mode="<?= htmlspecialchars($option['UF_SVG_TARGET_MODE'] ?? '') ?>"
                                            data-svg-layer-group="<?= htmlspecialchars($option['UF_SVG_LAYER_GROUP'] ?? '') ?>"
                                            data-svg-filter-id="<?= htmlspecialchars($option['UF_SVG_FILTER_ID'] ?? '') ?>"
                                            data-svg-special-key="<?= htmlspecialchars($option['UF_SVG_SPECIAL_KEY'] ?? '') ?>"
                                            <?php if ($option['UF_IS_RAL']): ?>
                                                data-ral-id="<?= htmlspecialchars($ralId) ?>"
                                                data-ral-hex="<?= htmlspecialchars($ralHex) ?>"
                                                data-ral-name="<?= htmlspecialchars($ralName) ?>"
                                            <?php endif; ?>
                                            data-option-id="<?= (int)($option['ID'] ?? 0) ?>">
                                        
                                        <?php if ($option['UF_IS_RAL'] && $ralHex): ?>
                                            <div class="color-swatch" style="background-color: <?= htmlspecialchars($ralHex) ?>;"></div>
                                        <?php endif; ?>
                                        
                                        <span class="option-label">
                                            <?= htmlspecialchars($option['UF_VARIANT_NAME'] ?? $option['UF_VARIANT_CODE']) ?>
                                        </span>
                                        
                                        <?php if ($option['UF_PRICE'] > 0): ?>
                                            <span class="option-price">+<?= number_format($option['UF_PRICE'], 0, '.', ' ') ?> ₽</span>
                                        <?php endif; ?>
                                    </button>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

        </div>
    </div>

    <!-- Панель информации и цены -->
    <div class="info-panel">
        <div class="price-display">
            <span class="price-label">Цена:</span>
            <span class="price-value" id="total-price"><?= number_format($arResult['MODELS_BY_CODE'][$arResult['CURRENT_MODEL_CODE']]['BASE_PRICE'] ?? 0, 0, '.', ' ') ?> ₽</span>
        </div>
        <div class="action-buttons">
            <button class="btn-secondary" id="reset-button">Сбросить</button>
            <button class="btn-primary" id="add-to-cart-button">В корзину</button>
        </div>
    </div>
</div>

<!-- Подключение стилей -->
<link rel="stylesheet" href="<?= $this->GetFolder() ?>/assets/css/gamma-template.css">

<!-- Передача данных в JavaScript -->
<script>
window.CUSTOMIZER_DATA = <?= json_encode([
    'models' => $arResult['MODELS_BY_CODE'],
    'modelsByCode' => $arResult['MODELS_BY_CODE'],
    'options' => $arResult['OPTIONS'],
    'optionsBySection' => $arResult['OPTIONS_BY_SECTION'],
    'currentModelOptions' => $arResult['CURRENT_MODEL_OPTIONS'],
    'ralColors' => $arResult['RAL_COLORS'],
    'prices' => $arResult['PRICES'],
    'viewTypeMap' => $arResult['VIEW_TYPE_MAP'],
    'currentModelCode' => $arResult['CURRENT_MODEL_CODE'],
    'currentModelId' => $arResult['CURRENT_MODEL_ID'],
    'liquidToggles' => $arResult['LIQUID_TOGGLES']
]) ?>;

window.CUSTOMIZER_ASSETS_PATH = '<?= $this->GetFolder() ?>/assets';
</script>

<!-- Подключение JS -->
<script src="<?= $this->GetFolder() ?>/assets/js/main.js"></script>
