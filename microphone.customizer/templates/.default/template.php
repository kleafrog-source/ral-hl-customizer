<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/** @var array $arParams */
/** @var array $arResult */
/** @var CBitrixComponentTemplate $this */

use Bitrix\Main\Page\Asset;

Asset::getInstance()->addCss($templateFolder . "/assets/css/style.css");
Asset::getInstance()->addCss($templateFolder . "/assets/css/woodcase.css");
Asset::getInstance()->addCss($templateFolder . "/assets/css/forms.css");
Asset::getInstance()->addCss($templateFolder . "/assets/css/camera-effect.css");
Asset::getInstance()->addCss($templateFolder . "/assets/css/start-screen.css");
Asset::getInstance()->addJs("https://cdn.jsdelivr.net/npm/interactjs@1.10.19/dist/interact.min.js");
Asset::getInstance()->addJs("https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js");
?>
<!-- Глоссарий-словарь разделов, элементов, вариантов
которые по-разному могут называться в приложении:
1. "Силуэт", "spheres", "Полусферы", "Цвет силуэта";
2. "Корпус", "body", "Цвет корпуса", "центральная часть микрофона","Цвет корпуса", "Корпус", "body", "цвет корпуса";
3. "Эмблема", "emblem", "логотип микрофона", "лого", "logo" Цвет логотипа", "Логотип", "logo", "Цвет логотипа", Цвет логотипа", "Логотип", "logo", "Цвет логотипа;
4. "Фон эмблемы","Эмаль эмблемы","Эмаль логотипа","цвет эмали эмблемы", "logobg", "фон логотипа микрофона", "Цвет фона логотипа", "color of logo background" 11. "Цвет фона логотипа", "Фон логотипа", "logobg", "Цвет фона логотипа";;
5. "Футляр", "Деревянный футляр", "Кейс", "case", "woodcase","Цвет футляра", "Футляр", "case", "woodcase", "Цвет футляра", "Цвет футляра", "Футляр", "case", "woodcase", "Цвет футляра";
6. "Подвес", "антивибрационный подвес","каркас подвеса", "shockmount", "Амортизатор", "Амортизатор Паук", "паук", "color of shockmount".
7. "Цвет пинов подвеса", "Пины", "pins","штыри подвеса", "Цвет пинов", "Цвет пинов", "Пины", "shockmount-pins", "Цвет пинов"
8. "Цвет подвеса", "Подвес", "shockmount", "Цвет подвеса";  "Цвет подвеса", "Подвес", "shockmount", "Цвет подвеса"; "Цвет подвеса", "Подвес", "shockmount", "Цвет подвеса";
-->
<div class="microphone-customizer-app" id="customizer-app-root"
     data-element-id="<?= isset($arResult["ELEMENT"]["ID"]) ? $arResult["ELEMENT"]["ID"] : 0 ?>"
     data-iblock-id="<?= isset($arResult["ELEMENT"]["IBLOCK_ID"]) ? $arResult["ELEMENT"]["IBLOCK_ID"] : 0 ?>"
     data-ajax-path="<?= $componentPath ?>/ajax.php"
     data-sessid="<?= bitrix_sessid() ?>">

    <div id="start-screen" style="display:none;">
        <?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => $templateFolder."/start-screen.php"), false);?>
    </div>


    
        <div class="toggle-color">
            <button id="fullscreen-toggle" class="fullscreen-toggle" aria-label="Переключить полноэкранный режим">
                <svg class="fullscreen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3m-18 0v3a2 2 0 0 0 2 2h3"></path>
                </svg>
            </button>        
            <button id="theme-toggle" class="theme-toggle" aria-label="Переключить тему">

            </button>
        </div>

 <div class="app-container">
        <div class="preview-area" id="preview-area">
            <div class="svg-container">
                <div class="svg-wrapper" id="svg-wrapper">
                    <?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => $templateFolder."/svg-microphone.php"), false);?>
                </div>

                <!-- Shockmount Preview Container -->
                <div class="shockmount-preview-container" id="shockmount-preview-container" style="">
                           <?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => $templateFolder."/svg-shockmount.php"), false);?>
                </div>

                <!-- Case Preview Container -->
                <div class="case-preview-container" id="case-preview-container" style=" width:100%; height:100%;">
                <?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => $templateFolder."/svg-woodcase.php"), false);?>
                </div>
            </div>
        </div>
            <?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => $templateFolder."/sidebar.php"), false);?>
          


        <div class="modal-overlay" id="order-modal">
            <div class="modal-container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="font-size:20px; font-weight:700;">Ваша конфигурация</h3>
                <button style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--text-secondary);">×</button>
            </div>
            <form id="order-form" novalidate>
                <div class="form-group">
                    <label class="form-label">Фамилия *</label>
                    <input type="text" class="form-input" name="lastname" id="input-lastname" required>
                    <div class="error-message">Минимум 2 символа</div>
                </div>
                 <div class="form-group">
                    <label class="form-label">Имя *</label>
                    <input type="text" class="form-input" name="name" id="input-name" required>
                    <div class="error-message">Минимум 2 символа</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Телефон *</label>
                    <input type="tel" class="form-input" name="phone" id="input-phone" required>
                    <div class="error-message">Некорректный номер телефона</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-input" name="email" id="input-email" required>
                    <div class="error-message">Некорректный email адрес</div>
                </div>
             <div class="form-group">
                    <label class="form-label">Страна</label>
                    <input type="text" class="form-input" name="country" id="input-country">
                    <div class="error-message">Минимум 2 символа</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Город</label>
                    <input type="text" class="form-input" name="city" id="input-city">
                    <div class="error-message">Минимум 2 символа</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Комментарий</label>
                    <textarea class="form-textarea" name="comment" rows="3"></textarea>
                </div>
                <button type="submit" class="order-button">Отправить конфигурацию</button>
            </form>
        </div>
                <!-- HIDDEN STORAGE -->
        <div id="ral-storage"></div>
        <div id="variant-storage"></div>
    </div>

    <!-- Report Modal -->
    <div class="modal-overlay" id="report-modal">
        <div class="modal-container report-container">
            <div class="report-header">
                <h2 style="font-size:24px; font-weight:800;">Конфигурация сохранена</h2>
                <button style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--text-secondary);">×</button>
            </div>
            <div class="report-body">
                <div class="report-visual" id="report-visual-container">
                    <!-- SVG Clone will be inserted here -->
                </div>
                <div class="report-details">
                    <div class="report-section">
                        <h3>Данные клиента</h3>
                        <div class="report-data-row">
                            <span class="report-data-label">Фамилия:</span>
                            <span class="report-data-value" id="report-lastname"></span>
                        </div>
                          <div class="report-data-row">
                            <span class="report-data-label">Имя:</span>
                            <span class="report-data-value" id="report-name"></span>
                        </div>
                        <div class="report-data-row">
                            <span class="report-data-label">Телефон:</span>
                            <span class="report-data-value" id="report-phone"></span>
                        </div>
                        <div class="report-data-row">
                            <span class="report-data-label">Email:</span>
                            <span class="report-data-value" id="report-email"></span>
                        </div>
                        <div class="report-data-row">
                            <span class="report-data-label">Комментарий:</span>
                            <span class="report-data-value" id="report-comment" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h3>Конфигурация</h3>
                        <div class="report-data-row">
                            <span class="report-data-label">Модель:</span>
                            <span class="report-data-value" id="report-model"></span>
                        </div>
                        <div class="report-data-row">
                            <span class="report-data-label">Силуэт:</span>
                            <span class="report-data-value" id="report-spheres"></span>
                        </div>
                        <div class="report-data-row">
                            <span class="report-data-label">Корпус:</span>
                            <span class="report-data-value" id="report-body"></span>
                        </div>
                        <div class="report-data-row">
                            <span class="report-data-label">Эмблема:</span>
                            <span class="report-data-value" id="report-logo"></span>
                        </div>
                        <div class="report-data-row">
                            <span class="report-data-label">Футляр:</span>
                            <span class="report-data-value" id="report-case"></span>
                        </div>
                        <div class="report-data-row" id="report-shockmount-row" style="display: none;">
                            <span class="report-data-label">Подвес (корпус):</span>
                            <span class="report-data-value" id="report-shockmount"></span>
                        </div>
                        <div class="report-data-row" id="report-shockmount-pins-row" style="display: none;">
                            <span class="report-data-label">Подвес (пины):</span>
                            <span class="report-data-value" id="report-shockmount-pins"></span>
                        </div>
                        <!-- Hidden inputs for custom logos -->
                        <input type="hidden" id="report-custom-logo-data" value="">
                        <input type="hidden" id="report-case-logo-data" value="">
                    </div>

                    <div class="report-total">
                        <span>Итого:</span>
                        <span id="report-total-price"></span>
                    </div>
                </div>
            </div>
            <button class="print-btn">Сохранить в PDF</button>
        </div>
    </div>

    <div class="notification" id="notification"> 
    </div>
</div>

<script>
    // Устанавливаем пути для JS
    window.CUSTOMIZER_SVG_PATH = '<?= $templateFolder ?>/assets/mic-017.svg';
    window.CUSTOMIZER_ASSETS_PATH = '<?= $templateFolder ?>/assets';
    
    // Передаем данные пользователя в JS
    window.BX_USER_DATA = <?= json_encode($arResult["USER_DATA"]) ?>;
</script>



    <!-- modal -->
<div class="modal-overlay" id="info-modal">
    <div class="modal">
        <div class="modal-header">
          <h2>Current View Info</h2>
          <button class="modal-close" id="info-close">&times;</button>
        </div>
        <div class="modal-section">
          <strong>Case:</strong> <span id="info-case"></span><br>
          <strong>Image loaded:</strong> <span id="info-image-state"></span><br>
          <strong>Position:</strong> X: <span id="info-x"></span>,
          Y: <span id="info-y"></span>,
          Scale: <span id="info-scale"></span><br>
          <strong>Image size:</strong> <span id="info-size"></span>
        </div>
        <div class="modal-section modal-grid">
          <div class="modal-box">
            <h3>Uploaded Image</h3>
            <img id="info-image-preview" alt="">
          </div>
        </div>
    </div>
</div>



    <!-- Скрытая форма Битрикса для надежной отправки заказа -->
    <div style="display:none;">
        <?$APPLICATION->IncludeComponent(
            "bitrix:form.result.new",
            "",
            Array(
                "WEB_FORM_ID" => "1",
                "IGNORE_CUSTOM_TEMPLATE" => "Y",
                "USE_EXTENDED_ERRORS" => "Y",
                "SEF_MODE" => "N",
                "CACHE_TYPE" => "N",
                "LIST_URL" => "",
                "EDIT_URL" => "",
                "SUCCESS_URL" => "",
                "CHAIN_ITEM_TEXT" => "",
                "CHAIN_ITEM_LINK" => ""
            )
        );?>
    </div>




    <script type="module" src="<?= $templateFolder ?>/assets/js/main.js"></script>
