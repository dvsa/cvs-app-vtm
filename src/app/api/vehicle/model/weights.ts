import { AxleBrakeProperties } from './axleBrakeProperties';
import { AxleTyreProperties } from './axleTyreProperties';
import { AxleWeightProperties } from './axleWeightProperties';

export interface Weights { 
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    axleNumber?: number;
    /**
     * Used for all vehicle types - PSV, HGV and TRL. Optional for HGV
     */
    parkingBrakeMrk?: boolean;
    weights?: AxleWeightProperties;
    tyres?: AxleTyreProperties;
    brakes?: AxleBrakeProperties;
}