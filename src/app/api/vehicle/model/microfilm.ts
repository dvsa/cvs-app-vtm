export interface Microfilm { 
    /**
     * Used for all vehicle types
     */
    microfilmDocumentType?: Microfilm.MicrofilmDocumentTypeEnum;
    /**
     * Used for all vehicle types
     */
    microfilmRollNumber?: string;
    /**
     * Used for all vehicle types
     */
    microfilmSerialNumber?: string;
}
export namespace Microfilm {
    export type MicrofilmDocumentTypeEnum = 'PSV Miscellaneous' | 'AAT - Trailer Annual Test' | 'AIV - HGV International App' | 'COIF Modification' | 'Trailer COC + Int Plate' | 'RCT - Trailer Test Cert paid' | 'HGV COC + Int Plate' | 'PSV Carry/Auth' | 'OMO Report' | 'AIT - Trailer International App' | 'IPV - HGV EEC Plate/Cert' | 'XCV - HGV Test Cert free' | 'AAV - HGV Annual Test' | 'COIF Master' | 'Tempo 100 Sp Ord' | 'Deleted' | 'PSV N/ALT' | 'XPT - Tr Plating Cert paid' | 'FFV - HGV First Test' | 'Repl Vitesse 100' | 'TCV - HGV Test Cert' | 'ZZZ -  Miscellaneous' | 'Test Certificate' | 'XCT - Trailer Test Cert free' | 'C52 - COC and VTG52A' | 'Tempo 100 Report' | 'Main File Amendment' | 'PSV Doc' | 'PSV COC' | 'PSV Repl COC' | 'TAV - COC' | 'NPT - Trailer Alteration' | 'OMO Certificate' | 'PSV Repl COIF' | 'PSV Repl COF' | 'COIF Application' | 'XPV - HGV Plating Cert Free' | 'TCT  - Trailer Test Cert' | 'Tempo 100 App' | 'PSV Decision on N/ALT' | 'Special Order PSV' | 'NPV - HGV Alteration' | 'No Description Found' | 'Vitesse 100 Sp Ord' | 'Brake Test Details' | 'COIF Productional' | 'RDT - Test Disc Paid' | 'RCV -  HGV Test Cert' | 'FFT -  Trailer First Test' | 'IPT - Trailer EEC Plate/Cert' | 'XDT - Test Disc Free' | 'PRV - HGV Plating Cert paid' | 'COF Cert' | 'PRT - Tr Plating Cert paid' | 'Tempo 100 Permit';
    export const MicrofilmDocumentTypeEnum = {
        PSVMiscellaneous: 'PSV Miscellaneous' as MicrofilmDocumentTypeEnum,
        AATTrailerAnnualTest: 'AAT - Trailer Annual Test' as MicrofilmDocumentTypeEnum,
        AIVHGVInternationalApp: 'AIV - HGV International App' as MicrofilmDocumentTypeEnum,
        COIFModification: 'COIF Modification' as MicrofilmDocumentTypeEnum,
        TrailerCOCIntPlate: 'Trailer COC + Int Plate' as MicrofilmDocumentTypeEnum,
        RCTTrailerTestCertPaid: 'RCT - Trailer Test Cert paid' as MicrofilmDocumentTypeEnum,
        HGVCOCIntPlate: 'HGV COC + Int Plate' as MicrofilmDocumentTypeEnum,
        PSVCarryAuth: 'PSV Carry/Auth' as MicrofilmDocumentTypeEnum,
        OMOReport: 'OMO Report' as MicrofilmDocumentTypeEnum,
        AITTrailerInternationalApp: 'AIT - Trailer International App' as MicrofilmDocumentTypeEnum,
        IPVHGVEECPlateCert: 'IPV - HGV EEC Plate/Cert' as MicrofilmDocumentTypeEnum,
        XCVHGVTestCertFree: 'XCV - HGV Test Cert free' as MicrofilmDocumentTypeEnum,
        AAVHGVAnnualTest: 'AAV - HGV Annual Test' as MicrofilmDocumentTypeEnum,
        COIFMaster: 'COIF Master' as MicrofilmDocumentTypeEnum,
        Tempo100SpOrd: 'Tempo 100 Sp Ord' as MicrofilmDocumentTypeEnum,
        Deleted: 'Deleted' as MicrofilmDocumentTypeEnum,
        PSVNALT: 'PSV N/ALT' as MicrofilmDocumentTypeEnum,
        XPTTrPlatingCertPaid: 'XPT - Tr Plating Cert paid' as MicrofilmDocumentTypeEnum,
        FFVHGVFirstTest: 'FFV - HGV First Test' as MicrofilmDocumentTypeEnum,
        ReplVitesse100: 'Repl Vitesse 100' as MicrofilmDocumentTypeEnum,
        TCVHGVTestCert: 'TCV - HGV Test Cert' as MicrofilmDocumentTypeEnum,
        ZZZMiscellaneous: 'ZZZ -  Miscellaneous' as MicrofilmDocumentTypeEnum,
        TestCertificate: 'Test Certificate' as MicrofilmDocumentTypeEnum,
        XCTTrailerTestCertFree: 'XCT - Trailer Test Cert free' as MicrofilmDocumentTypeEnum,
        C52COCAndVTG52A: 'C52 - COC and VTG52A' as MicrofilmDocumentTypeEnum,
        Tempo100Report: 'Tempo 100 Report' as MicrofilmDocumentTypeEnum,
        MainFileAmendment: 'Main File Amendment' as MicrofilmDocumentTypeEnum,
        PSVDoc: 'PSV Doc' as MicrofilmDocumentTypeEnum,
        PSVCOC: 'PSV COC' as MicrofilmDocumentTypeEnum,
        PSVReplCOC: 'PSV Repl COC' as MicrofilmDocumentTypeEnum,
        TAVCOC: 'TAV - COC' as MicrofilmDocumentTypeEnum,
        NPTTrailerAlteration: 'NPT - Trailer Alteration' as MicrofilmDocumentTypeEnum,
        OMOCertificate: 'OMO Certificate' as MicrofilmDocumentTypeEnum,
        PSVReplCOIF: 'PSV Repl COIF' as MicrofilmDocumentTypeEnum,
        PSVReplCOF: 'PSV Repl COF' as MicrofilmDocumentTypeEnum,
        COIFApplication: 'COIF Application' as MicrofilmDocumentTypeEnum,
        XPVHGVPlatingCertFree: 'XPV - HGV Plating Cert Free' as MicrofilmDocumentTypeEnum,
        TCTTrailerTestCert: 'TCT  - Trailer Test Cert' as MicrofilmDocumentTypeEnum,
        Tempo100App: 'Tempo 100 App' as MicrofilmDocumentTypeEnum,
        PSVDecisionOnNALT: 'PSV Decision on N/ALT' as MicrofilmDocumentTypeEnum,
        SpecialOrderPSV: 'Special Order PSV' as MicrofilmDocumentTypeEnum,
        NPVHGVAlteration: 'NPV - HGV Alteration' as MicrofilmDocumentTypeEnum,
        NoDescriptionFound: 'No Description Found' as MicrofilmDocumentTypeEnum,
        Vitesse100SpOrd: 'Vitesse 100 Sp Ord' as MicrofilmDocumentTypeEnum,
        BrakeTestDetails: 'Brake Test Details' as MicrofilmDocumentTypeEnum,
        COIFProductional: 'COIF Productional' as MicrofilmDocumentTypeEnum,
        RDTTestDiscPaid: 'RDT - Test Disc Paid' as MicrofilmDocumentTypeEnum,
        RCVHGVTestCert: 'RCV -  HGV Test Cert' as MicrofilmDocumentTypeEnum,
        FFTTrailerFirstTest: 'FFT -  Trailer First Test' as MicrofilmDocumentTypeEnum,
        IPTTrailerEECPlateCert: 'IPT - Trailer EEC Plate/Cert' as MicrofilmDocumentTypeEnum,
        XDTTestDiscFree: 'XDT - Test Disc Free' as MicrofilmDocumentTypeEnum,
        PRVHGVPlatingCertPaid: 'PRV - HGV Plating Cert paid' as MicrofilmDocumentTypeEnum,
        COFCert: 'COF Cert' as MicrofilmDocumentTypeEnum,
        PRTTrPlatingCertPaid: 'PRT - Tr Plating Cert paid' as MicrofilmDocumentTypeEnum,
        Tempo100Permit: 'Tempo 100 Permit' as MicrofilmDocumentTypeEnum
    };
}