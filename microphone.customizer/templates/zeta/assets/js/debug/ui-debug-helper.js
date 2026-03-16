import { stateManager } from '../core/state.js';
import { switchLayer, getActiveLayer } from '../modules/camera-effect.js';

export function initDebugHelper() {
    const isDebug = new URLSearchParams(window.location.search).get('debug') === '1' || window.DEBUG_UI_HELPER;
    if (!isDebug) return;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${window.CUSTOMIZER_ASSETS_PATH}/css/debug/debug-helper.css`;
    document.head.appendChild(link);

    const panel = document.createElement('div');
    panel.className = 'debug-panel';
    panel.innerHTML = `
        <h3>Dev Debug Panel <button id="debug-collapse">_</button></h3>
        <div id="debug-content">
            <div class="debug-section">
                <h4>Camera View</h4>
                <div class="debug-row">
                    <button data-view="microphone">Mic View</button>
                    <button data-view="shockmount">Shockmount</button>
                    <button data-view="case">Case</button>
                    <button data-view="logo">Logo View</button>
                </div>
            </div>

            <div class="debug-section">
                <h4>Overlay Stencil</h4>
                <div class="debug-row">
                    <input type="file" id="debug-stencil-upload" accept="image/*">
                </div>
                <div class="debug-row">
                    <label>Opacity</label>
                    <input type="range" id="debug-stencil-opacity" min="0" max="1" step="0.1" value="0.5">
                </div>
            </div>

            <div class="debug-section">
                <h4>State Viewer</h4>
                <div class="debug-state-viewer" id="debug-state-json"></div>
            </div>

            <div class="debug-section">
                <h4>Export Config</h4>
                <textarea id="debug-export-area" style="width:100%; height:100px; background:#111; color:#0f0; font-size:10px;"></textarea>
                <button id="debug-copy-config">Copy to Clipboard</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const stateViewer = document.getElementById('debug-state-json');
    stateManager.subscribe((state) => {
        const cleanState = { ...state };
        delete cleanState.savedMicConfigs;
        delete cleanState.initialConfig;
        stateViewer.textContent = JSON.stringify(cleanState, null, 2);
    });

    // Stencil logic
    const stencil = document.createElement('img');
    stencil.className = 'debug-overlay-stencil';
    stencil.style.display = 'none';
    document.body.appendChild(stencil);

    document.getElementById('debug-stencil-upload').addEventListener('change', (e) => {
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

    document.getElementById('debug-stencil-opacity').addEventListener('input', (e) => {
        stencil.style.opacity = e.target.value;
    });

    document.getElementById('debug-collapse').addEventListener('click', () => {
        const content = document.getElementById('debug-content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });

    panel.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchLayer(view);
        });
    });
}
