import { getModelData } from '../config.js';

export const MODEL_CODES = Object.freeze({
    TUBE_017: '017-tube',
    FET_017: '017-fet',
    DELUXE_023: '023-deluxe',
    BOMBLET_023: '023-the-bomblet',
    MALFA_023: '023-malfa'
});

const CAMERA_MODEL_KEYS = Object.freeze({
    [MODEL_CODES.TUBE_017]: '017-TUBE',
    [MODEL_CODES.FET_017]: '017-FET',
    [MODEL_CODES.DELUXE_023]: '023-DELUXE',
    [MODEL_CODES.BOMBLET_023]: '023-BOMBLET',
    [MODEL_CODES.MALFA_023]: '023-MALFA'
});

function extractModelCode(modelLike) {
    if (!modelLike) {
        return null;
    }

    if (typeof modelLike === 'string') {
        return modelLike;
    }

    return modelLike.currentModelCode
        || modelLike.variant
        || modelLike.code
        || modelLike.CODE
        || modelLike.model?.code
        || modelLike.model?.slug
        || null;
}

export function resolveModelCode(modelLike) {
    const rawCode = extractModelCode(modelLike);
    if (!rawCode) {
        return null;
    }

    const normalizedCode = String(rawCode).trim();
    const model = getModelData(normalizedCode) || getModelData(normalizedCode.toLowerCase());

    return model?.CODE || normalizedCode.toLowerCase();
}

export function getResolvedModel(modelLike) {
    if (modelLike && typeof modelLike === 'object' && modelLike.CODE) {
        return modelLike;
    }

    const modelCode = resolveModelCode(modelLike);
    return modelCode ? (getModelData(modelCode) || null) : null;
}

export function isModel(modelLike, targetCode) {
    return resolveModelCode(modelLike) === targetCode;
}

export function isMalfaModel(modelLike) {
    return isModel(modelLike, MODEL_CODES.MALFA_023);
}

export function supportsMalfaLogos(modelLike) {
    return isMalfaModel(modelLike);
}

export function hasPaidOptionalShockmount(modelLike) {
    return isModel(modelLike, MODEL_CODES.BOMBLET_023);
}

export function getShockmountOptionVariantCode(modelLike, enabled) {
    const modelCode = resolveModelCode(modelLike);
    if (!modelCode || !hasPaidOptionalShockmount(modelCode)) {
        return null;
    }

    return enabled
        ? `shockmount-option-included_${modelCode}`
        : `shockmount-option-not_included_${modelCode}`;
}

export function buildShockmountState(modelLike) {
    const model = getResolvedModel(modelLike) || modelLike || {};
    const price = Number(model.shockmountPrice ?? model.SHOCKMOUNT_PRICE ?? 0) || 0;
    const enabled = Number(model.shockmountEnabled ?? model.SHOCKMOUNT_ENABLED ?? 0) === 1;
    const visible = Number(model.shockmountVisible ?? model.SHOCKMOUNT_VISIBLE ?? 0) === 1;
    const canToggle = Number(model.shockmountToggle ?? model.SHOCKMOUNT_TOGGLE ?? 0) === 1;

    return {
        canToggle,
        enabled,
        visible,
        available: visible || enabled,
        included: enabled && price === 0,
        price,
        defaultOption: model.UF_DEFAULT_SHOCKMOUNT_OPTION || null
    };
}

export function getBaseAnimationModelKey(modelLike) {
    const modelCode = resolveModelCode(modelLike);
    if (!modelCode) {
        return CAMERA_MODEL_KEYS[MODEL_CODES.TUBE_017];
    }

    return CAMERA_MODEL_KEYS[modelCode]
        || String(modelCode).toUpperCase().replace('THE-BOMBLET', 'BOMBLET');
}

export function getAnimationModelKey(modelLike, state) {
    const baseModelKey = getBaseAnimationModelKey(modelLike);

    if (baseModelKey === '023-BOMBLET') {
        return state?.shockmount?.enabled
            ? '023-BOMBLET-WITH-SHOCKMOUNT'
            : '023-BOMBLET-NO-SHOCKMOUNT';
    }

    return baseModelKey;
}
