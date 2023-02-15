import { MetadataAdrDetails } from './metadataAdrDetails';

/**
 * Applicable only to ADR details. Returned only if query param \"metadata\" = \"true\", otherwise not returned
 */
export interface Metadata { 
    /**
     * makeFe and chassisMakeFe fields have the same value. Combining them into a field for now so we don't send the same list twice.
     */
    makeAndChassisMakeFe?: Array<string>;
    bodyMakeFe?: Array<string>;
    adrDetails?: MetadataAdrDetails;
}