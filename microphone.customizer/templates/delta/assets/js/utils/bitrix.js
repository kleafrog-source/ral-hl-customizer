// utils/bitrix.js

import { stateManager } from '../core/state.js';
import { showNotification } from '../ui-core.js';

let refreshInterval = null;

/**
 * Periodically pings the server to keep the bitrix session alive.
 */
function refreshSession() {
    const ajaxPath = stateManager.get('ajaxPath'); // Assuming ajaxPath is stored in state
    if (!ajaxPath) return;

    const sessid = stateManager.get('sessid');
    
    fetch(ajaxPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=ping&sessid=${sessid}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.sessid) {
            console.log('[Bitrix] Session refreshed successfully.');
            stateManager.set('sessid', data.sessid);
        } else {
            console.warn('[Bitrix] Session refresh failed.', data.error);
            // Optional: notify user that connection might be unstable
        }
    })
    .catch(error => {
        console.error('[Bitrix] Session refresh network error:', error);
    });
}

/**
 * Starts the automatic session refresh mechanism.
 * @param {number} interval - The refresh interval in milliseconds (e.g., 600000 for 10 minutes).
 */
export function startSessionRefresh(interval = 600000) {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    console.log(`[Bitrix] Session refresh started with an interval of ${interval / 60000} minutes.`);
    refreshInterval = setInterval(refreshSession, interval);
}

/**
 * Checks if the current session is valid before a critical action.
 * @returns {Promise<boolean>} A promise that resolves to true if the session is valid, false otherwise.
 */
export async function checkSessid() {
    const ajaxPath = stateManager.get('ajaxPath');
    const sessid = stateManager.get('sessid');
    if (!ajaxPath || !sessid) return false;

    try {
        const response = await fetch(ajaxPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=ping&sessid=${sessid}`
        });
        const data = await response.json();
        if (data.success && data.sessid) {
            stateManager.set('sessid', data.sessid);
            return true;
        } else {
            showNotification('Ваша сессия истекла. Пожалуйста, обновите страницу.', 'error');
            return false;
        }
    } catch (e) {
        showNotification('Ошибка сети. Не удалось проверить сессию.', 'error');
        return false;
    }
}
