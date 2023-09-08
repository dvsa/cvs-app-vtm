// // Define a custom validator function for the "Approval type number" field
// import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
//
// // Define a custom validator function for the "Approval type number" field
//
// export function approvalTypeNumberFormatValidator(approvalType: string): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const value = control.value;
//
//     switch (approvalType) {
//       case 'ECTA':
//         // Define the format rules for ECTA
//         const ectaFormatRegex = /^e\d{2}\*[\dA-Z]+\*[\dA-Z]+\*[\dA-Z]+$/;
//         return ectaFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'NSSTA':
//         // Define the format rules for NSSTA
//         const nsstaFormatRegex = /^e\d{2}\*[\dA-Z]+\*[\dA-Z]+$/;
//         return nsstaFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'GB WVTA':
//         // Define the format rules for GB WVTA
//         const gbWvtaFormatRegex = /^\d{3}\*[\dA-Z]+\*[\dA-Z]+\*[\dA-Z]+$/;
//         return gbWvtaFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'UKNI WVTA':
//         // Define the format rules for UKNI WVTA
//         const ukniWvtaFormatRegex = /^[X\d]{3}\*\d{4}\/\d{4}\*\d{6}$/;
//         return ukniWvtaFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'EU WVTA Pre 23':
//       case 'EU WVTA 23 on':
//       case 'QNIG':
//         // Define the format rules for EU WVTA Pre 23, EU WVTA 23 on, and QNIG
//         const euWvtaFormatRegex = /^e\d{2}\*[\dA-Z]+\*[\dA-Z]+\*[\dA-Z]+$/;
//         return euWvtaFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'Prov.GB WVTA':
//         // Define the format rules for Prov.GB WVTA
//         const provGbWvtaFormatRegex = /^\d{3}\*[\dA-Z]+\*[\dA-Z]+\*[\dA-Z]+$/;
//         return provGbWvtaFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'Small series':
//         // Define the format rules for Small series
//         const smallSeriesFormatRegex = /^[X\d]{3}\*\d{4}\/\d{4}\*\d{6}$/;
//         return smallSeriesFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'IVA – VCA':
//         // Define the format rules for IVA – VCA
//         const ivaVcaFormatRegex = /^[nN\d]{3}\*NIV\d{2}\/\d{4}\*\d{6}$/;
//         return ivaVcaFormatRegex.test(value) ? null : { invalidFormat: true };
//
//       case 'IVA – DVSA/NI':
//         // No specific format required for IVA – DVSA/NI
//         return null;
//
//       default:
//         // No specific format required for other "Approval type" values
//         return null;
//     }
//   };
// }
