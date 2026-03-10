/**
 * Debug Module for Microphone Customizer v2.0
 * Оптимизированная версия с режимами логирования
 */

class CustomizerDebuggerV2 {
    constructor() {
        this.isEnabled = false;
        this.showInUI = false;
        this.logs = [];
        this.maxLogs = 500; // Уменьшено для экономии памяти
        this.actionCounter = 0;
        this.stateHistory = [];
        this.errorCount = 0;
        this.startTime = Date.now();
        
        // РЕЖИМЫ ЛОГИРОВАНИЯ
        this.logMode = 'minimal'; // 'minimal', 'normal', 'verbose'
        this.lastLoggedActions = new Map(); // Для предотвращения дублирования
        this.throttleDelay = 100; // ms
        this.lastLogTime = 0;
        
        // Уникальные идентификаторы
        this.elementIds = new Map();
        this.actionIds = new Map();
        
        // Счетчики для анализа производительности
        this.performanceCounters = {
            updateUI: 0,
            setState: 0,
            togglePalette: 0,
            setCase: 0
        };
        
        this.init();
    }

    init() {
        console.log('🔧 Customizer Debugger V2 initialized');
        this.createDebugUI();
        this.setupGlobalListeners();
        this.interceptConsole();
    }

    // === УПРАВЛЕНИЕ РЕЖИМАМИ ===
    
    setLogMode(mode) {
        this.logMode = mode;
        this.log('INFO', `Log mode changed to: ${mode}`, { mode });
        this.updateDebugUI();
    }

    // === ОПТИМИЗИРОВАННОЕ ЛОГИРОВАНИЕ ===
    
    log(level, message, data = null, elementId = null) {
        if (!this.isEnabled) return;

        // Throttling для предотвращения спама
        const now = Date.now();
        if (now - this.lastLogTime < this.throttleDelay && level === 'ACTION') {
            return;
        }
        this.lastLogTime = now;

        // Фильтрация в зависимости от режима
        if (!this.shouldLog(level, message)) {
            return;
        }

        const logEntry = {
            id: ++this.actionCounter,
            timestamp: Date.now(),
            level: level,
            message: message,
            data: this.sanitizeData(data),
            elementId: elementId,
            logMode: this.logMode
        };

        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Вывод в консоль
        const icon = this.getLevelIcon(level);
        console.log(`${icon} [${level}] ${message}`, data || '');

        // Обновление UI
        if (this.showInUI) {
            this.addLogToUI(logEntry);
        }

        // Показ ошибок в интерфейсе
        if (level === 'ERROR' && this.showInUI) {
            this.showErrorInUI(message, data);
        }
    }

    shouldLog(level, message) {
        // Фильтрация в зависимости от режима
        switch (this.logMode) {
            case 'minimal':
                // Только ошибки и важные действия
                return level === 'ERROR' || 
                       level === 'WARN' || 
                       (level === 'ACTION' && message.includes('clicked')) ||
                       (level === 'INFO' && message.includes('started'));
            
            case 'normal':
                // Все кроме детальной отладки
                return !message.includes('trackState') && 
                       !message.includes('updateUI called');
            
            case 'verbose':
                // Все логи
                return true;
            
            default:
                return true;
        }
    }

    sanitizeData(data) {
        if (!data) return null;
        
        // Удаляем большие объекты для экономии памяти
        if (typeof data === 'object') {
            const sanitized = { ...data };
            
            // Ограничиваем глубину объектов
            if (sanitized.beforeState) {
                sanitized.beforeState = this.createStateSnapshot(sanitized.beforeState);
            }
            if (sanitized.afterState) {
                sanitized.afterState = this.createStateSnapshot(sanitized.afterState);
            }
            
            return sanitized;
        }
        
        return data;
    }

    createStateSnapshot(state) {
        if (!state) return null;
        
        // Создаем компактный снепшот состояния
        return {
            variant: state.variant,
            model: state.model,
            spheres: state.spheres?.color || state.spheres?.variant,
            body: state.body?.color || state.body?.variant,
            logo: state.logo?.variant || 'custom',
            shockmount: state.shockmount?.variant
        };
    }

    // === ОТСЛЕЖИВАНИЕ ДЕЙСТВИЙ С ДЕДУПЛИКАЦИЕЙ ===
    
    trackUserAction(element, action, data = null) {
        const elementId = this.getOrCreateElementId(element);
        
        // Дедупликация одинаковых действий
        const actionKey = `${elementId}-${action}`;
        const now = Date.now();
        
        if (this.lastLoggedActions.has(actionKey)) {
            const lastTime = this.lastLoggedActions.get(actionKey);
            if (now - lastTime < 1000) { // Не логируем одинаковые действия чаще 1 раза в секунду
                return;
            }
        }
        
        this.lastLoggedActions.set(actionKey, now);
        
        this.log('ACTION', `User ${action}: ${this.getElementDescription(element)}`, {
            elementId: elementId,
            action: action,
            data: data,
            element: {
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                textContent: element.textContent?.substring(0, 30)
            }
        }, elementId);
    }

    getElementDescription(element) {
        const tagName = element.tagName.toLowerCase();
        const className = element.className ? '.' + element.className.split(' ').join('.') : '';
        const id = element.id ? `#${element.id}` : '';
        const text = element.textContent ? `"${element.textContent.substring(0, 20)}"` : '';
        
        return `${tagName}${id}${className} ${text}`.trim();
    }

    // === ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ STATE С ОПТИМИЗАЦИЕЙ ===
    
    trackStateChange(moduleName, functionName, beforeState, afterState, changes = null) {
        // В minimal режиме не логируем изменения состояния
        if (this.logMode === 'minimal') return;
        
        const stateSnapshot = {
            timestamp: Date.now(),
            module: moduleName,
            function: functionName,
            before: this.createStateSnapshot(beforeState),
            after: this.createStateSnapshot(afterState),
            changes: changes || this.detectChanges(beforeState, afterState)
        };

        // Логируем только если есть реальные изменения
        if (stateSnapshot.changes) {
            this.stateHistory.push(stateSnapshot);
            if (this.stateHistory.length > 50) { // Уменьшили историю
                this.stateHistory.shift();
            }

            this.log('STATE', `State changed in ${moduleName}.${functionName}`, stateSnapshot);
        }
    }

    // === ОТСЛЕЖИВАНИЕ ФУНКЦИЙ С СЧЕТЧИКАМИ ===
    
    trackFunction(moduleName, functionName, args, result, error = null) {
        // Счетчики производительности
        if (this.performanceCounters[functionName] !== undefined) {
            this.performanceCounters[functionName]++;
        }

        // В minimal режиме логируем только ошибки
        if (this.logMode === 'minimal' && !error) return;

        const trackingData = {
            module: moduleName,
            function: functionName,
            args: this.sanitizeData(args),
            result: error ? null : this.sanitizeData(result),
            error: error ? {
                message: error.message,
                stack: error.stack
            } : null,
            executionTime: performance.now(),
            counter: this.performanceCounters[functionName] || 0
        };

        if (error) {
            this.errorCount++;
            this.log('ERROR', `Function ${moduleName}.${functionName} failed`, trackingData);
        } else {
            this.log('INFO', `Function ${moduleName}.${functionName} executed`, trackingData);
        }
    }

    // === СОЗДАНИЕ UI С РЕЖИМАМИ ===
    
    createDebugUI() {
        // Проверяем, не создан ли уже UI
        if (document.getElementById('customizer-debugger-v2')) {
            return;
        }

        const debugContainer = document.createElement('div');
        debugContainer.id = 'customizer-debugger-v2';
        debugContainer.innerHTML = `
            <div class="debug-header">
                <h3>🔧 Customizer Debugger V2</h3>
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
                    <span>Mode: <span id="log-mode">minimal</span></span>
                </div>
                <div class="debug-mode-controls">
                    <label>Log Mode:</label>
                    <select id="log-mode-select">
                        <option value="minimal">Minimal</option>
                        <option value="normal">Normal</option>
                        <option value="verbose">Verbose</option>
                    </select>
                    <button id="performance-report" class="debug-btn">Performance</button>
                </div>
                <div class="debug-tabs">
                    <button class="debug-tab active" data-tab="logs">Logs</button>
                    <button class="debug-tab" data-tab="state">State</button>
                    <button class="debug-tab" data-tab="errors">Errors</button>
                    <button class="debug-tab" data-tab="performance">Performance</button>
                </div>
                <div class="debug-panels">
                    <div id="logs-panel" class="debug-panel active"></div>
                    <div id="state-panel" class="debug-panel"></div>
                    <div id="errors-panel" class="debug-panel"></div>
                    <div id="performance-panel" class="debug-panel"></div>
                </div>
            </div>
        `;

        // Добавляем стили
        this.addStyles();
        document.body.appendChild(debugContainer);
        this.setupDebugUIListeners();
    }

    addStyles() {
        if (document.getElementById('debugger-v2-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'debugger-v2-styles';
        style.textContent = `
            #customizer-debugger-v2 {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 450px;
                max-height: 85vh;
                background: #1a1a1a;
                color: #fff;
                border: 2px solid #333;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
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
                font-size: 13px;
            }
            .debug-controls {
                display: flex;
                gap: 3px;
            }
            .debug-btn {
                padding: 3px 6px;
                background: #444;
                color: #fff;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 9px;
            }
            .debug-btn:hover {
                background: #555;
            }
            .debug-content {
                max-height: 70vh;
                overflow-y: auto;
            }
            .debug-stats {
                padding: 6px;
                background: #2a2a2a;
                border-bottom: 1px solid #333;
                display: flex;
                gap: 12px;
                font-size: 10px;
                flex-wrap: wrap;
            }
            .debug-mode-controls {
                padding: 6px;
                background: #2a2a2a;
                border-bottom: 1px solid #333;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 10px;
            }
            .debug-mode-controls select {
                background: #444;
                color: #fff;
                border: 1px solid #555;
                border-radius: 3px;
                padding: 2px 4px;
                font-size: 9px;
            }
            .debug-tabs {
                display: flex;
                background: #2a2a2a;
                border-bottom: 1px solid #333;
            }
            .debug-tab {
                flex: 1;
                padding: 6px;
                background: transparent;
                color: #888;
                border: none;
                cursor: pointer;
                font-size: 10px;
            }
            .debug-tab.active {
                background: #444;
                color: #fff;
            }
            .debug-panels {
                max-height: 50vh;
                overflow-y: auto;
            }
            .debug-panel {
                display: none;
                padding: 8px;
            }
            .debug-panel.active {
                display: block;
            }
            .log-entry {
                margin-bottom: 4px;
                padding: 4px;
                background: #2a2a2a;
                border-left: 3px solid #666;
                border-radius: 3px;
                font-size: 10px;
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
                font-size: 9px;
            }
            .log-message {
                margin-top: 2px;
                word-wrap: break-word;
            }
            .performance-counter {
                padding: 4px;
                margin: 2px 0;
                background: #333;
                border-radius: 3px;
            }
            .error-display {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4444;
                color: #fff;
                padding: 15px;
                border-radius: 8px;
                z-index: 10001;
                max-width: 350px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                font-size: 11px;
            }
        `;
        
        document.head.appendChild(style);
    }

    setupDebugUIListeners() {
        document.getElementById('debug-toggle').addEventListener('click', () => this.toggleUI());
        document.getElementById('debug-enable').addEventListener('click', () => this.enable());
        document.getElementById('debug-disable').addEventListener('click', () => this.disable());
        document.getElementById('debug-clear').addEventListener('click', () => this.clearLogs());
        document.getElementById('debug-export').addEventListener('click', () => this.exportLogs());
        document.getElementById('performance-report').addEventListener('click', () => this.showPerformanceReport());
        
        // Смена режима логирования
        document.getElementById('log-mode-select').addEventListener('change', (e) => {
            this.setLogMode(e.target.value);
        });

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

    // === ГЛОБАЛЬНЫЕ СЛУШАТЕЛИ С ОПТИМИЗАЦИЕЙ ===
    
    setupGlobalListeners() {
        // Отслеживание кликов с дедупликацией
        let lastClickTime = 0;
        document.addEventListener('click', (e) => {
            if (this.isEnabled) {
                const now = Date.now();
                if (now - lastClickTime < 50) return; // Предотвращаем дублирование
                lastClickTime = now;
                
                this.trackUserAction(e.target, 'click', {
                    x: e.clientX,
                    y: e.clientY,
                    button: e.button
                });
            }
        }, true);

        // Отслеживание изменений input с throttling
        let lastInputTime = 0;
        document.addEventListener('input', (e) => {
            if (this.isEnabled) {
                const now = Date.now();
                if (now - lastInputTime < 200) return; // Throttling для input
                lastInputTime = now;
                
                this.trackUserAction(e.target, 'input', {
                    value: e.target.value,
                    inputType: e.inputType
                });
            }
        }, true);

        // Наблюдение за DOM с оптимизацией
        const observer = new MutationObserver((mutations) => {
            if (!this.isEnabled || this.logMode === 'minimal') return;
            
            let hasRelevantChanges = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' && 
                    mutation.target.classList.contains('active')) {
                    hasRelevantChanges = true;
                }
            });
            
            if (hasRelevantChanges) {
                const target = mutations[0].target;
                this.trackUserAction(target, 'class-change', {
                    oldClass: mutations[0].oldValue,
                    newClass: target.className
                });
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeOldValue: true,
            subtree: true,
            attributeFilter: ['class']
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
        if (!before || !after) return null;
        
        const changes = {};
        const keys = ['variant', 'model', 'spheres', 'body', 'logo', 'shockmount'];
        
        keys.forEach(key => {
            if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
                changes[key] = { before: before[key], after: after[key] };
            }
        });
        
        return Object.keys(changes).length > 0 ? changes : null;
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
        
        // Ограничиваем количество записей в UI
        while (logsPanel.children.length > 100) {
            logsPanel.removeChild(logsPanel.firstChild);
        }
        
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
        }, 3000);
    }

    showPerformanceReport() {
        const panel = document.getElementById('performance-panel');
        panel.innerHTML = `
            <h4>Performance Counters</h4>
            ${Object.entries(this.performanceCounters).map(([func, count]) => 
                `<div class="performance-counter">${func}: ${count} calls</div>`
            ).join('')}
            <h4>Memory Usage</h4>
            <div>Logs: ${this.logs.length}/${this.maxLogs}</div>
            <div>State History: ${this.stateHistory.length}/50</div>
            <div>Elements tracked: ${this.elementIds.size}</div>
        `;
    }

    updateDebugUI() {
        const debugContent = document.getElementById('debug-content');
        if (debugContent) {
            debugContent.style.display = this.showInUI ? 'block' : 'none';
        }
        
        document.getElementById('log-count').textContent = this.logs.length;
        document.getElementById('error-count').textContent = this.errorCount;
        document.getElementById('action-count').textContent = this.actionCounter;
        document.getElementById('log-mode').textContent = this.logMode;
        document.getElementById('log-mode-select').value = this.logMode;
    }

    clearLogs() {
        this.logs = [];
        this.stateHistory = [];
        this.errorCount = 0;
        this.actionCounter = 0;
        this.lastLoggedActions.clear();
        
        document.getElementById('logs-panel').innerHTML = '';
        document.getElementById('state-panel').innerHTML = '';
        document.getElementById('errors-panel').innerHTML = '';
        this.updateDebugUI();
        
        this.log('INFO', 'Logs cleared');
    }

    exportLogs() {
        const exportData = {
            timestamp: Date.now(),
            duration: Date.now() - this.startTime,
            logMode: this.logMode,
            logs: this.logs,
            stateHistory: this.stateHistory,
            performanceCounters: this.performanceCounters,
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
        a.download = `customizer-debug-v2-${Date.now()}.json`;
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

    // === ОСНОВНЫЕ МЕТОДЫ УПРАВЛЕНИЯ ===
    
    enable() {
        this.isEnabled = true;
        this.log('INFO', 'Debugger V2 ENABLED', { 
            timestamp: Date.now(),
            logMode: this.logMode 
        });
        this.updateDebugUI();
    }

    disable() {
        this.isEnabled = false;
        this.log('INFO', 'Debugger V2 DISABLED', { timestamp: Date.now() });
        this.updateDebugUI();
    }

    toggleUI() {
        this.showInUI = !this.showInUI;
        this.updateDebugUI();
    }
}

// Создаем глобальный экземпляр
window.debuggerV2 = new CustomizerDebuggerV2();

// Экспортируем для использования в других модулях
export default window.debuggerV2;
