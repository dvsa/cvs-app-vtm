export interface MetadataAdrDetailsAdditionalNotes { 
    guidanceNotesFe?: Array<MetadataAdrDetailsAdditionalNotes.GuidanceNotesFeEnum>;
    numberFe?: Array<MetadataAdrDetailsAdditionalNotes.NumberFeEnum>;
}
export namespace MetadataAdrDetailsAdditionalNotes {
    export type GuidanceNotesFeEnum = 'New certificate requested';
    export const GuidanceNotesFeEnum = {
        NewCertificateRequested: 'New certificate requested' as GuidanceNotesFeEnum
    };
    export type NumberFeEnum = '1' | '1A' | '2' | '3' | 'V1B' | 'T1B';
    export const NumberFeEnum = {
        _1: '1' as NumberFeEnum,
        _1A: '1A' as NumberFeEnum,
        _2: '2' as NumberFeEnum,
        _3: '3' as NumberFeEnum,
        V1B: 'V1B' as NumberFeEnum,
        T1B: 'T1B' as NumberFeEnum
    };
}