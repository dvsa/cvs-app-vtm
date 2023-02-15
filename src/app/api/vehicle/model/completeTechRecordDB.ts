import { TechRecords } from './techRecords';

/**
 * the Tech objects as they
 */
export interface CompleteTechRecordDB { 
    /**
     * It defines the composed primary key, in combination with \"vin\".
     */
    systemNumber?: string;
    partialVin?: string;
    primaryVrm?: string;
    secondaryVrms?: Array<string>;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    vin?: string;
    /**
     * Used only for TRL
     */
    trailerId?: string;
    techRecord?: TechRecords;
}