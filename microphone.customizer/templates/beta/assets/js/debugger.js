// ============================================
// DEBUGGER FOR CUSTOMIZER
// ============================================

import { swatchStorage } from './modules/swatch-storage.js';

window.debugCustomizer = {
    
    /**
     * Check all palette containers
     */
    checkContainers() {
        console.log('=== DEBUG: Checking all containers ===');
        
        const sections = ['spheres', 'body', 'shockmount', 'pins', 'logobg'];
        sections.forEach(section => {
            console.log(`\n--- Section: ${section} ---`);
            
            // Check palette container
            const paletteContainer = document.getElementById(`pal-${section}`);
            console.log(`Palette container (pal-${section}):`, paletteContainer);
            if (paletteContainer) {
                console.log(`  Children count: ${paletteContainer.children.length}`);
                console.log(`  Display: ${paletteContainer.style.display}`);
                console.log(`  Visibility: ${window.getComputedStyle(paletteContainer).display}`);
            } else {
                console.log(`  ❌ NOT FOUND`);
            }
            
            // Check quick-select container
            const quickContainer = document.getElementById(`quick-select-${section}`);
            console.log(`Quick container (quick-select-${section}):`, quickContainer);
            if (quickContainer) {
                console.log(`  Children count: ${quickContainer.children.length}`);
                console.log(`  Display: ${quickContainer.style.display}`);
                console.log(`  Visibility: ${window.getComputedStyle(quickContainer).display}`);
            } else {
                console.log(`  ❌ NOT FOUND`);
            }
            
            // Check wrapper
            const wrapper = document.getElementById(`palette-wrapper-${section}`);
            console.log(`Wrapper (palette-wrapper-${section}):`, wrapper);
            if (wrapper) {
                console.log(`  Display: ${wrapper.style.display}`);
                console.log(`  Visibility: ${window.getComputedStyle(wrapper).display}`);
            } else {
                console.log(`  ❌ NOT FOUND`);
            }
            
            // Check special pins containers
            if (section === 'pins') {
                const pinsQuick = document.getElementById('quick-select-shockmount-pins');
                const pinsPalette = document.getElementById('pal-pins');
                console.log(`Pins quick (quick-select-shockmount-pins):`, pinsQuick || '❌ NOT FOUND');
                console.log(`Pins palette (pal-pins):`, pinsPalette || '❌ NOT FOUND');
            }
        });
        
        // Check storage containers
        console.log('\n--- Storage Containers ---');
        const ralStorage = document.getElementById('ral-storage');
        const variantStorage = document.getElementById('variant-storage');
        console.log('RAL Storage:', ralStorage);
        console.log('  Children count:', ralStorage ? ralStorage.children.length : 'not found');
        console.log('Variant Storage:', variantStorage);
        console.log('  Children count:', variantStorage ? variantStorage.children.length : 'not found');
    },
    
    /**
     * Test palette opening for a specific section
     */
    testPalette(section) {
        console.log(`=== DEBUG: Testing palette for ${section} ===`);
        
        const paletteContainer = document.getElementById(`pal-${section}`);
        console.log('Palette container:', paletteContainer);
        
        if (paletteContainer) {
            console.log('Before opening:');
            console.log(`  Children count: ${paletteContainer.children.length}`);
            
            // Force open palette
            swatchStorage.openPalette(section);
            
            setTimeout(() => {
                console.log('After opening:');
                console.log(`  Children count: ${paletteContainer.children.length}`);
                
                // Log first few children
                for (let i = 0; i < Math.min(5, paletteContainer.children.length); i++) {
                    const child = paletteContainer.children[i];
                    console.log(`  Child ${i}:`, {
                        tag: child.tagName,
                        classes: child.className,
                        ral: child.dataset.ral,
                        color: child.dataset.color,
                        style: child.style.backgroundColor
                    });
                }
            }, 200);
        }
    },
    
    /**
     * Test quick-select for a specific section
     */
    testQuickSelect(section) {
        console.log(`=== DEBUG: Testing quick-select for ${section} ===`);
        
        const quickContainer = document.getElementById(`quick-select-${section}`);
        console.log('Quick container:', quickContainer);
        
        if (quickContainer) {
            console.log('Before population:');
            console.log(`  Children count: ${quickContainer.children.length}`);
            
            // Force populate quick-select
            swatchStorage.populateQuickSelect(section);
            
            setTimeout(() => {
                console.log('After population:');
                console.log(`  Children count: ${quickContainer.children.length}`);
                
                // Log first few children
                for (let i = 0; i < Math.min(5, quickContainer.children.length); i++) {
                    const child = quickContainer.children[i];
                    console.log(`  Child ${i}:`, {
                        tag: child.tagName,
                        classes: child.className,
                        value: child.dataset.value,
                        section: child.dataset.section
                    });
                }
            }, 200);
        }
    },
    
    /**
     * Show storage stats
     */
    showStorageStats() {
        console.log('=== DEBUG: Storage Stats ===');
        console.log('RAL Swatches:', swatchStorage.ralSwatches.size);
        console.log('Variant Items:', swatchStorage.variantItems.size);
        console.log('Current Open Section:', swatchStorage.currentOpenSection);
    }
};

console.log('🔍 Customizer debugger loaded! Use window.debugCustomizer.checkContainers(), testPalette(), testQuickSelect(), or showStorageStats()');
