// assets/js/debug/ui-debug-helper.js
import { stateManager } from '../core/state.js';

export function initDebugHelper() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('debug')) return;

    console.log('[Debug Helper] Initializing...');

    // Load Debug CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.CUSTOMIZER_ASSETS_PATH + '/css/debug.css';
    document.head.appendChild(link);

    // Create Panel
    const panel = document.createElement('div');
    panel.className = 'debug-panel';
    panel.innerHTML = `
        <h3>Customizer Debugger <span class="debug-close-btn">×</span></h3>

        <div class="debug-panel-section">
            <h4>Camera Views</h4>
            <div class="debug-view-buttons">
                <button data-view="global-view">Global</button>
                <button data-view="mic-active">Microphone</button>
                <button data-view="shockmount-active">Shockmount</button>
                <button data-view="case-active">Wood Case</button>
                <button data-view="logo-view">Logo View</button>
            </div>
        </div>

        <div class="debug-panel-section">
            <h4>Current View Tuning</h4>
            <div id="camera-controls">
                <div class="debug-control-row">
                    <label>Translate X (%)</label>
                    <input type="number" id="cam-tx" value="0">
                </div>
                <div class="debug-control-row">
                    <label>Translate Y (%)</label>
                    <input type="number" id="cam-ty" value="0">
                </div>
                <div class="debug-control-row">
                    <label>Scale</label>
                    <input type="number" id="cam-scale" step="0.05" value="1">
                </div>
            </div>
        </div>

        <div class="debug-panel-section">
            <h4>Overlay Stencil</h4>
            <div class="debug-control-row">
                <input type="file" id="debug-stencil-upload" accept="image/*">
            </div>
            <div class="debug-control-row">
                <label>Opacity</label>
                <input type="range" id="debug-stencil-opacity" min="0" max="1" step="0.1" value="0.5">
            </div>
        </div>

        <div class="debug-panel-section">
            <h4>State Viewer</h4>
            <pre class="debug-state-viewer" id="debug-state-display"></pre>
        </div>

        <div class="debug-panel-section">
            <h4>Export Config</h4>
            <textarea class="debug-config-export" id="debug-config-export" readonly></textarea>
        </div>
    `;
    document.body.appendChild(panel);

    // Stencil Overlay
    const stencil = document.createElement('img');
    stencil.className = 'debug-overlay-canvas';
    stencil.style.display = 'none';
    const previewArea = document.getElementById('preview-area');
    if (previewArea) previewArea.appendChild(stencil);

    // Bind Controls
    const stateDisplay = document.getElementById('debug-state-display');
    const configExport = document.getElementById('debug-config-export');
    const stencilOpacity = document.getElementById('debug-stencil-opacity');
    const stencilUpload = document.getElementById('debug-stencil-upload');

    // Subscribe to state changes
    stateManager.subscribe((state) => {
        const filteredState = {
            model: state.currentModelCode,
            spheres: state.spheres,
            body: state.body,
            logo: state.logo,
            shockmount: state.shockmount,
            prices: state.prices
        };
        stateDisplay.textContent = JSON.stringify(filteredState, null, 2);
    });

    stencilUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                stencil.src = ev.target.result;
                stencil.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    stencilOpacity.addEventListener('input', (e) => {
        stencil.style.opacity = e.target.value;
    });

    panel.querySelector('.debug-close-btn').onclick = () => panel.remove();

    // View Switching & Tuning
    const viewButtons = panel.querySelectorAll('.debug-view-buttons button');
    let currentView = 'global-view';

    viewButtons.forEach(btn => {
        btn.onclick = () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;

            // Logic to apply view
            import('../modules/camera-effect.js').then(m => {
                const layerMap = {
                    'mic-active': 'microphone',
                    'shockmount-active': 'shockmount',
                    'case-active': 'case',
                    'logo-view': 'logo-view'
                };
                m.switchLayer(layerMap[currentView] || 'microphone');
            });
        };
    });

    // Real-time camera tuning (Simplified)
    const inputs = ['cam-tx', 'cam-ty', 'cam-scale'];
    inputs.forEach(id => {
        document.getElementById(id).oninput = () => {
            const tx = document.getElementById('cam-tx').value;
            const ty = document.getElementById('cam-ty').value;
            const s = document.getElementById('cam-scale').value;

            const activeLayer = document.querySelector('.layer.active');
            if (activeLayer) {
                activeLayer.style.transform = `translateX(${tx}%) translateY(${ty}%) scale(${s})`;

                configExport.value = `transform: 'translateX(${tx}%) translateY(${ty}%) scale(${s})'`;
            }
        };
    });
}
