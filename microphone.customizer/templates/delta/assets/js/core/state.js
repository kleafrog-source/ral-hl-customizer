// core/state.js

// Debug flag
const APP_DEBUG = false;

export { APP_DEBUG };

/**
 * @typedef {object} State
 * @property {string} model
 * @property {string} variant
 * @property {object} spheres
 * @property {object} body
 * @property {object} logo
 * @property {object} case
 * @property {object} shockmount
 * @property {object} prices
 * @property {object|null} initialConfig
 * @property {boolean} hasChanged
 * @property {object} savedMicConfigs
 */

class StateManager {
    /** @type {State} */
    #state;
    #listeners = [];
    #sectionListeners = {};
    #isNotifying = false;
    #batchUpdates = null;
    #batchTimeout = null;

    constructor() {
        this.#state = {
            currentModelCode: null,
            currentModelId: null,
            modelSeries: null,
            basePrice: 0,
            spheres: {},
            body: {},
            logo: { useCustom: false, customLogoData: null },
            logobg: {},
            case: { laserEngravingEnabled: false, logoTransform: { x: 0, y: 0, scale: 1 }, logoWidthMM: 0, logoOffsetMM: { top: 0, left: 0 } },
            shockmount: { enabled: false, included: false },
            shockmountPins: {},
            prices: { base: 0, spheres: 0, body: 0, logo: 0, logobg: 0, case: 0, shockmount: 0 },
            initialConfig: null,
            hasChanged: false,
            savedMicConfigs: {}
        };
    }

    /**
     * Subscribes a listener function to state changes.
     * @param {function} listener - The function to call on state change.
     * @returns {function} An unsubscribe function.
     */
    subscribe(listener) {
        this.#listeners.push(listener);
        return () => {
            this.#listeners = this.#listeners.filter(l => l !== listener);
        };
    }

    /**
     * Subscribes to changes in a specific section of state.
     * @param {string} section - The section to subscribe to (e.g., 'body', 'logo', 'logobg').
     * @param {function} listener - The function to call when section changes.
     * @returns {function} An unsubscribe function.
     */
    subscribeSection(section, listener) {
        if (!this.#sectionListeners[section]) {
            this.#sectionListeners[section] = [];
        }
        this.#sectionListeners[section].push(listener);
        
        return () => {
            this.#sectionListeners[section] = this.#sectionListeners[section].filter(l => l !== listener);
        };
    }

    /**
     * Notifies all subscribed listeners of a state change.
     * @param {object} updateDetails - Details about the update.
     */
    #notify(updateDetails) {
        this.#isNotifying = true;
        try {
            // Notify global listeners
            for (const listener of this.#listeners) {
                listener(this.#state, updateDetails);
            }
            
            // Notify section-specific listeners
            if (updateDetails.path) {
                const section = updateDetails.path.split('.')[0];
                const sectionListeners = this.#sectionListeners[section];
                if (sectionListeners) {
                    for (const listener of sectionListeners) {
                        listener(this.#state, updateDetails);
                    }
                }
            }
        } finally {
            this.#isNotifying = false;
        }
    }

    /**
     * Batch multiple state updates together and notify listeners once.
     * @param {Array<{path: string, value: any}>} updates - Array of updates to apply.
     */
    batchSet(updates) {
        if (this.#isNotifying) {
            console.warn('[StateManager] Cannot batch updates during notification cycle');
            return;
        }

        // Apply all updates
        for (const { path, value } of updates) {
            const keys = path.split('.');
            let current = this.#state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            const oldValue = current[keys[keys.length - 1]];
            current[keys[keys.length - 1]] = value;

            if (APP_DEBUG) {
                console.log(`[Batch State Change] Path: ${path}, Old:`, oldValue, `New:`, value);
            }
        }

        // Notify once for all changes
        this.#notify({ batch: true, updates });
    }

    /**
     * Start a batch operation that will collect updates and apply them together.
     * @returns {function} A function to apply updates within the batch.
     */
    startBatch() {
        if (this.#batchUpdates) {
            console.warn('[StateManager] Batch already in progress');
            return () => {};
        }

        this.#batchUpdates = [];
        
        return (path, value) => {
            this.#batchUpdates.push({ path, value });
        };
    }

    /**
     * End the current batch operation and apply all collected updates.
     */
    endBatch() {
        if (!this.#batchUpdates) {
            console.warn('[StateManager] No batch in progress');
            return;
        }

        const updates = [...this.#batchUpdates];
        this.#batchUpdates = null;
        
        if (updates.length > 0) {
            this.batchSet(updates);
        }
    }

    /**
     * Gets a deep copy of the current state or a part of it.
     * @param {string} [path] - Optional path to a specific part of the state (e.g., 'spheres.color').
     * @returns {*} The requested state value.
     */
    get(path) {
        if (!path) {
            return JSON.parse(JSON.stringify(this.#state));
        }
        const keys = path.split('.');
        let current = this.#state;
        for (const key of keys) {
            if (current === undefined || current === null) return undefined;
            current = current[key];
        }
        return current === undefined ? undefined : JSON.parse(JSON.stringify(current));
    }

    /**
     * Sets a value in the state and notifies listeners.
     * @param {string} path - The path to state property to set (e.g., 'spheres.color').
     * @param {*} value - The new value.
     */
    // Центральный механизм управления состоянием приложения
    set(path, value) {
        // Prevent recursive updates during notification
        if (this.#isNotifying) {
            console.warn(`[StateManager] Recursive set detected during notification for path: ${path}. This may cause infinite loops.`);
            return;
        }

        const keys = path.split('.');
        let current = this.#state;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        const oldValue = current[keys[keys.length - 1]];
        current[keys[keys.length - 1]] = value;

        if (APP_DEBUG) {
            console.log(`[State Change] Path: ${path}, Old:`, oldValue, `New:`, value);
        }

        // For now, we pass the whole path as the update detail.
        // A more complex implementation could pass what changed.
        // Триггерит render() и другие подписанные функции
        this.#notify({ path, value });
    }

    /**
     * A special method to set the initial config for comparison.
     * @param {object} config 
     */
    setInitialConfig(config) {
        this.set('initialConfig', JSON.parse(JSON.stringify(config)));
        this.set('hasChanged', false);
    }
}

// Export a single instance of the StateManager
export const stateManager = new StateManager();
