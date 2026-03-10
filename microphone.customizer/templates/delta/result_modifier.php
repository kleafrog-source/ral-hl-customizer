<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Highloadblock\HighloadBlockTable;
use Bitrix\Main\Loader;

$viewTypeMap = [
    1 => 'spheres',
    2 => 'body',
    3 => 'logo',
    4 => 'logobg',
    5 => 'case',
    6 => 'shockmount',
    7 => 'shockmountPins',
];

$arResult['VIEW_TYPE_MAP'] = $viewTypeMap;
$arResult['VIEW_TYPE_TO_SECTION'] = $viewTypeMap;
$arResult['SECTION_TO_VIEW_TYPE'] = array_flip($viewTypeMap);

$cacheTime = 3600;
$cacheId = 'customizer_hl_data_delta_' . ($arParams['MODEL_CODE'] ?? 'default');
$cacheDir = '/customizer/hl_data';

$cache = \Bitrix\Main\Data\Cache::createInstance();
if ($cache->initCache($cacheTime, $cacheId, $cacheDir)) {
    $arResult = $cache->getVars();
} elseif ($cache->startDataCache()) {
    if (!Loader::includeModule('highloadblock')) {
        $cache->abortDataCache();
        return;
    }

    $getHlData = function ($hlId, $filter = [], $select = ['*'], $order = ['UF_SORT' => 'ASC']) {
        try {
            $hlBlock = HighloadBlockTable::getById($hlId)->fetch();
            if (!$hlBlock) {
                return [];
            }

            $entity = HighloadBlockTable::compileEntity($hlBlock);
            $entityDataClass = $entity->getDataClass();

            $rsData = $entityDataClass::getList([
                'select' => $select,
                'filter' => $filter,
                'order' => $order
            ]);

            return $rsData->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    };

    // RAL colors (HL ID 9)
    $ralRows = $getHlData(9, ['UF_ACTIVE' => 1], ['ID', 'UF_NAME', 'UF_CODE', 'UF_HEX', 'UF_RGB_CODE', 'UF_SORT']);
    $ralColors = [];
    foreach ($ralRows as $color) {
        $ralColors[(int)$color['ID']] = $color;
    }
    $arResult['RAL_COLORS'] = $ralColors;

    // Models (HL ID 10)
    $modelRows = $getHlData(
        10,
        [],
        ['ID', 'UF_CODE', 'UF_NAME', 'UF_BASE_PRICE', 'UF_DESCRIPTION', 'UF_SHOCKMOUNT_ENABLED', 'UF_SHOCKMOUNT_PRICE', 'UF_SORT', 'UF_MODEL_SERIES'],
        ['UF_SORT' => 'ASC']
    );
    $models = [];
    $modelsByCode = [];
    foreach ($modelRows as $model) {
        $modelData = [
            'ID' => (int)$model['ID'],
            'CODE' => $model['UF_CODE'],
            'NAME' => $model['UF_NAME'],
            'BASE_PRICE' => (int)$model['UF_BASE_PRICE'],
            'DESCRIPTION' => $model['UF_DESCRIPTION'],
            'SHOCKMOUNT_ENABLED' => (int)$model['UF_SHOCKMOUNT_ENABLED'],
            'SHOCKMOUNT_PRICE' => (int)$model['UF_SHOCKMOUNT_PRICE'],
            'MODEL_SERIES' => $model['UF_MODEL_SERIES'],
            'SORT' => (int)$model['UF_SORT'],
        ];
        $models[$modelData['ID']] = $modelData;
        $modelsByCode[$modelData['CODE']] = $modelData;
    }
    $arResult['MODELS'] = $models;
    $arResult['MODELS_BY_CODE'] = $modelsByCode;

    // Options (HL ID 11)
    $optionRows = $getHlData(11, [], ['*'], ['UF_SORT' => 'ASC']);
    $options = [];
    foreach ($optionRows as $option) {
        $modelId = (int)($option['UF_MODEL_ID'] ?: 0);
        $viewTypeId = (int)($option['UF_VIEW_TYPE'] ?: 0);
        $sectionCode = $option['UF_SECTION_CODE'] ?: ($viewTypeMap[$viewTypeId] ?? 'unknown');

        if (!isset($options[$modelId])) {
            $options[$modelId] = [];
        }
        if (!isset($options[$modelId][$sectionCode])) {
            $options[$modelId][$sectionCode] = [];
        }

        if (!empty($option['UF_IS_RAL']) && !empty($option['UF_RAL_COLOR_ID'])) {
            $ralId = (int)$option['UF_RAL_COLOR_ID'];
            if (isset($ralColors[$ralId])) {
                $option['RAL_DATA'] = $ralColors[$ralId];
            }
        }

        if (!empty($option['UF_SERIESVAR'])) {
            $option['SERIES_VAR'] = $option['UF_SERIESVAR'];
        }

        if (!empty($option['UF_SVG_SPECIAL_KEY'])) {
            $option['SVG_SPECIAL_KEY'] = $option['UF_SVG_SPECIAL_KEY'];
        }

        $options[$modelId][$sectionCode][] = $option;
    }
    $arResult['OPTIONS'] = $options;

    // Prices (HL ID 12)
    $priceRows = $getHlData(12, [], ['UF_SECTION_CODE', 'UF_MODEL_CODE', 'UF_VARIANT_CODE', 'UF_PRICE', 'UF_IS_RAL_SURCHARGE']);
    $prices = [];
    foreach ($priceRows as $price) {
        $sectionCode = $price['UF_SECTION_CODE'];
        $modelCode = $price['UF_MODEL_CODE'] ?: '';
        $variantCode = $price['UF_VARIANT_CODE'] ?: '';
        $priceValue = (int)$price['UF_PRICE'];
        $isRalSurcharge = (bool)$price['UF_IS_RAL_SURCHARGE'];

        if (!isset($prices[$sectionCode])) {
            $prices[$sectionCode] = [];
        }
        if (!isset($prices[$sectionCode][$modelCode])) {
            $prices[$sectionCode][$modelCode] = [];
        }

        if ($isRalSurcharge) {
            $prices[$sectionCode]['_ral_surcharge'] = $priceValue;
        } else {
            $prices[$sectionCode][$modelCode][$variantCode] = $priceValue;
        }
    }
    $arResult['PRICES'] = $prices;

    // Current model
    $currentModelCode = $arParams['MODEL_CODE'] ?? '023-the-bomblet';
    $currentModel = $modelsByCode[$currentModelCode] ?? null;
    $currentModelId = $currentModel['ID'] ?? null;

    $arResult['CURRENT_MODEL_CODE'] = $currentModelCode;
    $arResult['CURRENT_MODEL_ID'] = $currentModelId;

    // Merge options for current model (model_id = 0 + model-specific)
    $currentModelOptions = [];
    if (isset($options[0])) {
        foreach ($options[0] as $sectionCode => $sectionOptions) {
            $currentModelOptions[$sectionCode] = $sectionOptions;
        }
    }
    if ($currentModelId && isset($options[$currentModelId])) {
        foreach ($options[$currentModelId] as $sectionCode => $sectionOptions) {
            if (!isset($currentModelOptions[$sectionCode])) {
                $currentModelOptions[$sectionCode] = [];
            }
            $currentModelOptions[$sectionCode] = array_merge($currentModelOptions[$sectionCode], $sectionOptions);
        }
    }
    $arResult['CURRENT_MODEL_OPTIONS'] = $currentModelOptions;
    $arResult['OPTIONS_BY_SECTION'] = $currentModelOptions;

    $arResult['LIQUID_TOGGLES'] = [
        'custom_logo' => [
            'enabled' => true,
            'title' => 'Собственная эмблема',
            'description' => 'Загрузите собственный логотип для микрофона',
            'price_rule' => 'custom-microphone-logo'
        ],
        'laser_engraving' => [
            'enabled' => true,
            'title' => 'Добавить персональную лазерную гравировку',
            'description' => 'Нанесите гравировку на деревянный футляр',
            'price_rule' => 'custom-woodcase-image'
        ],
        'shockmount' => [
            'enabled' => (int)($currentModel['SHOCKMOUNT_ENABLED'] ?? 0),
            'included' => (int)($currentModel['SHOCKMOUNT_ENABLED'] ?? 0) === 1,
            'price' => (int)($currentModel['SHOCKMOUNT_PRICE'] ?? 0),
            'title' => 'Добавить подвес',
            'description' => 'Профессиональный подвес для микрофона'
        ]
    ];

    $cache->endDataCache($arResult);
}
