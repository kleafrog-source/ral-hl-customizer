/**
 * Интеграция дебаггера с основными модулями
 */

import customizerDebugger from './debugger.js';
import { currentState } from './state.js';

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ДЕБАГГА ===

window.debugCustomizer = {
    // Включение/выключение дебаггера
    enable: () => customizerDebugger.enable(),
    disable: () => customizerDebugger.disable(),
    toggle: () => {
        if (customizerDebugger.isEnabled) {
            customizerDebugger.disable();
        } else {
            customizerDebugger.enable();
        }
    },
    
    // Отслеживание действий
    trackAction: (element, action, data) => {
        customizerDebugger.trackUserAction(element, action, data);
    },
    
    // Отслеживание изменений состояния
    trackState: (module, func, before, after) => {
        customizerDebugger.trackStateChange(module, func, before, after);
    },
    
    // Логирование
    log: (level, message, data) => {
        customizerDebugger.log(level, message, data);
    },
    
    // Получение текущего состояния
    getCurrentState: () => ({ ...currentState }),
    
    // Поиск элемента по уникальному ID
    findElement: (id) => {
        return document.querySelector(`[data-debug-id="${id}"]`);
    }
};

// === АВТОМАТИЧЕСКОЕ ДОБАВЛЕНИЕ DEBUG ID ===

function addDebugIds() {
    const elements = document.querySelectorAll('.variant-button, .palette-toggle-btn, .color-option, .menu-item');
    let counter = 1;
    
    elements.forEach(element => {
        if (!element.hasAttribute('data-debug-id')) {
            const debugId = `element_${counter++}`;
            element.setAttribute('data-debug-id', debugId);
            
            // Добавляем отслеживание кликов
            element.addEventListener('click', (e) => {
                if (customizerDebugger.isEnabled) {
                    customizerDebugger.trackUserAction(element, 'click', {
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

// === ИНИЦИАЛИЗАЦИЯ ИНТЕГРАЦИИ ===

document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки DOM
    setTimeout(() => {
        addDebugIds();
        
        // Наблюдаем за изменениями DOM для новых элементов
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                addDebugIds();
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Добавляем глобальные горячие клавиши
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D - toggle debugger
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                window.debugCustomizer.toggle();
            }
            
            // Ctrl+Shift+E - export logs
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                customizerDebugger.exportLogs();
            }
            
            // Ctrl+Shift+C - clear logs
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                customizerDebugger.clearLogs();
            }
        });
        
        console.log('🔧 Debug Integration loaded. Use Ctrl+Shift+D to toggle debugger');
    }, 1000);
});

// === ОБЕРТКИ ДЛЯ ОСНОВНЫХ ФУНКЦИЙ ===

window.debugWrap = {
    updateUI: (originalFunc) => {
        return function(...args) {
            const before = window.debugCustomizer.getCurrentState();
            try {
                const result = originalFunc.apply(this, args);
                const after = window.debugCustomizer.getCurrentState();
                window.debugCustomizer.trackState('ui-core', 'updateUI', before, after);
                return result;
            } catch (error) {
                window.debugCustomizer.log('ERROR', 'updateUI failed', { error: error.message, args });
                throw error;
            }
        };
    },
    
    setState: (originalFunc) => {
        return function(...args) {
            const before = window.debugCustomizer.getCurrentState();
            try {
                const result = originalFunc.apply(this, args);
                const after = window.debugCustomizer.getCurrentState();
                window.debugCustomizer.trackState('state', 'setState', before, after);
                return result;
            } catch (error) {
                window.debugCustomizer.log('ERROR', 'setState failed', { error: error.message, args });
                throw error;
            }
        };
    },
    
    setCase: (originalFunc) => {
        return function(...args) {
            window.debugCustomizer.log('INFO', 'setCase called', { args });
            try {
                const result = originalFunc.apply(this, args);
                window.debugCustomizer.log('INFO', 'setCase completed', { result });
                return result;
            } catch (error) {
                window.debugCustomizer.log('ERROR', 'setCase failed', { error: error.message, args });
                throw error;
            }
        };
    }
};

export default window.debugCustomizer;
