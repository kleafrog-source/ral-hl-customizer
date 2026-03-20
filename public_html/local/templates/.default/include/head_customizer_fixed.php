<?php
/**
 * Минималистичный head для кастомайзера
 * Отключены все ненужные скрипты Битрикса
 */

// Отключаем Яндекс.Метрику и другие счетчики
if (!defined('STOP_YANDEX_METRICS')) {
    define('STOP_YANDEX_METRICS', true);
}
if (!defined('NO_BITRIX_ANALYTICS')) {
    define('NO_BITRIX_ANALYTICS', true);
}

// Базовые мета-теги
echo '<meta http-equiv="X-UA-Compatible" content="IE=edge" />';
echo '<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />';
echo '<meta name="viewport" content="width=device-width, initial-scale=1" />';
echo '<link rel="shortcut icon" href="/favicon.ico" />';
echo '<title>'.$APPLICATION->GetTitle().'</title>';

// Канонический URL для SEO
$canonicalUrl = "https://".$_SERVER['HTTP_HOST'].$APPLICATION->GetCurPage(false);
echo '<link rel="canonical" href="'.htmlspecialchars($canonicalUrl).'" />';

// Schema.org
include $_SERVER['DOCUMENT_ROOT'].'/include/schema.php';

// Только критические стили для кастомайзера
$APPLICATION->SetAdditionalCSS('/css/style.css');
$APPLICATION->SetAdditionalCSS('/css/style_mobile.css');
$APPLICATION->SetAdditionalCSS('/css/fonts.css');

// Только jQuery для кастомайзера
$APPLICATION->AddHeadScript('/js/jquery-3.7.1.min.js');

// Базовые мета-теги
$APPLICATION->ShowMeta("robots", false, true);
$APPLICATION->ShowMeta("keywords", false, true);
$APPLICATION->ShowMeta("description", false, true);
$APPLICATION->ShowCSS(true, true);
$APPLICATION->ShowHeadStrings();
$APPLICATION->ShowHeadScripts();
?>

<script>
// Отключаем Яндекс.Метрику на клиентской стороне
(function() {
    'use strict';
    
    try {
        // Блокируем все счетчики Яндекс.Метрики
        if (typeof window.yandexMetrika !== 'undefined') {
            window.yandexMetrika = null;
        }
        
        // Удаляем существующие счетчики
        if (typeof Object.keys === 'function') {
            Object.keys(window).forEach(function(key) {
                if (key.indexOf('yaCounter') === 0 || key.indexOf('yandex') >= 0) {
                    try {
                        window[key] = null;
                    } catch (e) {
                        // Игнорируем ошибки
                    }
                }
            });
        }
        
        // Блокируем будущие счетчики
        if (typeof Object.defineProperty === 'function') {
            Object.defineProperty(window, 'yandexMetrika', {
                get: function() { return null; },
                set: function() { return null; }
            });
        }
        
        // Блокируем XMLHttpRequest к mc.yandex.com
        if (typeof XMLHttpRequest !== 'undefined' && XMLHttpRequest.prototype) {
            var originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url && (url.indexOf('mc.yandex.com') >= 0 || url.indexOf('yandex.ru') >= 0)) {
                    console.log('🚫 Yandex.Metrics blocked:', url);
                    return;
                }
                return originalOpen.apply(this, arguments);
            };
        }
        
        console.log('🚫 Yandex.Metrics and other analytics disabled for customizer');
        
    } catch (e) {
        console.log('Error in analytics blocker:', e.message);
    }
})();
</script>
