import visualModules from './visual-modules.js';

const PANEL_CLASS = 'visual-modules-panel';
const TOGGLE_CLASS = 'visual-modules-toggle';

const CATEGORY_ORDER = Object.freeze([
    'cinematic',
    'perspective',
    'materials',
    'post-processing'
]);

const CATEGORY_LABELS = Object.freeze({
    cinematic: 'Cinematic',
    perspective: 'Perspective',
    materials: 'Materials',
    'post-processing': 'Post Processing'
});

class ModulesPanel {
    constructor() {
        this.panel = null;
        this.toggleButton = null;
        this.isOpen = false;
        this.unsubscribe = null;
        this.init();
    }

    init() {
        this.createPanel();
        this.createToggleButton();
        this.renderModules();
        this.bindEvents();
        this.unsubscribe = visualModules.subscribe(() => {
            this.syncModuleState();
        });
    }

    createPanel() {
        this.panel = document.createElement('aside');
        this.panel.id = 'visual-modules-panel';
        this.panel.className = PANEL_CLASS;
        this.panel.setAttribute('aria-hidden', 'true');
        this.panel.innerHTML = `
            <div class="visual-modules-panel__header">
                <div>
                    <h3>Visual Effects</h3>
                    <p>Choose how cinematic the scene should feel.</p>
                </div>
                <button type="button" class="visual-modules-panel__close" aria-label="Close visual effects panel">×</button>
            </div>
            <div class="visual-modules-panel__content">
                <div class="visual-modules-panel__categories"></div>
                <div class="visual-modules-panel__presets">
                    <h4>Quick Presets</h4>
                    <div class="visual-modules-panel__preset-buttons">
                        <button type="button" data-modules-preset="cinematic">Cinematic</button>
                        <button type="button" data-modules-preset="performance">Performance</button>
                        <button type="button" data-modules-preset="minimal">Minimal</button>
                        <button type="button" data-modules-preset="default">Default</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.panel);
    }

    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = TOGGLE_CLASS;
        this.toggleButton.type = 'button';
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.toggleButton.setAttribute('aria-controls', 'visual-modules-panel');
        this.toggleButton.textContent = 'Effects';
        document.body.appendChild(this.toggleButton);
    }

    bindEvents() {
        this.toggleButton?.addEventListener('click', () => this.toggle());

        this.panel?.querySelector('.visual-modules-panel__close')?.addEventListener('click', () => {
            this.close();
        });

        this.panel?.addEventListener('change', (event) => {
            const checkbox = event.target.closest('[data-visual-module]');
            if (!checkbox) {
                return;
            }

            visualModules.setModuleEnabled(checkbox.dataset.visualModule, checkbox.checked);
        });

        this.panel?.addEventListener('click', (event) => {
            const presetButton = event.target.closest('[data-modules-preset]');
            if (!presetButton) {
                return;
            }

            visualModules.applyPreset(presetButton.dataset.modulesPreset);
        });
    }

    renderModules() {
        const categoriesContainer = this.panel?.querySelector('.visual-modules-panel__categories');
        if (!categoriesContainer) {
            return;
        }

        categoriesContainer.innerHTML = '';

        CATEGORY_ORDER.forEach((category) => {
            const modules = visualModules.getModulesByCategory(category);
            if (!modules.length) {
                return;
            }

            const section = document.createElement('section');
            section.className = 'visual-modules-panel__category';
            section.innerHTML = `
                <h4>${CATEGORY_LABELS[category] || category}</h4>
                <div class="visual-modules-panel__modules"></div>
            `;

            const modulesContainer = section.querySelector('.visual-modules-panel__modules');

            modules.forEach((moduleConfig) => {
                const moduleElement = document.createElement('div');
                moduleElement.className = 'visual-modules-panel__module';
                moduleElement.innerHTML = `
                    <label class="visual-modules-panel__module-label">
                        <input type="checkbox" data-visual-module="${moduleConfig.id}" ${moduleConfig.enabled ? 'checked' : ''}>
                        <span class="visual-modules-panel__module-name">${moduleConfig.name}</span>
                    </label>
                    <span class="visual-modules-panel__module-desc">${moduleConfig.description}</span>
                `;
                modulesContainer.appendChild(moduleElement);
            });

            categoriesContainer.appendChild(section);
        });

        this.syncModuleState();
    }

    syncModuleState() {
        if (!this.panel) {
            return;
        }

        visualModules.getAllModules().forEach((moduleConfig) => {
            const checkbox = this.panel.querySelector(`[data-visual-module="${moduleConfig.id}"]`);
            if (!checkbox) {
                return;
            }

            checkbox.checked = moduleConfig.enabled;
            const moduleCard = checkbox.closest('.visual-modules-panel__module');
            moduleCard?.classList.toggle('is-active', moduleConfig.enabled);
        });
    }

    open() {
        this.panel?.classList.add('is-open');
        this.panel?.setAttribute('aria-hidden', 'false');
        this.toggleButton?.setAttribute('aria-expanded', 'true');
        this.isOpen = true;
    }

    close() {
        this.panel?.classList.remove('is-open');
        this.panel?.setAttribute('aria-hidden', 'true');
        this.toggleButton?.setAttribute('aria-expanded', 'false');
        this.isOpen = false;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
            return;
        }

        this.open();
    }
}

let modulesPanelInstance = null;

export function initModulesPanel() {
    if (modulesPanelInstance) {
        return modulesPanelInstance;
    }

    modulesPanelInstance = new ModulesPanel();
    return modulesPanelInstance;
}
