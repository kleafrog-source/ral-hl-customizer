/**
 * Интеграция оптимизированного дебаггера V2 с основными модулями
 */

import debuggerV2 from './debugger-v2.js';
import { currentState } from './state.js';

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ДЕБАГГА V2 ===

window.debugCustomizerV2 = {
    // Включение/выключение
    enable: () => debuggerV2.enable(),
    disable: () => debuggerV2.disable(),
    toggle: () => {
        if (debuggerV2.isEnabled) {
            debuggerV2.disable();
        } else {
            debuggerV2.enable();
        }
    },
    
    // Управление режимами
    setMode: (mode) => debuggerV2.setLogMode(mode),
    
    // Отслеживание действий
    trackAction: (element, action, data) => {
        debuggerV2.trackUserAction(element, action, data);
    },
    
    // Отслеживание изменений состояния
    trackState: (module, func, before, after) => {
        debuggerV2.trackStateChange(module, func, before, after);
    },
    
    // Логирование
    log: (level, message, data) => {
        debuggerV2.log(level, message, data);
    },
    
    // Получение текущего состояния
    getCurrentState: () => ({ ...currentState }),
    
    // Получение отчета о производительности
    getPerformanceReport: () => {
        return debuggerV2.performanceCounters;
    }
};

// === ОПТИМИЗИРОВАННОЕ ДОБАВЛЕНИЕ DEBUG ID ===

function addDebugIds() {
    const elements = document.querySelectorAll('.variant-button, .palette-toggle-btn, .color-option, .menu-item');
    let counter = 1;
    
    elements.forEach(element => {
        if (!element.hasAttribute('data-debug-id')) {
            const debugId = `elem_${counter++}`;
            element.setAttribute('data-debug-id', debugId);
            
            // Добавляем отслеживание кликов с оптимизацией
            element.addEventListener('click', (e) => {
                if (debuggerV2.isEnabled) {
                    debuggerV2.trackUserAction(element, 'click', {
                        debugId: debugId,
                        text: element.textContent?.trim(),
                        variant: element.dataset.variant,
                        varnum: element.dataset.varnum,
                        section: element.dataset.section
                    });
                }
            });
        }
    });
}

// === ИНИЦИАЛИЗАЦИЯ ОПТИМИЗИРОВАННОЙ ИНТЕГРАЦИИ ===

document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки DOM
    setTimeout(() => {
        addDebugIds();
        
        // Оптимизированный наблюдатель за DOM
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && 
                    (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                addDebugIds();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D - toggle debugger
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                window.debugCustomizerV2.toggle();
            }
            
            // Ctrl+Shift+M - switch log mode
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                const modes = ['minimal', 'normal', 'verbose'];
                const currentIndex = modes.indexOf(debuggerV2.logMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                window.debugCustomizerV2.setMode(nextMode);
            }
            
            // Ctrl+Shift+E - export logs
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                debuggerV2.exportLogs();
            }
            
            // Ctrl+Shift+C - clear logs
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                debuggerV2.clearLogs();
            }
            
            // Ctrl+Shift+P - performance report
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                debuggerV2.showPerformanceReport();
            }
        });
        
        console.log('🔧 Debug Integration V2 loaded');
        console.log('🎯 Hotkeys:');
        console.log('  Ctrl+Shift+D - Toggle debugger');
        console.log('  Ctrl+Shift+M - Switch log mode');
        console.log('  Ctrl+Shift+E - Export logs');
        console.log('  Ctrl+Shift+C - Clear logs');
        console.log('  Ctrl+Shift+P - Performance report');
    }, 1000);
});

// === ОПТИМИЗИРОВАННЫЕ ОБЕРТКИ ДЛЯ ОСНОВНЫХ ФУНКЦИЙ ===

window.debugWrapV2 = {
    updateUI: (originalFunc) => {
        return function(...args) {
            if (debuggerV2.logMode === 'minimal') {
                return originalFunc.apply(this, args);
            }
            
            const before = window.debugCustomizerV2.getCurrentState();
            try {
                const result = originalFunc.apply(this, args);
                const after = window.debugCustomizerV2.getCurrentState();
                window.debugCustomizerV2.trackState('ui-core', 'updateUI', before, after);
                return result;
            } catch (error) {
                window.debugCustomizerV2.log('ERROR', 'updateUI failed', { error: error.message, args });
                throw error;
            }
        };
    },
    
    setState: (originalFunc) => {
        return function(...args) {
            if (debuggerV2.logMode === 'minimal') {
                return originalFunc.apply(this, args);
            }
            
            const before = window.debugCustomizerV2.getCurrentState();
            try {
                const result = originalFunc.apply(this, args);
                const after = window.debugCustomizerV2.getCurrentState();
                window.debugCustomizerV2.trackState('state', 'setState', before, after);
                return result;
            } catch (error) {
                window.debugCustomizerV2.log('ERROR', 'setState failed', { error: error.message, args });
                throw error;
            }
        };
    },
    
    togglePalette: (originalFunc) => {
        return function(...args) {
            debuggerV2.performanceCounters.togglePalette++;
            
            if (debuggerV2.logMode === 'minimal') {
                return originalFunc.apply(this, args);
            }
            
            try {
                window.debugCustomizerV2.log('INFO', 'togglePalette called', { args });
                const result = originalFunc.apply(this, args);
                window.debugCustomizerV2.log('INFO', 'togglePalette completed', { result });
                return result;
            } catch (error) {
                window.debugCustomizerV2.log('ERROR', 'togglePalette failed', { error: error.message, args });
                throw error;
            }
        };
    },
    
    setCase: (originalFunc) => {
        return function(...args) {
            debuggerV2.performanceCounters.setCase++;
            
            if (debuggerV2.logMode === 'minimal') {
                return originalFunc.apply(this, args);
            }
            
            try {
                window.debugCustomizerV2.log('INFO', 'setCase called', { args });
                const result = originalFunc.apply(this, args);
                window.debugCustomizerV2.log('INFO', 'setCase completed', { result });
                return result;
            } catch (error) {
                window.debugCustomizerV2.log('ERROR', 'setCase failed', { error: error.message, args });
                throw error;
            }
        };
    }
};

// Создаем backwards compatibility
window.debugCustomizer = window.debugCustomizerV2;
window.debugWrap = window.debugWrapV2;

export default window.debugCustomizerV2;
