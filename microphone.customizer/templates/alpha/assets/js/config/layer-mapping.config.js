// Layer mapping configuration for SVG sections
export const SECTION_LAYER_MAP = {
  spheres: {
    'spheres-default-satin-steel': {
      originals: ['spheres-original-3'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome',
      description: 'Сатинированная сталь'
    },
    'spheres-default-brass': {
      originals: ['spheres-original-2'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome',
      description: 'Классическая латунь'
    },
    'spheres-default-black': {
      originals: ['spheres-original-1'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome',
      description: 'Матовый черный'
    },
    'satinsteel': {
      originals: ['spheres-original-3'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome',
      description: 'Сатинированная сталь'
    },
    'classicbrass': {
      originals: ['spheres-original-2'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome',
      description: 'Классическая латунь'
    },
    'deepblack': {
      originals: ['spheres-original-1'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome',
      description: 'Матовый черный'
    },
    'spheres-ral-custom': {
      originals: ['spheres-original-1', 'spheres-original-2', 'spheres-original-3'],
      colorizedGroup: 'spheres-colorized',
      monoGroup: 'spheres-monochrome',
      description: 'RAL цвет (кастомный)'
    }
  },
  body: {
    'body-default-satin-steel': {
      originals: ['body-original-3'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome',
      description: 'Сатинированная сталь'
    },
    'body-default-pearl-white': {
      originals: ['body-original-2'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome',
      description: 'Жемчужно-белый'
    },
    'body-default-anthracite': {
      originals: ['body-original-1'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome',
      description: 'Матовый черный'
    },
    'pearlwhite': {
      originals: ['body-original-2'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome',
      description: 'Жемчужно-белый'
    },
    'satinsteel': {
      originals: ['body-original-3'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome',
      description: 'Сатинированная сталь'
    },
    'anthracite': {
      originals: ['body-original-1'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome',
      description: 'Матовый черный'
    },
    'body-ral-custom': {
      originals: ['body-original-1', 'body-original-2', 'body-original-3', 'body-original-4'],
      colorizedGroup: 'body-colorized',
      monoGroup: 'body-monochrome',
      description: 'RAL цвет (кастомный)'
    }
  },
  logobg: {
    'logobg-black': {
      originals: ['logobg-black'],
      colorizedGroup: 'logobg-colorized',
      monoGroup: 'logobg-monochrome',
      description: 'Черный фон'
    },
    'logobg-ral-custom': {
      originals: ['logobg-black'],
      colorizedGroup: 'logobg-colorized',
      monoGroup: 'logobg-monochrome',
      description: 'RAL цвет фона'
    }
  },
  shockmountPins: {
    'pins-brass': {
      originals: ['shockmount-017-pins-brass-group', 'shockmount-023-pins-brass-group'],
      colorizedGroup: null,
      monoGroup: null,
      description: 'Полированная латунь'
    },
    'pins-ral9006-free': {
      originals: ['shockmount-017-pins-brass-group', 'shockmount-023-pins-brass-group'],
      colorizedGroup: null,
      monoGroup: null,
      description: 'RAL 9006 (белый алюминий, бесплатный)',
      specialFilter: 'grayscale(1)'
    },
    'pins-RAL9005-free': {
      originals: [],
      colorizedGroup: 'g3',
      monoGroup: 'g4',
      description: 'RAL 9005 (матовый черный)',
      colorizedFilter: 'filter9',
      monoFilter: 'filter13',
      floodFilter: 'feFlood8'
    },
    'pins-RAL9010-free': {
      originals: [],
      colorizedGroup: 'g3',
      monoGroup: 'g4',
      description: 'RAL 9010 (чистый белый)',
      colorizedFilter: 'filter9',
      monoFilter: 'filter13',
      floodFilter: 'feFlood8'
    },
    'pins-RAL1013-free': {
      originals: [],
      colorizedGroup: 'g3',
      monoGroup: 'g4',
      description: 'RAL 1013 (жемчужно-белый)',
      colorizedFilter: 'filter9',
      monoFilter: 'filter13',
      floodFilter: 'feFlood8'
    },
    'pins-ral-custom': {
      originals: [],
      colorizedGroup: 'g3',
      monoGroup: 'g4',
      description: 'RAL цвет (платный)',
      colorizedFilter: 'filter9',
      monoFilter: 'filter13',
      floodFilter: 'feFlood8'
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
