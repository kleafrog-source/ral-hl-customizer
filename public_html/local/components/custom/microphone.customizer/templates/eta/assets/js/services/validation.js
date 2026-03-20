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

const PRIVACY_CHECKBOX_ID = 'input-privacy-consent';

function getValidationElement(id) {
    return document.getElementById(id);
}

function getPrivacyConsentCheckbox() {
    return document.getElementById(PRIVACY_CHECKBOX_ID);
}

function getPrivacyConsentGroup() {
    return document.getElementById('privacy-consent-group');
}

export function hasPrivacyConsent() {
    return !!getPrivacyConsentCheckbox()?.checked;
}

export function validatePrivacyConsent() {
    const checkbox = getPrivacyConsentCheckbox();
    const group = getPrivacyConsentGroup();
    const isValid = !!checkbox?.checked;

    if (group) {
        group.classList.toggle('error', !isValid);
    }

    return isValid;
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

    const privacyCheckbox = getPrivacyConsentCheckbox();
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', validatePrivacyConsent);
    }
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

    if (!validatePrivacyConsent()) {
        isFormValid = false;
    }

    return isFormValid;
}
