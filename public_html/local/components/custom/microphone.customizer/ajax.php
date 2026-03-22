<?php
define("NO_KEEP_STATISTIC", true);
define("NOT_CHECK_PERMISSIONS", true);

require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader;
use Bitrix\Main\Context;

// РџРѕР»РЅР°СЏ РѕС‡РёСЃС‚РєР° Р±СѓС„РµСЂР°, С‡С‚РѕР±С‹ СѓР±СЂР°С‚СЊ Р»СЋР±РѕР№ С‚РµРєСЃС‚/РѕС€РёР±РєРё РґРѕ СЌС‚РѕРіРѕ РјРѕРјРµРЅС‚Р°
while (ob_get_level()) {
    ob_end_clean();
}

header('Content-Type: application/json');

if (!Loader::includeModule("form")) {
    echo json_encode(["success" => false, "error" => "Module Form not found"]);
    die();
}

$request = Context::getCurrent()->getRequest();
$action = $request->getPost("action");
if ($action === "loadConfig") {
    echo json_encode([
        "success" => true,
        "config" => null
    ]);
    die();
}

if ($action === "ping") {
    if (check_bitrix_sessid()) {
        echo json_encode(["success" => true, "sessid" => bitrix_sessid()]);
    } else {
        echo json_encode(["success" => false, "error" => "Session expired"]);
    }
    die();
}

if ($action === "createOrder") {
    $FORM_ID = 1;

    // РўРѕР»СЊРєРѕ С‚Рµ РїРѕР»СЏ, РєРѕС‚РѕСЂС‹Рµ РјС‹ СЂРµР°Р»СЊРЅРѕ С…РѕС‚РёРј СЃРѕС…СЂР°РЅРёС‚СЊ (Р±РµР· USER_FORM)
    $fields = [
        "NAME_FORM" => 6,
        "LAST_NAME_FORM" => 7,
        "CITY_FORM" => 8,
        "COUNTRY_FORM" => 9,
        "EMAIL_FORM" => 10,
        "PHONE_FORM" => 11,
        "COMMENT_FORM" => 12,
        "MIC_MODEL_FORM" => 13,
        "MIC_SPHERES_FORM" => 14,
        "MIC_BODY_FORM" => 15,
        "MIC_LOGO_TYPE_FORM" => 16,
        "MIC_LOGO_BG_FORM" => 17,
        "WOODCASE_IMAGE_DESK_FORM" => 18,
        "SHOCKMOUNT_COLOR_FORM" => 19,
        "SHOCKMOUNT_PINS_FORM" => 20,
        "PRICE_FORM" => 21
    ];

    $arValues = [];
    foreach ($fields as $postKey => $questionId) {
        $val = $request->getPost($postKey);
        if ($val !== null) {
            $rsAnswer = CAnswer::GetList($questionId, $by="s_id", $order="asc", [], $fv=null);
            if ($arAnswer = $rsAnswer->Fetch()) {
                $bitrixKey = "form_" . $arAnswer["FIELD_TYPE"] . "_" . $arAnswer["ID"];
                $arValues[$bitrixKey] = $val;
            }
        }
    }

    // Р”РѕР±Р°РІР»СЏРµРј СЂРµР·СѓР»СЊС‚Р°С‚. "N" - РЅРµ РїСЂРѕРІРµСЂСЏС‚СЊ РїСЂР°РІР° РґРѕСЃС‚СѓРїР°.
    $RESULT_ID = CFormResult::Add($FORM_ID, $arValues, "N", "Y");

    if ($RESULT_ID) {
        echo json_encode(["success" => true, "orderId" => $RESULT_ID]);
    } else {
        global $strError;
        echo json_encode(["success" => false, "error" => strip_tags($strError) ?: "CFormResult::Add failed"]);
    }
    die();
}

echo json_encode(["success" => false, "error" => "Action mismatch"]);
