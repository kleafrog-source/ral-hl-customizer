/**
 * Declarative viewport layout presets for eta camera states.
 *
 * Source of truth:
 * - desktop / tablet / mobile-landscape are exact inversions of the archived
 *   SHARED_GLOBAL_VIEW_LAYER_OVERRIDES vw-based direct-view states.
 * - mobile-portrait is an exact inversion of the archived
 *   MOBILE_PORTRAIT_LAYER_OVERRIDES vw-based direct-view states.
 *
 * Fully declarative coverage: 017-TUBE, 017-FET, 023-BOMBLET-NO-SHOCKMOUNT,
 * 023-BOMBLET-WITH-SHOCKMOUNT, 023-MALFA, 023-DELUXE across
 * global-view, mic-active, shockmount-active, case-active, logo-view.
 *
 * Notes for manual QA:
 * - 023-BOMBLET-NO-SHOCKMOUNT / shockmount-active on wide devices is a
 *   synthetic fallback to global-view because the archived wide direct-view set
 *   did not define a dedicated state for a missing shockmount.
 * - Mobile portrait values are sourced from the previously approved negative/
 *   tight-offset setup, but they should still be visually spot-checked in the browser.
 * - Tablet keeps the wide microphone/case framing, but shockmount sizing is
 *   intentionally aligned to the mobile portrait set because the wide shockmount
 *   appeared too large on real tablet devices.
 */
const SHARED_WIDE_LAYOUT_PRESETS = Object.freeze({
    "017-TUBE": {
        "global-view": {
            "microphone": {
                "x": 0.07,
                "y": 0.08,
                "width": 0.1584,
                "height": 0.66,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.18,
                "y": 0.25,
                "width": 0.2108,
                "height": 0.3162,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.1,
                "y": 0.04,
                "width": 0.847,
                "height": 0.6534,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.7585,
                "y": 0.014,
                "width": 0.24552,
                "height": 1.023,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.929,
                "y": 0.2465,
                "width": 0.32674,
                "height": 0.49011,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.7585,
                "y": -0.048,
                "width": 1.31285,
                "height": 1.01277,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 0.391,
                "y": -0.106,
                "width": 0.36432,
                "height": 1.518,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.644,
                "y": 0.239,
                "width": 0.48484,
                "height": 0.72726,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.391,
                "y": -0.198,
                "width": 1.9481,
                "height": 1.50282,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.023,
                "y": 0.068,
                "width": 0.17424,
                "height": 0.726,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.637,
                "y": 0.376,
                "width": 0.34408,
                "height": 0.51612,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.087,
                "y": 0.024,
                "width": 0.9317,
                "height": 0.71874,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.951,
                "y": -0.016,
                "width": 0.36432,
                "height": 1.518,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 1.204,
                "y": 0.329,
                "width": 0.48484,
                "height": 0.72726,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.951,
                "y": -0.108,
                "width": 1.9481,
                "height": 1.50282,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "017-FET": {
        "global-view": {
            "microphone": {
                "x": 0.33,
                "y": 0.06,
                "width": 0.1968,
                "height": 0.82,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.43,
                "y": 0.2,
                "width": 0.2992,
                "height": 0.4488,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.09,
                "y": 0.02,
                "width": 0.854,
                "height": 0.6588,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.576,
                "y": 0.022,
                "width": 0.23616,
                "height": 0.984,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.696,
                "y": 0.19,
                "width": 0.35904,
                "height": 0.53856,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.072,
                "y": -0.026,
                "width": 1.0248,
                "height": 0.79056,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 0.827,
                "y": -0.006,
                "width": 0.37392,
                "height": 1.558,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 1.017,
                "y": 0.26,
                "width": 0.56848,
                "height": 0.85272,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.029,
                "y": -0.082,
                "width": 1.6226,
                "height": 1.25172,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.104,
                "y": 0.063,
                "width": 0.19008,
                "height": 0.792,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.687,
                "y": 0.272,
                "width": 0.32912,
                "height": 0.49368,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.071,
                "y": 0.052,
                "width": 0.9394,
                "height": 0.72468,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.827,
                "y": -0.006,
                "width": 0.37392,
                "height": 1.558,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 1.017,
                "y": 0.26,
                "width": 0.56848,
                "height": 0.85272,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.029,
                "y": -0.082,
                "width": 1.6226,
                "height": 1.25172,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-BOMBLET-NO-SHOCKMOUNT": {
        "global-view": {
            "microphone": {
                "x": 0.36,
                "y": 0.02,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.25,
                "y": 0.19,
                "width": 0.2992,
                "height": 0.4488,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.22,
                "y": 0.03,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.664,
                "y": -0.002,
                "width": 0.29568,
                "height": 1.232,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.19,
                "y": 0.236,
                "width": 0.41888,
                "height": 0.62832,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.468,
                "y": 0.02,
                "width": 1.2642,
                "height": 0.97524,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 0.36,
                "y": 0.02,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.25,
                "y": 0.19,
                "width": 0.2992,
                "height": 0.4488,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.22,
                "y": 0.03,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.1955,
                "y": 0.0315,
                "width": 0.2268,
                "height": 0.945,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.3925,
                "y": 0.1995,
                "width": 0.31416,
                "height": 0.47124,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.101,
                "y": 0.0315,
                "width": 0.94815,
                "height": 0.73143,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.84,
                "y": -0.05,
                "width": 0.4224,
                "height": 1.76,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.38,
                "y": 0.29,
                "width": 0.5984,
                "height": 0.8976,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.56,
                "y": -0.03,
                "width": 1.806,
                "height": 1.3932,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-BOMBLET-WITH-SHOCKMOUNT": {
        "global-view": {
            "microphone": {
                "x": 0.36,
                "y": 0.02,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.11,
                "y": 0.19,
                "width": 0.2992,
                "height": 0.4488,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.22,
                "y": 0.03,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.664,
                "y": -0.002,
                "width": 0.29568,
                "height": 1.232,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.314,
                "y": 0.236,
                "width": 0.41888,
                "height": 0.62832,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.468,
                "y": 0.012,
                "width": 1.2642,
                "height": 0.97524,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.018,
                "y": -0.074,
                "width": 0.38016,
                "height": 1.584,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.568,
                "y": 0.232,
                "width": 0.53856,
                "height": 0.80784,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.766,
                "y": -0.056,
                "width": 1.6254,
                "height": 1.25388,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.6155,
                "y": 0.0315,
                "width": 0.252,
                "height": 1.05,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.004,
                "y": 0.2625,
                "width": 0.34272,
                "height": 0.51408,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.101,
                "y": 0.0315,
                "width": 0.94815,
                "height": 0.73143,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.84,
                "y": -0.05,
                "width": 0.4224,
                "height": 1.76,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.34,
                "y": 0.29,
                "width": 0.5984,
                "height": 0.8976,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.56,
                "y": -0.03,
                "width": 1.806,
                "height": 1.3932,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-MALFA": {
        "global-view": {
            "microphone": {
                "x": 0.38,
                "y": -0.01,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.07,
                "y": 0.16,
                "width": 0.3128,
                "height": 0.4692,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.21,
                "y": 0.01,
                "width": 0.84,
                "height": 0.648,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.6412,
                "y": -0.0174,
                "width": 0.2976,
                "height": 1.24,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.2568,
                "y": 0.1934,
                "width": 0.387872,
                "height": 0.581808,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.4304,
                "y": 0.0074,
                "width": 1.0416,
                "height": 0.80352,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.018,
                "y": -0.116,
                "width": 0.384,
                "height": 1.6,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.522,
                "y": 0.156,
                "width": 0.50048,
                "height": 0.75072,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.746,
                "y": -0.084,
                "width": 1.344,
                "height": 1.0368,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.6,
                "y": 0.01,
                "width": 0.264,
                "height": 1.1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.02,
                "y": 0.22,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.11,
                "y": 0.01,
                "width": 0.84,
                "height": 0.648,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.838,
                "y": -0.111,
                "width": 0.504,
                "height": 2.1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.187,
                "y": 0.246,
                "width": 0.65688,
                "height": 0.98532,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.481,
                "y": -0.069,
                "width": 1.764,
                "height": 1.3608,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-DELUXE": {
        "global-view": {
            "microphone": {
                "x": 0.5,
                "y": 0.01,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.05,
                "y": 0.17,
                "width": 0.272,
                "height": 0.408,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.02,
                "y": 0,
                "width": 0.672,
                "height": 0.5184,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.71,
                "y": -0.016,
                "width": 0.29568,
                "height": 1.232,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.08,
                "y": 0.208,
                "width": 0.3808,
                "height": 0.5712,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.038,
                "y": -0.03,
                "width": 0.9408,
                "height": 0.72576,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.35,
                "y": -0.122,
                "width": 0.38016,
                "height": 1.584,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.54,
                "y": 0.166,
                "width": 0.4896,
                "height": 0.7344,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.486,
                "y": -0.14,
                "width": 1.2096,
                "height": 0.93312,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.7656,
                "y": 0.044,
                "width": 0.18096,
                "height": 0.754,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.061,
                "y": 0.382,
                "width": 0.3978,
                "height": 0.5967,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.126,
                "y": 0.07,
                "width": 0.8736,
                "height": 0.67392,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.93,
                "y": -0.078,
                "width": 0.46464,
                "height": 1.936,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.06,
                "y": 0.274,
                "width": 0.5984,
                "height": 0.8976,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.126,
                "y": -0.1,
                "width": 1.4784,
                "height": 1.14048,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    }
});

const MOBILE_PORTRAIT_LAYOUT_PRESETS = Object.freeze({
    "017-TUBE": {
        "global-view": {
            "microphone": {
                "x": 0.06,
                "y": 0.21,
                "width": 0.144,
                "height": 0.6,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.02,
                "y": 0.32,
                "width": 0.1122,
                "height": 0.1683,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.02,
                "y": 0.49,
                "width": 0.7,
                "height": 0.54,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.38,
                "y": 0.04,
                "width": 0.252,
                "height": 1.05,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.56,
                "y": 0.24,
                "width": 0.2108,
                "height": 0.3162,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.23,
                "y": 0.49,
                "width": 0.987,
                "height": 0.7614,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": -0.01,
                "y": 0.1,
                "width": 0.1104,
                "height": 0.46,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.11,
                "y": 0.18,
                "width": 0.136,
                "height": 0.204,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.31,
                "y": 0.3,
                "width": 0.42,
                "height": 0.324,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.23,
                "y": 0.02,
                "width": 0.1584,
                "height": 0.66,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.73,
                "y": 0.47,
                "width": 0.1598,
                "height": 0.2397,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.01,
                "y": 0.51,
                "width": 0.7,
                "height": 0.54,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.02,
                "y": 0.08,
                "width": 0.168,
                "height": 0.7,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.56,
                "y": 0.16,
                "width": 0.136,
                "height": 0.204,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.76,
                "y": 0.6,
                "width": 0.847,
                "height": 0.6534,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "017-FET": {
        "global-view": {
            "microphone": {
                "x": 0.2,
                "y": 0.18,
                "width": 0.168,
                "height": 0.7,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.16,
                "y": 0.33,
                "width": 0.136,
                "height": 0.204,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0,
                "y": 0.65,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.17,
                "y": 0.21,
                "width": 0.156,
                "height": 0.65,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.09,
                "y": 0.36,
                "width": 0.1258,
                "height": 0.1887,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.04,
                "y": 0.71,
                "width": 1.015,
                "height": 0.783,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": -0.11,
                "y": 0.02,
                "width": 0.1968,
                "height": 0.82,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.11,
                "y": 0.12,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.18,
                "y": 0.13,
                "width": 0.7,
                "height": 0.54,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.24,
                "y": 0.27,
                "width": 0.1488,
                "height": 0.62,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.48,
                "y": 0.34,
                "width": 0.1632,
                "height": 0.2448,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.11,
                "y": 0.72,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.26,
                "y": 0.06,
                "width": 0.1968,
                "height": 0.82,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.34,
                "y": 0.21,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.13,
                "y": 0.46,
                "width": 0.7,
                "height": 0.54,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-BOMBLET-NO-SHOCKMOUNT": {
        "global-view": {
            "microphone": {
                "x": 0.22,
                "y": 0.11,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.27,
                "y": 0.26,
                "width": 0.1598,
                "height": 0.2397,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.17,
                "y": 0.77,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.3,
                "y": 0,
                "width": 0.192,
                "height": 0.8,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.39,
                "y": 0.21,
                "width": 0.1496,
                "height": 0.2244,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.18,
                "y": 0.6,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 0.59,
                "y": 0,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.2,
                "y": 0.14,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.22,
                "y": 0.03,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.18,
                "y": 0.08,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.27,
                "y": 0.26,
                "width": 0.1598,
                "height": 0.2397,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.12,
                "y": 0.8,
                "width": 1.008,
                "height": 0.7776,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.31,
                "y": -0.05,
                "width": 0.3024,
                "height": 1.26,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.41,
                "y": 0.22,
                "width": 0.136,
                "height": 0.204,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.36,
                "y": 0.63,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-BOMBLET-WITH-SHOCKMOUNT": {
        "global-view": {
            "microphone": {
                "x": 0.34,
                "y": 0.11,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.27,
                "y": 0.28,
                "width": 0.1598,
                "height": 0.2397,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.22,
                "y": 0.73,
                "width": 0.931,
                "height": 0.7182,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.37,
                "y": 0,
                "width": 0.264,
                "height": 1.1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.28,
                "y": 0.23,
                "width": 0.1496,
                "height": 0.2244,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.35,
                "y": 0.66,
                "width": 0.931,
                "height": 0.7182,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 0.59,
                "y": 0,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.2,
                "y": 0.14,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.22,
                "y": 0.03,
                "width": 0.931,
                "height": 0.7182,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.84,
                "y": 0.16,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.4,
                "y": 0.44,
                "width": 0.1496,
                "height": 0.2244,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.12,
                "y": 0.8,
                "width": 1.008,
                "height": 0.7776,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.31,
                "y": -0.05,
                "width": 0.3024,
                "height": 1.26,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.41,
                "y": 0.22,
                "width": 0.136,
                "height": 0.204,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.36,
                "y": 0.63,
                "width": 0.931,
                "height": 0.7182,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-MALFA": {
        "global-view": {
            "microphone": {
                "x": 0.09,
                "y": 0.05,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.06,
                "y": 0.35,
                "width": 0.1632,
                "height": 0.2448,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.31,
                "y": 0.8,
                "width": 1.05,
                "height": 0.81,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.22,
                "y": -0.02,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.47,
                "y": 0.24,
                "width": 0.1496,
                "height": 0.2244,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.34,
                "y": 0.8,
                "width": 1.26,
                "height": 0.972,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": -0.16,
                "y": -0.23,
                "width": 0.36,
                "height": 1.5,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.05,
                "y": 0.1,
                "width": 0.3128,
                "height": 0.4692,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.52,
                "y": 0.58,
                "width": 1.19,
                "height": 0.918,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.17,
                "y": 0.18,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.46,
                "y": 0.38,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.2,
                "y": 0.8,
                "width": 1.008,
                "height": 0.7776,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.33,
                "y": 0.02,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.38,
                "y": 0.31,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.37,
                "y": 0.75,
                "width": 0.84,
                "height": 0.648,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-DELUXE": {
        "global-view": {
            "microphone": {
                "x": 0.16,
                "y": 0.13,
                "width": 0.192,
                "height": 0.8,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.11,
                "y": 0.32,
                "width": 0.136,
                "height": 0.204,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.09,
                "y": 0.61,
                "width": 0.91,
                "height": 0.702,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.39,
                "y": 0,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.42,
                "y": 0.2,
                "width": 0.187,
                "height": 0.2805,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.05,
                "y": 0.52,
                "width": 0.91,
                "height": 0.702,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1,
                "y": -0.01,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.01,
                "y": 0.06,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.29,
                "y": 0.33,
                "width": 0.84,
                "height": 0.648,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.118,
                "y": 0.18,
                "width": 0.168,
                "height": 0.7,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.72,
                "y": 0.24,
                "width": 0.306,
                "height": 0.459,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.14,
                "y": 0.78,
                "width": 1.05,
                "height": 0.81,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.47,
                "y": 0,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.58,
                "y": 0.15,
                "width": 0.204,
                "height": 0.306,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.05,
                "y": 0.22,
                "width": 0.672,
                "height": 0.5184,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    }
});

function buildTabletLayoutPresets() {
    return Object.freeze(
        Object.fromEntries(
            Object.entries(SHARED_WIDE_LAYOUT_PRESETS).map(([modelKey, states]) => [
                modelKey,
                Object.freeze(
                    Object.fromEntries(
                        Object.entries(states).map(([stateName, layers]) => {
                            const tabletShockmount = layers.shockmount;
                            const mobileShockmount = MOBILE_PORTRAIT_LAYOUT_PRESETS[modelKey]?.[stateName]?.shockmount;

                            return [
                                stateName,
                                Object.freeze({
                                    ...layers,
                                    shockmount: (tabletShockmount && mobileShockmount)
                                        ? Object.freeze({
                                            ...tabletShockmount,
                                            width: mobileShockmount.width,
                                            height: mobileShockmount.height
                                        })
                                        : tabletShockmount
                                })
                            ];
                        })
                    )
                )
            ])
        )
    );
}

const TABLET_LAYOUT_PRESETS = buildTabletLayoutPresets();

export const VIEWPORT_LAYOUT_PRESETS = Object.freeze({
    desktop: SHARED_WIDE_LAYOUT_PRESETS,
    tablet: TABLET_LAYOUT_PRESETS,
    'mobile-landscape': SHARED_WIDE_LAYOUT_PRESETS,
    'mobile-portrait': MOBILE_PORTRAIT_LAYOUT_PRESETS
});
