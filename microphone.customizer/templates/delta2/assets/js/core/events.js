// core/events.js

class EventRegistry {
    #listeners = [];

    /**
     * Adds an event listener to an element and registers it for cleanup.
     * @param {EventTarget} element - The DOM element.
     * @param {string} event - The event name (e.g., 'click').
     * @param {function} handler - The event handler function.
     * @param {object} [options] - Optional event listener options.
     */
    add(element, event, handler, options) {
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
        
        console.log(`[EventRegistry] Cleaning up ${this.#listeners.length} event listeners.`);
        this.#listeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        
        // Clear the registry
        this.#listeners = [];
    }
}

// Export a single instance of the EventRegistry
export const eventRegistry = new EventRegistry();
