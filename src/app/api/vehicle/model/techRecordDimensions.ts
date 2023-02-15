import { TechRecordDimensionsAxleSpacing } from './techRecordDimensionsAxleSpacing';

export interface TechRecordDimensions { 
    /**
     * Used for all vehicle types. Optional for PSV
     */
    length?: number;
    /**
     * Used only for PSV
     */
    height?: number;
    /**
     * Used for all vehicle types. Optional for PSV
     */
    width?: number;
    /**
     * Used only for HGV and TRL
     */
    axleSpacing?: Array<TechRecordDimensionsAxleSpacing>;
}