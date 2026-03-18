import { debugWarn } from '../utils/debug.js';

const FIELD_VALIDATORS = {
    'input-lastname': (val) => val.length >= 2,
    'input-name': (val) => val.length >= 2,
    'input-phone': (val) => /^[\d\+\-\(\)\s]{6,}$/.test(val),
    'input-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    'input-country': (val) => val.length === 0 || val.length >= 2,
    'input-city': (val) => val.length === 0 || val.length >= 2,
};

const REQUIRED_FIELDS = new Set([
    'input-lastname',
    'input-name',
    'input-phone',
    'input-email',
]);

function getValidationElement(id) {
    return document.getElementById(id);
}

export function initValidation() {
    Object.entries(FIELD_VALIDATORS).forEach(([id, validator]) => {
        const el = getValidationElement(id);
        if (!el) {
            debugWarn(`Element with id "${id}" not found for validation`);
            return;
        }

        const validate = () => validateField(el, validator);
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
    let isFormValid = true;
    Object.entries(FIELD_VALIDATORS).forEach(([id, validator]) => {
        const el = getValidationElement(id);
        if (el) {
            if (!validateField(el, validator)) {
                isFormValid = false;
                if (el.value.length === 0 && REQUIRED_FIELDS.has(id)) {
                    el.classList.add('error');
                }
            }
        }
    });
    return isFormValid;
}
