export interface Letters { 
    /**
     * Used for TRLs
     */
    letterType?: string;
    letterDateRequested?: Date;
    letterParagraphId?: number;
}

export namespace Letters {
    export type LetterIssueTypeEnum = 'Authorised' | 'Rejected';
    export const LetterIssueTypeEnum = {
        Authorised: 'Authorised' as LetterIssueTypeEnum,
        Rejected: 'Rejected' as LetterIssueTypeEnum
    };
}