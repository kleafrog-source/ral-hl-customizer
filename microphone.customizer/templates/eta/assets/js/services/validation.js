export function initValidation() {
    const fields = {
        'input-lastname': (val) => val.length >= 2,
        'input-name': (val) => val.length >= 2,
        'input-phone': (val) => /^[\d\+\-\(\)\s]{6,}$/.test(val),
        'input-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        'input-country': (val) => val.length === 0 || val.length >= 2,
        'input-city': (val) => val.length === 0 || val.length >= 2,
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
    if (!el) return false;

    const isValid = validator(el.value);

    if (!isValid && el.value.length > 0) {
        el.classList.add('error');
    } else {
        el.classList.remove('error');
    }
    return isValid;
}

export function validateForm() {
    const fields = {
        'input-lastname': (val) => val.length >= 2,
        'input-name': (val) => val.length >= 2,
        'input-phone': (val) => /^[\d\+\-\(\)\s]{6,}$/.test(val),
        'input-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        'input-country': (val) => val.length === 0 || val.length >= 2,
        'input-city': (val) => val.length === 0 || val.length >= 2,
    };

    let isFormValid = true;
    Object.keys(fields).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (!validateField(el, fields[id])) {
                isFormValid = false;
                if (el.value.length === 0 && (id === 'input-lastname' || id === 'input-name' || id === 'input-phone' || id === 'input-email')) {
                    el.classList.add('error');
                }
            }
        }
    });
    return isFormValid;
}
