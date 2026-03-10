  <? if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); 
  ?>
     <div id="wood-case-workspace">
                        <div class="loader" id="wood-case-loader">Загрузка...</div>
                        <svg id="wood-case-svg" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="black" /></filter>
                                <filter id="burnFilterRaster" x="-10%" y="-10%" width="120%" height="120%">
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.28 0 0 0 0 0.15 0 0 0 0 0.08 0 0 0 1 0" result="colored"/>
                                    <feGaussianBlur stdDeviation="0.8" in="SourceAlpha" result="blur"/>
                                    <feOffset dx="1" dy="1" result="offsetBlur"/>
                                    <feComposite operator="in" in="colored" in2="SourceGraphic"/>
                                </filter>
                                <filter id="woodBurnFilter" x="-10%" y="-10%" width="120%" height="120%">
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.28 0 0 0 0 0.15 0 0 0 0 0.08 0 0 0 1 0" result="colored"/>
                                    <feGaussianBlur stdDeviation="0.8" in="SourceAlpha" result="blur"/>
                                    <feOffset dx="1" dy="1" result="offsetBlur"/>
                                    <feComposite operator="in" in="colored" in2="SourceGraphic" result="mainColor"/>
                                    <feMerge><feMergeNode in="mainColor"/></feMerge>
                                </filter>
                                <filter id="burnFilterSVG" x="-20%" y="-20%" width="140%" height="140%">
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.15 0 0 0 0 0.10 0 0 0 0 0.09 0 0 0 1 0"/>
                                    <feTurbulence type="fractalNoise" baseFrequency="0.011 0.7" numOctaves="1" seed="10" result="noise"/>
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" result="distorted"/>
                                    <feComposite operator="in" in="distorted" in2="noise" result="burned"/>
                                    <feGaussianBlur stdDeviation="0.4" in="burned"/>
                                </filter>
                            </defs>
                            <image id="wood-case-bg" x="0" y="0" />
                            <foreignObject id="wood-case-perspective-fo" x="0" y="0" width="100%" height="100%">
                                <div id="wood-case-perspective-plane" xmlns="http://www.w3.org/1999/xhtml">
                                    <div id="wood-case-logo-wrapper">
                                        <div id="user-logo-container" style="display:none;"></div>
                                    </div>
                                </div>
                            </foreignObject>
                            <g id="wood-case-rulers-group"></g>
                        </svg>
                    </div>