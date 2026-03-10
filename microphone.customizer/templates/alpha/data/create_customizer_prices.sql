-- Создание HL-блока CustomizerPrices для хранения цен кастомайзера
-- Поля: UF_SECTION_CODE, UF_MODEL_CODE, UF_VARIANT_CODE, UF_PRICE, UF_IS_RAL_SURCHARGE, UF_SORT, UF_DESCRIPTION

INSERT INTO b_hlblock_entity (
    ID,
    ENTITY_NAME,
    TABLE_NAME,
    FIELD_NAME
) VALUES (
    12, -- ID нового HL-блока
    'CustomizerPrices',
    'b_hlblock_customizer_prices',
    'UF_SECTION_CODE'
), (
    12,
    'CustomizerPrices',
    'b_hlblock_customizer_prices',
    'UF_MODEL_CODE'
), (
    12,
    'CustomizerPrices',
    'b_hlblock_customizer_prices',
    'UF_VARIANT_CODE'
), (
    12,
    'CustomizerPrices',
    'b_hlblock_customizer_prices',
    'UF_PRICE'
), (
    12,
    'CustomizerPrices',
    'b_hlblock_customizer_prices',
    'UF_IS_RAL_SURCHARGE'
), (
    12,
    'CustomizerPrices',
    'b_hlblock_customizer_prices',
    'UF_SORT'
), (
    12,
    'CustomizerPrices',
    'b_hlblock_customizer_prices',
    'UF_DESCRIPTION'
);

-- Создание таблицы HL-блока
CREATE TABLE b_hlblock_customizer_prices (
    ID INT(11) NOT NULL AUTO_INCREMENT,
    UF_ENTITY INT(11) NULL,
    UF_NAME VARCHAR(255) NULL,
    UF_SORT INT(11) NULL,
    UF_SECTION_CODE VARCHAR(50) NULL,
    UF_MODEL_CODE VARCHAR(50) NULL,
    UF_VARIANT_CODE VARCHAR(50) NULL,
    UF_PRICE INT(11) NULL,
    UF_IS_RAL_SURCHARGE INT(1) NULL DEFAULT 0,
    UF_DESCRIPTION VARCHAR(255) NULL,
    TIMESTAMP_X TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TIMESTAMP_Y TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

-- Заполнение данными из XML
INSERT INTO b_hlblock_customizer_prices (
    UF_ENTITY,
    UF_NAME,
    UF_SORT,
    UF_SECTION_CODE,
    UF_MODEL_CODE,
    UF_VARIANT_CODE,
    UF_PRICE,
    UF_IS_RAL_SURCHARGE,
    UF_DESCRIPTION
) VALUES 
-- 1. Платные RAL цвета силуэта
(1, NULL, 10, 'spheres', '', '', 3000, 1, 'Наценка за платные RAL цвета силуэта'),

-- 2. Платные RAL цвета корпуса
(2, NULL, 20, 'body', '', '', 3000, 1, 'Наценка за платные RAL цвета корпуса'),

-- 3. Кастомная гравировка футляра
(3, NULL, 40, 'case', '', '', 5000, 0, 'Кастомная гравировка футляра'),

-- 4. Собственная эмблема
(4, NULL, 30, 'logo', '', '', 3000, 0, 'Собственная эмблема'),

-- 5. Наценка за цвет каркаса подвеса
(5, NULL, 50, 'shockmount', '', '', 3000, 1, 'Наценка за цвет каркаса подвеса'),

-- 6. Наценка за цвет пинов подвеса
(6, NULL, 60, 'shockmountPins', '', '', 2500, 1, 'Наценка за цвет пинов подвеса'),

-- 7. Подвес для BOMBLET (не в комплекте)
(7, NULL, 51, 'shockmount', 'bomblet', '', 10000, 0, 'Подвес для BOMBLET (не в комплекте)');
