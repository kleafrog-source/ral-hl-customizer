export function initValidation() {
    const fields = {
        'input-lastname': (val) => val.length >= 2,
        'input-name': (val) => val.length >= 2,
        'input-phone': (val) => /^[\d\+\-\(\)\s]{6,}$/.test(val),
        'input-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    };

    Object.keys(fields).forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Element with id "${id}" not found for validation`);
            return;
        }
        
        const validate = () => validateField(el, fields[id]);
        el.addEventListener('input', validate);
        el.addEventListener('blur', validate);
    });
}

export function validateField(el, validator) {
    if (!el) {
        console.warn('validateField: element is null');
        return false;
    }
    
    const fieldName = el.name || el.id || 'unknown';
    console.log('Проверяю поле:', fieldName);
    
    // Если валидатор не передан или не является функцией, считаем поле валидным
    if (!validator || typeof validator !== 'function') {
        console.warn(`Валидатор для поля "${fieldName}" не найден, считаем поле валидным`);
        el.classList.remove('error');
        console.log('Проверяю поле:', fieldName, 'Результат: true (валидатор отсутствует)');
        return true;
    }

    const isValid = validator(el.value);
    console.log('Проверяю поле:', fieldName, 'Результат:', isValid);
    
    if (!isValid && el.value.length > 0) {
        el.classList.add('error');
    } else {
        el.classList.remove('error');
    }
    return isValid;
}
