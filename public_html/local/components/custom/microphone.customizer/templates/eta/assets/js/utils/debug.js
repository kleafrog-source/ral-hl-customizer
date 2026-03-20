export const DEBUG_STORAGE_KEY = 'customizer-debug-enabled';
export const DEBUG_UI_HELPER = false;
export const DEBUG_LOGS = false; // Enable only during development.

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

function hasRuntimeDebugFlag() {
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

export function isDebugUIEnabled() {
    return DEBUG_UI_HELPER && hasRuntimeDebugFlag();
}

export function isRuntimeDebugEnabled() {
    return DEBUG_LOGS && hasRuntimeDebugFlag();
}

export function debugLog(...args) {
    if (!isRuntimeDebugEnabled()) {
        return;
    }

    console.log(...args);
}

export function debugWarn(...args) {
    if (!isRuntimeDebugEnabled()) {
        return;
    }

    console.warn(...args);
}
