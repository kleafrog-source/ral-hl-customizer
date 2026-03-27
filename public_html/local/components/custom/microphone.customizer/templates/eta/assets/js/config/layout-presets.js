/**
 * Declarative viewport layout presets for eta camera states.
 *
 * Source of truth:
 * - desktop is the approved wide baseline and is now treated as locked; do not
 *   retune desktop further unless there is an explicit regression report.
 * - tablet and mobile-landscape start from the desktop baseline and can now be
 *   tuned independently without risking accidental desktop regressions.
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
 * - Desktop values are approved and now treated as locked; future tuning should
 *   happen in the tablet/mobile-landscape sets instead of rewriting desktop.
 * - Mobile portrait values are sourced from the previously approved negative/
 *   tight-offset setup and are now treated as locked; do not retune
 *   mobile-portrait further unless there is an explicit regression report.
 * - Tablet keeps the wide microphone/case framing, but shockmount sizing is
 *   intentionally aligned to the mobile portrait set because the wide shockmount
 *   appeared too large on real tablet devices.
 */
const DESKTOP_LAYOUT_PRESETS = Object.freeze({
    "017-TUBE": {
        "global-view": {
            "microphone": {
                "x": 0.0913,
                "y": 0.0828,
                "width": 0.1584,
                "height": 0.66,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.2195,
                "y": 0.2693,
                "width": 0.2108,
                "height": 0.3162,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.1402,
                "y": 0.0361,
                "width": 0.847,
                "height": 0.6534,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.6188,
                "y": 0.0223,
                "width": 0.24552,
                "height": 1.023,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.9541,
                "y": 0.2338,
                "width": 0.32674,
                "height": 0.49011,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.5361,
                "y": -0.0872,
                "width": 1.05,
                "height": 0.81,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": -0.2361,
                "y": -0.1562,
                "width": 0.336,
                "height": 1.4,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.4443,
                "y": 0.1418,
                "width": 0.4216,
                "height": 0.6324,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.3789,
                "y": -0.2747,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.023,
                "y": 0.0636,
                "width": 0.1742,
                "height": 0.726,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.637,
                "y": 0.3997,
                "width": 0.3441,
                "height": 0.5161,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.1637,
                "y": 0.0604,
                "width": 0.7,
                "height": 0.54,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.743,
                "y": -0.0298,
                "width": 0.312,
                "height": 1.3,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 1.267,
                "y": 0.2909,
                "width": 0.4848,
                "height": 0.7273,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.0645,
                "y": -0.0379,
                "width": 0.7,
                "height": 0.54,
                "anchor": "center",
                "visible": false,
                "opacity": 0
            }
        }
    },
    "017-FET": {
        "global-view": {
            "microphone": {
                "x": 0.718,
                "y": 0.0589,
                "width": 0.1848,
                "height": 0.77,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.2508,
                "y": 0.2586,
                "width": 0.238,
                "height": 0.357,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.0452,
                "y": -0.0038,
                "width": 0.91,
                "height": 0.702,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.7635,
                "y": 0.0292,
                "width": 0.23616,
                "height": 0.984,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.0812,
                "y": 0.2198,
                "width": 0.359,
                "height": 0.5386,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.1611,
                "y": -0.116,
                "width": 1.05,
                "height": 0.81,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.3666,
                "y": -0.0148,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.4692,
                "y": 0.1562,
                "width": 0.408,
                "height": 0.612,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.3035,
                "y": -0.331,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.0622,
                "y": 0.0895,
                "width": 0.1901,
                "height": 0.792,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.4283,
                "y": 0.272,
                "width": 0.272,
                "height": 0.408,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.1234,
                "y": 0.0763,
                "width": 0.9394,
                "height": 0.7247,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.7503,
                "y": -0.0402,
                "width": 0.36,
                "height": 1.5,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.5413,
                "y": 0.1772,
                "width": 0.442,
                "height": 0.663,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": -0.0575,
                "y": -0.1024,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": false,
                "opacity": 0
            }
        }
    },
    "023-BOMBLET-NO-SHOCKMOUNT": {
        "global-view": {
            "microphone": {
                "x": 0.4071,
                "y": 0.0299,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.22,
                "y": 0.03,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.2405,
                "y": 0.0482,
                "width": 0.938,
                "height": 0.7236,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.7452,
                "y": 0.0057,
                "width": 0.264,
                "height": 1.1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.19,
                "y": 0.236,
                "width": 0.4189,
                "height": 0.6283,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.6889,
                "y": 0.0504,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.1221,
                "y": -0.2193,
                "width": 0.432,
                "height": 1.8,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.0422,
                "y": 0.0816,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.7067,
                "y": 1.5831,
                "width": 1.47,
                "height": 1.134,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.1348,
                "y": 0.0453,
                "width": 0.2268,
                "height": 0.945,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.3925,
                "y": 0.1995,
                "width": 0.3142,
                "height": 0.4712,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.1633,
                "y": 0.0552,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.7709,
                "y": -0.0599,
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
                "x": 0.8599,
                "y": -0.03,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": false,
                "opacity": 0
            }
        }
    },
    "023-BOMBLET-WITH-SHOCKMOUNT": {
        "global-view": {
            "microphone": {
                "x": 0.4071,
                "y": 0.0299,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.22,
                "y": 0.03,
                "width": 0.903,
                "height": 0.6966,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.2405,
                "y": 0.0482,
                "width": 0.938,
                "height": 0.7236,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.7058,
                "y": -0.0153,
                "width": 0.2957,
                "height": 1.232,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.1401,
                "y": 0.2266,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.616,
                "y": 0.0297,
                "width": 1.12,
                "height": 0.864,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.1061,
                "y": -0.1132,
                "width": 0.3802,
                "height": 1.584,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.4572,
                "y": 0.1343,
                "width": 0.408,
                "height": 0.612,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.6271,
                "y": -0.2647,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.9336,
                "y": 0.0315,
                "width": 0.252,
                "height": 1.05,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.0488,
                "y": 0.2702,
                "width": 0.3427,
                "height": 0.5141,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.1557,
                "y": 0.0442,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.7709,
                "y": -0.0599,
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
                "x": 0.8599,
                "y": -0.03,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": false,
                "opacity": 0
            }
        }
    },
    "023-MALFA": {
        "global-view": {
            "microphone": {
                "x": 0.4536,
                "y": -0.0056,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.0654,
                "y": 0.1926,
                "width": 0.3128,
                "height": 0.4692,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.2806,
                "y": 0.0304,
                "width": 0.91,
                "height": 0.702,
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
                "x": 0.1589,
                "y": 0.2171,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.5572,
                "y": 0.0273,
                "width": 1.0416,
                "height": 0.8035,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.1061,
                "y": -0.1132,
                "width": 0.3802,
                "height": 1.584,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.4572,
                "y": 0.1343,
                "width": 0.408,
                "height": 0.612,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.6271,
                "y": -0.2647,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.9336,
                "y": 0.0315,
                "width": 0.252,
                "height": 1.05,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.0488,
                "y": 0.2702,
                "width": 0.3427,
                "height": 0.5141,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.1557,
                "y": 0.0442,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.7709,
                "y": -0.0599,
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
                "x": 0.8599,
                "y": -0.03,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": false,
                "opacity": 0
            }
        }
    },
    "023-DELUXE": {
        "global-view": {
            "microphone": {
                "x": 0.7156,
                "y": 0.0597,
                "width": 0.2112,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.296,
                "y": 0.2661,
                "width": 0.2618,
                "height": 0.3927,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.0385,
                "y": 0.011,
                "width": 0.91,
                "height": 0.702,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.71,
                "y": -0.016,
                "width": 0.2957,
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
                "height": 0.7258,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.1061,
                "y": -0.1132,
                "width": 0.3802,
                "height": 1.584,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.4572,
                "y": 0.1343,
                "width": 0.408,
                "height": 0.612,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.6271,
                "y": -0.2647,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.0622,
                "y": 0.0895,
                "width": 0.1901,
                "height": 0.792,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": -0.4283,
                "y": 0.272,
                "width": 0.272,
                "height": 0.408,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.1234,
                "y": 0.0763,
                "width": 0.9394,
                "height": 0.7247,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.7709,
                "y": -0.0599,
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
                "x": 0.8599,
                "y": -0.03,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": false,
                "opacity": 0
            }
        }
    }
});

const MOBILE_PORTRAIT_LAYOUT_PRESETS = Object.freeze({
    "017-TUBE": {
        "global-view": {
            "microphone": {
                "x": 0.1716,
                "y": 0.3198,
                "width": 0.1848,
                "height": 0.77,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.1962,
                "y": 0.7168,
                "width": 0.1462,
                "height": 0.2193,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.4286,
                "y": 1.4821,
                "width": 1.12,
                "height": 0.864,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.3064,
                "y": 0.1425,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.5077,
                "y": 0.6831,
                "width": 0.2142,
                "height": 0.3213,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.5983,
                "y": 1.5327,
                "width": 1.26,
                "height": 0.972,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": -0.4098,
                "y": -0.0309,
                "width": 0.3504,
                "height": 1.46,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": -0.0542,
                "y": 0.2729,
                "width": 0.289,
                "height": 0.4335,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.396,
                "y": 0.9754,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.2672,
                "y": 0.1973,
                "width": 0.1344,
                "height": 0.56,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.73,
                "y": 0.47,
                "width": 0.1598,
                "height": 0.2397,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": -0.0054,
                "y": 0.9659,
                "width": 0.602,
                "height": 0.4644,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.3296,
                "y": -0.0222,
                "width": 0.36,
                "height": 1.5,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.8703,
                "y": 0.7042,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 1.0284,
                "y": 1.9591,
                "width": 1.4,
                "height": 1.08,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "017-FET": {
        "global-view": {
            "microphone": {
                "x": 0.1536,
                "y": 0.4122,
                "width": 0.168,
                "height": 0.7,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.1275,
                "y": 0.769,
                "width": 0.1224,
                "height": 0.1836,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.0139,
                "y": 1.4099,
                "width": 0.98,
                "height": 0.756,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.2886,
                "y": 0.1087,
                "width": 0.24,
                "height": 1,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.4852,
                "y": 0.5035,
                "width": 0.204,
                "height": 0.306,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.5142,
                "y": 1.7358,
                "width": 1.33,
                "height": 1.026,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": -0.1347,
                "y": 0.4333,
                "width": 0.1776,
                "height": 0.74,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.6482,
                "y": 0.7859,
                "width": 0.1224,
                "height": 0.1836,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.0139,
                "y": 1.5239,
                "width": 0.994,
                "height": 0.7668,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.2447,
                "y": 0.4262,
                "width": 0.1488,
                "height": 0.62,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.7241,
                "y": 0.6397,
                "width": 0.1632,
                "height": 0.2448,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": -0.0155,
                "y": 1.6108,
                "width": 1.05,
                "height": 0.81,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.3513,
                "y": -0.0264,
                "width": 0.384,
                "height": 1.6,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.713,
                "y": 0.4318,
                "width": 0.306,
                "height": 0.459,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.8094,
                "y": 1.8245,
                "width": 1.365,
                "height": 1.053,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-BOMBLET-NO-SHOCKMOUNT": {
        "global-view": {
            "microphone": {
                "x": 0.1086,
                "y": 0.1564,
                "width": 0.216,
                "height": 0.88,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.542,
                "y": 0.5164,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.1371,
                "y": 1.7097,
                "width": 1.043,
                "height": 0.8046,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.3293,
                "y": -0.0496,
                "width": 0.288,
                "height": 1.2,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.7211,
                "y": 0.4975,
                "width": 0.2516,
                "height": 0.3774,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.4725,
                "y": 1.7752,
                "width": 1.26,
                "height": 0.972,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.1221,
                "y": -0.2193,
                "width": 0.432,
                "height": 1.8,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.0422,
                "y": 0.0816,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.7067,
                "y": 1.5831,
                "width": 1.47,
                "height": 1.134,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.8441,
                "y": 0.2391,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.7994,
                "y": 0.6755,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.1047,
                "y": 1.8174,
                "width": 1.078,
                "height": 0.8316,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.3855,
                "y": -0.2879,
                "width": 0.432,
                "height": 1.8,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.8167,
                "y": 0.7337,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.8375,
                "y": 1.4754,
                "width": 1.33,
                "height": 1.026,
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
                "y": 0.1564,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.3095,
                "y": 0.5164,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.3696,
                "y": 1.6422,
                "width": 1.043,
                "height": 0.8046,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.3293,
                "y": -0.0496,
                "width": 0.288,
                "height": 1.2,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.7211,
                "y": 0.4975,
                "width": 0.2516,
                "height": 0.3774,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.4725,
                "y": 1.7752,
                "width": 1.26,
                "height": 0.972,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": 1.1221,
                "y": -0.2193,
                "width": 0.432,
                "height": 1.8,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": -0.0422,
                "y": 0.0816,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.7067,
                "y": 1.5831,
                "width": 1.47,
                "height": 1.134,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.8441,
                "y": 0.2391,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.7994,
                "y": 0.6755,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.1047,
                "y": 1.8174,
                "width": 1.078,
                "height": 0.8316,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.3855,
                "y": -0.2879,
                "width": 0.432,
                "height": 1.8,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.8167,
                "y": 0.7337,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.8375,
                "y": 1.4754,
                "width": 1.33,
                "height": 1.026,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-MALFA": {
        "global-view": {
            "microphone": {
                "x": 0.5353,
                "y": 0.148,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.3142,
                "y": 0.6431,
                "width": 0.1598,
                "height": 0.2397,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.1511,
                "y": 1.6169,
                "width": 1.043,
                "height": 0.8046,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.4307,
                "y": -0.042,
                "width": 0.288,
                "height": 1.2,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": -0.6512,
                "y": 0.4235,
                "width": 0.238,
                "height": 0.357,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.1255,
                "y": 1.6591,
                "width": 1.253,
                "height": 0.9666,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "shockmount-active": {
            "microphone": {
                "x": -0.4248,
                "y": -0.2193,
                "width": 0.456,
                "height": 1.9,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": -0.0492,
                "y": 0.09,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.7067,
                "y": 1.5831,
                "width": 1.47,
                "height": 1.134,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": 0.9022,
                "y": 0.2391,
                "width": 0.216,
                "height": 0.9,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": -0.6808,
                "y": 0.7093,
                "width": 0.17,
                "height": 0.255,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.1233,
                "y": 1.8216,
                "width": 1.078,
                "height": 0.8316,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.3855,
                "y": -0.2879,
                "width": 0.432,
                "height": 1.8,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.8167,
                "y": 0.7337,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": 0.8375,
                "y": 1.4754,
                "width": 1.33,
                "height": 1.026,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    },
    "023-DELUXE": {
        "global-view": {
            "microphone": {
                "x": 0.1832,
                "y": 0.3622,
                "width": 0.18,
                "height": 0.75,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.2239,
                "y": 0.6831,
                "width": 0.136,
                "height": 0.204,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.0179,
                "y": 1.2601,
                "width": 0.91,
                "height": 0.702,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "mic-active": {
            "microphone": {
                "x": 0.3506,
                "y": -0.022,
                "width": 0.288,
                "height": 1.2,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.5889,
                "y": 0.5437,
                "width": 0.221,
                "height": 0.3315,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.089,
                "y": 1.3657,
                "width": 1.162,
                "height": 0.8964,
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
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": -0.0644,
                "y": 0.1149,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": -0.4481,
                "y": 0.1822,
                "width": 0.84,
                "height": 0.648,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "case-active": {
            "microphone": {
                "x": -0.2505,
                "y": 0.446,
                "width": 0.168,
                "height": 0.7,
                "anchor": "bottom-center",
                "visible": false,
                "opacity": 0
            },
            "shockmount": {
                "x": 0.9385,
                "y": 0.2527,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": false,
                "opacity": 0
            },
            "case": {
                "x": -0.0157,
                "y": 1.5948,
                "width": 1.05,
                "height": 0.81,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        },
        "logo-view": {
            "microphone": {
                "x": 0.3855,
                "y": -0.2879,
                "width": 0.432,
                "height": 1.8,
                "anchor": "bottom-center",
                "visible": true,
                "opacity": 1
            },
            "shockmount": {
                "x": 0.8167,
                "y": 0.7337,
                "width": 0.34,
                "height": 0.51,
                "anchor": "top-center",
                "visible": true,
                "opacity": 1
            },
            "case": {
                "x": 0.8375,
                "y": 1.4754,
                "width": 1.33,
                "height": 1.026,
                "anchor": "center",
                "visible": true,
                "opacity": 1
            }
        }
    }
});

const TABLET_LAYOUT_RECT_OVERRIDES = Object.freeze({
    "017-TUBE": {
        "global-view": {
            "microphone": { "x": 0.1315, "y": 0.2934, "width": 0.1584, "height": 0.66, "visible": true, "opacity": 1 },
            "shockmount": { "x": 0.1805, "y": 0.3602, "width": 0.136, "height": 0.204, "visible": true, "opacity": 1 },
            "case": { "x": 0.1889, "y": -0.0925, "width": 0.847, "height": 0.6534, "visible": true, "opacity": 1 }
        },
        "mic-active": {
            "microphone": { "x": 0.3934, "y": 0.0822, "width": 0.2455, "height": 1.023, "visible": true, "opacity": 1 },
            "shockmount": { "x": 0.9541, "y": 0.2338, "width": 0.2142, "height": 0.3213, "visible": true, "opacity": 1 },
            "case": { "x": 0.4484, "y": -0.351, "width": 1.05, "height": 0.81, "visible": true, "opacity": 1 }
        },
        "shockmount-active": {
            "microphone": { "x": -0.2361, "y": -0.1562, "width": 0.336, "height": 1.4, "visible": false, "opacity": 0 },
            "shockmount": { "x": 0.158, "y": -0.0333, "width": 0.306, "height": 0.459, "visible": true, "opacity": 1 },
            "case": { "x": 0.0243, "y": -0.5252, "width": 0.98, "height": 0.756, "visible": true, "opacity": 1 }
        },
        "case-active": {
            "microphone": { "x": -0.023, "y": 0.0638, "width": 0.1742, "height": 0.726, "visible": false, "opacity": 0 },
            "shockmount": { "x": 0.637, "y": 0.3997, "width": 0.1598, "height": 0.2397, "visible": false, "opacity": 0 },
            "case": { "x": 0.0406, "y": 0.0604, "width": 0.7, "height": 0.54, "visible": true, "opacity": 1 }
        },
        "logo-view": {
            "microphone": { "x": 0.4213, "y": -0.0801, "width": 0.384, "height": 1.6, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.5413, "y": 0.1772, "width": 0.306, "height": 0.459, "visible": false, "opacity": 0 },
            "case": { "x": -0.0575, "y": -0.1024, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        }
    },
    "017-FET": {
        "global-view": {
            "microphone": { "x": 0.7022, "y": 0.1875, "width": 0.192, "height": 0.8, "visible": true, "opacity": 1 },
            "shockmount": { "x": 0.0108, "y": 0.3451, "width": 0.136, "height": 0.204, "visible": true, "opacity": 1 },
            "case": { "x": -0.0525, "y": -0.2055, "width": 0.91, "height": 0.702, "visible": true, "opacity": 1 }
        },
        "mic-active": {
            "microphone": { "x": 0.4187, "y": 0.0735, "width": 0.24, "height": 1, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.4427, "y": 0.2198, "width": 0.204, "height": 0.306, "visible": true, "opacity": 1 },
            "case": { "x": -0.1611, "y": -0.4375, "width": 1.05, "height": 0.81, "visible": true, "opacity": 1 }
        },
        "shockmount-active": {
            "microphone": { "x": 1.3666, "y": -0.0148, "width": 0.24, "height": 1, "visible": false, "opacity": 0 },
            "shockmount": { "x": 0.1561, "y": -0.0079, "width": 0.306, "height": 0.459, "visible": true, "opacity": 1 },
            "case": { "x": -0.3498, "y": -0.9207, "width": 1.4, "height": 1.08, "visible": true, "opacity": 1 }
        },
        "case-active": {
            "microphone": { "x": -0.1827, "y": 0.0806, "width": 0.1901, "height": 0.792, "visible": false, "opacity": 0 },
            "shockmount": { "x": -0.4283, "y": 0.272, "width": 0.1632, "height": 0.2448, "visible": false, "opacity": 0 },
            "case": { "x": 0.0466, "y": -0.0922, "width": 0.9394, "height": 0.7247, "visible": true, "opacity": 1 }
        },
        "logo-view": {
            "microphone": { "x": 0.4213, "y": -0.0801, "width": 0.384, "height": 1.6, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.5413, "y": 0.1772, "width": 0.306, "height": 0.459, "visible": false, "opacity": 0 },
            "case": { "x": -0.0575, "y": -0.1024, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        }
    },
    "023-BOMBLET-NO-SHOCKMOUNT": {
        "global-view": {
            "microphone": { "x": 0.2755, "y": 0.1407, "width": 0.2112, "height": 0.88, "visible": true, "opacity": 1 },
            "shockmount": { "x": 0.22, "y": 0.03, "width": 0.17, "height": 0.255, "visible": false, "opacity": 0 },
            "case": { "x": 0.2113, "y": 0.077, "width": 0.84, "height": 0.648, "visible": true, "opacity": 1 }
        },
        "mic-active": {
            "microphone": { "x": 0.4244, "y": -0.0397, "width": 0.2957, "height": 1.232, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.2096, "y": 0.1933, "width": 0.1836, "height": 0.2754, "visible": false, "opacity": 0 },
            "case": { "x": 0.5161, "y": 0.0829, "width": 0.91, "height": 0.702, "visible": true, "opacity": 1 }
        },
        "case-active": {
            "microphone": { "x": 0.1348, "y": 0.0453, "width": 0.2268, "height": 0.945, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.3925, "y": 0.1995, "width": 0.17, "height": 0.255, "visible": false, "opacity": 0 },
            "case": { "x": 0.1633, "y": 0.0885, "width": 0.84, "height": 0.648, "visible": true, "opacity": 1 }
        },
        "logo-view": {
            "microphone": { "x": 0.4423, "y": -0.1508, "width": 0.3984, "height": 1.66, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.38, "y": 0.29, "width": 0.34, "height": 0.51, "visible": false, "opacity": 0 },
            "case": { "x": 0.8599, "y": -0.03, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        }
    },
    "023-BOMBLET-WITH-SHOCKMOUNT": {
        "global-view": {
            "microphone": { "x": 0.3645, "y": 0.1474, "width": 0.2112, "height": 0.88, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.2186, "y": 0.265, "width": 0.17, "height": 0.255, "visible": true, "opacity": 1 },
            "case": { "x": 0.2892, "y": 0.0925, "width": 0.868, "height": 0.6696, "visible": true, "opacity": 1 }
        },
        "mic-active": {
            "microphone": { "x": 0.4244, "y": -0.0397, "width": 0.2957, "height": 1.232, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.2096, "y": 0.1933, "width": 0.1836, "height": 0.2754, "visible": true, "opacity": 1 },
            "case": { "x": 0.5161, "y": 0.0829, "width": 0.91, "height": 0.702, "visible": true, "opacity": 1 }
        },
        "shockmount-active": {
            "microphone": { "x": 1.1061, "y": -0.1132, "width": 0.3802, "height": 1.584, "visible": false, "opacity": 0 },
            "shockmount": { "x": 0.1502, "y": -0.0253, "width": 0.272, "height": 0.408, "visible": true, "opacity": 1 },
            "case": { "x": 0.7977, "y": -0.2647, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        },
        "case-active": {
            "microphone": { "x": 0.8605, "y": 0.0315, "width": 0.252, "height": 1.05, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.3522, "y": 0.2702, "width": 0.17, "height": 0.255, "visible": true, "opacity": 1 },
            "case": { "x": 0.1545, "y": 0.0996, "width": 0.91, "height": 0.702, "visible": true, "opacity": 1 }
        },
        "logo-view": {
            "microphone": { "x": 0.4423, "y": -0.1508, "width": 0.3984, "height": 1.66, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.38, "y": 0.29, "width": 0.34, "height": 0.51, "visible": false, "opacity": 0 },
            "case": { "x": 0.8599, "y": -0.03, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        }
    },
    "023-MALFA": {
        "global-view": {
            "microphone": { "x": 0.3939, "y": 0.0676, "width": 0.24, "height": 1, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.2039, "y": 0.2613, "width": 0.1598, "height": 0.2397, "visible": true, "opacity": 1 },
            "case": { "x": 0.2806, "y": 0.0304, "width": 0.91, "height": 0.702, "visible": true, "opacity": 1 }
        },
        "mic-active": {
            "microphone": { "x": 0.428, "y": -0.0263, "width": 0.2976, "height": 1.24, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.2091, "y": 0.2171, "width": 0.204, "height": 0.306, "visible": true, "opacity": 1 },
            "case": { "x": 0.4744, "y": 0.0406, "width": 0.9716, "height": 0.7495, "visible": true, "opacity": 1 }
        },
        "shockmount-active": {
            "microphone": { "x": 1.1061, "y": -0.1132, "width": 0.3802, "height": 1.584, "visible": false, "opacity": 0 },
            "shockmount": { "x": 0.1161, "y": -0.0497, "width": 0.306, "height": 0.459, "visible": true, "opacity": 1 },
            "case": { "x": 0.8842, "y": -0.2647, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        },
        "case-active": {
            "microphone": { "x": 0.9336, "y": 0.0315, "width": 0.252, "height": 1.05, "visible": false, "opacity": 0 },
            "shockmount": { "x": -0.3522, "y": 0.268, "width": 0.17, "height": 0.255, "visible": false, "opacity": 0 },
            "case": { "x": 0.1228, "y": 0.0885, "width": 0.91, "height": 0.702, "visible": true, "opacity": 1 }
        },
        "logo-view": {
            "microphone": { "x": 0.4423, "y": -0.1508, "width": 0.3984, "height": 1.66, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.38, "y": 0.29, "width": 0.34, "height": 0.51, "visible": false, "opacity": 0 },
            "case": { "x": 0.8599, "y": -0.03, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        }
    },
    "023-DELUXE": {
        "global-view": {
            "microphone": { "x": 0.6937, "y": 0.1351, "width": 0.2112, "height": 0.88, "visible": true, "opacity": 1 },
            "shockmount": { "x": 0.017, "y": 0.3725, "width": 0.136, "height": 0.204, "visible": true, "opacity": 1 },
            "case": { "x": -0.0385, "y": -0.1974, "width": 0.91, "height": 0.702, "visible": true, "opacity": 1 }
        },
        "mic-active": {
            "microphone": { "x": 0.4237, "y": -0.0271, "width": 0.288, "height": 1.2, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.3338, "y": 0.3942, "width": 0.221, "height": 0.3315, "visible": true, "opacity": 1 },
            "case": { "x": -0.0936, "y": -0.2229, "width": 0.9408, "height": 0.7258, "visible": true, "opacity": 1 }
        },
        "shockmount-active": {
            "microphone": { "x": 1.229, "y": -0.1258, "width": 0.3802, "height": 1.584, "visible": false, "opacity": 0 },
            "shockmount": { "x": 0.1425, "y": -0.0454, "width": 0.34, "height": 0.51, "visible": true, "opacity": 1 },
            "case": { "x": 0.6968, "y": -0.2941, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        },
        "case-active": {
            "microphone": { "x": 0.0622, "y": 0.0895, "width": 0.1901, "height": 0.792, "visible": false, "opacity": 0 },
            "shockmount": { "x": -0.4283, "y": 0.272, "width": 0.34, "height": 0.51, "visible": false, "opacity": 0 },
            "case": { "x": 0.1234, "y": 0.0231, "width": 0.84, "height": 0.648, "visible": true, "opacity": 1 }
        },
        "logo-view": {
            "microphone": { "x": 0.4423, "y": -0.1508, "width": 0.3984, "height": 1.66, "visible": true, "opacity": 1 },
            "shockmount": { "x": -0.38, "y": 0.29, "width": 0.34, "height": 0.51, "visible": false, "opacity": 0 },
            "case": { "x": 0.8599, "y": -0.03, "width": 1.4, "height": 1.08, "visible": false, "opacity": 0 }
        }
    }
});

function buildDeviceLayoutPresets(basePresets, layoutOverrides = {}) {
    return Object.freeze(
        Object.fromEntries(
            Object.entries(basePresets).map(([modelKey, states]) => [
                modelKey,
                Object.freeze(
                    Object.fromEntries(
                        Object.entries(states).map(([stateName, layers]) => {
                            const stateOverrides = layoutOverrides[modelKey]?.[stateName] || {};

                            return [
                                stateName,
                                Object.freeze(
                                    Object.fromEntries(
                                        Object.entries(layers).map(([layerKey, layerConfig]) => [
                                            layerKey,
                                            Object.freeze({
                                                ...layerConfig,
                                                ...(stateOverrides[layerKey] || {})
                                            })
                                        ])
                                    )
                                )
                            ];
                        })
                    )
                )
            ])
        )
    );
}

function cloneLayoutPresets(presets) {
    return Object.freeze(
        Object.fromEntries(
            Object.entries(presets).map(([modelKey, states]) => [
                modelKey,
                Object.freeze(
                    Object.fromEntries(
                        Object.entries(states).map(([stateName, layers]) => [
                            stateName,
                            Object.freeze(
                                Object.fromEntries(
                                    Object.entries(layers).map(([layerKey, layerConfig]) => [
                                        layerKey,
                                        Object.freeze({ ...layerConfig })
                                    ])
                                )
                            )
                        ])
                    )
                )
            ])
        )
    );
}

const TABLET_LAYOUT_PRESETS = buildDeviceLayoutPresets(DESKTOP_LAYOUT_PRESETS, TABLET_LAYOUT_RECT_OVERRIDES);
const MOBILE_LANDSCAPE_LAYOUT_PRESETS = cloneLayoutPresets(DESKTOP_LAYOUT_PRESETS);

export const VIEWPORT_LAYOUT_PRESETS = Object.freeze({
    desktop: DESKTOP_LAYOUT_PRESETS,
    tablet: TABLET_LAYOUT_PRESETS,
    'mobile-landscape': MOBILE_LANDSCAPE_LAYOUT_PRESETS,
    'mobile-portrait': MOBILE_PORTRAIT_LAYOUT_PRESETS
});
