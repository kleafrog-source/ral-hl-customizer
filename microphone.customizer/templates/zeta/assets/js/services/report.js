import { stateManager } from '../core/state.js';

// Функция для конвертации Base64 в Blob
function base64ToBlob(base64String) {
    try {
        const parts = base64String.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new ArrayBuffer(rawLength);
        const uint8View = new Uint8Array(uInt8Array);

        for (let i = 0; i < rawLength; ++i) {
            uint8View[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    } catch (e) {
        console.error('Error converting base64 to blob:', e);
        return null;
    }
}

// Функция для конвертации SVG в Blob
function svgToBlob(svgString) {
    try {
        return new Blob([svgString], { type: 'image/svg+xml' });
    } catch (e) {
        console.error('Error converting SVG to blob:', e);
        return null;
    }
}

export async function sendOrder(clientData) {
    const bitrixForm = document.querySelector('form[name="SIMPLE_FORM_1"]');
    if (!bitrixForm) {
        console.error('Bitrix form not found');
        return;
    }

    const formData = new FormData(bitrixForm);
    
    // Получаем актуальное состояние из stateManager
    const currentState = stateManager.get();

    // 1. Добавляем текстовые данные (маппинг согласно ТЗ)
    formData.set('form_text_24', clientData.name || '');
    formData.set('form_text_25', clientData.lastname || '');
    formData.set('form_text_26', clientData.city || '');
    formData.set('form_text_27', clientData.country || '');
    formData.set('form_text_28', clientData.email || '');
    formData.set('form_text_29', clientData.phone || '');
    formData.set('form_text_30', clientData.comment || '');

    formData.set('form_text_31', state.currentModelCode || '');
    formData.set('form_text_32', state.spheres?.variantName || state.spheres?.variant || '');
    formData.set('form_text_33', state.body?.variantName || state.body?.variant || '');
    formData.set('form_text_34', state.logo?.variantName || state.logo?.variant || '');
    formData.set('form_text_35', state.logobg?.variantName || state.logobg?.variant || '');
    formData.set('form_text_36', state.case?.variantName || state.case?.variant || '');
    formData.set('form_text_37', state.shockmount?.enabled ? (state.shockmount?.variantName || state.shockmount?.variant || 'Enabled') : 'Disabled');
    formData.set('form_text_38', state.shockmountPins?.variantName || state.shockmountPins?.variant || '');

    // Итоговая цена
    const totalEl = document.getElementById('total-price');
    const totalPriceText = totalEl ? totalEl.textContent : '0';
    formData.set('form_text_39', totalPriceText);

    // JSON конфигурация
    const configJson = JSON.stringify({
        modelCode: state.currentModelCode,
        options: {
            spheres: state.spheres?.variant,
            body: state.body?.variant,
            logo: state.logo?.variant,
            logobg: state.logobg?.variant,
            case: state.case?.variant,
            shockmount: state.shockmount?.variant,
            shockmountPins: state.shockmountPins?.variant
        },
        woodCase: state.case
    });
    formData.set('form_textarea_48', configJson);

    // 2. Добавляем ФАЙЛЫ
    // Поле 47 - PREVIEW_MIC_CUSTOM_FORM
    const svgElement = document.getElementById('microphone-svg-container')?.innerHTML;
    if (svgElement) {
        const previewBlob = svgToBlob(svgElement);
        if (previewBlob) {
            formData.append('form_file_47', previewBlob, 'preview.svg');
        }
    }

    // Поле 43 - WOODCASE_IMAGE_FORM (изображение для гравировки на футляре)
    if (currentState.case?.customLogo) {
        let caseBlob;
        const data = currentState.case.customLogo;
        if (typeof data === 'string' && data.includes(';base64,')) {
            caseBlob = base64ToBlob(data);
        } else if (typeof data === 'string' && data.trim().startsWith('<svg')) {
            caseBlob = svgToBlob(data);
        }
        if (caseBlob) {
            formData.append('form_file_43', caseBlob, 'case_logo' + (caseBlob.type.includes('svg') ? '.svg' : '.png'));
        }
    }

    // Поле 44 - MIC_LOGO_CUSTOM_FORM
    if (currentState.logo?.customLogoData) {
        let logoBlob;
        const data = currentState.logo.customLogoData;
        if (typeof data === 'string' && data.includes(';base64,')) {
            logoBlob = base64ToBlob(data);
        } else if (typeof data === 'string' && data.trim().startsWith('<svg')) {
            logoBlob = svgToBlob(data);
        }
        if (logoBlob) {
            formData.append('form_file_44', logoBlob, 'mic_logo' + (logoBlob.type.includes('svg') ? '.svg' : '.png'));
        }
    }

    console.log('Отправляем форму с файлами...');

    try {
        const response = await fetch(bitrixForm.action, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            return { success: true };
        } else {
            throw new Error('Server returned ' + response.status);
        }
    } catch (e) {
        console.error('Error sending order:', e);
        throw e;
    }
}
