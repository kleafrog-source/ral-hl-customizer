// utils/color.js

/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @returns {{r: number, g: number, b: number} | null}
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Calculates the luminance of a color.
 * @param {string} hex - The hex color string.
 * @returns {number} The luminance value (0-1).
 */
export function calculateLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
