export interface AdrDetailsTankTankDetailsTc3Details { 
    /**
     * Optional. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tc3Type?: AdrDetailsTankTankDetailsTc3Details.Tc3TypeEnum;
    /**
     * Optional. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tc3PeriodicNumber?: string;
    /**
     * Optional. Date(YYYY-MM-DD). Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tc3PeriodicExpiryDate?: string;
}
export namespace AdrDetailsTankTankDetailsTc3Details {
    export type Tc3TypeEnum = 'intermediate' | 'periodic' | 'exceptional';
    export const Tc3TypeEnum = {
        Intermediate: 'intermediate' as Tc3TypeEnum,
        Periodic: 'periodic' as Tc3TypeEnum,
        Exceptional: 'exceptional' as Tc3TypeEnum
    };
}