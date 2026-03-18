// core/events.js
import { debugLog } from '../utils/debug.js';

class EventRegistry {
    #listeners = [];

    #isValidEventTarget(element) {
        return !!element && typeof element.addEventListener === 'function';
    }

    /**
     * Adds an event listener to an element and registers it for cleanup.
     * @param {EventTarget} element - The DOM element.
     * @param {string} event - The event name (e.g., 'click').
     * @param {function} handler - The event handler function.
     * @param {object} [options] - Optional event listener options.
     */
    add(element, event, handler, options) {
        if (!this.#isValidEventTarget(element)) {
            debugLog(`[EventRegistry] Skipping listener for invalid target: ${event}`);
            return;
        }

        element.addEventListener(event, handler, options);
        this.#listeners.push({ element, event, handler, options });
    }

    /**
     * Removes all registered event listeners from their elements.
     */
    cleanup() {
        if (!this.#listeners.length) {
            return;
        }
        
        debugLog(`[EventRegistry] Cleaning up ${this.#listeners.length} event listeners.`);
        this.#listeners.forEach(({ element, event, handler, options }) => {
            if (this.#isValidEventTarget(element)) {
                element.removeEventListener(event, handler, options);
            }
        });
        
        // Clear the registry
        this.#listeners = [];
    }
}

// Export a single instance of the EventRegistry
export const eventRegistry = new EventRegistry();
