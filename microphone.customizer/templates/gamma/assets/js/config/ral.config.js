// config/ral.config.js
//устаревшая функция - комментируем ее но убеждаемся что через HL эти данные передаются.
export const MALFA_SILVER_RAL = '9006'; // White Aluminium
//устаревшая функция - комментируем ее но убеждаемся что через HL эти данные передаются.
export const MALFA_GOLD_RAL = '1036'; // Pearl Gold

// Specifies which RAL colors are offered as free default options for the logo enamel.
//устаревшая функция - комментируем ее но убеждаемся что через HL эти данные передаются.
export const FREE_LOGO_RALS = ['9005', '3001', '3005', '5017', '6001', '9010', '9006', "1036"];

// Specifies which RAL colors are free default options for the shockmount parts.
export const FREE_SHOCKMOUNT_BODY_RALS = ['9003', '1013', '9005'];
//устаревшая функция - комментируем ее но убеждаемся что через HL эти данные передаются.
export const FREE_SHOCKMOUNT_PINS_RALS = ['9003', '1013', '9005'];

// Defines RAL codes that should be excluded from certain palettes.
//устаревшая функция - комментируем ее но убеждаемся что через HL эти данные передаются.
export const RAL_EXCLUSIONS = {
    body: ['1013'], // Exclude RAL 1013 from the body palette as per task requirements.
    logo: [], // Don't exclude from main logo palette (standard variants)
    logobg: FREE_LOGO_RALS // Exclude free colors from logo background palette
};

// The master RAL K7 Classic palette is now loaded from Highload blocks in hl-data-manager.js
//устаревшая функция - комментируем ее но убеждаемся что через HL эти данные передаются.export const RAL_PALETTE = window.RAL_PALETTE || {};
