import { stateManager } from '../core/state.js';
import { calculateTotal, getBreakdown } from '../modules/price-calculator.js';

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

function buildBlobFromData(rawData) {
    if (typeof rawData !== 'string') {
        return null;
    }

    if (rawData.includes(';base64,')) {
        return base64ToBlob(rawData);
    }

    if (rawData.trim().startsWith('<svg')) {
        return svgToBlob(rawData);
    }

    return null;
}

function appendFileField(formData, fieldName, blob, fileBaseName) {
    if (!blob) {
        return;
    }

    const extension = blob.type.includes('svg') ? '.svg' : '.png';
    formData.delete(fieldName);
    formData.append(fieldName, blob, `${fileBaseName}${extension}`);
}

function setClientFields(formData, clientData) {
    formData.set('form_text_24', clientData.name || '');
    formData.set('form_text_25', clientData.lastname || '');
    formData.set('form_text_26', clientData.city || '');
    formData.set('form_text_27', clientData.country || '');
    formData.set('form_text_28', clientData.email || '');
    formData.set('form_text_29', clientData.phone || '');
    formData.set('form_text_30', clientData.comment || '');
}

function setConfigurationFields(formData, currentState, woodcaseDesk) {
    const useCustomMicLogo = !!currentState.logo?.useCustom;
    formData.set('form_text_31', currentState.currentModelCode || '');
    formData.set('form_text_32', currentState.spheres?.variantName || currentState.spheres?.variant || '');
    formData.set('form_text_33', currentState.body?.variantName || currentState.body?.variant || '');
    formData.set('form_text_34', useCustomMicLogo ? (currentState.miclogoState || '') : (currentState.logo?.variantName || currentState.logo?.variant || ''));
    formData.set('form_text_35', useCustomMicLogo ? '' : (currentState.logobg?.variantName || currentState.logobg?.variant || ''));
    formData.set('form_text_36', woodcaseDesk);
    formData.set(
        'form_text_37',
        currentState.shockmount?.enabled
            ? (currentState.shockmount?.variantName || currentState.shockmount?.variant || 'Enabled')
            : 'Disabled'
    );
    formData.set('form_text_38', currentState.shockmountPins?.variantName || currentState.shockmountPins?.variant || '');
}

function buildWoodcaseDesk(caseState = {}) {
    if (!caseState.laserEngravingEnabled) {
        return '';
    }

    const caseOffset = caseState.logoOffsetMM || { top: 0, left: 0 };
    return `Ш:${caseState.logoWidthMM || 0}мм, Сверху:${caseOffset.top || 0}мм, Слева:${caseOffset.left || 0}мм`;
}

function formatRubles(value) {
    return `${(Number(value) || 0).toLocaleString('ru-RU')} ₽`;
}

function buildDetailedPriceString(currentState) {
    const breakdown = getBreakdown(currentState);
    const total = calculateTotal(currentState);
    const parts = [
        ['база', breakdown.base],
        ['силуэт', breakdown.spheres],
        ['корпус', breakdown.body],
        ['логотип', breakdown.logo],
        ['фон логотипа', breakdown.logobg],
        ['футляр', breakdown.case],
        ['подвес', breakdown.shockmountBase],
        ['цвет каркаса', breakdown.shockmountFrame],
        ['цвет пинов', breakdown.shockmountPins]
    ].filter(([, value], index) => index === 0 || (Number(value) || 0) > 0);

    return `Итог: ${formatRubles(total)} (${parts.map(([label, value]) => `${label}: ${formatRubles(value)}`).join(' + ')})`;
}

function buildConfigPayload(currentState) {
    const useCustomMicLogo = !!currentState.logo?.useCustom;
    const woodCaseState = currentState.case?.laserEngravingEnabled
        ? currentState.case
        : {
            ...(currentState.case || {}),
            customLogo: null
        };

    return {
        modelCode: currentState.currentModelCode,
        options: {
            spheres: currentState.spheres?.variant,
            body: currentState.body?.variant,
            logo: useCustomMicLogo ? null : currentState.logo?.variant,
            logobg: useCustomMicLogo ? null : currentState.logobg?.variant,
            case: currentState.case?.variant,
            shockmount: currentState.shockmount?.variant,
            shockmountPins: currentState.shockmountPins?.variant
        },
        micLogo: currentState.logo?.useCustom
            ? {
                summary: currentState.miclogoState,
                transform: currentState.logo?.customLogoTransform,
                metrics: currentState.logo?.customLogoMetrics
            }
            : null,
        woodCase: woodCaseState
    };
}

export async function sendOrder(clientData) {
    const bitrixForm = document.querySelector('form[name="SIMPLE_FORM_1"]');
    if (!bitrixForm) {
        console.error('Bitrix form not found');
        return;
    }

    const formData = new FormData(bitrixForm);
    const currentState = stateManager.get();
    const woodcaseDesk = buildWoodcaseDesk(currentState.case);

    setClientFields(formData, clientData);
    setConfigurationFields(formData, currentState, woodcaseDesk);
    formData.set('form_text_39', buildDetailedPriceString(currentState));
    formData.set('form_textarea_48', JSON.stringify(buildConfigPayload(currentState)));

    const svgElement = document.getElementById('microphone-svg-container')?.innerHTML;
    if (svgElement) {
        const previewBlob = svgToBlob(svgElement);
        appendFileField(formData, 'form_file_47', previewBlob, 'preview');
    }

    if (currentState.case?.laserEngravingEnabled && currentState.case?.customLogo) {
        const caseBlob = buildBlobFromData(currentState.case.customLogo);
        appendFileField(formData, 'form_file_43', caseBlob, 'case_logo');
    }

    if (currentState.logo?.customLogoData) {
        const logoBlob = buildBlobFromData(currentState.logo.customLogoData);
        appendFileField(formData, 'form_file_44', logoBlob, 'mic_logo');
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
