const DEBUG_STORAGE_KEY = 'customizer-debug-enabled';

function hasWindow() {
    return typeof window !== 'undefined';
}

function hasDebugQueryParam() {
    const params = new URLSearchParams(window.location.search || '');
    return params.get('debug') === '1';
}

function hasDebugStorageFlag() {
    return window.localStorage?.getItem(DEBUG_STORAGE_KEY) === '1';
}

export function isRuntimeDebugEnabled() {
    if (!hasWindow()) {
        return false;
    }

    try {
        if (hasDebugQueryParam()) {
            return true;
        }

        return hasDebugStorageFlag();
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
