<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Highloadblock\HighloadBlockTable;
use Bitrix\Main\Loader;

$viewTypeMap = [
    1 => 'spheres',
    2 => 'body',
    3 => 'logo',
    34 => 'logobg',
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
        ['ID', 'UF_CODE', 'UF_NAME', 'UF_BASE_PRICE', 'UF_DESCRIPTION', 'UF_SHOCKMOUNT_ENABLED', 'UF_SHOCKMOUNT_PRICE', 'UF_SHOCKMOUNT_TOGGLE', 'UF_SHOCKMOUNT_VISIBLE', 'UF_IS_DEFAULT_MODEL', 'UF_DEFAULT_SPHERES', 'UF_DEFAULT_BODY', 'UF_DEFAULT_LOGO', 'UF_DEFAULT_LOGOBG', 'UF_DEFAULT_SHOCKMOUNT', 'UF_DEFAULT_SHOCKMOUNT_PINS', 'UF_SORT', 'UF_MODEL_SERIES'],
        ['UF_SORT' => 'ASC']
    );
    $models = [];
    $modelsByCode = [];
    foreach ($modelRows as $model) {
        $modelData = [
            'ID' => (int)$model['ID'],
            'CODE' => $model['UF_CODE'],
            'NAME' => $model['UF_NAME'],
            'BASE_PRICE' => (int)($model['UF_BASE_PRICE'] ?? 0),
            'DESCRIPTION' => $model['UF_DESCRIPTION'] ?? '',
            'SHOCKMOUNT_ENABLED' => (int)($model['UF_SHOCKMOUNT_ENABLED'] ?? 0),
            'SHOCKMOUNT_TOGGLE' => (int)($model['UF_SHOCKMOUNT_TOGGLE'] ?? 0),
            'SHOCKMOUNT_VISIBLE' => (int)($model['UF_SHOCKMOUNT_VISIBLE'] ?? 0),
            'SHOCKMOUNT_PRICE' => (int)($model['UF_SHOCKMOUNT_PRICE'] ?? 0),
            'IS_DEFAULT_MODEL' => (int)($model['UF_IS_DEFAULT_MODEL'] ?? 0),
            'DEFAULTS' => [
                'SPHERES' => (string)($model['UF_DEFAULT_SPHERES'] ?? ''),
                'BODY' => (string)($model['UF_DEFAULT_BODY'] ?? ''),
                'LOGO' => (string)($model['UF_DEFAULT_LOGO'] ?? ''),
                'LOGOBG' => (string)($model['UF_DEFAULT_LOGOBG'] ?? ''),
                'SHOCKMOUNT' => (string)($model['UF_DEFAULT_SHOCKMOUNT'] ?? ''),
                'SHOCKMOUNT_PINS' => (string)($model['UF_DEFAULT_SHOCKMOUNT_PINS'] ?? ''),
            ],
            'SORT' => (int)($model['UF_SORT'] ?? 0),
            'MODEL_SERIES' => (string)($model['UF_MODEL_SERIES'] ?? ''),
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
        $variantCode = $option['UF_VARIANT_CODE'] ?? '';
        $sectionCode = $option['UF_SECTION_CODE'] ?: ($viewTypeMap[$viewTypeId] ?? 'unknown');
        // HL export contains shockmountpinspaidral with view_type=6 (shockmount). Force it to pins.
        if ($variantCode === 'shockmountpinspaidral') {
            $sectionCode = 'shockmountPins';
        }

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

        // Special handling for free logobg RAL variants
        if ($sectionCode === 'logobg' && !empty($option['UF_IS_RAL']) && !empty($option['UF_RAL_COLOR_ID']) && !empty($option['UF_IS_FREE'])) {
            // This is a free logobg RAL variant - ensure it's marked as free
            $option['IS_RAL_PAID'] = 0;
            $option['UF_PRICE'] = 0;
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
    $currentModelCode = $arParams['MODEL_CODE'] ?? null;
    
    // Если модель не передана, ищем модель с флагом IS_DEFAULT_MODEL = 1
    if (!$currentModelCode) {
        foreach ($modelsByCode as $code => $model) {
            if ($model['IS_DEFAULT_MODEL'] === 1) {
                $currentModelCode = $code;
                break;
            }
        }
        // Fallback если модель по умолчанию не найдена
        if (!$currentModelCode) {
            $currentModelCode = '023-the-bomblet';
        }
    }
    
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
    
    // Filter options by model series (SERIES_VAR) when provided
    $currentSeries = $currentModel['MODEL_SERIES'] ?? '';
    if (!empty($currentSeries)) {
        foreach ($currentModelOptions as $sectionCode => $sectionOptions) {
            // Temporarily disable series filtering for logo and logobg sections to show all variants
            if ($sectionCode === 'logo' || $sectionCode === 'logobg') {
                // For logo and logobg sections, show all options (including MALFA and free RAL)
                $currentModelOptions[$sectionCode] = array_values($sectionOptions);
            } else {
                // For other sections, apply strict filtering
                $currentModelOptions[$sectionCode] = array_values(array_filter($sectionOptions, function ($opt) use ($currentSeries) {
                    $seriesVar = $opt['SERIES_VAR'] ?? ($opt['UF_SERIESVAR'] ?? '');
                    if (empty($seriesVar)) {
                        return true;
                    }
                    return (string)$seriesVar === (string)$currentSeries;
                }));
            }
        }
    }
    $arResult['CURRENT_MODEL_OPTIONS'] = $currentModelOptions;
    $arResult['OPTIONS_BY_SECTION'] = $currentModelOptions;

    // SECTION_OPTIONS — список опций по секциям для текущей модели,
    // в формате, который использует model-defaults.js и UI.
    $sectionOptions = [];

    foreach ($currentModelOptions as $sectionKey => $sectionOptionsList) {
        if (!is_array($sectionOptionsList)) {
            continue;
        }

        $sectionOptions[$sectionKey] = [];

        foreach ($sectionOptionsList as $opt) {
            $ralData = $opt['RAL_DATA'] ?? [];

            $sectionOptions[$sectionKey][] = [
                'variantCode'   => (string)($opt['UF_VARIANT_CODE'] ?? ''),
                'variantName'   => (string)($opt['UF_VARIANT_NAME'] ?? ''),
                'isRal'         => (bool)($opt['UF_IS_RAL'] ?? false),
                'color'         => (string)($opt['UF_RAL_COLOR_CODE'] ?? ''),
                'colorValue'    => (string)($ralData['UF_HEX'] ?? ''),
                'colorName'     => (string)($ralData['UF_NAME'] ?? ''),
                'modelId'       => (int)($opt['UF_MODEL_ID'] ?? 0),
                'svgTargetMode' => (string)($opt['UF_SVG_TARGET_MODE'] ?? ''),
                'svgLayerGroup' => (string)($opt['UF_SVG_LAYER_GROUP'] ?? ''),
                'svgFilterId'   => (string)($opt['UF_SVG_FILTER_ID'] ?? ''),
                'svgSpecialKey' => (string)($opt['UF_SVG_SPECIAL_KEY'] ?? ''),
            ];
        }
    }

    $arResult['SECTION_OPTIONS'] = $sectionOptions;

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
