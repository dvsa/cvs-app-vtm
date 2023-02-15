/**
 * Test type
 */
export interface TestTypeInfo { 
    /**
     * Unique identifier
     */
    id?: string;
    testTypeClassification?: TestTypeInfo.TestTypeClassificationEnum;
    defaultTestCode?: string;
    linkedTestCode?: string;
}
export namespace TestTypeInfo {
    export type TestTypeClassificationEnum = 'Annual With Certificate' | 'Annual No Certificate' | 'Non Annual';
    export const TestTypeClassificationEnum = {
        AnnualWithCertificate: 'Annual With Certificate' as TestTypeClassificationEnum,
        AnnualNoCertificate: 'Annual No Certificate' as TestTypeClassificationEnum,
        NonAnnual: 'Non Annual' as TestTypeClassificationEnum
    };
}