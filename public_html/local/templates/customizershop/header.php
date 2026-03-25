<!DOCTYPE html>
<html lang="ru">
<head>
    <?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/head_customizer_simple.php");?>    
</head>
<body>
    <?$APPLICATION->ShowPanel();?>
    <?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/header_customizer.php");?>

<?php
$APPLICATION->IncludeComponent(
	"custom:microphone.customizer", 
	"eta", 
	array(
		"IBLOCK_ID" => "0",
		"ELEMENT_ID" => "0",
		"PROPERTY_CODE" => "CUSTOM_CONFIG",
		"COMPONENT_TEMPLATE" => "eta",
		"CACHE_TYPE" => "A",
		"CACHE_TIME" => "3600",
		"MODEL_CODE" => "023-the-bomblet",
		"CACHE_NOTES" => ""
	),
	false
);
?>
