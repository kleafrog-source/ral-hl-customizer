/**
 * Debug Module for Microphone Customizer
 * Полный дебаггер с отслеживанием всех процессов и состояний
 */

class CustomizerDebugger {
    constructor() {
        this.isEnabled = false;
        this.showInUI = false;
        this.logs = [];
        this.maxLogs = 1000;
        this.actionCounter = 0;
        this.stateHistory = [];
        this.errorCount = 0;
        this.startTime = Date.now();
        
        // Уникальные идентификаторы для всех элементов
        this.elementIds = new Map();
        this.actionIds = new Map();
        
        this.init();
    }

    init() {
        console.log('🔧 Customizer Debugger initialized');
        this.createDebugUI();
        this.setupGlobalListeners();
        this.interceptConsole();
    }

    // === УПРАВЛЕНИЕ ДЕБАГГЕРОМ ===
    
    enable() {
        this.isEnabled = true;
        this.log('INFO', 'Debugger ENABLED', { timestamp: Date.now() });
        this.updateDebugUI();
    }

    disable() {
        this.isEnabled = false;
        this.log('INFO', 'Debugger DISABLED', { timestamp: Date.now() });
        this.updateDebugUI();
    }

    toggleUI() {
        this.showInUI = !this.showInUI;
        this.updateDebugUI();
    }

    // === ЛОГИРОВАНИЕ ===
    
    log(level, message, data = null, elementId = null) {
        if (!this.isEnabled) return;

        const logEntry = {
            id: ++this.actionCounter,
            timestamp: Date.now(),
            level: level, // INFO, WARN, ERROR, ACTION, STATE
            message: message,
            data: data,
            elementId: elementId,
            stackTrace: this.getStackTrace()
        };

        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Вывод в консоль
        const icon = this.getLevelIcon(level);
        console.log(`${icon} [${level}] ${message}`, data || '');

        // Обновление UI если включено
        if (this.showInUI) {
            this.addLogToUI(logEntry);
        }

        // Показ ошибок в интерфейсе
        if (level === 'ERROR' && this.showInUI) {
            this.showErrorInUI(message, data);
        }
    }

    // === ОТСЛЕЖИВАНИЕ ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЯ ===
    
    trackUserAction(element, action, data = null) {
        const elementId = this.getOrCreateElementId(element);
        
        this.log('ACTION', `User ${action}: ${element.tagName.toLowerCase()}${element.className ? '.' + element.className.split(' ').join('.') : ''}`, {
            elementId: elementId,
            action: action,
            data: data,
            element: {
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                textContent: element.textContent?.substring(0, 50),
                dataset: { ...element.dataset }
            }
        }, elementId);
    }

    // === ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ STATE ===
    
    trackStateChange(moduleName, functionName, beforeState, afterState, changes = null) {
        const stateSnapshot = {
            timestamp: Date.now(),
            module: moduleName,
            function: functionName,
            before: this.deepClone(beforeState),
            after: this.deepClone(afterState),
            changes: changes || this.detectChanges(beforeState, afterState)
        };

        this.stateHistory.push(stateSnapshot);
        if (this.stateHistory.length > 100) {
            this.stateHistory.shift();
        }

        this.log('STATE', `State changed in ${moduleName}.${functionName}`, stateSnapshot);
    }

    // === ОТСЛЕЖИВАНИЕ ФУНКЦИЙ ===
    
    trackFunction(moduleName, functionName, args, result, error = null) {
        const trackingData = {
            module: moduleName,
            function: functionName,
            args: this.deepClone(args),
            result: error ? null : this.deepClone(result),
            error: error ? {
                message: error.message,
                stack: error.stack
            } : null,
            executionTime: performance.now()
        };

        if (error) {
            this.errorCount++;
            this.log('ERROR', `Function ${moduleName}.${functionName} failed`, trackingData);
        } else {
            this.log('INFO', `Function ${moduleName}.${functionName} executed`, trackingData);
        }
    }

    // === СОЗДАНИЕ UI ДЕБАГГЕРА ===
    
    createDebugUI() {
        // Создаем контейнер дебаггера
        const debugContainer = document.createElement('div');
        debugContainer.id = 'customizer-debugger';
        debugContainer.innerHTML = `
            <div class="debug-header">
                <h3>🔧 Customizer Debugger</h3>
                <div class="debug-controls">
                    <button id="debug-toggle" class="debug-btn">Toggle</button>
                    <button id="debug-enable" class="debug-btn">Enable</button>
                    <button id="debug-disable" class="debug-btn">Disable</button>
                    <button id="debug-clear" class="debug-btn">Clear</button>
                    <button id="debug-export" class="debug-btn">Export</button>
                </div>
            </div>
            <div class="debug-content" id="debug-content" style="display: none;">
                <div class="debug-stats">
                    <span>Logs: <span id="log-count">0</span></span>
                    <span>Errors: <span id="error-count">0</span></span>
                    <span>Actions: <span id="action-count">0</span></span>
                </div>
                <div class="debug-tabs">
                    <button class="debug-tab active" data-tab="logs">Logs</button>
                    <button class="debug-tab" data-tab="state">State</button>
                    <button class="debug-tab" data-tab="elements">Elements</button>
                    <button class="debug-tab" data-tab="errors">Errors</button>
                </div>
                <div class="debug-panels">
                    <div id="logs-panel" class="debug-panel active"></div>
                    <div id="state-panel" class="debug-panel"></div>
                    <div id="elements-panel" class="debug-panel"></div>
                    <div id="errors-panel" class="debug-panel"></div>
                </div>
            </div>
        `;

        // Добавляем стили
        const style = document.createElement('style');
        style.textContent = `
            #customizer-debugger {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 400px;
                max-height: 80vh;
                background: #1a1a1a;
                color: #fff;
                border: 2px solid #333;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            }
            .debug-header {
                padding: 10px;
                background: #2a2a2a;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .debug-header h3 {
                margin: 0;
                font-size: 14px;
            }
            .debug-controls {
                display: flex;
                gap: 5px;
            }
            .debug-btn {
                padding: 4px 8px;
                background: #444;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
            }
            .debug-btn:hover {
                background: #555;
            }
            .debug-content {
                max-height: 60vh;
                overflow-y: auto;
            }
            .debug-stats {
                padding: 8px;
                background: #2a2a2a;
                border-bottom: 1px solid #333;
                display: flex;
                gap: 15px;
                font-size: 11px;
            }
            .debug-tabs {
                display: flex;
                background: #2a2a2a;
                border-bottom: 1px solid #333;
            }
            .debug-tab {
                flex: 1;
                padding: 8px;
                background: transparent;
                color: #888;
                border: none;
                cursor: pointer;
                font-size: 11px;
            }
            .debug-tab.active {
                background: #444;
                color: #fff;
            }
            .debug-panels {
                max-height: 40vh;
                overflow-y: auto;
            }
            .debug-panel {
                display: none;
                padding: 10px;
            }
            .debug-panel.active {
                display: block;
            }
            .log-entry {
                margin-bottom: 8px;
                padding: 6px;
                background: #2a2a2a;
                border-left: 3px solid #666;
                border-radius: 3px;
            }
            .log-entry.error {
                border-left-color: #ff4444;
                background: #3a1a1a;
            }
            .log-entry.action {
                border-left-color: #44ff44;
                background: #1a3a1a;
            }
            .log-entry.state {
                border-left-color: #4444ff;
                background: #1a1a3a;
            }
            .log-timestamp {
                color: #888;
                font-size: 10px;
            }
            .log-message {
                margin-top: 2px;
            }
            .error-display {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4444;
                color: #fff;
                padding: 20px;
                border-radius: 8px;
                z-index: 10001;
                max-width: 400px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(debugContainer);
        
        this.setupDebugUIListeners();
    }

    setupDebugUIListeners() {
        document.getElementById('debug-toggle').addEventListener('click', () => this.toggleUI());
        document.getElementById('debug-enable').addEventListener('click', () => this.enable());
        document.getElementById('debug-disable').addEventListener('click', () => this.disable());
        document.getElementById('debug-clear').addEventListener('click', () => this.clearLogs());
        document.getElementById('debug-export').addEventListener('click', () => this.exportLogs());

        // Табы
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.debug-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.debug-panel').forEach(p => p.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab + '-panel').classList.add('active');
            });
        });
    }

    // === ГЛОБАЛЬНЫЕ СЛУШАТЕЛИ ===
    
    setupGlobalListeners() {
        // Отслеживание кликов
        document.addEventListener('click', (e) => {
            if (this.isEnabled) {
                this.trackUserAction(e.target, 'click', {
                    x: e.clientX,
                    y: e.clientY,
                    button: e.button
                });
            }
        }, true);

        // Отслеживание изменений input
        document.addEventListener('input', (e) => {
            if (this.isEnabled) {
                this.trackUserAction(e.target, 'input', {
                    value: e.target.value,
                    inputType: e.inputType
                });
            }
        }, true);

        // Отслеживание изменений в DOM
        const observer = new MutationObserver((mutations) => {
            if (!this.isEnabled) return;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.trackUserAction(mutation.target, 'class-change', {
                        oldClass: mutation.oldValue,
                        newClass: mutation.target.className
                    });
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeOldValue: true,
            subtree: true
        });
    }

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    
    getOrCreateElementId(element) {
        if (!this.elementIds.has(element)) {
            this.elementIds.set(element, `elem_${this.elementIds.size + 1}`);
        }
        return this.elementIds.get(element);
    }

    detectChanges(before, after) {
        const changes = {};
        
        if (typeof before !== typeof after) {
            return { type: 'type_change', before: typeof before, after: typeof after };
        }
        
        if (typeof after === 'object' && after !== null) {
            for (const key in after) {
                if (before[key] !== after[key]) {
                    changes[key] = { before: before[key], after: after[key] };
                }
            }
        } else if (before !== after) {
            return { before, after };
        }
        
        return Object.keys(changes).length > 0 ? changes : null;
    }

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    getStackTrace() {
        const stack = new Error().stack;
        return stack ? stack.split('\n').slice(2, 6) : [];
    }

    getLevelIcon(level) {
        const icons = {
            'INFO': 'ℹ️',
            'WARN': '⚠️',
            'ERROR': '❌',
            'ACTION': '👆',
            'STATE': '🔄'
        };
        return icons[level] || '📝';
    }

    addLogToUI(logEntry) {
        const logsPanel = document.getElementById('logs-panel');
        const logElement = document.createElement('div');
        logElement.className = `log-entry ${logEntry.level.toLowerCase()}`;
        logElement.innerHTML = `
            <div class="log-timestamp">${new Date(logEntry.timestamp).toLocaleTimeString()}</div>
            <div class="log-message">${logEntry.message}</div>
            ${logEntry.data ? `<pre class="log-data">${JSON.stringify(logEntry.data, null, 2)}</pre>` : ''}
        `;
        logsPanel.appendChild(logElement);
        logsPanel.scrollTop = logsPanel.scrollHeight;
    }

    showErrorInUI(message, data) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-display';
        errorDiv.innerHTML = `
            <h4>❌ Error</h4>
            <p>${message}</p>
            ${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''}
            <button onclick="this.parentElement.remove()">Close</button>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    updateDebugUI() {
        const debugContent = document.getElementById('debug-content');
        if (debugContent) {
            debugContent.style.display = this.showInUI ? 'block' : 'none';
        }
        
        document.getElementById('log-count').textContent = this.logs.length;
        document.getElementById('error-count').textContent = this.errorCount;
        document.getElementById('action-count').textContent = this.actionCounter;
    }

    clearLogs() {
        this.logs = [];
        this.stateHistory = [];
        this.errorCount = 0;
        this.actionCounter = 0;
        
        document.getElementById('logs-panel').innerHTML = '';
        this.updateDebugUI();
        
        this.log('INFO', 'Logs cleared');
    }

    exportLogs() {
        const exportData = {
            timestamp: Date.now(),
            duration: Date.now() - this.startTime,
            logs: this.logs,
            stateHistory: this.stateHistory,
            elements: Array.from(this.elementIds.entries()).map(([element, id]) => ({
                id,
                tagName: element.tagName,
                className: element.className,
                id: element.id
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customizer-debug-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    interceptConsole() {
        const originalError = console.error;
        console.error = (...args) => {
            originalError.apply(console, args);
            if (this.isEnabled) {
                this.log('ERROR', 'Console Error', args);
            }
        };
    }
}

// Создаем глобальный экземпляр дебаггера
window.debugger = new CustomizerDebugger();

// Экспортируем для использования в других модулях
export default window.debugger;
