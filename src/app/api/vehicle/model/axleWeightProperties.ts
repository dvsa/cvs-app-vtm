export interface AxleWeightProperties { 
    /**
     * Used only for PSV
     */
    kerbWeight?: number;
    /**
     * Used only for PSV
     */
    ladenWeight?: number;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    gbWeight?: number;
    /**
     * Used only for HGV and TRL
     */
    eecWeight?: number;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    designWeight?: number;
}