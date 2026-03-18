import { stateManager } from '../core/state.js';

function base64ToBlob(base64String) {
    try {
        const parts = base64String.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uint8View = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uint8View[i] = raw.charCodeAt(i);
        }

        return new Blob([uint8View], { type: contentType });
    } catch (error) {
        console.error('Error converting base64 to blob:', error);
        return null;
    }
}

function svgToBlob(svgString) {
    try {
        return new Blob([svgString], { type: 'image/svg+xml' });
    } catch (error) {
        console.error('Error converting SVG to blob:', error);
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
    const currentState = stateManager.get();
    const caseState = currentState.case || {};
    const caseOffset = caseState.logoOffsetMM || { top: 0, left: 0 };
    const woodcaseDesk = `Ш:${caseState.logoWidthMM || 0}мм, Сверху:${caseOffset.top || 0}мм, Слева:${caseOffset.left || 0}мм`;

    formData.set('form_text_24', clientData.name || '');
    formData.set('form_text_25', clientData.lastname || '');
    formData.set('form_text_26', clientData.city || '');
    formData.set('form_text_27', clientData.country || '');
    formData.set('form_text_28', clientData.email || '');
    formData.set('form_text_29', clientData.phone || '');
    formData.set('form_text_30', clientData.comment || '');

    formData.set('form_text_31', currentState.currentModelCode || '');
    formData.set('form_text_32', currentState.spheres?.variantName || currentState.spheres?.variant || '');
    formData.set('form_text_33', currentState.body?.variantName || currentState.body?.variant || '');
    formData.set('form_text_34', currentState.logo?.variantName || currentState.logo?.variant || '');
    formData.set('form_text_35', currentState.logobg?.variantName || currentState.logobg?.variant || '');
    formData.set('form_text_36', woodcaseDesk);
    formData.set(
        'form_text_37',
        currentState.shockmount?.enabled
            ? (currentState.shockmount?.variantName || currentState.shockmount?.variant || 'Enabled')
            : 'Disabled'
    );
    formData.set('form_text_38', currentState.shockmountPins?.variantName || currentState.shockmountPins?.variant || '');

    const totalEl = document.getElementById('total-price');
    const totalPriceText = totalEl ? totalEl.textContent : '0';
    formData.set('form_text_39', totalPriceText);

    const configJson = JSON.stringify({
        modelCode: currentState.currentModelCode,
        options: {
            spheres: currentState.spheres?.variant,
            body: currentState.body?.variant,
            logo: currentState.logo?.variant,
            logobg: currentState.logobg?.variant,
            case: currentState.case?.variant,
            shockmount: currentState.shockmount?.variant,
            shockmountPins: currentState.shockmountPins?.variant
        },
        woodCase: currentState.case
    });
    formData.set('form_textarea_48', configJson);

    const svgElement = document.getElementById('microphone-svg-container')?.innerHTML;
    if (svgElement) {
        const previewBlob = svgToBlob(svgElement);
        if (previewBlob) {
            formData.delete('form_file_47');
            formData.append('form_file_47', previewBlob, 'preview.svg');
        }
    }

    if (currentState.case?.customLogo) {
        let caseBlob = null;
        const caseData = currentState.case.customLogo;

        if (typeof caseData === 'string' && caseData.includes(';base64,')) {
            caseBlob = base64ToBlob(caseData);
        } else if (typeof caseData === 'string' && caseData.trim().startsWith('<svg')) {
            caseBlob = svgToBlob(caseData);
        }

        if (caseBlob) {
            formData.delete('form_file_43');
            formData.append('form_file_43', caseBlob, `case_logo${caseBlob.type.includes('svg') ? '.svg' : '.png'}`);
        }
    }

    if (currentState.logo?.customLogoData) {
        let logoBlob = null;
        const logoData = currentState.logo.customLogoData;

        if (typeof logoData === 'string' && logoData.includes(';base64,')) {
            logoBlob = base64ToBlob(logoData);
        } else if (typeof logoData === 'string' && logoData.trim().startsWith('<svg')) {
            logoBlob = svgToBlob(logoData);
        }

        if (logoBlob) {
            formData.delete('form_file_44');
            formData.append('form_file_44', logoBlob, `mic_logo${logoBlob.type.includes('svg') ? '.svg' : '.png'}`);
        }
    }

    try {
        const response = await fetch(bitrixForm.action, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            return { success: true };
        }

        throw new Error('Server returned ' + response.status);
    } catch (error) {
        console.error('Error sending order:', error);
        throw error;
    }
}
