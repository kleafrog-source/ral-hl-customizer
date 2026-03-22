import { stateManager } from '../core/state.js';
import { getDevice } from '../utils.js';
import { CASE_IMAGES, CASE_GEOMETRY, getModelData } from '../config.js';
import { showNotification as showAppNotification } from '../utils/notifications.js';
import { debugWarn } from '../utils/debug.js';

const WoodCase = {
    currentCase: '023-the-bomblet',
    userImgSrc: null,
    isSvg: false,
    svgRatio: 1,
    history: {},
    currentMatrix: null,
    timer: null,
    resizeTimer: null,
    caseImageCache: new Map(),
    caseRequestId: 0,
    caseBackgroundNodes: new Map(),
    casePoolDevice: null,
    visibleCaseId: null,
    pendingTransformDirty: false,
    transformCommitTimer: null,

    updateCaseState(updates) {
        stateManager.batch((batch) => {
            Object.entries(updates).forEach(([path, value]) => {
                batch(`case.${path}`, value);
            });
        });
    },

    isVerticalBurnFilterCase() {
        return this.currentCase === '023-the-bomblet' || this.currentCase === '023-malfa';
    },

    syncBurnFilterOrientation() {
        const turbulence = document.getElementById('burnFilterSVGNoise');
        if (!turbulence) {
            return;
        }

        turbulence.setAttribute(
            'baseFrequency',
            this.isVerticalBurnFilterCase() ? '0.7 0.011' : '0.011 0.7'
        );
    },

    isCaseEditingActive() {
        const caseSubmenu = document.getElementById('submenu-case');
        const casePositioningControls = document.getElementById('case-positioning-controls');
        const engravingToggle = document.getElementById('laser-engraving-toggle');

        return !!this.userImgSrc
            && !!caseSubmenu?.classList.contains('active')
            && casePositioningControls?.style.display !== 'none'
            && !!engravingToggle?.checked;
    },

    hideRulers() {
        const rulersGroup = document.getElementById('wood-case-rulers-group');
        if (rulersGroup) {
            rulersGroup.classList.remove('visible');
        }
        clearTimeout(this.timer);
        this.timer = null;
    },

    syncEditingState() {
        if (!this.isCaseEditingActive()) {
            this.commitPendingTransformState();
            this.hideRulers();
        }
    },

    clampScale(scale) {
        return Math.max(0.01, Math.min(5, scale));
    },

    commitPendingTransformState() {
        if (!this.userImgSrc || !this.pendingTransformDirty) {
            return;
        }

        clearTimeout(this.transformCommitTimer);
        this.transformCommitTimer = null;
        this.updateTransform(false, true);
    },

    getCaseImageHref(caseId = this.currentCase, device = this.getDevice()) {
        return CASE_IMAGES[caseId]?.[device] || null;
    },

    getCaseBackgroundLayer() {
        return document.getElementById('wood-case-bg-layer');
    },

    getCaseBackgroundNode(caseId) {
        return this.caseBackgroundNodes.get(caseId) || null;
    },

    syncCaseBackgroundFrame(node, caseId, device = this.getDevice()) {
        const caseData = CASE_GEOMETRY.cases[caseId]?.[device];
        if (!node || !caseData) {
            return;
        }

        node.setAttribute('x', caseData.x);
        node.setAttribute('y', caseData.y);
        node.setAttribute('width', caseData.w);
        node.setAttribute('height', caseData.h);
    },

    hideAllCaseBackgrounds() {
        this.caseBackgroundNodes.forEach((node) => {
            node.style.opacity = '0';
            node.style.visibility = 'hidden';
        });
        this.visibleCaseId = null;
    },

    showCaseBackground(caseId, device = this.getDevice()) {
        const node = this.getCaseBackgroundNode(caseId);
        if (!node) {
            return;
        }

        this.syncCaseBackgroundFrame(node, caseId, device);
        this.hideAllCaseBackgrounds();
        node.style.opacity = '1';
        node.style.visibility = 'visible';
        this.visibleCaseId = caseId;
    },

    preloadCaseImage(href) {
        if (!href) {
            return Promise.reject(new Error('WoodCase.preloadCaseImage: empty href'));
        }

        const cached = this.caseImageCache.get(href);
        if (cached) {
            return cached.promise;
        }

        const img = new Image();
        img.decoding = 'async';
        const entry = {
            img,
            loaded: false,
            promise: null
        };

        entry.promise = new Promise((resolve, reject) => {
            let settled = false;

            const resolveImage = () => {
                if (settled) {
                    return;
                }

                settled = true;
                entry.loaded = true;

                if (typeof img.decode === 'function') {
                    img.decode().catch(() => null).finally(() => resolve(img));
                    return;
                }

                resolve(img);
            };

            img.onload = resolveImage;
            img.onerror = () => {
                if (settled) {
                    return;
                }

                settled = true;
                this.caseImageCache.delete(href);
                reject(new Error(`Failed to preload case image: ${href}`));
            };

            img.src = href;

            if (img.complete && img.naturalWidth > 0) {
                resolveImage();
            }
        });

        this.caseImageCache.set(href, entry);
        return entry.promise;
    },

    isCaseImageReady(href) {
        return !!this.caseImageCache.get(href)?.loaded;
    },

    primeCaseImagesForDevice(device = this.getDevice()) {
        Object.keys(CASE_GEOMETRY.cases).forEach((caseId) => {
            const href = this.getCaseImageHref(caseId, device);
            if (!href) {
                return;
            }

            this.preloadCaseImage(href).catch(() => {
                debugWarn(`WoodCase.primeCaseImagesForDevice: failed to preload "${href}"`);
            });
        });
    },

    ensureCaseBackgroundPool(device = this.getDevice()) {
        const layer = this.getCaseBackgroundLayer();
        if (!layer) {
            return;
        }

        const caseIds = Object.keys(CASE_GEOMETRY.cases);
        const needsRebuild = this.casePoolDevice !== device || this.caseBackgroundNodes.size !== caseIds.length;

        if (needsRebuild) {
            layer.innerHTML = '';
            this.caseBackgroundNodes = new Map();
            this.casePoolDevice = device;
            this.visibleCaseId = null;

            caseIds.forEach((caseId) => {
                const node = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                const href = this.getCaseImageHref(caseId, device);

                node.dataset.caseId = caseId;
                node.classList.add('wood-case-bg-node');
                node.style.opacity = '0';
                node.style.visibility = 'hidden';

                if (href) {
                    node.setAttribute('href', href);
                }

                this.syncCaseBackgroundFrame(node, caseId, device);
                layer.appendChild(node);
                this.caseBackgroundNodes.set(caseId, node);
            });

            this.primeCaseImagesForDevice(device);
            return;
        }

        this.caseBackgroundNodes.forEach((node, caseId) => {
            const href = this.getCaseImageHref(caseId, device);
            this.syncCaseBackgroundFrame(node, caseId, device);

            if (!href) {
                node.removeAttribute('href');
                node.style.opacity = '0';
                node.style.visibility = 'hidden';
                return;
            }

            if (node.getAttribute('href') !== href) {
                node.setAttribute('href', href);
                this.preloadCaseImage(href).catch(() => {
                    debugWarn(`WoodCase.ensureCaseBackgroundPool: failed to preload "${href}"`);
                });
            }
        });
    },

    init() {
        Object.keys(CASE_GEOMETRY.cases).forEach(k => { this.history[k] = { x: 0, y: 0, scale: 0.5 }; });
        this.setupCaseInteractions();
        this.setupRulerEvents();
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = window.setTimeout(() => this.setCase(this.currentCase), 80);
        });

        // Add null checks for elements that might not exist
        const caseFileInput = document.getElementById('case-file-input');
        const caseClearBtn = document.getElementById('case-clear-btn');
        const engravingToggle = document.getElementById('laser-engraving-toggle');
        
        // Убираем обработчик клика на кнопку, чтобы избежать множественных вызовов
        // Клик обрабатывается через inline onclick в HTML
        
        if (caseFileInput) {
            caseFileInput.addEventListener('change', (e) => this.handleUpload(e));
        }
        
        if (caseClearBtn) {
            caseClearBtn.addEventListener('click', () => this.clearLogo());
        }

        if (engravingToggle) {
            engravingToggle.addEventListener('change', () => this.syncEditingState());
        }

        // Add drag&drop for case upload
        const caseUploadArea = document.querySelector('.laser-engraving-upload .upload-area');
        if (caseUploadArea) {
            caseUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                caseUploadArea.classList.add('drag-over');
            });
            
            caseUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                caseUploadArea.classList.remove('drag-over');
            });
            
            caseUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                caseUploadArea.classList.remove('drag-over');
                const file = e.dataTransfer.files?.[0];
                if (file) {
                    this.handleUpload({ files: [file] });
                }
            });
        }

        this.setupManualInputs();
        this.setCase(this.currentCase);
        this.syncEditingState();
    },

    setupManualInputs() {
        const topInput = document.getElementById('input-case-top');
        const leftInput = document.getElementById('input-case-left');
        const widthInput = document.getElementById('input-case-width');

        if (!topInput || !leftInput || !widthInput) return;

        const enhanceWithSteppers = (input, labelText) => {
            if (!input || input.dataset.stepperReady === '1') {
                return;
            }

            const group = input.closest('.input-group');
            const label = group?.querySelector('label');
            if (!group || !label) {
                return;
            }

            input.dataset.stepperReady = '1';
            group.classList.add('positioning-input-group');
            input.classList.add('positioning-number-input');

            const controls = document.createElement('div');
            controls.className = 'positioning-input-controls';

            const createButton = (delta, text) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = text;
                button.className = 'positioning-stepper-btn';
                button.setAttribute('aria-label', `${delta > 0 ? 'Увеличить' : 'Уменьшить'} ${labelText}`);
                button.addEventListener('click', () => {
                    const currentValue = Number.parseFloat(input.value || '0') || 0;
                    input.value = String(Math.max(0, currentValue + delta));
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                });
                return button;
            };

            controls.appendChild(createButton(-1, '-'));
            controls.appendChild(input);
            controls.appendChild(createButton(1, '+'));
            group.appendChild(controls);
        };

        enhanceWithSteppers(topInput, 'отступ сверху');
        enhanceWithSteppers(leftInput, 'отступ слева');
        enhanceWithSteppers(widthInput, 'ширину');

        const updateFromInputs = () => {
            if (!this.userImgSrc) return;
            const state = this.history[this.currentCase];
            const pxPerMM = this.getPixelsPerMM(this.currentCase);

            const plane = document.getElementById('wood-case-perspective-plane');
            const pH = parseFloat(plane.style.height) || 0;
            const pW = parseFloat(plane.style.width) || 0;

            const container = document.getElementById('user-logo-container');
            let bW, bH;
            if (this.isSvg) {
                bW = 550; bH = 550 / this.svgRatio;
            } else {
                const img = container.querySelector('img');
                bW = img ? img.naturalWidth : 100;
                bH = img ? img.naturalHeight : 100;
            }

            const targetWidthPx = parseFloat(widthInput.value) * pxPerMM;
            state.scale = targetWidthPx / bW;

            const cH = bH * state.scale;
            const cW = bW * state.scale;

            const targetTopPx = parseFloat(topInput.value) * pxPerMM;
            const targetLeftPx = parseFloat(leftInput.value) * pxPerMM;

            state.y = targetTopPx - pH/2 + cH/2;
            state.x = targetLeftPx - pW/2 + cW/2;

            this.updateTransform(false, false);
            this.showRulers();
        };

        [topInput, leftInput, widthInput].forEach(input => {
            input.addEventListener('input', updateFromInputs);
        });
    },

    getDevice() {
        return getDevice(CASE_GEOMETRY.res);
    },

    setCase(id) {
        const modelData = getModelData(id);
        const caseId = modelData ? modelData.CODE : id;

        if (!caseId || !CASE_GEOMETRY.cases[caseId]) {
            debugWarn(`WoodCase.setCase: Invalid case ID "${caseId}"`);
            return;
        }

        this.currentCase = caseId;

        if (this.userImgSrc && this.history[caseId].scale === 0.5 && this.history[caseId].x === 0) {
            this.applyStartConfig(caseId);
        }
        const device = this.getDevice();
        const nextHref = this.getCaseImageHref(caseId, device);
        const requestId = ++this.caseRequestId;

        this.ensureCaseBackgroundPool(device);

        if (!nextHref) {
            this.hideAllCaseBackgrounds();
            this.render({ syncBackground: false });
            debugWarn(`WoodCase.setCase: Missing case image for "${caseId}" on "${device}"`);
            return;
        }

        if (this.isCaseImageReady(nextHref)) {
            this.showCaseBackground(caseId, device);
            this.render({ syncBackground: false });
            return;
        }

        this.hideAllCaseBackgrounds();
        this.render({ syncBackground: false });

        this.preloadCaseImage(nextHref)
            .then(() => {
                if (requestId !== this.caseRequestId || this.currentCase !== caseId) {
                    return;
                }

                const freshDevice = this.getDevice();
                this.ensureCaseBackgroundPool(freshDevice);
                this.showCaseBackground(this.currentCase, freshDevice);
            })
            .catch(() => {
                if (requestId !== this.caseRequestId) {
                    return;
                }

                debugWarn(`WoodCase.setCase: Failed to load case image "${nextHref}"`);
            });
        
    },

    handleUpload(e) {
        const file = (e.target && e.target.files) ? e.target.files[0] : (e.files ? e.files[0] : null);
        if (!file) return;
        
        // Check file size (3MB limit)
        const maxSize = 3 * 1024 * 1024;
        if (file.size > maxSize) {
            showAppNotification('Файл слишком большой. Максимальный размер: 3 МБ', 'error');
            return;
        }
        
        // Check file type
        const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/webp', 'image/x-icon'];
        const allowedExtensions = ['.png', '.svg', '.jpg', '.jpeg', '.bmp', '.webp', '.ico'];
        
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        const hasValidType = allowedTypes.includes(file.type);
        
        if (!hasValidExtension && !hasValidType) {
            showAppNotification('Неподдерживаемый формат файла. Допустимые: PNG, SVG, JPG, BMP, WEBP, ICO', 'error');
            return;
        }
        
        const caseClearBtn = document.getElementById('case-clear-btn');
        const casePositioningControls = document.getElementById('case-positioning-controls');

        if (caseClearBtn) caseClearBtn.style.display = 'block';
        if (casePositioningControls) casePositioningControls.style.display = 'block';

        const reader = new FileReader();
        reader.onload = (ev) => {
            this.isSvg = file.type === 'image/svg+xml';
            if (this.isSvg) {
                const text = ev.target.result;
                this.svgRatio = this.parseSvgRatio(text);
                this.userImgSrc = this.processSvgColors(text);
                const container = document.getElementById('user-logo-container');
                if (container) {
                    container.innerHTML = this.userImgSrc;
                    const svgEl = container.querySelector('svg');
                    if(svgEl) {
                        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                        svgEl.style.width = '100%'; svgEl.style.height = '100%';
                    }
                }
            } else {
                this.userImgSrc = ev.target.result;
                const container = document.getElementById('user-logo-container');
                if (container) {
                    container.innerHTML = `<img src="${this.userImgSrc}" style="display:block; width:100%; height:100%;" />`;
                }
            }

            const loadHandler = () => {
                this.applyStartConfig(this.currentCase);
                this.render();
                this.syncEditingState();
                this.updateCaseState({
                    variant: 'custom',
                    customLogo: this.userImgSrc
                });
                
                showAppNotification('Изображение для футляра успешно загружено', 'success');
            };

            if (this.isSvg) {
                loadHandler();
            } else {
                const img = document.querySelector('#user-logo-container img');
                if (img) {
                    img.onload = loadHandler;
                }
            }
        };

        if (file.type === 'image/svg+xml') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    },

    applyStartConfig(caseId) {
        if (!this.userImgSrc) return;
        const config = CASE_GEOMETRY.cases[caseId].startConfig;
        const pxPerMM = this.getPixelsPerMM(caseId);
        let newScale = 0.5;

        if (this.isSvg) {
            newScale = (config.wMM * pxPerMM) / 550;
        } else {
            const img = document.querySelector('#user-logo-container img');
            const natW = img ? img.naturalWidth : 100;
            if (natW > 0) newScale = (config.wMM * pxPerMM) / natW;
        }

        this.history[caseId] = { x: 0, y: config.yOffsetMM * pxPerMM, scale: newScale };
    },

    getPixelsPerMM(caseId) {
        const dev = this.getDevice();
        const poly = CASE_GEOMETRY.cases[caseId][dev].poly;
        let minX = Infinity, maxX = -Infinity;
        for(let i=0; i<poly.length; i+=2) { minX = Math.min(minX, poly[i]); maxX = Math.max(maxX, poly[i]); }
        return (maxX - minX) / CASE_GEOMETRY.cases[caseId].mm;
    },

    render(options = {}) {
        const { syncBackground = true } = options;
        const dev = this.getDevice();
        const res = CASE_GEOMETRY.res[dev];
        const caseData = CASE_GEOMETRY.cases[this.currentCase][dev];
        const svg = document.getElementById('wood-case-svg');
        if (svg) svg.setAttribute('viewBox', res.vb);

        // Device-specific scaling for woodcase preview (hardcoded for stable framing).
        const rescaleMap = CASE_GEOMETRY.cases_rescale || {};
        const scaleFactor = rescaleMap[this.currentCase]?.[dev] ?? 1;
        const workspace = document.getElementById('wood-case-workspace');
        if (workspace) {
            workspace.style.transform = `scale(${scaleFactor})`;
            workspace.style.transformOrigin = 'center center';
        }

        this.ensureCaseBackgroundPool(dev);
        if (syncBackground) {
            const href = this.getCaseImageHref(this.currentCase, dev);
            if (href && this.isCaseImageReady(href)) {
                this.showCaseBackground(this.currentCase, dev);
            } else {
                this.hideAllCaseBackgrounds();
            }
        }

        const fo = document.getElementById('wood-case-perspective-fo');
        if (fo) {
            const vbParts = res.vb.split(' ');
            fo.setAttribute('width', vbParts[2]); fo.setAttribute('height', vbParts[3]);
        }

        const infoResTag = document.getElementById('info-res-tag');
        const infoMmTag = document.getElementById('info-mm-tag');
        if (infoResTag) infoResTag.textContent = dev.toUpperCase();
        if (infoMmTag) infoMmTag.textContent = CASE_GEOMETRY.cases[this.currentCase].mm + ' мм';

        const container = document.getElementById('user-logo-container');
        if (this.userImgSrc && container) {
            this.syncBurnFilterOrientation();
            container.style.display = 'block';
            if (this.isSvg) {
                container.style.filter = 'grayscale(1) brightness(0) url(#woodBurnFilter)';
                container.style.mixBlendMode = 'multiply';
                container.style.opacity = '0.9';
            } else {
                container.style.filter = 'url(#svg-burn-charcoal)';
                container.style.mixBlendMode = 'multiply';
                container.style.opacity = '1';
            }
            const poly = caseData.poly;
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for(let i=0; i<poly.length; i+=2) {
                minX = Math.min(minX, poly[i]); maxX = Math.max(maxX, poly[i]);
                minY = Math.min(minY, poly[i+1]); maxY = Math.max(maxY, poly[i+1]);
            }
            const srcW = maxX - minX, srcH = maxY - minY;
            const dstQuad = this.getSortedCorners(poly);
            const h = this.solveHomography([{x:0,y:0},{x:srcW,y:0},{x:srcW,y:srcH},{x:0,y:srcH}], dstQuad);
            this.currentMatrix = h;

            const plane = document.getElementById('wood-case-perspective-plane');
            if (plane) {
                plane.style.width = srcW + 'px'; plane.style.height = srcH + 'px';
                plane.style.transform = `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
            }
            this.updateTransform();
        }

        this.syncEditingState();
    },

    updateTransform(animate = false, persistState = true) {
        if(!this.userImgSrc) return;
        const state = this.history[this.currentCase];
        const container = document.getElementById('user-logo-container');
        if (!container) return;
        
        let bW, bH;
        if (this.isSvg) {
            bW = 550; bH = 550 / this.svgRatio;
        } else {
            const img = container.querySelector('img');
            bW = img ? img.naturalWidth : 100; bH = img ? img.naturalHeight : 100;
        }
        container.style.width = bW + 'px'; container.style.height = bH + 'px';

        if (window.anime && animate) {
            window.anime.remove(container);
            window.anime({
                targets: container,
                translateX: state.x,
                translateY: state.y,
                scale: state.scale,
                duration: 200,
                easing: 'easeOutQuad'
            });
        } else {
            container.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
        }

        const pxPerMM = this.getPixelsPerMM(this.currentCase);
        const width_mm = Math.round((bW * state.scale) / pxPerMM);
        if (persistState) {
            this.updateCaseState({
                logoTransform: { x: state.x, y: state.y, scale: state.scale },
                logoWidthMM: width_mm
            });
            this.pendingTransformDirty = false;
        } else {
            this.pendingTransformDirty = true;
        }

        this.drawRulers(persistState);
    },

    moveLogoBy(dx, dy) {
        if (!this.isCaseEditingActive()) {
            return;
        }

        const state = this.history[this.currentCase];
        state.x += dx;
        state.y += dy;
        this.updateTransform(false, false);
        this.showRulers();
    },

    scaleLogoBy(factor) {
        if (!this.isCaseEditingActive()) {
            return;
        }

        const state = this.history[this.currentCase];
        state.scale = this.clampScale(state.scale * factor);
        this.updateTransform(false, false);
        this.showRulers();
    },

    scheduleTransformCommit(delay = 140) {
        clearTimeout(this.transformCommitTimer);
        this.transformCommitTimer = window.setTimeout(() => {
            this.commitPendingTransformState();
        }, delay);
    },

    setupCaseInteractions() {
        if (typeof window !== 'undefined' && typeof window.interact === 'function') {
            this.setupInteractInteractions();
            return;
        }

        this.setupNativeInteractions();
    },

    getLocalPlanePoint(clientX, clientY) {
        const plane = document.getElementById('wood-case-perspective-plane');
        if (!plane) {
            return null;
        }

        const rect = plane.getBoundingClientRect();
        const localWidth = parseFloat(plane.style.width) || rect.width || 1;
        const localHeight = parseFloat(plane.style.height) || rect.height || 1;

        return {
            x: ((clientX - rect.left) / (rect.width || 1)) * localWidth,
            y: ((clientY - rect.top) / (rect.height || 1)) * localHeight
        };
    },

    setupInteractInteractions() {
        const wrapper = document.getElementById('wood-case-logo-wrapper');
        if (!wrapper || wrapper.dataset.interactReady === '1') {
            return;
        }

        wrapper.dataset.interactReady = '1';

        window.interact(wrapper)
            .gesturable({
                listeners: {
                    move: (event) => {
                        this.scaleLogoBy(1 + event.ds);
                    },
                    end: () => {
                        this.commitPendingTransformState();
                    }
                }
            })
            .draggable({
                listeners: {
                    move: (event) => {
                        this.moveLogoBy(event.dx, event.dy);
                    },
                    end: () => {
                        this.commitPendingTransformState();
                    }
                }
            });

        wrapper.addEventListener('wheel', (event) => {
            event.preventDefault();
            const factor = event.deltaY > 0 ? 0.95 : 1.05;
            this.scaleLogoBy(factor);
            this.scheduleTransformCommit();
        }, { passive: false });
    },

    setupNativeInteractions() {
        const wrapper = document.getElementById('wood-case-logo-wrapper');
        if (!wrapper) return;

        let isDragging = false;
        let dragStartPoint = null;
        let dragStartState = null;
        let initialPinchDistance = null;
        let initialScale = 1;

        const getDistance = (touches) => {
            return Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
        };

        const beginDrag = (clientX, clientY) => {
            if (!this.isCaseEditingActive()) {
                return false;
            }

            const point = this.getLocalPlanePoint(clientX, clientY);
            if (!point) {
                return false;
            }

            const state = this.history[this.currentCase];
            isDragging = true;
            dragStartPoint = point;
            dragStartState = { x: state.x, y: state.y };
            return true;
        };

        const updateDrag = (clientX, clientY) => {
            if (!isDragging || !dragStartPoint || !dragStartState) {
                return;
            }

            const point = this.getLocalPlanePoint(clientX, clientY);
            if (!point) {
                return;
            }

            const dx = point.x - dragStartPoint.x;
            const dy = point.y - dragStartPoint.y;
            const state = this.history[this.currentCase];
            state.x = dragStartState.x + dx;
            state.y = dragStartState.y + dy;
            this.updateTransform(false, false);
            this.showRulers();
        };

        const endDrag = () => {
            isDragging = false;
            dragStartPoint = null;
            dragStartState = null;
            this.commitPendingTransformState();
        };

        wrapper.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') return;
            if (!beginDrag(e.clientX, e.clientY)) {
                return;
            }
            wrapper.setPointerCapture(e.pointerId);
        });

        wrapper.addEventListener('pointermove', (e) => {
            updateDrag(e.clientX, e.clientY);
        });

        wrapper.addEventListener('pointerup', endDrag);
        wrapper.addEventListener('pointercancel', endDrag);

        wrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                beginDrag(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2) {
                endDrag();
                initialPinchDistance = getDistance(e.touches);
                initialScale = this.history[this.currentCase].scale;
            }
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging) {
                updateDrag(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2 && initialPinchDistance) {
                const currentDistance = getDistance(e.touches);
                const ds = currentDistance / initialPinchDistance;
                const state = this.history[this.currentCase];
                state.scale = this.clampScale(initialScale * ds);
                this.updateTransform(false, false);
                this.showRulers();
            }
        }, { passive: true });

        wrapper.addEventListener('touchend', () => {
            endDrag();
            initialPinchDistance = null;
        });

        wrapper.addEventListener('touchcancel', () => {
            endDrag();
            initialPinchDistance = null;
        });

        wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.95 : 1.05;
            this.scaleLogoBy(delta);
            this.scheduleTransformCommit();
        }, { passive: false });
    },

    parseSvgRatio(text) {
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector('svg');
        if(svg && svg.viewBox.baseVal.width > 0) return svg.viewBox.baseVal.width / svg.viewBox.baseVal.height;
        return 1;
    },

    processSvgColors(text) {
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        doc.querySelectorAll('*').forEach(el => {
            ['fill', 'stroke'].forEach(attr => { if(el.getAttribute(attr) && el.getAttribute(attr) !== 'none') el.setAttribute(attr, '#482814'); });
            if(el.style.fill && el.style.fill !== 'none') el.style.fill = '#482814';
        });
        return new XMLSerializer().serializeToString(doc);
    },

    getSortedCorners(poly) {
        let pts = []; for(let i=0; i<poly.length; i+=2) pts.push({x: poly[i], y: poly[i+1]});
        pts.sort((a,b) => a.y - b.y);
        const t = pts.slice(0,2).sort((a,b) => a.x - b.x), b = pts.slice(2,4).sort((a,b) => a.x - b.x);
        return [t[0], t[1], b[1], b[0]];
    },

    solveHomography(src, dst) {
        const A = [], b = [];
        for(let i=0; i<4; i++){
            const sx = src[i].x, sy = src[i].y, dx = dst[i].x, dy = dst[i].y;
            A.push([sx, sy, 1, 0, 0, 0, -dx*sx, -dx*sy]); b.push(dx);
            A.push([0, 0, 0, sx, sy, 1, -dy*sx, -dy*sy]); b.push(dy);
        }
        return this.gaussianElimination(A, b);
    },

    gaussianElimination(A, b) {
        const n = A.length, aug = A.map((row, i) => [...row, b[i]]);
        for (let i = 0; i < n; i++) {
            let max = i; for (let k = i+1; k < n; k++) if (Math.abs(aug[k][i]) > Math.abs(aug[max][i])) max = k;
            [aug[i], aug[max]] = [aug[max], aug[i]];
            for (let k = i+1; k < n; k++) {
                const f = aug[k][i] / aug[i][i];
                for (let j = i; j <= n; j++) aug[k][j] -= f * aug[i][j];
            }
        }
        const x = new Array(n);
        for (let i = n-1; i >= 0; i--) {
            x[i] = aug[i][n]; for (let j = i+1; j < n; j++) x[i] -= aug[i][j] * x[j];
            x[i] /= aug[i][i];
        }
        return x;
    },

    projectPoint(x, y, h) {
        const w = h[6]*x + h[7]*y + 1;
        return { x: (h[0]*x + h[1]*y + h[2]) / w, y: (h[3]*x + h[4]*y + h[5]) / w };
    },

    drawRulers(persistState = true) {
        if (!this.userImgSrc || !this.currentMatrix) return;
        const state = this.history[this.currentCase], container = document.getElementById('user-logo-container');
        if (!container) return;
        
        const bW = parseFloat(container.style.width), bH = parseFloat(container.style.height);
        const cW = bW * state.scale, cH = bH * state.scale;
        const plane = document.getElementById('wood-case-perspective-plane');
        if (!plane) return;
        
        const pW = parseFloat(plane.style.width), pH = parseFloat(plane.style.height);
        const iTLx = (pW/2 + state.x) - cW/2, iTLy = (pH/2 + state.y) - cH/2;
        const pxPerMM = this.getPixelsPerMM(this.currentCase);

        const top_mm = Math.round(iTLy / pxPerMM);
        const left_mm = Math.round(iTLx / pxPerMM);

        const infoTopTag = document.getElementById('info-top-tag');
        const infoLeftTag = document.getElementById('info-left-tag');
        if (infoTopTag) infoTopTag.textContent = top_mm + ' мм';
        if (infoLeftTag) infoLeftTag.textContent = left_mm + ' мм';

        // Update manual inputs
        const topInput = document.getElementById('input-case-top');
        const leftInput = document.getElementById('input-case-left');
        const widthInput = document.getElementById('input-case-width');
        if (topInput && document.activeElement !== topInput) topInput.value = top_mm;
        if (leftInput && document.activeElement !== leftInput) leftInput.value = left_mm;
        if (widthInput && document.activeElement !== widthInput) widthInput.value = Math.round(cW / pxPerMM);

        if (persistState) {
            this.updateCaseState({
                logoOffsetMM: { top: top_mm, left: left_mm }
            });
        }

        const sCorners = [{x:iTLx,y:iTLy},{x:iTLx+cW,y:iTLy},{x:iTLx+cW,y:iTLy+cH},{x:iTLx,y:iTLy+cH}].map(p => this.projectPoint(p.x, p.y, this.currentMatrix));
        const pTL = sCorners[0], pTR = sCorners[1], pBL = sCorners[3];

        const getOff = (p1, p2, d) => {
            const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx*dx + dy*dy);
            return { x: (-dy/len)*d, y: (dx/len)*d };
        };

        const tO = getOff(pTL, pTR, -15), lO = getOff(pBL, pTL, -15);
        const tr1 = {x:pTL.x+tO.x, y:pTL.y+tO.y}, tr2 = {x:pTR.x+tO.x, y:pTR.y+tO.y};
        const lr1 = {x:pTL.x+lO.x, y:pTL.y+lO.y}, lr2 = {x:pBL.x+lO.x, y:pBL.y+lO.y};

        const rulersGroup = document.getElementById('wood-case-rulers-group');
        if (rulersGroup) {
            rulersGroup.innerHTML = `
                <line class="ruler-line" x1="${tr1.x}" y1="${tr1.y}" x2="${tr2.x}" y2="${tr2.y}" />
                <line class="ruler-tick" x1="${pTL.x}" y1="${pTL.y}" x2="${tr1.x}" y2="${tr1.y}" />
                <line class="ruler-tick" x1="${pTR.x}" y1="${pTR.y}" x2="${tr2.x}" y2="${tr2.y}" />
                <text class="r-text" x="${(tr1.x+tr2.x)/2}" y="${(tr1.y+tr2.y)/2-5}" text-anchor="middle">${Math.round(cW/pxPerMM)} мм</text>
                <line class="ruler-line" x1="${lr1.x}" y1="${lr1.y}" x2="${lr2.x}" y2="${lr2.y}" />
                <line class="ruler-tick" x1="${pTL.x}" y1="${pTL.y}" x2="${lr1.x}" y2="${lr1.y}" />
                <line class="ruler-tick" x1="${pBL.x}" y1="${pBL.y}" x2="${lr2.x}" y2="${lr2.y}" />
                <text class="r-text" x="${(lr1.x+lr2.x)/2-10}" y="${(lr1.y+lr2.y)/2}" text-anchor="end" dominant-baseline="middle">${Math.round(cH/pxPerMM)} мм</text>
            `;
        }
    },

    showRulers() {
        if (!this.isCaseEditingActive()) {
            this.hideRulers();
            return;
        }

        const g = document.getElementById('wood-case-rulers-group');
        if (g) {
            g.classList.add('visible');
            clearTimeout(this.timer); 
            this.timer = setTimeout(() => g.classList.remove('visible'), 3000);
        }
    },

    setupRulerEvents() {
        [document.getElementById('wood-case-logo-wrapper'), this.getCaseBackgroundLayer()].forEach(el => {
            if(el) {
                el.addEventListener('click', () => this.showRulers());
                el.addEventListener('mouseover', () => this.showRulers());
            }
        });
    },

    clearLogo() {
        clearTimeout(this.transformCommitTimer);
        this.transformCommitTimer = null;
        this.pendingTransformDirty = false;
        this.userImgSrc = null;
        const c = document.getElementById('user-logo-container');
        if (c) {
            c.style.display = 'none';
            c.innerHTML = '';
        }
        
        const rulersGroup = document.getElementById('wood-case-rulers-group');
        if (rulersGroup) {
            rulersGroup.innerHTML = '';
        }
        this.hideRulers();
        
        ['info-top-tag', 'info-left-tag', 'info-res-tag'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.textContent = '-';
        });
        
        const caseClearBtn = document.getElementById('case-clear-btn');
        if (caseClearBtn) {
            caseClearBtn.style.display = 'none';
        }
        
        const casePositioningControls = document.getElementById('case-positioning-controls');
        if (casePositioningControls) {
            casePositioningControls.style.display = 'none';
        }
        
        const caseFileInput = document.getElementById('case-file-input');
        if (caseFileInput) {
            caseFileInput.value = '';
        }

        this.updateCaseState({
            variant: 'standard',
            customLogo: null,
            logoWidthMM: 0
        });
    }
};

export function getWoodCaseTransformState() {
    const s = WoodCase.history[WoodCase.currentCase];
    return {
        translateX: s.x,
        translateY: s.y,
        scale: s.scale,
        rotation: 0 // rotation not currently implemented in UI
    };
}

export function setWoodCaseTransformState(nextState) {
    const s = WoodCase.history[WoodCase.currentCase];
    if (nextState.translateX !== undefined) s.x = nextState.translateX;
    if (nextState.translateY !== undefined) s.y = nextState.translateY;
    if (nextState.scale !== undefined) s.scale = nextState.scale;
    WoodCase.updateTransform(true);
}

export function initializeWoodCase() {
    WoodCase.init();
    // Make it globally accessible for now for easier integration
    window.WoodCase = WoodCase;
}

