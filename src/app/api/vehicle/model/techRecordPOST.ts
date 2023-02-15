import { TechRecordArchiveAndProvisionalPayloadMsUserDetails } from './techRecordArchiveAndProvisionalPayloadMsUserDetails';
import { TechRecords } from './techRecords';

export interface TechRecordPOST { 
    msUserDetails?: TechRecordArchiveAndProvisionalPayloadMsUserDetails;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    vin?: string;
    /**
     * Mandatory for PSV, HGV, car, lgv, motorcycle. Optional for TRL
     */
    primaryVrm?: string;
    /**
     * Mandatory for PSV and HGV. Optional for TRL
     */
    secondaryVrms?: Array<string>;
    /**
     * Used only for TRL. Optional for HGV and PSV
     */
    trailerId?: string;
    techRecord?: TechRecords;
}