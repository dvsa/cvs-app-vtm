export interface AxleTyreProperties { 
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    tyreSize?: string;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    plyRating?: string;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    fitmentCode?: AxleTyreProperties.FitmentCodeEnum;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    dataTrAxles?: number;
    /**
     * Used only for PSV
     */
    speedCategorySymbol?: AxleTyreProperties.SpeedCategorySymbolEnum;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    tyreCode?: number;
}
export namespace AxleTyreProperties {
    export type FitmentCodeEnum = 'double' | 'single';
    export const FitmentCodeEnum = {
        Double: 'double' as FitmentCodeEnum,
        Single: 'single' as FitmentCodeEnum
    };
    export type SpeedCategorySymbolEnum = 'a7' | 'a8' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'j' | 'k' | 'l' | 'm' | 'n' | 'p' | 'q';
    export const SpeedCategorySymbolEnum = {
        A7: 'a7' as SpeedCategorySymbolEnum,
        A8: 'a8' as SpeedCategorySymbolEnum,
        B: 'b' as SpeedCategorySymbolEnum,
        C: 'c' as SpeedCategorySymbolEnum,
        D: 'd' as SpeedCategorySymbolEnum,
        E: 'e' as SpeedCategorySymbolEnum,
        F: 'f' as SpeedCategorySymbolEnum,
        G: 'g' as SpeedCategorySymbolEnum,
        J: 'j' as SpeedCategorySymbolEnum,
        K: 'k' as SpeedCategorySymbolEnum,
        L: 'l' as SpeedCategorySymbolEnum,
        M: 'm' as SpeedCategorySymbolEnum,
        N: 'n' as SpeedCategorySymbolEnum,
        P: 'p' as SpeedCategorySymbolEnum,
        Q: 'q' as SpeedCategorySymbolEnum
    };
}