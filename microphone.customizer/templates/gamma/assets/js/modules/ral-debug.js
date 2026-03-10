
// legacy code
// // RAL debugging utility for checking duplicate codes across sections
// import { stateManager } from '../core/state.js';

// /**
//  * Analyzes RAL codes across all sections to identify duplicates and pricing issues
//  */
// export function analyzeRalCodes() {
//     const hlData = stateManager.get('hlData');
//     const options = hlData?.options || {};
//     const prices = hlData?.prices || {};
    
//     console.group('🔍 RAL Code Analysis');
    
//     // Track RAL codes by section
//     const ralBySection = {};
//     const ralCodeDetails = {};
    
//     // Collect RAL codes from each section
//     Object.entries(options).forEach(([section, sectionOptions]) => {
//         ralBySection[section] = [];
        
//         sectionOptions.forEach(option => {
//             if (option.UF_IS_RAL && option.RAL_DATA) {
//                 const ralCode = option.RAL_DATA.UF_CODE;
//                 const ralName = option.RAL_DATA.UF_NAME;
//                 const isFree = option.UF_IS_FREE;
//                 const price = option.UF_PRICE || 0;
                
//                 ralBySection[section].push({
//                     code: ralCode,
//                     name: ralName,
//                     isFree,
//                     price,
//                     variantCode: option.UF_VARIANT_CODE
//                 });
                
//                 // Track cross-section duplicates
//                 if (!ralCodeDetails[ralCode]) {
//                     ralCodeDetails[ralCode] = {
//                         name: ralName,
//                         sections: {},
//                         pricingIssues: []
//                     };
//                 }
                
//                 ralCodeDetails[ralCode].sections[section] = {
//                     isFree,
//                     price,
//                     variantCode: option.UF_VARIANT_CODE
//                 };
                
//                 // Check for pricing inconsistencies
//                 const sectionRalSurcharge = prices[section]?._ral_surcharge;
//                 if (sectionRalSurcharge !== undefined) {
//                     const expectedPrice = isFree ? 0 : sectionRalSurcharge;
//                     if (price !== expectedPrice) {
//                         ralCodeDetails[ralCode].pricingIssues.push({
//                             section,
//                             actualPrice: price,
//                             expectedPrice,
//                             isFree
//                         });
//                     }
//                 }
//             }
//         });
//     });
    
//     // Log analysis results
//     console.log('📊 RAL Codes by Section:', ralBySection);
    
//     // Find duplicates across sections
//     const duplicates = Object.entries(ralCodeDetails).filter(([code, details]) => 
//         Object.keys(details.sections).length > 1
//     );
    
//     if (duplicates.length > 0) {
//         console.warn('⚠️ RAL Codes Found in Multiple Sections:', duplicates);
//         duplicates.forEach(([code, details]) => {
//             console.group(`RAL ${code} (${details.name})`);
//             Object.entries(details.sections).forEach(([section, info]) => {
//                 console.log(`${section}: ${info.isFree ? 'FREE' : `+${info.price}₽`} (${info.variantCode})`);
//             });
            
//             if (details.pricingIssues.length > 0) {
//                 console.error('💰 Pricing Issues:', details.pricingIssues);
//             }
//             console.groupEnd();
//         });
//     } else {
//         console.log('✅ No RAL code duplicates found across sections');
//     }
    
//     // Check section-specific RAL surcharges
//     console.group('💰 Section RAL Surcharges');
//     Object.entries(prices).forEach(([section, sectionPrices]) => {
//         if (sectionPrices._ral_surcharge !== undefined) {
//             console.log(`${section}: +${sectionPrices._ral_surcharge}₽`);
//         }
//     });
//     console.groupEnd();
    
//     console.groupEnd();
    
//     return {
//         ralBySection,
//         ralCodeDetails,
//         duplicates,
//         summary: {
//             totalRalCodes: Object.keys(ralCodeDetails).length,
//             duplicateCount: duplicates.length,
//             sectionsWithRal: Object.keys(ralBySection).filter(s => ralBySection[s].length > 0)
//         }
//     };
// }

// /**
//  * Validates pricing for a specific configuration
//  */
// export function validateCurrentPricing() {
//     const state = stateManager.get();
//     const hlData = stateManager.get('hlData');
//     const prices = hlData?.prices || {};
    
//     console.group('💰 Current Pricing Validation');
    
//     const sections = ['spheres', 'body', 'logo', 'logobg', 'shockmount', 'shockmountPins'];
    
//     sections.forEach(section => {
//         const sectionState = state[section];
//         if (!sectionState || !sectionState.color) return;
        
//         const isRal = sectionState.variant === 'ral' || sectionState.variant === '3';
//         const sectionRalSurcharge = prices[section]?._ral_surcharge;
        
//         console.log(`${section}:`);
//         console.log(`  Color: ${sectionState.color}`);
//         console.log(`  Variant: ${sectionState.variant}`);
//         console.log(`  Is RAL: ${isRal}`);
        
//         if (isRal && sectionRalSurcharge !== undefined) {
//             console.log(`  Expected RAL surcharge: +${sectionRalSurcharge}₽`);
//         } else if (!isRal) {
//             console.log(`  No RAL surcharge (non-RAL variant)`);
//         } else {
//             console.log(`  No RAL surcharge configured for this section`);
//         }
//     });
    
//     console.groupEnd();
// }

// // Auto-run analysis in debug mode
// if (window.APP_DEBUG) {
//     setTimeout(() => {
//         analyzeRalCodes();
//         validateCurrentPricing();
//     }, 2000);
// }
