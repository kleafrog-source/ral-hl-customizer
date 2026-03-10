<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arComponentParameters = [
    "GROUPS" => [],
    "PARAMETERS" => [
        "IBLOCK_ID" => [
            "PARENT" => "BASE",
            "NAME" => GetMessage("MICROPHONE_CUSTOMIZER_IBLOCK_ID"),
            "TYPE" => "STRING",
            "REQUIRED" => "Y",
        ],
        "ELEMENT_ID" => [
            "PARENT" => "BASE",
            "NAME" => GetMessage("MICROPHONE_CUSTOMIZER_ELEMENT_ID"),
            "TYPE" => "STRING",
            "DEFAULT" => '={$_REQUEST["ELEMENT_ID"]}',
        ],
        "PROPERTY_CODE" => [
            "PARENT" => "BASE",
            "NAME" => GetMessage("MICROPHONE_CUSTOMIZER_PROPERTY_CODE"),
            "TYPE" => "STRING",
            "DEFAULT" => "CUSTOM_CONFIG",
        ],
        "CACHE_TIME" => ["DEFAULT" => 3600],
    ],
];
