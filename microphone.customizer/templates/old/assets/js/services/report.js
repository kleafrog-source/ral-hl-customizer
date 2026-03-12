import { currentState } from '../state.js';
import { CONFIG, variantNames } from '../config.js';

// Функция для конвертации Base64 в Blob
function base64ToBlob(base64String) {
    try {
        // Регулярка теперь понимает svg+xml и другие форматы
        const parts = base64String.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
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
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        return blob;
    } catch (e) {
        console.error('Error converting SVG to blob:', e);
        return null;
    }
}

// Функция для создания SVG превью микрофона
function createMicrophonePreview() {
    const svgWrapper = document.getElementById('svg-wrapper');
    if (!svgWrapper || !svgWrapper.querySelector('svg')) return null;
    
    const svgClone = svgWrapper.querySelector('svg').cloneNode(true);
    svgClone.setAttribute('width', '200');
    svgClone.setAttribute('height', '150');
    svgClone.setAttribute('viewBox', '0 0 800 600');
    
    const svgString = new XMLSerializer().serializeToString(svgClone);
    return new Blob([svgString], { type: 'image/svg+xml' });
}

export async function sendOrder(clientData) {
    const bitrixForm = document.querySelector('form[name="SIMPLE_FORM_1"]');
    const formData = new FormData(bitrixForm); // Берем все скрытые поля и токены сразу

    // 1. Добавляем текстовые данные (используем те же ID, что сработали)
    formData.set('form_text_24', clientData.name || '');
    formData.set('form_text_25', clientData.lastname || '');
    formData.set('form_text_26', clientData.city || '');
    formData.set('form_text_27', clientData.country || '');
    formData.set('form_text_28', clientData.email || '');
    formData.set('form_text_29', clientData.phone || '');
    formData.set('form_text_30', clientData.comment || '');
    formData.set('form_text_31', `Модель: ${currentState.model} (${currentState.variant})`);
    
    // Сферы - правильные названия
    const sphereNames = {
        '1': 'Глубокий черный',
        '2': 'Классическая латунь', 
        '3': 'Сатинированная сталь'
    };
    
    let sphereValue;
    if (currentState.spheres.color) {
        // Если выбран цвет из палитры
        sphereValue = `RAL ${currentState.spheres.color}`;
    } else {
        // Если выбран стандартный вариант
        sphereValue = sphereNames[currentState.spheres.variant] || currentState.spheres.variant;
    }
    formData.set('form_text_32', sphereValue);
    
    // Корпус - правильные названия
    const bodyNames = {
        '1': 'Глубокий черный',
        '2': 'Классическая латунь',
        '3': 'Сатинированная сталь'
    };
    
    let bodyValue;
    if (currentState.body.color) {
        // Если выбран цвет из палитры
        bodyValue = `RAL ${currentState.body.color}`;
    } else {
        // Если выбран стандартный вариант
        bodyValue = bodyNames[currentState.body.variant] || currentState.body.variant;
    }
    formData.set('form_text_33', bodyValue);
    
    // Логотип тип
    const logoTypeText = currentState.logo.customLogo ? 'Кастомный логотип микрофона' : 'STANDARD';
    formData.set('form_text_34', logoTypeText);
    
    // Логотип фон - прочерк если кастомный логотип
    const logoBgText = currentState.logo.customLogo ? '-' : (currentState.logo.bgColor || '');
    formData.set('form_text_35', logoBgText);
    
    // Кейс - добавляем отступ слева
    const woodcaseDesk = `Ш:${currentState.case.logoWidthMM}мм, Сверху:${currentState.case.logoOffsetMM.top}мм, Слева:${currentState.case.logoOffsetMM.left}мм`;
    formData.set('form_text_36', woodcaseDesk);
    
    // Шокмаунт - проверяем выбран ли он
    if (currentState.shockmount.variant === 'none' || !currentState.shockmount.variant) {
        formData.set('form_text_37', 'Шокмаунт не добавлен в комплект');
        formData.set('form_text_38', 'Шокмаунт не добавлен в комплект');
    } else {
        const shockmountColor = currentState.shockmount.color || 'Standard';
        const pinsColor = currentState.shockmount.pins?.color || 'Standard';
        const pinsPaid = currentState.shockmount.pins?.paid ? '(платный)' : '(бесплатный)';
        
        formData.set('form_text_37', shockmountColor);
        formData.set('form_text_38', `${pinsColor} ${pinsPaid}`);
    }
    
    import('../config.js').then(config => {
        const basePrice = config.VARIANT_PRICES[currentState.variant] || config.CONFIG.basePrice;
        const spheresPrice = currentState.prices.spheres || 0;
        const bodyPrice = currentState.prices.body || 0;
        const logoPrice = currentState.prices.logo || 0;
        const casePrice = currentState.prices.case || 0;
        const shockmountPrice = currentState.prices.shockmount || 0;
        const totalPrice = basePrice + spheresPrice + bodyPrice + logoPrice + casePrice + shockmountPrice;
        
        let priceDetails = `База: ${basePrice}р`;
        if (spheresPrice > 0) priceDetails += ` + Сферы: ${spheresPrice}р`;
        if (bodyPrice > 0) priceDetails += ` + Корпус: ${bodyPrice}р`;
        if (logoPrice > 0) priceDetails += ` + Лого: ${logoPrice}р`;
        if (casePrice > 0) priceDetails += ` + Кейс: ${casePrice}р`;
        if (shockmountPrice > 0) priceDetails += ` + Подвес: ${shockmountPrice}р`;
        priceDetails += ` = ${totalPrice}р`;
        
        formData.set('form_textarea_36', priceDetails);
        formData.set('form_text_37', `${totalPrice}р`);
    });

    // 2. Добавляем ФАЙЛЫ
    // Поле 47 - PREVIEW_MIC_CUSTOM_FORM
    const svgElement = document.getElementById('svg-wrapper')?.innerHTML;
    if (svgElement) {
        const previewBlob = svgToBlob(svgElement);
        if (previewBlob) {
            formData.append('form_file_47', previewBlob, 'preview.svg');
            console.log('SVG превью добавлено');
        }
    }

    // Поле 43 - WOODCASE_IMAGE_FORM (Проверка типа данных)
    if (currentState.case.customLogo) {
        let caseBlob;
        if (currentState.case.customLogo.includes('<svg')) {
            caseBlob = svgToBlob(currentState.case.customLogo);
        } else {
            caseBlob = base64ToBlob(currentState.case.customLogo);
        }
        if (caseBlob) formData.append('form_file_43', caseBlob, 'case_logo.svg');
    }

    // Поле 44 - MIC_LOGO_CUSTOM_FORM
    if (currentState.logo.customLogo) {
        let logoBlob;
        const data = currentState.logo.customLogo;

        if (typeof data === 'string' && data.includes(';base64,')) {
            // Это Base64 (неважно, SVG это внутри или PNG)
            logoBlob = base64ToBlob(data);
            console.log('Логотип микрофона обработан как Base64 (универсально)');
        } else if (typeof data === 'string' && data.trim().startsWith('<svg')) {
            // Это чистый код SVG
            logoBlob = svgToBlob(data);
            console.log('Логотип микрофона обработан как чистый SVG');
        }

        if (logoBlob) {
            // Если внутри SVG, даем расширение .svg, иначе .png
            const extension = logoBlob.type.includes('svg') ? 'svg' : 'png';
            formData.append('form_file_44', logoBlob, `mic_logo.${extension}`);
            console.log(`Логотип микрофона добавлен в форму как mic_logo.${extension}`);
        } else {
            console.error('Не удалось создать Blob для логотипа микрофона');
        }
    }

    console.log('Отправляем форму с файлами...');

    // 3. Отправляем всё это на сервер
    try {
        const response = await fetch(bitrixForm.action, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Заказ с файлами успешно отправлен!');
            document.getElementById('order-modal').style.display = 'none';
        } else {
            alert('Ошибка при отправке файлов.');
        }
    } catch (e) {
        console.error('Ошибка:', e);
        alert('Ошибка при отправке: ' + e.message);
    }
}

export function generateReport(clientData) {
    // Функция больше не генерирует визуальное превью
    // Все данные передаются через sendOrder
    console.log('generateReport вызван, но визуальная генерация отключена');
}
