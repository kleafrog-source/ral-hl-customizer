<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<!--[if lt IE 9]><script src="/js/html5shiv.js"></script><![endif]-->

	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<link rel="shortcut icon" href="/favicon.ico" />
	<title><?$APPLICATION->ShowTitle()?></title>
	<?php
// Получаем текущую страницу без GET-параметров
$canonicalUrl = "https://".$_SERVER['HTTP_HOST'].$APPLICATION->GetCurPage(false);

// Выводим тег canonical
echo '<link rel="canonical" href="'.htmlspecialchars($canonicalUrl).'" />';
?>

	<?php	include $_SERVER['DOCUMENT_ROOT'].'/include/schema.php';

$curPage = $APPLICATION->GetCurPage(false);

if(isset($SCHEMA_PAGES[$curPage])){
    $APPLICATION->AddHeadString($SCHEMA_PAGES[$curPage], true);
}
	?>



	<?if($APPLICATION->GetCurPage(false) === '/contacts/'){?><script src="https://api-maps.yandex.ru/v3/?apikey=c017236e-19fb-4e98-b82d-25964416b976&lang=ru_RU" type="text/javascript"></script><script src="/js/maps.js?<?=date('YmdH')?>"></script><?}?>

    <?if($APPLICATION->GetCurPage(false) === '/samples/'){
				$APPLICATION->AddHeadScript('/js/wavesurfer/wavesurfer.min.js');

    }?>


     <?
	 $APPLICATION->SetAdditionalCSS('/js/aos/aos.css');
     $APPLICATION->SetAdditionalCSS('/js/owl/owl.carousel.min.css');
     $APPLICATION->SetAdditionalCSS('/js/owl/owl.theme.default.min.css');
    //  $APPLICATION->AddHeadScript('/js/aos/aos.js');
     $APPLICATION->AddHeadScript('/js/jquery-3.7.1.min.js');
	 $APPLICATION->AddHeadScript('/js/jquery.mask.min.js');
	//jquery.bxslider


	$APPLICATION->AddHeadScript('/js/bxslider/jquery.bxslider.min.js');
	$APPLICATION->SetAdditionalCSS('/js/bxslider/jquery.bxslider.css');

	//jquery.magnific-popup
	$APPLICATION->AddHeadScript('/js/maginific-popup/jquery.magnific-popup.js');
	$APPLICATION->SetAdditionalCSS('/js/maginific-popup/magnific-popup.css');
	//Plyr Player
	$APPLICATION->AddHeadScript('/js/plyr/plyr.js');
	$APPLICATION->SetAdditionalCSS('/js/plyr/plyr.css');
	$APPLICATION->SetAdditionalCSS('/js/plyr/plyr_custom.css');


	//Site Styles
	$APPLICATION->SetAdditionalCSS('/css/style.css');
	$APPLICATION->SetAdditionalCSS('/css/style_mobile.css');
	$APPLICATION->SetAdditionalCSS('/css/fonts.css');
	//Site Scripts
	$APPLICATION->AddHeadScript('/js/validate.js');
	$APPLICATION->AddHeadScript('/js/jquery.md5.js');
	$APPLICATION->AddHeadScript('/js/forms.js');
	$APPLICATION->AddHeadScript('/js/script.js');
     $APPLICATION->AddHeadScript('/js/owl/owl.carousel.min.js');
// $APPLICATION->AddHeadScript('/js/calltouch.js');

	?>
	<?
				$APPLICATION->ShowMeta("robots", false, true);
				$APPLICATION->ShowMeta("keywords", false, true);
				$APPLICATION->ShowMeta("description", false, true);
				$APPLICATION->ShowCSS(true, true);
				$APPLICATION->ShowHeadStrings();
				$APPLICATION->ShowHeadScripts();
	?>





