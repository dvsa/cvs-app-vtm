import { AdrDetailsTankTankDetailsTc2Details } from './adrDetailsTankTankDetailsTc2Details';
import { AdrDetailsTankTankDetailsTc3Details } from './adrDetailsTankTankDetailsTc3Details';

export interface AdrDetailsTankTankDetails { 
    /**
     * Mandatory. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tankManufacturer?: string;
    /**
     * Mandatory. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    yearOfManufacture?: number;
    /**
     * Mandatory. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tankCode?: string;
    /**
     * Optional. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    specialProvisions?: string;
    /**
     * Mandatory. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tankManufacturerSerialNo?: string;
    /**
     * Optional. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
     */
    tankTypeAppNo?: string;
    tc2Details?: AdrDetailsTankTankDetailsTc2Details;
    tc3Details?: Array<AdrDetailsTankTankDetailsTc3Details>;
}