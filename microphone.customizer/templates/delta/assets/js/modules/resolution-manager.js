import { DEVICE_TIER_MAP, RESOLUTION_BASE_LAYERS } from '../config/layer-mapping.config.js';
import { debugDeviceTier, debugSVGLayers } from '../debug.js';

/**
 * Resolution Manager - handles ONLY pure resolution/resource layer switching
 * 
 * IMPORTANT: This module MUST NOT interfere with color/material-dependent layers:
 * - NO *-original layers (spheres-original-*, body-original-*)
 * - NO *-color* layers (spheres-color*, body-color*)
 * - NO *-mono* layers (spheres-mono*, body-mono*)
 * 
 * Only handles pure resolution variants like img-grill-mic-1/2/3
 * Color/material switching is handled by color-utils.js + SECTION_LAYER_MAP
 */

class ResolutionManager {
  constructor() {
    this.currentTier = this.detectDeviceTier();
    this.init();
  }

  detectDeviceTier() {
    const width = window.innerWidth;
    
    if (width >= 3840) return '4k';
    if (width >= 1280) return 'hd';
    return 'tablet';
  }

  init() {
    // Apply initial resolution layers
    this.applyResolutionLayers(this.currentTier);
    
    // Listen for resize events with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newTier = this.detectDeviceTier();
        if (newTier !== this.currentTier) {
          this.currentTier = newTier;
          this.applyResolutionLayers(newTier);
        }
      }, 300);
    });
  }

  applyResolutionLayers(deviceTier) {
    const svg = document.querySelector('#microphone-svg-container svg');
    if (!svg) return;

    const index = DEVICE_TIER_MAP[deviceTier];
    const activeLayers = [];

    RESOLUTION_BASE_LAYERS.forEach(baseId => {
      const layers = [];
      
      // Check for original layers
      for (let i = 1; i <= 3; i++) {
        const orig = svg.querySelector(`#${baseId}-${i}`);
        if (orig) {
          const display = i === index ? 'inline' : 'none';
          orig.style.display = display;
          
          if (display === 'inline') {
            layers.push({ id: `${baseId}-${i}`, display });
          }
        }
      }

      // Handle special case for img-grill-mic (no suffix variants)
      if (baseId === 'img-grill-mic') {
        const grill = svg.querySelector(`#${baseId}${index}`);
        if (grill) {
          grill.style.display = 'inline';
          layers.push({ id: `${baseId}${index}`, display: 'inline' });
        }
        
        // Hide other grill variants
        for (let i = 1; i <= 3; i++) {
          if (i !== index) {
            const otherGrill = svg.querySelector(`#${baseId}${i}`);
            if (otherGrill) {
              otherGrill.style.display = 'none';
            }
          }
        }
      }

      activeLayers.push(...layers);
    });

    debugDeviceTier(deviceTier, activeLayers);
  }

  getCurrentTier() {
    return this.currentTier;
  }

  // Force refresh with current tier
  refresh() {
    this.applyResolutionLayers(this.currentTier);
  }
}

// Create singleton instance
export const resolutionManager = new ResolutionManager();
export default resolutionManager;
