import { Metadata } from './metadata';
import { TechRecords } from './techRecords';
import { Vrms } from './vrms';

export interface CompleteTechRecord { 
    /**
     * It defines the composed primary key, in combination with \"vin\".
     */
    systemNumber?: string;
    vrms?: Vrms;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    vin?: string;
    /**
     * Used only for TRL
     */
    trailerId?: string;
    techRecord?: TechRecords;
    metadata?: Metadata;
}