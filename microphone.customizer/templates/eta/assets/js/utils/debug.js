function hasWindow() {
    return typeof window !== 'undefined';
}

export function isRuntimeDebugEnabled() {
    if (!hasWindow()) {
        return false;
    }

    try {
        const params = new URLSearchParams(window.location.search || '');
        if (params.get('debug') === '1') {
            return true;
        }

        return window.localStorage?.getItem('customizer-debug-enabled') === '1';
    } catch {
        return false;
    }
}

export function debugLog(...args) {
    if (!isRuntimeDebugEnabled()) {
        return;
    }

    console.log(...args);
}
