import { stateManager } from '../core/state.js';
import { getDevice } from '../utils.js';
import { CASE_IMAGES, CASE_GEOMETRY, CONFIG } from '../config.js';

const WoodCase = {
    currentCase: '023-the-bomblet',
    userImgSrc: null,
    isSvg: false,
    svgRatio: 1,
    history: {},
    currentMatrix: null,
    timer: null,

    init() {
        Object.keys(CASE_GEOMETRY.cases).forEach(k => { this.history[k] = { x: 0, y: 0, scale: 0.5 }; });
        this.setupInteract();
        this.setupRulerEvents();
        window.addEventListener('resize', () => this.render());

        document.getElementById('case-upload-btn').addEventListener('click', () => {
            document.getElementById('case-file-input').click();
        });
        document.getElementById('case-file-input').addEventListener('change', (e) => this.handleUpload(e));
        document.getElementById('case-clear-btn').addEventListener('click', () => this.clearLogo());

        this.setupManualInputs();
        this.render();
    },

    setupManualInputs() {
        const topInput = document.getElementById('input-case-top');
        const leftInput = document.getElementById('input-case-left');
        const widthInput = document.getElementById('input-case-width');

        if (!topInput || !leftInput || !widthInput) return;

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

            this.updateTransform();
        };

        [topInput, leftInput, widthInput].forEach(input => {
            input.addEventListener('input', updateFromInputs);
        });
    },

    getDevice() {
        return getDevice(CASE_GEOMETRY.res);
    },

    setCase(id) {
        const variantMap = {
            'malfa': '023-malfa',
        };
        const caseId = variantMap[id] || id;

        if (!caseId || !CASE_GEOMETRY.cases[caseId]) {
            console.warn(`WoodCase.setCase: Invalid case ID "${caseId}"`);
            return;
        }
        document.getElementById('wood-case-loader').style.display = 'block';
        this.currentCase = caseId;

        if (this.userImgSrc && this.history[caseId].scale === 0.5 && this.history[caseId].x === 0) {
            this.applyStartConfig(caseId);
        }
        this.render();
        setTimeout(() => document.getElementById('wood-case-loader').style.display = 'none', 300);
    },

    handleUpload(e) {
        const file = (e.target && e.target.files) ? e.target.files[0] : (e.files ? e.files[0] : null);
        if (!file) return;
        document.getElementById('wood-case-loader').style.display = 'block';
        document.getElementById('case-clear-btn').style.display = 'block';
        document.getElementById('case-positioning-controls').style.display = 'block';

        const reader = new FileReader();
        reader.onload = (ev) => {
            this.isSvg = file.type === 'image/svg+xml';
            if (this.isSvg) {
                const text = ev.target.result;
                this.svgRatio = this.parseSvgRatio(text);
                this.userImgSrc = this.processSvgColors(text);
                const container = document.getElementById('user-logo-container');
                container.innerHTML = this.userImgSrc;
                const svgEl = container.querySelector('svg');
                if(svgEl) {
                    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                    svgEl.style.width = '100%'; svgEl.style.height = '100%';
                }
            } else {
                this.userImgSrc = ev.target.result;
                const container = document.getElementById('user-logo-container');
                container.innerHTML = `<img src="${this.userImgSrc}" style="display:block; width:100%; height:100%;" />`;
            }

            const loadHandler = () => {
                this.applyStartConfig(this.currentCase);
                this.render();
                stateManager.set('case.variant', 'custom');
                stateManager.set('case.customLogo', this.userImgSrc);
                
                document.getElementById('wood-case-loader').style.display = 'none';
            };

            if (this.isSvg) {
                loadHandler();
            } else {
                const img = document.querySelector('#user-logo-container img');
                img.onload = loadHandler;
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

    render() {
        const dev = this.getDevice();
        const res = CASE_GEOMETRY.res[dev];
        const caseData = CASE_GEOMETRY.cases[this.currentCase][dev];
        const svg = document.getElementById('wood-case-svg');
        svg.setAttribute('viewBox', res.vb);

        const bg = document.getElementById('wood-case-bg');
        bg.setAttribute('href', CASE_IMAGES[this.currentCase][dev]);
        bg.setAttribute('x', caseData.x); bg.setAttribute('y', caseData.y);
        bg.setAttribute('width', caseData.w); bg.setAttribute('height', caseData.h);

        const fo = document.getElementById('wood-case-perspective-fo');
        const vbParts = res.vb.split(' ');
        fo.setAttribute('width', vbParts[2]); fo.setAttribute('height', vbParts[3]);

        document.getElementById('info-res-tag').textContent = dev.toUpperCase();
        document.getElementById('info-mm-tag').textContent = CASE_GEOMETRY.cases[this.currentCase].mm + ' мм';

        const container = document.getElementById('user-logo-container');
        if (this.userImgSrc) {
            container.style.display = 'block';
            if (this.isSvg) {
                container.style.filter = 'grayscale(1) brightness(0) url(#woodBurnFilter)';
                container.style.mixBlendMode = 'multiply';
                container.style.opacity = '0.9';
            } else {
                container.style.filter = 'grayscale(1) contrast(1.2) brightness(0)  url(#burnFilterSVG) ';
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
            plane.style.width = srcW + 'px'; plane.style.height = srcH + 'px';
            plane.style.transform = `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
            this.updateTransform();
        }
    },

    updateTransform() {
        if(!this.userImgSrc) return;
        const state = this.history[this.currentCase];
        const container = document.getElementById('user-logo-container');
        let bW, bH;
        if (this.isSvg) {
            bW = 550; bH = 550 / this.svgRatio;
        } else {
            const img = container.querySelector('img');
            bW = img ? img.naturalWidth : 100; bH = img ? img.naturalHeight : 100;
        }
        container.style.width = bW + 'px'; container.style.height = bH + 'px';
        container.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;

        stateManager.set('case.logoTransform', { x: state.x, y: state.y, scale: state.scale });
        const pxPerMM = this.getPixelsPerMM(this.currentCase);
        const width_mm = Math.round((bW * state.scale) / pxPerMM);
        stateManager.set('case.logoWidthMM', width_mm);

        this.drawRulers();
    },

    setupInteract() {
        const isMobile = window.innerWidth <= 768;
        const sensitivity = isMobile ? 1.5 : 1;

        interact('#wood-case-logo-wrapper').gesturable({
            onmove: (e) => {
                const state = this.history[this.currentCase];
                // Increase pinch-zoom range/sensitivity
                const ds = e.ds * sensitivity * 2;
                state.scale *= (1 + ds);
                // Clamp scale
                state.scale = Math.max(0.01, Math.min(5, state.scale));
                this.updateTransform();
                this.showRulers();
            }
        }).draggable({
            onmove: (e) => {
                const state = this.history[this.currentCase];
                // Increase sensitivity for touch dragging
                state.x += e.dx * sensitivity;
                state.y += e.dy * sensitivity;
                this.updateTransform();
                this.showRulers();
            }
        });
        document.getElementById('wood-case-logo-wrapper').addEventListener('wheel', (e) => {
            e.preventDefault();
            const state = this.history[this.currentCase];
            const delta = e.deltaY > 0 ? 0.95 : 1.05;
            state.scale *= delta;
            this.updateTransform();
            this.showRulers();
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

    drawRulers() {
        if (!this.userImgSrc || !this.currentMatrix) return;
        const state = this.history[this.currentCase], container = document.getElementById('user-logo-container');
        const bW = parseFloat(container.style.width), bH = parseFloat(container.style.height);
        const cW = bW * state.scale, cH = bH * state.scale;
        const plane = document.getElementById('wood-case-perspective-plane');
        const pW = parseFloat(plane.style.width), pH = parseFloat(plane.style.height);
        const iTLx = (pW/2 + state.x) - cW/2, iTLy = (pH/2 + state.y) - cH/2;
        const pxPerMM = this.getPixelsPerMM(this.currentCase);

        const top_mm = Math.round(iTLy / pxPerMM);
        const left_mm = Math.round(iTLx / pxPerMM);

        document.getElementById('info-top-tag').textContent = top_mm + ' мм';
        document.getElementById('info-left-tag').textContent = left_mm + ' мм';

        // Update manual inputs
        const topInput = document.getElementById('input-case-top');
        const leftInput = document.getElementById('input-case-left');
        const widthInput = document.getElementById('input-case-width');
        if (topInput && document.activeElement !== topInput) topInput.value = top_mm;
        if (leftInput && document.activeElement !== leftInput) leftInput.value = left_mm;
        if (widthInput && document.activeElement !== widthInput) widthInput.value = Math.round(cW / pxPerMM);

        stateManager.set('case.logoOffsetMM', { top: top_mm, left: left_mm });

        const sCorners = [{x:iTLx,y:iTLy},{x:iTLx+cW,y:iTLy},{x:iTLx+cW,y:iTLy+cH},{x:iTLx,y:iTLy+cH}].map(p => this.projectPoint(p.x, p.y, this.currentMatrix));
        const pTL = sCorners[0], pTR = sCorners[1], pBL = sCorners[3];

        const getOff = (p1, p2, d) => {
            const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx*dx + dy*dy);
            return { x: (-dy/len)*d, y: (dx/len)*d };
        };

        const tO = getOff(pTL, pTR, -15), lO = getOff(pBL, pTL, -15);
        const tr1 = {x:pTL.x+tO.x, y:pTL.y+tO.y}, tr2 = {x:pTR.x+tO.x, y:pTR.y+tO.y};
        const lr1 = {x:pTL.x+lO.x, y:pTL.y+lO.y}, lr2 = {x:pBL.x+lO.x, y:pBL.y+lO.y};

        document.getElementById('wood-case-rulers-group').innerHTML = `
            <line class="ruler-line" x1="${tr1.x}" y1="${tr1.y}" x2="${tr2.x}" y2="${tr2.y}" />
            <line class="ruler-tick" x1="${pTL.x}" y1="${pTL.y}" x2="${tr1.x}" y2="${tr1.y}" />
            <line class="ruler-tick" x1="${pTR.x}" y1="${pTR.y}" x2="${tr2.x}" y2="${tr2.y}" />
            <text class="r-text" x="${(tr1.x+tr2.x)/2}" y="${(tr1.y+tr2.y)/2-5}" text-anchor="middle">${Math.round(cW/pxPerMM)} мм</text>
            <line class="ruler-line" x1="${lr1.x}" y1="${lr1.y}" x2="${lr2.x}" y2="${lr2.y}" />
            <line class="ruler-tick" x1="${pTL.x}" y1="${pTL.y}" x2="${lr1.x}" y2="${lr1.y}" />
            <line class="ruler-tick" x1="${pBL.x}" y1="${pBL.y}" x2="${lr2.x}" y2="${lr2.y}" />
            <text class="r-text" x="${(lr1.x+lr2.x)/2-10}" y="${(lr1.y+lr2.y)/2}" text-anchor="end" dominant-baseline="middle">${Math.round(cH/pxPerMM)} мм</text>
        `;
    },

    showRulers() {
        const g = document.getElementById('wood-case-rulers-group'); g.classList.add('visible');
        clearTimeout(this.timer); this.timer = setTimeout(() => g.classList.remove('visible'), 3000);
    },

    setupRulerEvents() {
        [document.getElementById('wood-case-logo-wrapper'), document.getElementById('wood-case-bg')].forEach(el => {
            if(el) {
                el.addEventListener('click', () => this.showRulers());
                el.addEventListener('mouseenter', () => this.showRulers());
            }
        });
    },

    clearLogo() {
        this.userImgSrc = null;
        const c = document.getElementById('user-logo-container');
        c.style.display = 'none';
        c.innerHTML = '';
        document.getElementById('wood-case-rulers-group').innerHTML = '';
        ['info-top-tag', 'info-left-tag', 'info-res-tag'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.textContent = '-';
        });
        document.getElementById('case-clear-btn').style.display = 'none';
        document.getElementById('case-positioning-controls').style.display = 'none';
        document.getElementById('case-file-input').value = '';

        stateManager.set('case.variant', 'standard');
        stateManager.set('case.customLogo', null);
        stateManager.set('case.logoWidthMM', 0);
    }
};

export function toggleLaserEngraving() {
    const currentState = stateManager.get();
    const isLaserEnabled = currentState.case?.laserEngraving || false;
    
    // Toggle the state
    const newState = !isLaserEnabled;
    stateManager.set('case.laserEngraving', newState);
    
    // Price will be calculated by price calculator based on case.laserEngravingEnabled state
    
    // Update UI
    const casePriceRow = document.getElementById('case-price-row');
    if (casePriceRow) {
        const currentPrice = stateManager.get().prices?.case || 0;
        casePriceRow.textContent = currentPrice > 0 ? `+${currentPrice}₽` : '0₽';
    }
    
    // Show/hide upload sections inside #submenu-case
    const uploadSections = document.querySelectorAll('#submenu-case .submenu-section');
    const laserDataSection = document.querySelector('.toggle-laser-engraving-data');
    
    if (newState) {
        // Laser engraving enabled - show upload sections
        uploadSections.forEach(section => {
            if (!section.closest('.toggle-laser-engraving-data')) {
                section.style.display = 'block';
            }
        });
        if (laserDataSection) laserDataSection.style.display = 'block';
    } else {
        // Laser engraving disabled - hide upload sections
        uploadSections.forEach(section => {
            if (!section.closest('.toggle-laser-engraving-data')) {
                section.style.display = 'none';
            }
        });
        if (laserDataSection) laserDataSection.style.display = 'none';
    }
    
    console.log(`[Wood Case] Laser engraving ${newState ? 'enabled' : 'disabled'}, price: ${casePrice}₽`);
}

export function initializeWoodCase() {
    WoodCase.init();
    // Make it globally accessible for now for easier integration
    window.WoodCase = WoodCase;
}
