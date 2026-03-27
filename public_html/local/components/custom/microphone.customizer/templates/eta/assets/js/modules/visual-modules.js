export const VISUAL_MODULES = Object.freeze({
    KINEMATIC_SHADOWS: Object.freeze({
        id: 'kinematic-shadows',
        name: 'Kinematic Shadows',
        description: 'Directional shadows driven by the current scene pitch and light angle.',
        enabled: true,
        category: 'cinematic',
        priority: 1,
        cssVar: '--module-shadows-enabled'
    }),
    FLOOR_REFLECTIONS: Object.freeze({
        id: 'floor-reflections',
        name: 'Floor Reflections',
        description: 'Soft sheen and floor light response under the scene.',
        enabled: true,
        category: 'cinematic',
        priority: 2,
        cssVar: '--module-reflections-enabled'
    }),
    DYNAMIC_HORIZON: Object.freeze({
        id: 'dynamic-horizon',
        name: 'Dynamic Horizon',
        description: 'Horizon glow and floor line respond to scene pitch.',
        enabled: true,
        category: 'perspective',
        priority: 1,
        cssVar: '--module-horizon-enabled'
    }),
    PARALLAX_EFFECT: Object.freeze({
        id: 'parallax-effect',
        name: 'Parallax Effect',
        description: 'Layer content shifts subtly relative to the horizon.',
        enabled: true,
        category: 'perspective',
        priority: 2,
        cssVar: '--module-parallax-enabled'
    }),
    MATERIAL_SPECULAR: Object.freeze({
        id: 'material-specular',
        name: 'Specular Highlights',
        description: 'Adds soft highlight response to the active microphone layer.',
        enabled: true,
        category: 'materials',
        priority: 1,
        cssVar: '--module-specular-enabled'
    }),
    AMBIENT_OCCLUSION: Object.freeze({
        id: 'ambient-occlusion',
        name: 'Ambient Occlusion',
        description: 'Subtle contact shadows and lower-scene depth shading.',
        enabled: true,
        category: 'materials',
        priority: 2,
        cssVar: '--module-ao-enabled'
    }),
    GLOW_EFFECT: Object.freeze({
        id: 'glow-effect',
        name: 'Glow Effect',
        description: 'Soft halo around the active scene layer.',
        enabled: false,
        category: 'post-processing',
        priority: 1,
        cssVar: '--module-glow-enabled'
    }),
    CHROMATIC_ABERRATION: Object.freeze({
        id: 'chromatic-aberration',
        name: 'Chromatic Aberration',
        description: 'A restrained cinematic split-tone edge on the active layer.',
        enabled: false,
        category: 'post-processing',
        priority: 2,
        cssVar: '--module-chromatic-enabled'
    })
});

export const VISUAL_MODULE_PRESETS = Object.freeze({
    cinematic: Object.freeze({
        'kinematic-shadows': true,
        'floor-reflections': true,
        'dynamic-horizon': true,
        'parallax-effect': true,
        'material-specular': true,
        'ambient-occlusion': true,
        'glow-effect': true,
        'chromatic-aberration': true
    }),
    performance: Object.freeze({
        'kinematic-shadows': true,
        'floor-reflections': false,
        'dynamic-horizon': false,
        'parallax-effect': false,
        'material-specular': true,
        'ambient-occlusion': false,
        'glow-effect': false,
        'chromatic-aberration': false
    }),
    minimal: Object.freeze({
        'kinematic-shadows': true,
        'floor-reflections': false,
        'dynamic-horizon': false,
        'parallax-effect': false,
        'material-specular': false,
        'ambient-occlusion': false,
        'glow-effect': false,
        'chromatic-aberration': false
    }),
    default: Object.freeze({
        'kinematic-shadows': true,
        'floor-reflections': true,
        'dynamic-horizon': true,
        'parallax-effect': true,
        'material-specular': true,
        'ambient-occlusion': true,
        'glow-effect': false,
        'chromatic-aberration': false
    })
});

const STORAGE_KEY = 'soyuz_visual_modules';

function canUseStorage() {
    try {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch (error) {
        return false;
    }
}

function getDefaultModulesState() {
    return Object.values(VISUAL_MODULES).reduce((result, moduleConfig) => {
        result[moduleConfig.id] = {
            ...moduleConfig
        };
        return result;
    }, {});
}

class VisualModulesManager {
    constructor() {
        this.modules = new Map();
        this.listeners = [];
        this.hydrate();
    }

    hydrate() {
        const savedState = this.readStoredState();
        const defaults = getDefaultModulesState();

        Object.values(defaults).forEach((moduleConfig) => {
            this.modules.set(moduleConfig.id, {
                ...moduleConfig,
                enabled: typeof savedState[moduleConfig.id] === 'boolean'
                    ? savedState[moduleConfig.id]
                    : moduleConfig.enabled
            });
        });

        this.applyToDOM();
    }

    readStoredState() {
        if (!canUseStorage()) {
            return {};
        }

        try {
            const rawValue = window.localStorage.getItem(STORAGE_KEY);
            return rawValue ? JSON.parse(rawValue) : {};
        } catch (error) {
            console.warn('[VisualModules] Failed to read stored state.', error);
            return {};
        }
    }

    writeStoredState() {
        if (!canUseStorage()) {
            return;
        }

        try {
            const serializedState = {};
            this.modules.forEach((moduleConfig, moduleId) => {
                serializedState[moduleId] = moduleConfig.enabled;
            });
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedState));
        } catch (error) {
            console.warn('[VisualModules] Failed to persist state.', error);
        }
    }

    applyToDOM() {
        if (typeof document === 'undefined') {
            return;
        }

        const root = document.documentElement;
        const body = document.body;

        this.modules.forEach((moduleConfig) => {
            root.style.setProperty(moduleConfig.cssVar, moduleConfig.enabled ? '1' : '0');

            if (!body) {
                return;
            }

            const className = `module-${moduleConfig.id}`;
            body.classList.toggle(className, moduleConfig.enabled);
        });
    }

    notify(event) {
        this.listeners.forEach((listener) => listener(event));
    }

    getModule(moduleId) {
        return this.modules.get(moduleId) || null;
    }

    getAllModules() {
        return Array.from(this.modules.values());
    }

    getModulesByCategory(category) {
        return this.getAllModules()
            .filter((moduleConfig) => moduleConfig.category === category)
            .sort((left, right) => left.priority - right.priority);
    }

    isEnabled(moduleId) {
        return Boolean(this.modules.get(moduleId)?.enabled);
    }

    setModuleEnabled(moduleId, enabled) {
        const moduleConfig = this.modules.get(moduleId);
        if (!moduleConfig) {
            return false;
        }

        const nextEnabled = Boolean(enabled);
        if (moduleConfig.enabled === nextEnabled) {
            return nextEnabled;
        }

        moduleConfig.enabled = nextEnabled;
        this.writeStoredState();
        this.applyToDOM();
        this.notify({
            type: 'module',
            moduleId,
            enabled: nextEnabled,
            modules: this.getAllModules()
        });
        return nextEnabled;
    }

    toggleModule(moduleId, forceEnabled = null) {
        const currentEnabled = this.isEnabled(moduleId);
        const nextEnabled = typeof forceEnabled === 'boolean'
            ? forceEnabled
            : !currentEnabled;
        return this.setModuleEnabled(moduleId, nextEnabled);
    }

    setModulesState(nextState = {}) {
        let hasChanges = false;

        Object.entries(nextState).forEach(([moduleId, enabled]) => {
            const moduleConfig = this.modules.get(moduleId);
            if (!moduleConfig) {
                return;
            }

            const nextEnabled = Boolean(enabled);
            if (moduleConfig.enabled === nextEnabled) {
                return;
            }

            moduleConfig.enabled = nextEnabled;
            hasChanges = true;
        });

        if (!hasChanges) {
            return false;
        }

        this.writeStoredState();
        this.applyToDOM();
        this.notify({
            type: 'batch',
            modules: this.getAllModules()
        });
        return true;
    }

    applyPreset(presetId) {
        const preset = VISUAL_MODULE_PRESETS[presetId];
        if (!preset) {
            return false;
        }

        const changed = this.setModulesState(preset);
        this.notify({
            type: 'preset',
            presetId,
            changed,
            modules: this.getAllModules()
        });
        return true;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter((listener) => listener !== callback);
        };
    }
}

const visualModules = new VisualModulesManager();

export default visualModules;
