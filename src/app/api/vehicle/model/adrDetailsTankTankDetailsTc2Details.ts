export interface AdrDetailsTankTankDetailsTc2Details { 
    /**
     * Optional. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tc2Type?: AdrDetailsTankTankDetailsTc2Details.Tc2TypeEnum;
    /**
     * Optional. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tc2IntermediateApprovalNo?: string;
    /**
     * Optional. Date(YYYY-MM-DD). Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tc2IntermediateExpiryDate?: string;
}
export namespace AdrDetailsTankTankDetailsTc2Details {
    export type Tc2TypeEnum = 'initial';
    export const Tc2TypeEnum = {
        Initial: 'initial' as Tc2TypeEnum
    };
}