<?php
/**
 * Простая версия head для кастомайзера
 * Минимум кода, максимум стабильности
 */

// Базовые мета-теги
?>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="shortcut icon" href="/favicon.ico" />
<title><?$APPLICATION->ShowTitle()?></title>

<?php
// Канонический URL
$canonicalUrl = "https://".$_SERVER['HTTP_HOST'].$APPLICATION->GetCurPage(false);
echo '<link rel="canonical" href="'.htmlspecialchars($canonicalUrl).'" />';
?>

<?php include $_SERVER['DOCUMENT_ROOT'].'/include/schema.php'; ?>

<?php
// Только необходимые стили
$APPLICATION->SetAdditionalCSS('/css/style.css');
$APPLICATION->SetAdditionalCSS('/css/style_mobile.css');
$APPLICATION->SetAdditionalCSS('/css/fonts.css');

// Только jQuery
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
// Простое отключение Яндекс.Метрики
window.addEventListener('load', function() {
    // Удаляем скрипты Яндекс.Метрики
    var scripts = document.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf('yandex') >= 0) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
    
    // Блокируем XMLHttpRequest
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && url.indexOf('mc.yandex.com') >= 0) {
            return;
        }
        return originalOpen.apply(this, arguments);
    };
    
    console.log('Yandex.Metrics blocked');
});
</script>
