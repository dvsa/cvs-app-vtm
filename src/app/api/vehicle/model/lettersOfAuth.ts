/**
 * Letters of authorisation
 */
export interface LettersOfAuth { 
    /**
     * Used only for TRL
     */
    letterType?: LettersOfAuth.LetterTypeEnum;
    /**
     * Used only for TRL
     */
    letterDateRequested?: string;
    /**
     * Used only for TRL
     */
    letterContents?: string;
}
export namespace LettersOfAuth {
    export type LetterTypeEnum = 'Trailer authorization' | 'Trailer rejection';
    export const LetterTypeEnum = {
        Authorization: 'Trailer authorization' as LetterTypeEnum,
        Rejection: 'Trailer rejection' as LetterTypeEnum
    };
}