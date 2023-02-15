export interface MetadataAdrDetailsTankTankStatement { 
    substancesPermittedFe?: Array<MetadataAdrDetailsTankTankStatement.SubstancesPermittedFeEnum>;
}
export namespace MetadataAdrDetailsTankTankStatement {
    export type SubstancesPermittedFeEnum = 'Substances permitted under the tank code and any special provisions specified in 9 may be carried' | 'Substances (Class UN number and if necessary packing group and proper shipping name) may be carried';
    export const SubstancesPermittedFeEnum = {
        PermittedUnderTheTankCodeAndAnySpecialProvisionsSpecifiedIn9MayBeCarried: 'Substances permitted under the tank code and any special provisions specified in 9 may be carried' as SubstancesPermittedFeEnum,
        ClassUNNumberAndIfNecessaryPackingGroupAndProperShippingNameMayBeCarried: 'Substances (Class UN number and if necessary packing group and proper shipping name) may be carried' as SubstancesPermittedFeEnum
    };
}