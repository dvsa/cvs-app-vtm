export interface PlatesInner { 
    /**
     * Used for all vehicle types
     */
    plateSerialNumber?: string;
    /**
     * Used for all vehicle types
     */
    plateIssueDate?: string;
    /**
     * Used for all vehicle types
     */
    plateReasonForIssue?: PlatesInner.PlateReasonForIssueEnum;
    /**
     * Used for all vehicle types
     */
    plateIssuer?: string;
    /**
     * Used for all vehicle types
     */
    toEmailAddress?: string;
}
export namespace PlatesInner {
    export type PlateReasonForIssueEnum = 'Free replacement' | 'Replacement' | 'Destroyed' | 'Provisional' | 'Original' | 'Manual';
    export const PlateReasonForIssueEnum = {
        FreeReplacement: 'Free replacement' as PlateReasonForIssueEnum,
        Replacement: 'Replacement' as PlateReasonForIssueEnum,
        Destroyed: 'Destroyed' as PlateReasonForIssueEnum,
        Provisional: 'Provisional' as PlateReasonForIssueEnum,
        Original: 'Original' as PlateReasonForIssueEnum,
        Manual: 'Manual' as PlateReasonForIssueEnum
    };
}