<!DOCTYPE html>
<html lang="ru">
<head>
    <?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/head_customizer_simple.php");?>    
</head>
<body>
    <?$APPLICATION->ShowPanel();?>
    <?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/header_customizer.php");?>

<?php
global $USER;
if (!$USER->IsAdmin()) {
    LocalRedirect("/");
}

$APPLICATION->IncludeComponent(
	"custom:microphone.customizer", 
	"eta", 
	array(
		"IBLOCK_ID" => "0",
		"ELEMENT_ID" => "0",
		"PROPERTY_CODE" => "CUSTOM_CONFIG",
		"COMPONENT_TEMPLATE" => "eta",
		"CACHE_TYPE" => "N",
		"CACHE_TIME" => "0",
		"MODEL_CODE" => "023-the-bomblet",
		"CACHE_NOTES" => ""
	),
	false
);
?>
