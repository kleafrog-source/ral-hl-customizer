export function getDevice(breakpoints) {
    const w = window.innerWidth;
    if (w <= breakpoints.mobile.max) return 'mobile';
    if (w <= breakpoints.tablet.max) return 'tablet';
    if (w <= breakpoints.desktop.max) return 'desktop';
    return '_4k';
}

/**
 * Returns the suffix for assets based on the current viewport width.
 * _4k: > 1920px
 * _tablet: 768px - 1024px
 * _hdmob: default (Desktops <= 1920px and Mobile < 768px)
 */
export function getAssetSuffix() {
    const w = window.innerWidth;
    if (w > 1920) return '_4k';
    if (w >= 768 && w <= 1024) return '_tablet';
    return '_hdmob';
}

export function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
