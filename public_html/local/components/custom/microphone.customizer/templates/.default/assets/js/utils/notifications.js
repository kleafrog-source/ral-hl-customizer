const NOTIFICATION_SELECTOR = '.notification';
const NOTIFICATION_TIMEOUT_MS = 3000;

let hideNotificationTimeout = null;

function getNotificationElement() {
    return document.querySelector(NOTIFICATION_SELECTOR);
}

function createNotificationElement() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    return notification;
}

function ensureNotificationElement() {
    return getNotificationElement() || createNotificationElement();
}

export function showNotification(message, type = 'info') {
    const notification = ensureNotificationElement();

    if (hideNotificationTimeout) {
        clearTimeout(hideNotificationTimeout);
    }

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    hideNotificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        hideNotificationTimeout = null;
    }, NOTIFICATION_TIMEOUT_MS);
}
