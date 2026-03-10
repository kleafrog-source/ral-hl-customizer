/**
 * Анализатор логов для выявления проблем в кастомайзере
 */

class DebugAnalyzer {
    constructor() {
        this.sessionLogs = new Map();
        this.actionPatterns = new Map();
        this.errorPatterns = new Map();
        this.performanceIssues = [];
        this.currentSession = null;
        
        this.init();
    }

    init() {
        console.log('🔍 Debug Analyzer initialized');
        this.setupAnalyzerUI();
        this.setupHotkeys();
    }

    // === СТРАТЕГИЯ ИМЕНОВАНИЯ ЛОГОВ ===
    
    startActionLog(actionName) {
        this.currentSession = {
            name: actionName,
            startTime: Date.now(),
            actions: [],
            errors: [],
            stateChanges: [],
            performanceData: {}
        };
        
        console.log(`📝 Started logging: ${actionName}`);
    }

    endActionLog() {
        if (!this.currentSession) return;
        
        this.currentSession.endTime = Date.now();
        this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
        
        // Анализируем сессию
        const analysis = this.analyzeSession(this.currentSession);
        
        // Сохраняем результат
        this.sessionLogs.set(this.currentSession.name, {
            session: this.currentSession,
            analysis: analysis
        });
        
        // Экспортируем автоматически
        this.exportSessionLog(this.currentSession.name);
        
        console.log(`✅ Finished logging: ${this.currentSession.name}`, analysis);
        this.currentSession = null;
    }

    // === АВТОМАТИЧЕСКОЕ ОПРЕДЕЛЕНИЕ ДЕЙСТВИЙ ===
    
    detectAction(element) {
        const text = element.textContent?.trim() || '';
        const className = element.className || '';
        const id = element.id || '';
        
        // Определяем действие на основе элемента
        if (className.includes('palette-toggle-btn')) {
            return `Palette Toggle - ${text}`;
        }
        
        if (className.includes('variant-button') || className.includes('model-button')) {
            return `Microphone Selection - ${text}`;
        }
        
        if (className.includes('color-option')) {
            return `Color Selection - ${text}`;
        }
        
        if (text.includes('RAL')) {
            return `RAL Color - ${text}`;
        }
        
        if (id.includes('shockmount-switch')) {
            return 'Shockmount Toggle';
        }
        
        if (className.includes('preview-switch-btn')) {
            return 'Preview Switch';
        }
        
        return `Unknown Action - ${text}`;
    }

    // === АНАЛИЗ СЕССИЙ ===
    
    analyzeSession(session) {
        const analysis = {
            issues: [],
            warnings: [],
            performance: {},
            recommendations: []
        };

        // Анализ производительности
        if (session.duration > 5000) {
            analysis.issues.push({
                type: 'performance',
                severity: 'high',
                message: `Action took ${session.duration}ms (> 5s)`,
                recommendation: 'Check for infinite loops or heavy operations'
            });
        }

        // Анализ количества действий
        if (session.actions.length > 50) {
            analysis.issues.push({
                type: 'spam',
                severity: 'medium',
                message: `${session.actions.length} actions detected`,
                recommendation: 'Check for event bubbling or multiple handlers'
            });
        }

        // Анализ ошибок
        if (session.errors.length > 0) {
            analysis.issues.push({
                type: 'errors',
                severity: 'high',
                message: `${session.errors.length} errors occurred`,
                recommendation: 'Fix JavaScript errors first'
            });
        }

        // Анализ изменений состояния
        if (session.stateChanges.length === 0 && session.actions.length > 0) {
            analysis.warnings.push({
                type: 'state',
                message: 'No state changes detected',
                recommendation: 'Check if state updates are working'
            });
        }

        // Анализ конкретных проблем
        this.analyzeSpecificIssues(session, analysis);

        return analysis;
    }

    analyzeSpecificIssues(session, analysis) {
        // Проблема с palette-toggle-btn
        const paletteActions = session.actions.filter(a => 
            a.message?.includes('Palette toggle') || 
            a.element?.className?.includes('palette-toggle-btn')
        );

        if (paletteActions.length > 0) {
            const hasStateChanges = session.stateChanges.some(change => 
                change.module?.includes('appearance') || 
                change.function?.includes('togglePalette')
            );

            if (!hasStateChanges) {
                analysis.issues.push({
                    type: 'palette-toggle',
                    severity: 'high',
                    message: 'Palette toggle clicked but no state changes',
                    recommendation: 'Check togglePalette function and event handlers'
                });
            }
        }

        // Проблема с выбором цвета
        const colorActions = session.actions.filter(a => 
            a.message?.includes('Color') || 
            a.element?.className?.includes('color-option')
        );

        if (colorActions.length > 0) {
            const hasStateChanges = session.stateChanges.some(change => 
                change.changes?.spheres || 
                change.changes?.body
            );

            if (!hasStateChanges) {
                analysis.issues.push({
                    type: 'color-selection',
                    severity: 'medium',
                    message: 'Color selected but no state changes',
                    recommendation: 'Check color selection handlers'
                });
            }
        }

        // Проблема с выбором микрофона
        const micActions = session.actions.filter(a => 
            a.message?.includes('Microphone Selection')
        );

        if (micActions.length > 0) {
            const hasStateChanges = session.stateChanges.some(change => 
                change.changes?.variant || 
                change.changes?.model
            );

            if (!hasStateChanges) {
                analysis.issues.push({
                    type: 'microphone-selection',
                    severity: 'high',
                    message: 'Microphone selected but no state changes',
                    recommendation: 'Check variant selection handlers'
                });
            }
        }
    }

    // === ЭКСПОРТ ЛОГОВ С АНАЛИЗОМ ===
    
    exportSessionLog(sessionName) {
        const sessionData = this.sessionLogs.get(sessionName);
        if (!sessionData) return;

        const exportData = {
            sessionName: sessionName,
            timestamp: Date.now(),
            session: sessionData.session,
            analysis: sessionData.analysis,
            summary: this.createSummary(sessionData)
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-analysis-${sessionName.replace(/\s+/g, '_')}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    createSummary(sessionData) {
        const { session, analysis } = sessionData;
        
        return {
            actionName: session.name,
            duration: `${session.duration}ms`,
            totalActions: session.actions.length,
            totalErrors: session.errors.length,
            stateChanges: session.stateChanges.length,
            issuesCount: analysis.issues.length,
            warningsCount: analysis.warnings.length,
            severity: analysis.issues.length > 0 ? 'FAILED' : 'PASSED',
            mainIssue: analysis.issues[0]?.message || 'No issues detected'
        };
    }

    // === UI АНАЛИЗАТОРА ===
    
    setupAnalyzerUI() {
        const analyzerContainer = document.createElement('div');
        analyzerContainer.id = 'debug-analyzer';
        analyzerContainer.innerHTML = `
            <div class="analyzer-header">
                <h4>🔍 Debug Analyzer</h4>
                <div class="analyzer-controls">
                    <button id="analyzer-toggle" class="analyzer-btn">Show</button>
                    <button id="analyzer-clear" class="analyzer-btn">Clear</button>
                    <button id="analyzer-export-all" class="analyzer-btn">Export All</button>
                </div>
            </div>
            <div class="analyzer-content" id="analyzer-content" style="display: none;">
                <div class="analyzer-section">
                    <h5>📝 Quick Actions</h5>
                    <div class="quick-actions">
                        <button class="action-btn" data-action="Palette Toggle">🎨 Palette</button>
                        <button class="action-btn" data-action="Color Selection">🎨 Color</button>
                        <button class="action-btn" data-action="Microphone Selection">🎤 Microphone</button>
                        <button class="action-btn" data-action="RAL Color">🎨 RAL</button>
                        <button class="action-btn" data-action="Logo Upload">📤 Logo</button>
                        <button class="action-btn" data-action="Logo Movement">🔄 Move Logo</button>
                    </div>
                </div>
                <div class="analyzer-section">
                    <h5>📊 Session History</h5>
                    <div id="session-history" class="session-list"></div>
                </div>
                <div class="analyzer-section">
                    <h5>⚠️ Issues Summary</h5>
                    <div id="issues-summary" class="issues-list"></div>
                </div>
            </div>
        `;

        // Стили
        const style = document.createElement('style');
        style.textContent = `
            #debug-analyzer {
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 350px;
                background: #2a2a2a;
                color: #fff;
                border: 2px solid #444;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                z-index: 10001;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            }
            .analyzer-header {
                padding: 8px;
                background: #333;
                border-bottom: 1px solid #444;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .analyzer-header h4 {
                margin: 0;
                font-size: 12px;
            }
            .analyzer-controls {
                display: flex;
                gap: 4px;
            }
            .analyzer-btn {
                padding: 3px 6px;
                background: #555;
                color: #fff;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 9px;
            }
            .analyzer-btn:hover {
                background: #666;
            }
            .analyzer-content {
                max-height: 300px;
                overflow-y: auto;
                padding: 8px;
            }
            .analyzer-section {
                margin-bottom: 12px;
                padding: 8px;
                background: #333;
                border-radius: 4px;
            }
            .analyzer-section h5 {
                margin: 0 0 8px 0;
                font-size: 11px;
                color: #4CAF50;
            }
            .quick-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px;
            }
            .action-btn {
                padding: 6px 4px;
                background: #444;
                color: #fff;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 9px;
                text-align: left;
            }
            .action-btn:hover {
                background: #555;
            }
            .session-list, .issues-list {
                max-height: 100px;
                overflow-y: auto;
            }
            .session-item {
                padding: 4px;
                margin: 2px 0;
                background: #444;
                border-radius: 3px;
                font-size: 10px;
            }
            .session-item.passed {
                border-left: 3px solid #4CAF50;
            }
            .session-item.failed {
                border-left: 3px solid #f44336;
            }
            .issue-item {
                padding: 4px;
                margin: 2px 0;
                background: #444;
                border-radius: 3px;
                font-size: 10px;
                border-left: 3px solid #ff9800;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(analyzerContainer);
        this.setupAnalyzerListeners();
    }

    setupAnalyzerListeners() {
        document.getElementById('analyzer-toggle').addEventListener('click', () => {
            const content = document.getElementById('analyzer-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('analyzer-clear').addEventListener('click', () => {
            this.sessionLogs.clear();
            this.updateSessionHistory();
            this.updateIssuesSummary();
        });

        document.getElementById('analyzer-export-all').addEventListener('click', () => {
            this.exportAllSessions();
        });

        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const actionName = btn.dataset.action;
                this.startActionLog(actionName);
                
                // Автоматически завершаем через 5 секунд
                setTimeout(() => {
                    this.endActionLog();
                }, 5000);
            });
        });
    }

    setupHotkeys() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+A - toggle analyzer
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                const content = document.getElementById('analyzer-content');
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            }
            
            // Ctrl+Shift+S - start/stop session
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                if (this.currentSession) {
                    this.endActionLog();
                } else {
                    this.startActionLog('Manual Session');
                }
            }
        });
    }

    updateSessionHistory() {
        const historyContainer = document.getElementById('session-history');
        if (!historyContainer) return;

        historyContainer.innerHTML = '';
        
        this.sessionLogs.forEach((data, name) => {
            const summary = this.createSummary(data);
            const item = document.createElement('div');
            item.className = `session-item ${summary.severity.toLowerCase()}`;
            item.innerHTML = `
                <strong>${summary.actionName}</strong><br>
                Duration: ${summary.duration}<br>
                Issues: ${summary.issuesCount}<br>
                ${summary.mainIssue}
            `;
            historyContainer.appendChild(item);
        });
    }

    updateIssuesSummary() {
        const issuesContainer = document.getElementById('issues-summary');
        if (!issuesContainer) return;

        const allIssues = [];
        this.sessionLogs.forEach(data => {
            allIssues.push(...data.analysis.issues);
        });

        issuesContainer.innerHTML = '';
        
        // Группируем проблемы по типу
        const issuesByType = {};
        allIssues.forEach(issue => {
            if (!issuesByType[issue.type]) {
                issuesByType[issue.type] = [];
            }
            issuesByType[issue.type].push(issue);
        });

        Object.entries(issuesByType).forEach(([type, issues]) => {
            const item = document.createElement('div');
            item.className = 'issue-item';
            item.innerHTML = `
                <strong>${type}:</strong> ${issues.length} occurrences<br>
                <small>${issues[0].recommendation}</small>
            `;
            issuesContainer.appendChild(item);
        });
    }

    exportAllSessions() {
        const allData = {
            timestamp: Date.now(),
            sessions: Object.fromEntries(this.sessionLogs),
            summary: {
                totalSessions: this.sessionLogs.size,
                totalIssues: Array.from(this.sessionLogs.values()).reduce((sum, data) => sum + data.analysis.issues.length, 0),
                commonIssues: this.getCommonIssues()
            }
        };

        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-analysis-complete-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    getCommonIssues() {
        const issueCounts = {};
        
        this.sessionLogs.forEach(data => {
            data.analysis.issues.forEach(issue => {
                if (!issueCounts[issue.type]) {
                    issueCounts[issue.type] = 0;
                }
                issueCounts[issue.type]++;
            });
        });

        return Object.entries(issueCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([type, count]) => ({ type, count }));
    }
}

// Создаем глобальный экземпляр
window.debugAnalyzer = new DebugAnalyzer();

// Интеграция с дебаггером V2
if (window.debuggerV2) {
    const originalTrackUserAction = window.debuggerV2.trackUserAction;
    
    window.debuggerV2.trackUserAction = function(element, action, data) {
        // Определяем действие
        const detectedAction = window.debugAnalyzer.detectAction(element);
        
        // Если нет активной сессии, начинаем новую
        if (!window.debugAnalyzer.currentSession) {
            window.debugAnalyzer.startActionLog(detectedAction);
        }
        
        // Добавляем действие в сессию
        if (window.debugAnalyzer.currentSession) {
            window.debugAnalyzer.currentSession.actions.push({
                timestamp: Date.now(),
                message: detectedAction,
                element: {
                    tagName: element.tagName,
                    className: element.className,
                    textContent: element.textContent?.trim()
                },
                data: data
            });
        }
        
        // Вызываем оригинальный метод
        return originalTrackUserAction.call(this, element, action, data);
    };
}

export default window.debugAnalyzer;
