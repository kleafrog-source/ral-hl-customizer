// Layer mapping configuration for SVG sections
// эти данные используются как резервные (fallback) или для группировки слоев
export const SECTION_LAYER_MAP = {
  spheres: {
    'standard': {
      originals: ['spheres-original-1', 'spheres-original-2', 'spheres-original-3'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome'
    }
  },
  body: {
    'standard': {
      originals: ['body-original-1', 'body-original-2', 'body-original-3', 'body-original-4'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome'
    }
  },
  logobg: {
    'standard': {
      originals: ['logobg-black'],
      colorizedGroup: 'logobg-colorized',
      monoGroup: 'logobg-monochrome'
    }
  },
  shockmount: {
    'standard': {
      originals: ['layer9', 'layer10'],
      colorizedGroup: null,
      monoGroup: null
    }
  },
  shockmountPins: {
    'standard': {
      originals: ['shockmount-017-pins-brass-group', 'shockmount-023-pins-brass-group'],
      colorizedGroup: 'g3',
      monoGroup: 'g4'
    }
  }
};

// Device tier mapping for resolution-specific layers
export const DEVICE_TIER_MAP = {
  '4k': 3,
  'hd': 2,
  'tablet': 1
};

// Base layer IDs that have resolution variants
// NOTE: Only include pure resolution/resource layers, NOT color/material-dependent layers
export const RESOLUTION_BASE_LAYERS = [
  'img-grill-mic'
  // Add other pure resolution base layers here if they exist in SVG
  // Examples: 'background', 'silhouette', 'frame' - but NOT *-original, *-color*, *-mono*
];
