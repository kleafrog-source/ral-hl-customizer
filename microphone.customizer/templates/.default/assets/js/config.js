export const CONFIG = {
    basePrice: 129990,
    optionPrice: 1500,
    scaleFactor: 0.8584,
    shockmountPrice: 10000,
    pxPerMm: 3.2909,
    caseScaleFactor: 1.0  // Коэффициент масштабирования для ручной корректировки CASE_GEOMETRY
};

// Осмысленные строковые ключи для вариантов
export const VARIANT_KEYS = {
    // Для spheres/body
    STANDARD_BRUSHED_STEEL: 'standard-brushed-steel',  // бывший '1'
    STANDARD_GOLD: 'standard-gold',                    // бывший '2' 
    RAL_COLOR: 'ral-color',                            // бывший '3'
    
    // Для пинов подвеса
    PINS_BRASS: 'pins-brass',                          // латунь
    PINS_RAL_9006: 'pins-ral-9006',                    // белый алюминий
    PINS_RAL_9010: 'pins-ral-9010',                    // чистый белый
    PINS_RAL_1013: 'pins-ral-1013',                    // жемчужно-белый
    PINS_RAL_9005: 'pins-ral-9005',                    // матовый черный
    
    // Общие
    NON_RAL: 'non-ral',
    RAL: 'ral',
    CUSTOM: 'custom'
};

export const VARIANT_PRICES = {
    '023-the-bomblet': 129990,
    '023-malfa': 149990,
    '023-deluxe': 159990,
    '017-fet': 229990,
    '017-tube': 419990
};

export const MALFA_SILVER_RAL = '9006'; // White Aluminium
export const MALFA_GOLD_RAL = '1036'; // Pearl Gold

export const FREE_LOGO_RALS = ['9005', '3001', '3005', '5017', '6001', '9010', MALFA_SILVER_RAL, MALFA_GOLD_RAL];
export const FREE_SHOCKMOUNT_BODY_RALS = ['1013', '9010', '9005'];
export const FREE_SHOCKMOUNT_PINS_RALS = ['1013', '9010', '9005'];
export const RAL_PALETTE = {
  "1000": "#C5BB8A", "1001": "#C6B286", "1002": "#C7AE72", "1003": "#E6B019",
  "1004": "#D2A40E", "1005": "#BC9611", "1006": "#CF9804", "1007": "#D49300",
  "1011": "#A38454", "1012": "#CFB539", "1013": "#DFDBC7", "1014": "#D4C79C",
  "1015": "#DED3B6", "1016": "#E8E253", "1017": "#E4AF56", "1018": "#EBD346",
  "1019": "#9C917B", "1020": "#999167", "1021": "#E5C000", "1023": "#E6BE05",
  "1024": "#AD9451", "1026": "#FFFF00", "1027": "#998420", "1028": "#F2A500",
  "1032": "#CFA81E", "1033": "#E4A02D", "1034": "#D9A156", "1035": "#898271",
  "1036": "#746341", "1037": "#DB9A17",

  "2000": "#C7750F", "2001": "#A74D23", "2002": "#AC3721", "2003": "#E17C30",
  "2004": "#CC5608", "2005": "#FF4612", "2007": "#FFAD19", "2008": "#D66C21",
  "2009": "#C9560D", "2010": "#BC602D", "2011": "#CF7421", "2012": "#C2674F",
  "2013": "#954527", "2017": "#FA4402",

  "3000": "#962A27", "3001": "#8F1E24", "3002": "#8D1F24", "3003": "#7C0D24",
  "3004": "#651927", "3005": "#561E27", "3007": "#3D2326", "3009": "#643730",
  "3011": "#6E2124", "3012": "#B7856E", "3013": "#8A2F28", "3014": "#BC6F72",
  "3015": "#CC9EA4", "3016": "#963D2F", "3017": "#B9535B", "3018": "#B63C49",
  "3020": "#AB1519", "3022": "#BE6954", "3024": "#EE1729", "3026": "#F71027",
  "3027": "#9E1B3C", "3028": "#B92726", "3031": "#973238", "3032": "#661925",
  "3033": "#94352D",

  "4001": "#7C5B80", "4002": "#823A4B", "4003": "#B65A88", "4004": "#5F1837",
  "4005": "#746395", "4006": "#852E6F", "4007": "#44263C", "4008": "#7C477D",
  "4009": "#95838F", "4010": "#AC3B71", "4011": "#685C80", "4012": "#67657A",

  "5000": "#35496B", "5001": "#294763", "5002": "#193278", "5003": "#203151",
  "5004": "#1E222C", "5005": "#134A85", "5007": "#466589", "5008": "#2F3A44",
  "5009": "#215F78", "5010": "#0E457A", "5011": "#222C3E", "5012": "#457FB3",
  "5013": "#212F51", "5014": "#667691", "5015": "#3172AD", "5017": "#0F518A",
  "5018": "#47848D", "5019": "#1A5784", "5020": "#113E4D", "5021": "#216D76",
  "5022": "#282C58", "5023": "#4D648A", "5024": "#6C8DAA", "5025": "#3C6379",
  "5026": "#1B2B4D",

  "6000": "#4A7363", "6001": "#40693A", "6002": "#3B5B2F", "6003": "#4F553E",
  "6004": "#214245", "6005": "#234235", "6006": "#3C3D32", "6007": "#2E3526",
  "6008": "#333327", "6009": "#2A372C", "6010": "#4E6E39", "6011": "#6A7C5B",
  "6012": "#2F3B39", "6013": "#777659", "6014": "#454339", "6015": "#3C3F38",
  "6016": "#256753", "6017": "#5C8144", "6018": "#689A45", "6019": "#B8CFAD",
  "6020": "#3B4634", "6021": "#899B79", "6022": "#3B382E", "6024": "#3A8258",
  "6025": "#5D703E", "6026": "#0D5951", "6027": "#88B5B3", "6028": "#3D5547",
  "6029": "#226C45", "6032": "#417E57", "6033": "#568480", "6034": "#86A9AD",
  "6035": "#2E4F31", "6036": "#27514A", "6037": "#3F8C3D", "6038": "#20A339",
  "6039": "#B3C43E",

  "7000": "#7E8B92", "7001": "#8B949B", "7002": "#7D7965", "7003": "#76776A",
  "7004": "#969799", "7005": "#696D6B", "7006": "#716C60", "7008": "#6C6040",
  "7009": "#5B6058", "7010": "#575B57", "7011": "#535A5E", "7012": "#595E60",
  "7013": "#545146", "7015": "#51535A", "7016": "#3B4044", "7021": "#323537",
  "7022": "#4C4C47", "7023": "#7D7F76", "7024": "#45494E", "7026": "#394345",
  "7030": "#8C8C83", "7031": "#5D676D", "7032": "#B1B1A1", "7033": "#7C8273",
  "7034": "#8C8870", "7035": "#C2C6C3", "7036": "#949292", "7037": "#797B7B",
  "7038": "#ADB0A9", "7039": "#68675F", "7040": "#969CA1", "7042": "#8C9190",
  "7043": "#4F5352", "7044": "#B3B2A9", "7045": "#8C9094", "7046": "#7C8287",
  "7047": "#C5C5C5", "7048": "#7A7871",

  "8000": "#816D44", "8001": "#8F6833", "8002": "#704F40", "8003": "#74502F",
  "8004": "#814D37", "8007": "#67492F", "8008": "#694F2B", "8011": "#533A29",
  "8012": "#5C3128", "8014": "#453729", "8015": "#57332B", "8016": "#483026",
  "8017": "#42332E", "8019": "#3B3736", "8022": "#201F20", "8023": "#965D33",
  "8024": "#6F543C", "8025": "#6E5B4B", "8028": "#4C3E30", "8029": "#764537",

  "9001": "#E5E1D4", "9002": "#D4D5CD", "9003": "#EBECEA", "9004": "#2F3133",
  "9005": "#131516", "9006": "#9A9D9D", "9007": "#828280", "9010": "#EFEEE5",
  "9011": "#25282A", "9012": "#F2F1E1", "9016": "#EFF0EB", "9017": "#262625",
  "9018": "#C6CBC6", "9022": "#818382", "9023": "#767779"
};
export const DEFAULT_MIC_CONFIGS = {
    '023-the-bomblet': {
        spheres: { variant: 'spheres-default-satin-steel', color: null, colorValue: '#a1a1a0' },
        body: { variant: 'body-default-satin-steel', color: null, colorValue: '#a1a1a0' },
        logo: { variant: 'silver', customLogo: null },
        logobg: { variant: 'logobg-ral-custom', color: '3001', colorValue: RAL_PALETTE['3001'] },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: false, variant: 'white', color: null, colorValue: '#ffffff' },
        shockmountPins: { variant: 'pins-brass', colorValue: '#EAE0C8', material: null }
    },
    'malfa': {
        spheres: { variant: 'spheres-default-satin-steel', color: null, colorValue: '#a1a1a0' },
        body: { variant: 'body-default-pearl-white', color: null, colorValue: '#000000' },
        logo: { variant: 'malfasilver', customLogo: null },
        logobg: { variant: 'logobg-ral-custom', color: MALFA_SILVER_RAL, colorValue: RAL_PALETTE[MALFA_SILVER_RAL] },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' },
        shockmountPins: { variant: 'pins-brass', colorValue: '#EAE0C8', material: null }
    },
    '023-dlx': {
        spheres: { variant: 'spheres-default-brass', color: null, colorValue: '#d4af37' },
        body: { variant: 'body-default-pearl-white', color: null, colorValue: '#d4af37' },
        logo: { variant: 'silver', customLogo: null },
        logobg: { variant: 'logobg-ral-custom', color: '3001', colorValue: RAL_PALETTE['3001'] },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' },
        shockmountPins: { variant: 'pins-brass', colorValue: '#EAE0C8', material: null }
    },
    '017-fet': {
        spheres: { variant: 'spheres-default-brass', color: null, colorValue: '#d4af37' },
        body: { variant: 'body-ral-custom', color: 'RAL 1013', colorValue: RAL_PALETTE['1013'] },
        logo: { variant: 'gold', customLogo: null },
        logobg: { variant: 'logobg-ral-custom', color: '6001', colorValue: RAL_PALETTE['6001'] },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' },
        shockmountPins: { variant: 'pins-brass', colorValue: '#EAE0C8', material: null }
    },
    '017-tube': {
        spheres: { variant: 'spheres-default-brass', color: null, colorValue: '#d4af37' },
        body: { variant: 'body-ral-custom', color: 'RAL 1013', colorValue: RAL_PALETTE['1013'] },
        logo: { variant: 'gold', customLogo: null },
        logobg: { variant: 'logobg-ral-custom', color: '5017', colorValue: RAL_PALETTE['5017'] },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'shock-RAL1013', color: null, colorValue: '#ffffff' },
        shockmountPins: { variant: 'pins-brass', colorValue: '#EAE0C8', material: null }
    }
};

export const variantNames = {
    'standard-brushed-steel': 'Сатинированная сталь',
    'standard-gold': 'Классическая латунь',
    'matte-black': 'Матовый черный'
};

// Функция для получения базового пути к изображениям
function getAssetsBasePath() {
    // Используем глобальную переменную из template.php
    if (window.CUSTOMIZER_ASSETS_PATH) {
        return window.CUSTOMIZER_ASSETS_PATH + '/image/';
    }
    
    // Fallback: определяем путь относительно текущего JS файла
    const currentPath = new URL(import.meta.url).pathname;
    const basePath = currentPath.replace(/\/assets\/js\/[^\/]+$/, '/assets/image/');
    return basePath;
}

const assetsPath = getAssetsBasePath();

export const CASE_IMAGES = {
    '017-tube': { 
        mobile: assetsPath + 'case_017_tube_mobile.png', 
        tablet: assetsPath + 'case_017_tube_tablet.png', 
        desktop: assetsPath + 'case_017_tube_desktop.png', 
        _4k: assetsPath + 'case_017_tube_4k.png' 
    },
    '017-fet': { 
        mobile: assetsPath + 'case_017_fet-023_dlx_mobile.png', 
        tablet: assetsPath + 'case_017_fet-023_dlx_tablet.png', 
        desktop: assetsPath + 'case_017_fet-023_dlx_desktop.png', 
        _4k: assetsPath + 'case_017_fet-023_dlx_4k.png' 
    },
    '023-deluxe': { 
        mobile: assetsPath + 'case_017_fet-023_dlx_mobile.png', 
        tablet: assetsPath + 'case_017_fet-023_dlx_tablet.png', 
        desktop: assetsPath + 'case_017_fet-023_dlx_desktop.png', 
        _4k: assetsPath + 'case_017_fet-023_dlx_4k.png' 
    },
    '023-the-bomblet': { 
        mobile: assetsPath + 'case_023thebomblet-23_malfa_mobile.png', 
        tablet: assetsPath + 'case_023thebomblet-23_malfa_tablet.png', 
        desktop: assetsPath + 'case_023thebomblet-23_malfa_desktop.png', 
        _4k: assetsPath + 'case_023thebomblet-23_malfa_4k.png' 
    },
    '023-malfa': { 
        mobile: assetsPath + 'case_023thebomblet-23_malfa_mobile.png', 
        tablet: assetsPath + 'case_023thebomblet-23_malfa_tablet.png', 
        desktop: assetsPath + 'case_023thebomblet-23_malfa_desktop.png', 
        _4k: assetsPath + 'case_023thebomblet-23_malfa_4k.png' 
    }
};

export const CASE_GEOMETRY = {
    res: { mobile: { max: 767, vb: "0 0 750 1334" }, tablet: { max: 1024, vb: "0 0 1024 768" }, desktop: { max: 2560, vb: "0 0 1920 1080" }, _4k: { max: 9999, vb: "0 0 3840 2160" } },
    cases: {
        '017-tube': { mm: 550, startConfig: { wMM: 160, yOffsetMM: 50 }, mobile: { x: 2.1, y: 88.55, w: 757, h: 431, poly: [746.33,105.59, 746.02,478.65, 33.85,511.99, 27.12,103.51] }, tablet: { x: 17.68, y: 116.72, w: 1009, h: 574, poly: [1004.24,139.31, 1003.83,633.85, 59.76,678.04, 50.84,136.54] }, desktop: { x: 50.31, y: 156.84, w: 1472, h: 838, poly: [1524.18,190.6, 1523.57,929.4, 113.18,995.43, 99.85,186.46] }, _4k: { x: 88.19, y: 329.76, w: 2775, h: 1580, poly: [2857.65,393.18, 2856.5,1781.43, 206.33,1905.49, 181.28,385.42] } },
        '017-fet': { mm: 284, startConfig: { wMM: 100, yOffsetMM: 50 }, mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } },
        '023-deluxe': { mm: 256, startConfig: { wMM: 100, yOffsetMM: 50 }, mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } },
        '023-the-bomblet': { mm: 139, startConfig: { wMM: 70, yOffsetMM: 50 }, mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } },
        '023-malfa': { mm: 139, startConfig: { wMM: 70, yOffsetMM: 50 }, mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } }
    },
    cases_rescale: {
        // Коэффициенты масштабирования для ручной корректировки CASE_GEOMETRY
        // Позволяют точно настроить размеры для каждого типа футляра и устройства
        '017-tube': {
            mobile: 1.7,      // Базовый масштаб для mobile
            tablet: 1.0,       // Базовый масштаб для tablet  
            desktop: 1.1,      // Базовый масштаб для desktop
            _4k: 1.0          // Базовый масштаб для 4K
        },
        '017-fet': {
            mobile: 1.7,
            tablet: 1.0,
            desktop: 1.1,
            _4k: 1.0
        },
        '023-deluxe': {
            mobile: 1.7,
            tablet: 1.0,
            desktop: 1.1,
            _4k: 1.0
        },
        '023-the-bomblet': {
            mobile: 1.7,
            tablet: 1.0,
            desktop: 1.1,
            _4k: 1.0
        },
        '023-malfa': {
            mobile: 1.7,
            tablet: 1.0,
            desktop: 1.1,
            _4k: 1.0
        }
    }
};
