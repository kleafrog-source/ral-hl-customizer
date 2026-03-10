<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Highloadblock\HighloadBlockTable;
use Bitrix\Main\Loader;

// Кэширование
$cacheTime = 3600;
$cacheId = 'customizer_hl_data_' . ($arParams['MODEL_CODE'] ?? 'default');
$cacheDir = '/customizer/hl_data';

$cache = \Bitrix\Main\Data\Cache::createInstance();
if ($cache->initCache($cacheTime, $cacheId, $cacheDir)) {
    $arResult = $cache->getVars();
} elseif ($cache->startDataCache()) {
    
    // Проверка наличия модуля highloadblock
    if (!Loader::includeModule('highloadblock')) {
        $cache->abortDataCache();
        return;
    }

    /**
     * Вспомогательная функция для получения данных из HL-блока
     */
    function getHlData($hlId, $filter = [], $select = ['*'], $order = ['UF_SORT' => 'ASC']) {
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
    }

    // Маппинг UF_VIEW_TYPE в строковые значения
    $viewTypeMap = [
        1 => 'spheres',
        2 => 'body',
        3 => 'logo',
        4 => 'logobg',
        5 => 'case',
        6 => 'shockmount',
        7 => 'shockmountPins',
    ];

    // 1. Загрузка RalColors (ID 9)
    $ralColors = getHlData(9, ['UF_ACTIVE' => 1], ['ID', 'UF_NAME', 'UF_CODE', 'UF_HEX', 'UF_RGB_CODE', 'UF_SORT']);
    $arResult['RAL_COLORS'] = [];
    foreach ($ralColors as $color) {
        $arResult['RAL_COLORS'][$color['ID']] = $color;
    }

    // 2. Загрузка MicrophoneModels (ID 10)
    $models = getHlData(10, [], ['ID', 'UF_CODE', 'UF_NAME', 'UF_BASE_PRICE', 'UF_DESCRIPTION', 'UF_SHOCKMOUNT_ENABLED', 'UF_SHOCKMOUNT_PRICE', 'UF_SORT', 'UF_MODEL_SERIES'], ['UF_SORT' => 'ASC']);
    $arResult['MODELS'] = [];
    $arResult['MODELS_BY_CODE'] = [];
    foreach ($models as $model) {
        // Упрощаем названия для JS
        $modelData = [
            'ID' => $model['ID'],
            'CODE' => $model['UF_CODE'],
            'NAME' => $model['UF_NAME'],
            'BASE_PRICE' => (int)$model['UF_BASE_PRICE'],
            'DESCRIPTION' => $model['UF_DESCRIPTION'],
            'SHOCKMOUNT_ENABLED' => (int)$model['UF_SHOCKMOUNT_ENABLED'],
            'SHOCKMOUNT_PRICE' => (int)$model['UF_SHOCKMOUNT_PRICE'],
            'MODEL_SERIES' => $model['UF_MODEL_SERIES'],
            'SORT' => (int)$model['UF_SORT']
        ];
        $arResult['MODELS'][$model['ID']] = $modelData;
        $arResult['MODELS_BY_CODE'][$model['UF_CODE']] = $modelData;
    }

    // 3. Загрузка CustomizerOptions (ID 11)
    $options = getHlData(11, [], ['*'], ['UF_SORT' => 'ASC']);
    $arResult['OPTIONS'] = [];
    
    foreach ($options as $option) {
        
        $modelId = $option['UF_MODEL_ID'] ?: 0; // 0 = для всех моделей
        $viewTypeId = (int)$option['UF_VIEW_TYPE'];
        $viewTypeKey = $viewTypeMap[$viewTypeId] ?? 'unknown';
        
        // Подтянуть RAL-данные если UF_IS_RAL = 1
        if ($option['UF_IS_RAL'] && $option['UF_RAL_COLOR_ID']) {
            $ralId = (int)$option['UF_RAL_COLOR_ID'];
            if (isset($arResult['RAL_COLORS'][$ralId])) {
                $option['RAL_DATA'] = $arResult['RAL_COLORS'][$ralId];
            }
        }
        
        $arResult['OPTIONS'][$modelId][$viewTypeKey][] = $option;
    }

    // 4. Загрузка CustomizerPrices (ID 12) - данные о ценах
    $prices = getHlData(12, [], ['UF_SECTION_CODE', 'UF_MODEL_CODE', 'UF_VARIANT_CODE', 'UF_PRICE', 'UF_IS_RAL_SURCHARGE']);
    $arResult['PRICES'] = [];
    
    // Группировка цен по разделам и моделям
    foreach ($prices as $price) {
        $sectionCode = $price['UF_SECTION_CODE'];
        $modelCode = $price['UF_MODEL_CODE'] ?: '';
        $variantCode = $price['UF_VARIANT_CODE'] ?: '';
        $priceValue = (int)$price['UF_PRICE'];
        $isRalSurcharge = (bool)$price['UF_IS_RAL_SURCHARGE'];
        
        // Инициализация секции если нет
        if (!isset($arResult['PRICES'][$sectionCode])) {
            $arResult['PRICES'][$sectionCode] = [];
        }
        
        // Инициализация модели если нет
        if (!isset($arResult['PRICES'][$sectionCode][$modelCode])) {
            $arResult['PRICES'][$sectionCode][$modelCode] = [];
        }
        
        // Установка цены
        if ($isRalSurcharge) {
            $arResult['PRICES'][$sectionCode]['_ral_surcharge'] = $priceValue;
        } else {
            $arResult['PRICES'][$sectionCode][$modelCode][$variantCode] = $priceValue;
        }
    }

    // 5. Сохранение маппинга типов представлений
    $arResult['VIEW_TYPE_MAP'] = $viewTypeMap;

    // 6. Определение текущей модели
    $currentModelCode = $arParams['MODEL_CODE'] ?? 'bomblet';
    $currentModel = $arResult['MODELS_BY_CODE'][$currentModelCode] ?? null;
    $arResult['CURRENT_MODEL_ID'] = $currentModel['ID'] ?? null;
    $arResult['CURRENT_MODEL_CODE'] = $currentModelCode;

    // 6. Установка опций для текущей модели
    $currentModelId = $arResult['CURRENT_MODEL_ID'];
    $arResult['CURRENT_MODEL_OPTIONS'] = [];
    
    // Опции для всех моделей (model_id = 0)
    if (isset($arResult['OPTIONS'][0])) {
        foreach ($arResult['OPTIONS'][0] as $viewType => $options) {
            $arResult['CURRENT_MODEL_OPTIONS'][$viewType] = $options;
        }
    }
    
    // Опции для конкретной модели
    if ($currentModelId && isset($arResult['OPTIONS'][$currentModelId])) {
        foreach ($arResult['OPTIONS'][$currentModelId] as $viewType => $options) {
            if (!isset($arResult['CURRENT_MODEL_OPTIONS'][$viewType])) {
                $arResult['CURRENT_MODEL_OPTIONS'][$viewType] = [];
            }
            $arResult['CURRENT_MODEL_OPTIONS'][$viewType] = array_merge(
                $arResult['CURRENT_MODEL_OPTIONS'][$viewType],
                $options
            );
        }
    }

    $cache->endDataCache($arResult);
}