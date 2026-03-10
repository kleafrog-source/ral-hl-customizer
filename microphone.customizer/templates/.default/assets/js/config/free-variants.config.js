// ============================================
// КОНФИГУРАЦИЯ БЕСПЛАТНЫХ ВАРИАНТОВ
// ============================================

export const FREE_VARIANTS = {
    spheres: [
        { label: "Матовый черный", labelen: "matteblack", hex: "#2d2d2d", isCustomRal: true, ralCode: "9005", dataVariant: "standard-brushed-steel" },
        { label: "Классическая латунь", labelen: "brass", hex: "#D4AF37", isNonRal: true, dataVariant: "standard-gold" },
        { label: "Сатинированная сталь", labelen: "satinsteel", hex: "#A1A1A0", isNonRal: true, dataVariant: "standard-brushed-steel" }
    ],
    body: [
        { label: "Матовый черный", labelen: "matteblack", hex: "#2d2d2d", isCustomRal: true, ralCode: "9005", dataVariant: "standard-brushed-steel" },
        { label: "Жемчужно-белый", labelen: "pearlwhite", hex: "#F5F5DC", isCustomRal: true, ralCode: "1013", dataVariant: "standard-brushed-steel" },
        { label: "Сатинированная сталь", labelen: "satinsteel", hex: "#A1A1A0", isNonRal: true, dataVariant: "standard-brushed-steel" }
    ],
    logobg: [
        { label: "RAL 9005 Матовый черный", labelen: "matteblack", hex: "#131516", ralCode: "9005", dataVariant: "ral" },
        { label: "RAL 3001 Сигнальный красный", labelen: "signalred", hex: "#8F1E24", ralCode: "3001", dataVariant: "ral" },
        { label: "RAL 3005 Винный красный", labelen: "wine", hex: "#561E27", ralCode: "3005", dataVariant: "ral" },
        { label: "RAL 5017 Ультрамариновый синий", labelen: "ultramarine", hex: "#0F518A", ralCode: "5017", dataVariant: "ral" },
        { label: "RAL 6001 Изумрудный зеленый", labelen: "emerald", hex: "#40693A", ralCode: "6001", dataVariant: "ral" },
        { label: "RAL 9010 Чистый белый", labelen: "purewhite", hex: "#EFEEE5", ralCode: "9010", dataVariant: "ral" }
    ],
    shockmount: [
        { label: "RAL 9010 Чистый белый", labelen: "purewhite", hex: "#EFEEE5", ralCode: "9010", dataVariant: "ral" },
        { label: "RAL 1013 Жемчужно-белый", labelen: "pearlwhite", hex: "#DFDBC7", ralCode: "1013", dataVariant: "ral" },
        { label: "RAL 9005 Матовый черный", labelen: "matteblack", hex: "#131516", ralCode: "9005", dataVariant: "ral" }
    ],
    pins: [
        { label: "Полированная латунь", labelen: "brass", hex: "#D4AF37", isNonRal: true, dataVariant: "pins-brass" },
        { label: "RAL 9006 Белый алюминий", labelen: "white-aluminum", hex: "#9A9D9D", isCustomRal: true, ralCode: "9006", dataVariant: "pins-ral9006-free" },
        { label: "RAL 9010 Чистый белый", labelen: "purewhite", hex: "#EFEEE5", ralCode: "9010", dataVariant: "pins-RAL9010-free" },
        { label: "RAL 1013 Жемчужно-белый", labelen: "pearlwhite", hex: "#DFDBC7", ralCode: "1013", dataVariant: "pins-RAL1013-free" },
        { label: "RAL 9005 Матовый черный", labelen: "matteblack", hex: "#131516", ralCode: "9005", dataVariant: "pins-RAL9005-free" }
    ]
};

// ============================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С БЕСПЛАТНЫМИ ВАРИАНТАМИ
// ============================================
//
// Получить все бесплатные RAL коды
export function getAllFreeRalCodes() {
    const codes = new Set();
    Object.values(FREE_VARIANTS).forEach(variants => {
        //для каждого варианта добавляем RAL код в сет
        variants.forEach(v => { if (v.ralCode) codes.add(v.ralCode); });
    });
    return codes;
}

// Проверить, является ли значение бесплатным вариантом
export function isFreeVariant(section, value) {
    const variants = FREE_VARIANTS[section];
    if (!variants) return false;
    
    return variants.some(v => {
        //если у варианта есть RAL код, проверяем его
        if (v.ralCode) return v.ralCode === value;
        //если у варианта нет RAL кода, проверяем labelen или dataVariant
        if (v.isNonRal) return value === v.labelen || value === v.dataVariant;
        return v.labelen === value || v.dataVariant === value;
    });
}
//Проверить, является ли значение бесплатным вариантом по dataVariant
export function isFreeVariantByDataVariant(section, value) {
    const variants = FREE_VARIANTS[section];
    if (!variants) return false;
    
    return variants.some(v => {
        return v.dataVariant === value;
    });
}

// Получить бесплатный вариант по значению
export function getFreeVariantByValue(section, value) {
    const variants = FREE_VARIANTS[section];
    if (!variants) return null;
    
    return variants.find(v => {
        if (v.ralCode) return v.ralCode === value;
        //если у варианта нет RAL кода, проверяем labelen или dataVariant
        if (v.isNonRal) return value === v.labelen || value === v.dataVariant;
        return v.labelen === value || v.dataVariant === value;
    });
}

// Получить цену бесплатного варианта
export function getFreeVariantPrice(section, value) {
    const variant = getFreeVariantByValue(section, value);
    return variant ? 0 : null; // Бесплатные варианты всегда стоят 0
}
