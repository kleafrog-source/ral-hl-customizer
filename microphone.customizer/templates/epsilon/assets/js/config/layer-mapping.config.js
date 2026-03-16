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
  logo: {
    'standard': {
      originals: ['logotype-gold'],
      standardGroup: 'logo-letters-and-frame',
      malfaGroup: 'malfa-logo-text-path',
      customGroup: 'custom-logo-layer'
    }
  },
  shockmount: {
    'standard': {
      originals: ['layer9', 'layer10'],
      colorizedGroup: 'shockmount-frame-colorized',
      monoGroup: 'shockmount-frame-mono'
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
