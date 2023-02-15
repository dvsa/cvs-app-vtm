export interface AdrDetailsTankTankStatement { 
    /**
     * Mandatory IF vehicleDetails.type contains the word ‘tank’ or ‘battery’ ELSE, optional. If mandatory, users must select ONE of these. Users cannot select less/more than one
     */
    substancesPermitted?: string;
    /**
     * Optional. Applicable only IF vehicleDetails.type contains the word ‘tank’ or ‘battery’
     */
    statement?: string;
    /**
     * Optional. Applicable only IF vehicleDetails.type contains the word ‘tank’ or ‘battery’
     */
    productListRefNo?: string;
    /**
     * Optional. Applicable only IF vehicleDetails.type contains the word ‘tank’ or ‘battery’
     */
    productListUnNo?: Array<string>;
    /**
     * Optional. Applicable only IF vehicleDetails.type contains the word ‘tank’ or ‘battery’
     */
    productList?: string;
}