import { MetadataAdrDetailsAdditionalNotes } from './metadataAdrDetailsAdditionalNotes';
import { MetadataAdrDetailsTank } from './metadataAdrDetailsTank';
import { MetadataAdrDetailsVehicleDetails } from './metadataAdrDetailsVehicleDetails';

export interface MetadataAdrDetails { 
    memosApplyFe?: Array<MetadataAdrDetails.MemosApplyFeEnum>;
    tank?: MetadataAdrDetailsTank;
    additionalNotes?: MetadataAdrDetailsAdditionalNotes;
    permittedDangerousGoodsFe?: Array<MetadataAdrDetails.PermittedDangerousGoodsFeEnum>;
    vehicleDetails?: MetadataAdrDetailsVehicleDetails;
}
export namespace MetadataAdrDetails {
    export type MemosApplyFeEnum = '07/09 3mth leak ext';
    export const MemosApplyFeEnum = {
        _07093mthLeakExt: '07/09 3mth leak ext' as MemosApplyFeEnum
    };
    export type PermittedDangerousGoodsFeEnum = 'FP <61 (FL)' | 'AT' | 'Class 5.1 Hydrogen Peroxide (OX)' | 'MEMU' | 'Carbon Disulphide' | 'Hydrogen' | 'Explosives (type 2)' | 'Explosives (type 3)';
    export const PermittedDangerousGoodsFeEnum = {
        FP61FL: 'FP <61 (FL)' as PermittedDangerousGoodsFeEnum,
        AT: 'AT' as PermittedDangerousGoodsFeEnum,
        Class51HydrogenPeroxideOX: 'Class 5.1 Hydrogen Peroxide (OX)' as PermittedDangerousGoodsFeEnum,
        MEMU: 'MEMU' as PermittedDangerousGoodsFeEnum,
        CarbonDisulphide: 'Carbon Disulphide' as PermittedDangerousGoodsFeEnum,
        Hydrogen: 'Hydrogen' as PermittedDangerousGoodsFeEnum,
        ExplosivesType2: 'Explosives (type 2)' as PermittedDangerousGoodsFeEnum,
        ExplosivesType3: 'Explosives (type 3)' as PermittedDangerousGoodsFeEnum
    };
}