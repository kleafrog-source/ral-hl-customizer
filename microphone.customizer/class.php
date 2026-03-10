<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;
use Bitrix\Main\Localization\Loc;

class MicrophoneCustomizerComponent extends CBitrixComponent
{
    public function onPrepareComponentParams($arParams)
    {
        $arParams["IBLOCK_ID"] = (int)$arParams["IBLOCK_ID"];
        $arParams["ELEMENT_ID"] = (int)$arParams["ELEMENT_ID"];
        if (empty($arParams["PROPERTY_CODE"])) {
            $arParams["PROPERTY_CODE"] = "CUSTOM_CONFIG";
        }
        return $arParams;
    }

    public function executeComponent()
    {
        try {
            if (!Loader::includeModule("iblock")) {
                throw new Exception("Module iblock not found");
            }

            // Получаем данные текущего пользователя
            global $USER;
            $this->arResult["USER_DATA"] = [
                "AUTHORIZED" => $USER->IsAuthorized(),
                "ID" => $USER->GetID(),
                "NAME" => $USER->GetFirstName(),
                "LAST_NAME" => $USER->GetLastName(),
                "EMAIL" => $USER->GetEmail(),
                "LOGIN" => $USER->GetLogin()
            ];

            // Если ELEMENT_ID не передан или равен 0, инициализируем значения по умолчанию
            if ($this->arParams["ELEMENT_ID"] > 0) {
                $this->arResult["ELEMENT"] = $this->getElement($this->arParams["ELEMENT_ID"]);
            } else {
                // Значения по умолчанию для автономной работы
                $this->arResult["ELEMENT"] = [
                    "ID" => 0,
                    "IBLOCK_ID" => 0,
                    "NAME" => "Custom Microphone",
                    "CUSTOM_CONFIG" => ""
                ];
            }

            $this->IncludeComponentTemplate();
        } catch (Exception $e) {
            ShowError($e->getMessage());
        }
    }

    protected function getElement($elementId)
    {
        $res = CIBlockElement::GetList(
            [],
            ["IBLOCK_ID" => $this->arParams["IBLOCK_ID"], "ID" => $elementId],
            false,
            false,
            ["ID", "IBLOCK_ID", "NAME", "PROPERTY_" . $this->arParams["PROPERTY_CODE"]]
        );

        if ($ob = $res->GetNextElement()) {
            $arFields = $ob->GetFields();
            $arFields["CUSTOM_CONFIG"] = $arFields["PROPERTY_" . $this->arParams["PROPERTY_CODE"] . "_VALUE"];
            return $arFields;
        }

        return null;
    }
}
