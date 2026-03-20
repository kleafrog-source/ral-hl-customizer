<?php
/**
 * Минималистичный head для кастомайзера
 * Отключены все ненужные скрипты Битрикса
 */

// Отключаем Яндекс.Метрику и другие счетчики
define('STOP_YANDEX_METRICS', true);
define('NO_BITRIX_ANALYTICS', true);

// Базовые мета-теги
echo '<meta http-equiv="X-UA-Compatible" content="IE=edge" />';
echo '<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />';
echo '<meta name="viewport" content="width=device-width, initial-scale=1" />';
echo '<link rel="shortcut icon" href="/favicon.ico" />';
echo '<title>'.$APPLICATION->GetTitle().'</title>';

<?php
// Канонический URL для SEO
$canonicalUrl = "https://".$_SERVER['HTTP_HOST'].$APPLICATION->GetCurPage(false);
echo '<link rel="canonical" href="'.htmlspecialchars($canonicalUrl).'" />';
?>

<?php include $_SERVER['DOCUMENT_ROOT'].'/include/schema.php'; ?>

<?php
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
    
    // Блокируем все счетчики Яндекс.Метрики
    if (window.yandexMetrika) {
        window.yandexMetrika = null;
    }
    
    // Удаляем существующие счетчики
    Object.keys(window).forEach(function(key) {
        if (key.startsWith('yaCounter') || key.includes('yandex')) {
            window[key] = null;
        }
    });
    
    // Блокируем будущие счетчики
    Object.defineProperty(window, 'yandexMetrika', {
        get: function() { return null; },
        set: function() { return null; }
    });
    
    // Блокируем XMLHttpRequest к mc.yandex.com
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && (url.includes('mc.yandex.com') || url.includes('yandex.ru'))) {
            console.log('🚫 Yandex.Metrics blocked:', url);
            throw new Error('Yandex.Metrics blocked by customizer');
        }
        return originalOpen.apply(this, arguments);
    };
    
    // Удаляем скрипты Яндекс.Метрики
    document.addEventListener('DOMContentLoaded', function() {
        const scripts = document.querySelectorAll('script[src*="yandex"], script[src*="mc.yandex.com"]');
        scripts.forEach(function(script) {
            console.log('🗑️ Removed Yandex script:', script.src);
            script.remove();
        });
    });
    
    console.log('🚫 Yandex.Metrics and other analytics disabled for customizer');
})();
</script>
