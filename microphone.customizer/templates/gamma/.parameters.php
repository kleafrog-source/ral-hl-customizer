<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arTemplateParameters = [
    "MODEL_CODE" => [
        "NAME" => "Код модели микрофона",
        "TYPE" => "STRING",
        "DEFAULT" => "023-the-bomblet",
        "MULTIPLE" => "N",
        "COL_COUNT" => 30
    ],
    "CACHE_TIME" => [
        "NAME" => "Время кэширования (сек)",
        "TYPE" => "STRING",
        "DEFAULT" => "3600",
        "MULTIPLE" => "N"
    ]
];
?>
