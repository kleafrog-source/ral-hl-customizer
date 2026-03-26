import { SCENE_LAYERS } from '../config/scene-layers.js';
import { VIEWPORT_LAYOUT_PRESETS } from '../config/layout-presets.js';

const LAYOUT_ANCHORS = Object.freeze({
    center: Object.freeze({ x: 0.5, y: 0.5 }),
    'bottom-center': Object.freeze({ x: 0.5, y: 1 }),
    'top-center': Object.freeze({ x: 0.5, y: 0 }),
    'left-center': Object.freeze({ x: 0, y: 0.5 }),
    'right-center': Object.freeze({ x: 1, y: 0.5 })
});

const DEVICE_REFERENCE_VIEWPORTS = Object.freeze({
    desktop: Object.freeze({ width: 1920, height: 1080 }),
    tablet: Object.freeze({ width: 820, height: 1180 }),
    'mobile-landscape': Object.freeze({ width: 844, height: 390 }),
    'mobile-portrait': Object.freeze({ width: 390, height: 844 })
});

function clampPrecision(value, digits = 3) {
    const numericValue = Number(value) || 0;
    const rounded = Number(numericValue.toFixed(digits));
    return Object.is(rounded, -0) ? 0 : rounded;
}

function formatPixelValue(value) {
    return `${clampPrecision(value)}px`;
}

function formatScaleValue(value) {
    return clampPrecision(value);
}

function resolveAnchor(anchorName) {
    return LAYOUT_ANCHORS[anchorName] || LAYOUT_ANCHORS.center;
}

function resolveViewportSize(viewportSize = {}) {
    const width = Number(viewportSize.width) || 0;
    const height = Number(viewportSize.height) || 0;

    return {
        width: width > 0 ? width : 1,
        height: height > 0 ? height : 1
    };
}

function resolveReferenceAspect(deviceKey) {
    const referenceViewport = DEVICE_REFERENCE_VIEWPORTS[deviceKey] || DEVICE_REFERENCE_VIEWPORTS.desktop;
    return referenceViewport.width / referenceViewport.height;
}

function normalizeRectForDevice(layoutRect, deviceKey) {
    const aspect = resolveReferenceAspect(deviceKey);

    return {
        ...layoutRect,
        x: layoutRect.x || 0,
        y: (layoutRect.y || 0) * aspect,
        width: layoutRect.width || 0,
        height: (layoutRect.height || 0) * aspect
    };
}

function normalizeSceneLayerForDevice(sceneLayer, deviceKey) {
    const aspect = resolveReferenceAspect(deviceKey);

    return {
        ...sceneLayer,
        width: sceneLayer.width || 0,
        height: (sceneLayer.height || 0) * aspect
    };
}

export function computeLayerTransform({ layoutRect, sceneLayer, viewportSize, deviceKey }) {
    if (!layoutRect || !sceneLayer || !deviceKey) {
        return null;
    }

    const normalizedRect = normalizeRectForDevice(layoutRect, deviceKey);
    const normalizedSceneLayer = normalizeSceneLayerForDevice(sceneLayer, deviceKey);
    const resolvedViewportSize = resolveViewportSize(viewportSize);
    const anchor = resolveAnchor(layoutRect.anchor || sceneLayer.anchor);
    const scale = Math.min(
        (normalizedRect.width || 0) / (normalizedSceneLayer.width || 1),
        (normalizedRect.height || 0) / (normalizedSceneLayer.height || 1)
    );
    const scaledWidth = (normalizedSceneLayer.width || 0) * scale;
    const scaledHeight = (normalizedSceneLayer.height || 0) * scale;
    const targetAnchorX = (normalizedRect.x || 0) + (normalizedRect.width || 0) * anchor.x;
    const targetAnchorY = (normalizedRect.y || 0) + (normalizedRect.height || 0) * anchor.y;
    const translateX = (targetAnchorX - scaledWidth * anchor.x) * resolvedViewportSize.width;
    const translateY = (targetAnchorY - scaledHeight * anchor.y) * resolvedViewportSize.height;

    return {
        transform: `translateX(${formatPixelValue(translateX)}) translateY(${formatPixelValue(translateY)}) scale(${formatScaleValue(scale)})`,
        opacity: typeof layoutRect.opacity === 'number'
            ? layoutRect.opacity
            : (layoutRect.visible === false ? 0 : 1)
    };
}

export function getLayoutTransforms({ deviceKey, modelKey, stateName, viewportSize }) {
    const statePreset = VIEWPORT_LAYOUT_PRESETS[deviceKey]?.[modelKey]?.[stateName];
    if (!statePreset) {
        return null;
    }

    const result = Object.entries(statePreset).reduce((layers, [layerId, layoutRect]) => {
        const sceneLayer = SCENE_LAYERS[layerId];
        const computedTransform = computeLayerTransform({
            layoutRect,
            sceneLayer,
            viewportSize,
            deviceKey
        });

        if (!sceneLayer || !computedTransform) {
            return layers;
        }

        layers[layerId] = {
            ...computedTransform,
            visible: layoutRect.visible !== false
        };

        return layers;
    }, {});

    return Object.keys(result).length ? result : null;
}
