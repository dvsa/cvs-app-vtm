import { AdrDetails } from './adrDetails';
import { ApplicantDetailsProperties } from './applicantDetailsProperties';
import { AuthIntoService } from './authIntoService';
import { Axles } from './axles';
import { Brakes } from './brakes';
import { Dda } from './dda';
import { LettersOfAuth } from './lettersOfAuth';
import { ManufacturerDetails } from './manufacturerDetails';
import { Microfilm } from './microfilm';
import { Plates } from './plates';
import { PurchaserDetails } from './purchaserDetails';
import { TechRecordBodyType } from './techRecordBodyType';
import { TechRecordDimensions } from './techRecordDimensions';
import { TechRecordVehicleClass } from './techRecordVehicleClass';

export interface TechRecord { 
    /**
     * Defines the level of completeness for a tech record. If it is set to \"skeleton\" then it means the vehicle does not meet the minimum requirements to be tested. If it is \"testable\" it means the vehicle meets the minimum requirements to be tested but is not complete from a business perspective. If \"complete\" then the vehicle it is complete form a business perspective also.
     */
    recordCompleteness?: string;
    /**
     * Used for all vehicle types
     */
    createdAt?: Date;
    /**
     * Used for all vehicle types
     */
    lastUpdatedAt?: Date;
    /**
     * Used only for HGV and TRL
     */
    make?: string;
    /**
     * Used only for HGV and TRL
     */
    model?: string;
    /**
     * Used for all vehicle types
     */
    functionCode?: string;
    /**
     * Used for HGV and PSV
     */
    fuelPropulsionSystem?: TechRecord.FuelPropulsionSystemEnum;
    /**
     * Used only for HGV
     */
    offRoad?: boolean;
    /**
     * Used for motorcycles to derive the test codes for specialist tests. Used for HGV and PSV.
     */
    numberOfWheelsDriven?: number;
    /**
     * Used for all vehicle types. Optional for car, lgv and motorcycle.
     */
    euVehicleCategory?: TechRecord.EuVehicleCategoryEnum;
    /**
     * Used only for HGV and PSV
     */
    emissionsLimit?: number;
    /**
     * Used for all vehicle types
     */
    departmentalVehicleMarker?: boolean;
    authIntoService?: AuthIntoService;
    lettersOfAuth?: LettersOfAuth;
    /**
     * Used for all vehicle types
     */
    alterationMarker?: boolean;
    /**
     * Used for all vehicle types
     */
    approvalType?: TechRecord.ApprovalTypeEnum;
    /**
     * Used for all vehicle types
     */
    approvalTypeNumber?: string;
    /**
     * Used for all vehicle types
     */
    variantNumber?: string;
    /**
     * Used for all vehicle types
     */
    variantVersionNumber?: string;
    /**
     * Used only for HGV and TRL
     */
    grossEecWeight?: number;
    /**
     * Used only for HGV
     */
    trainEecWeight?: number;
    /**
     * Used only for HGV
     */
    maxTrainEecWeight?: number;
    applicantDetails?: ApplicantDetailsProperties;
    purchaserDetails?: PurchaserDetails;
    manufacturerDetails?: ManufacturerDetails;
    microfilm?: Microfilm;
    plates?: Plates;
    /**
     * Used only for PSV
     */
    chassisMake?: string;
    /**
     * Used only for PSV
     */
    chassisModel?: string;
    /**
     * Used only for PSV
     */
    bodyMake?: string;
    /**
     * Used only for PSV
     */
    bodyModel?: string;
    /**
     * Used only for PSV
     */
    modelLiteral?: string;
    bodyType?: TechRecordBodyType;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    manufactureYear?: number;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    regnDate?: string;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    firstUseDate?: string;
    /**
     * Used only for PSV
     */
    coifDate?: string;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    ntaNumber?: string;
    /**
     * Used only for PSV
     */
    coifSerialNumber?: string;
    /**
     * Used only for PSV
     */
    coifCertifierName?: string;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    conversionRefNo?: string;
    /**
     * Used only for PSV
     */
    seatsLowerDeck?: number;
    /**
     * Used only for PSV
     */
    seatsUpperDeck?: number;
    /**
     * Used only for PSV
     */
    standingCapacity?: number;
    /**
     * Used only for PSV
     */
    speedRestriction?: number;
    /**
     * Used only for PSV and HGV
     */
    speedLimiterMrk?: boolean;
    /**
     * Used only for PSV and HGV
     */
    tachoExemptMrk?: boolean;
    /**
     * Used only for PSV
     */
    dispensations?: string;
    /**
     * Used for PSV, car, lgv and motorcycle
     */
    remarks?: string;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv and motorcycle
     */
    reasonForCreation?: string;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    statusCode?: TechRecord.StatusCodeEnum;
    /**
     * Used only for PSV
     */
    unladenWeight?: number;
    /**
     * Used only for PSV
     */
    grossKerbWeight?: number;
    /**
     * Used only for PSV
     */
    grossLadenWeight?: number;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    grossGbWeight?: number;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    grossDesignWeight?: number;
    /**
     * Used only for HGV
     */
    trainGbWeight?: number;
    /**
     * Used only for HGV and PSV
     */
    trainDesignWeight?: number;
    /**
     * Used only for HGV and PSV. Optional for PSV
     */
    maxTrainGbWeight?: number;
    /**
     * Used only for HGV
     */
    maxTrainDesignWeight?: number;
    /**
     * Used only for TRL
     */
    maxLoadOnCoupling?: number;
    frameDescription?: TechRecord.FrameDescriptionEnum;
    /**
     * Used only for HGV and TRL
     */
    tyreUseCode?: string;
    /**
     * Used only for HGV and TRL
     */
    roadFriendly?: boolean;
    /**
     * Used only for HGV
     */
    drawbarCouplingFitted?: boolean;
    /**
     * Used for HGV and PSV
     */
    euroStandard?: string;
    /**
     * Used only for TRL
     */
    suspensionType?: string;
    /**
     * Used only for TRL
     */
    couplingType?: string;
    dimensions?: TechRecordDimensions;
    /**
     * Used only for HGV
     */
    frontAxleTo5thWheelMin?: number;
    /**
     * Used only for HGV
     */
    frontAxleTo5thWheelMax?: number;
    /**
     * Used only for HGV. Optional for HGV
     */
    frontAxleTo5thWheelCouplingMin?: number;
    /**
     * Used only for HGV. Optional for HGV
     */
    frontAxleTo5thWheelCouplingMax?: number;
    /**
     * Used for all vehicle types. Optional for PSV
     */
    frontAxleToRearAxle?: number;
    /**
     * Used only for TRL
     */
    rearAxleToRearTrl?: number;
    /**
     * Used only for TRL
     */
    couplingCenterToRearAxleMin?: number;
    /**
     * Used only for TRL
     */
    couplingCenterToRearAxleMax?: number;
    /**
     * Used only for TRL
     */
    couplingCenterToRearTrlMin?: number;
    /**
     * Used only for TRL
     */
    couplingCenterToRearTrlMax?: number;
    /**
     * Used only for TRL
     */
    centreOfRearmostAxleToRearOfTrl?: number;
    /**
     * Used only for HGV and TRL
     */
    notes?: string;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    noOfAxles?: number;
    /**
     * Used only for PSV
     */
    brakeCode?: string;
    adrDetails?: AdrDetails;
    /**
     * This field gets populated with the Microsoft AD 'name', when a tech record gets created
     */
    createdByName?: string;
    /**
     * This attribute gets populated with the Microsoft AD 'oid', when a tech record gets created
     */
    createdById?: string;
    /**
     * This field gets populated with the Microsoft AD 'name', when a tech record gets updated
     */
    lastUpdatedByName?: string;
    /**
     * This attribute gets populated with the Microsoft AD 'oid', when a tech record gets updated
     */
    lastUpdatedById?: string;
    /**
     * set updateType to adrUpdate on the archived tech record, when a tech record is archived
     */
    updateType?: TechRecord.UpdateTypeEnum;
    vehicleClass?: TechRecordVehicleClass;
    /**
     * Used for car and lgv.
     */
    vehicleSubclass?: Array<string>;
    /**
     * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
     */
    vehicleType?: TechRecord.VehicleTypeEnum;
    /**
     * Used only for PSV
     */
    vehicleSize?: TechRecord.VehicleSizeEnum;
    /**
     * Used only for PSV
     */
    numberOfSeatbelts?: string;
    /**
     * Used only for PSV
     */
    seatbeltInstallationApprovalDate?: string;
    /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
    vehicleConfiguration?: TechRecord.VehicleConfigurationEnum;
    brakes?: Brakes;
    axles?: Axles;
    dda?: Dda;
}
export namespace TechRecord {
    export type FuelPropulsionSystemEnum = 'DieselPetrol' | 'Hybrid' | 'Electric' | 'CNG' | 'Fuel cell' | 'LNG' | 'Other';
    export const FuelPropulsionSystemEnum = {
        DieselPetrol: 'DieselPetrol' as FuelPropulsionSystemEnum,
        Hybrid: 'Hybrid' as FuelPropulsionSystemEnum,
        Electric: 'Electric' as FuelPropulsionSystemEnum,
        CNG: 'CNG' as FuelPropulsionSystemEnum,
        FuelCell: 'Fuel cell' as FuelPropulsionSystemEnum,
        LNG: 'LNG' as FuelPropulsionSystemEnum,
        Other: 'Other' as FuelPropulsionSystemEnum
    };
    export type EuVehicleCategoryEnum = 'm1' | 'm2' | 'm3' | 'n1' | 'n2' | 'n3' | 'o1' | 'o2' | 'o3' | 'o4' | 'l1e-a' | 'l1e' | 'l2e' | 'l3e' | 'l4e' | 'l5e' | 'l6e' | 'l7e';
    export const EuVehicleCategoryEnum = {
        M1: 'm1' as EuVehicleCategoryEnum,
        M2: 'm2' as EuVehicleCategoryEnum,
        M3: 'm3' as EuVehicleCategoryEnum,
        N1: 'n1' as EuVehicleCategoryEnum,
        N2: 'n2' as EuVehicleCategoryEnum,
        N3: 'n3' as EuVehicleCategoryEnum,
        O1: 'o1' as EuVehicleCategoryEnum,
        O2: 'o2' as EuVehicleCategoryEnum,
        O3: 'o3' as EuVehicleCategoryEnum,
        O4: 'o4' as EuVehicleCategoryEnum,
        L1eA: 'l1e-a' as EuVehicleCategoryEnum,
        L1e: 'l1e' as EuVehicleCategoryEnum,
        L2e: 'l2e' as EuVehicleCategoryEnum,
        L3e: 'l3e' as EuVehicleCategoryEnum,
        L4e: 'l4e' as EuVehicleCategoryEnum,
        L5e: 'l5e' as EuVehicleCategoryEnum,
        L6e: 'l6e' as EuVehicleCategoryEnum,
        L7e: 'l7e' as EuVehicleCategoryEnum
    };
    export type ApprovalTypeEnum = 'NTA' | 'ECTA' | 'IVA' | 'NSSTA' | 'ECSSTA';
    export const ApprovalTypeEnum = {
        NTA: 'NTA' as ApprovalTypeEnum,
        ECTA: 'ECTA' as ApprovalTypeEnum,
        IVA: 'IVA' as ApprovalTypeEnum,
        NSSTA: 'NSSTA' as ApprovalTypeEnum,
        ECSSTA: 'ECSSTA' as ApprovalTypeEnum
    };
    export type StatusCodeEnum = 'archived' | 'current' | 'provisional';
    export const StatusCodeEnum = {
        Archived: 'archived' as StatusCodeEnum,
        Current: 'current' as StatusCodeEnum,
        Provisional: 'provisional' as StatusCodeEnum
    };
    export type FrameDescriptionEnum = 'Channel section' | 'Space frame' | 'I section' | 'Tubular' | 'Frame section' | 'Other' | 'integral' | 'Box section' | 'U section';
    export const FrameDescriptionEnum = {
        ChannelSection: 'Channel section' as FrameDescriptionEnum,
        SpaceFrame: 'Space frame' as FrameDescriptionEnum,
        ISection: 'I section' as FrameDescriptionEnum,
        Tubular: 'Tubular' as FrameDescriptionEnum,
        FrameSection: 'Frame section' as FrameDescriptionEnum,
        Other: 'Other' as FrameDescriptionEnum,
        Integral: 'integral' as FrameDescriptionEnum,
        BoxSection: 'Box section' as FrameDescriptionEnum,
        USection: 'U section' as FrameDescriptionEnum
    };
    export type UpdateTypeEnum = 'adrUpdate' | 'techRecordUpdate';
    export const UpdateTypeEnum = {
        AdrUpdate: 'adrUpdate' as UpdateTypeEnum,
        TechRecordUpdate: 'techRecordUpdate' as UpdateTypeEnum
    };
    export type VehicleTypeEnum = 'psv' | 'hgv' | 'trl' | 'car' | 'lgv' | 'motorcycle';
    export const VehicleTypeEnum = {
        Psv: 'psv' as VehicleTypeEnum,
        Hgv: 'hgv' as VehicleTypeEnum,
        Trl: 'trl' as VehicleTypeEnum,
        Car: 'car' as VehicleTypeEnum,
        Lgv: 'lgv' as VehicleTypeEnum,
        Motorcycle: 'motorcycle' as VehicleTypeEnum
    };
    export type VehicleSizeEnum = 'small' | 'large';
    export const VehicleSizeEnum = {
        Small: 'small' as VehicleSizeEnum,
        Large: 'large' as VehicleSizeEnum
    };
    export type VehicleConfigurationEnum = 'rigid' | 'articulated' | 'centre axle drawbar' | 'semi-car transporter' | 'semi-trailer' | 'low loader' | 'other' | 'drawbar' | 'four-in-line' | 'dolly' | 'full drawbar';
    export const VehicleConfigurationEnum = {
        Rigid: 'rigid' as VehicleConfigurationEnum,
        Articulated: 'articulated' as VehicleConfigurationEnum,
        CentreAxleDrawbar: 'centre axle drawbar' as VehicleConfigurationEnum,
        SemiCarTransporter: 'semi-car transporter' as VehicleConfigurationEnum,
        SemiTrailer: 'semi-trailer' as VehicleConfigurationEnum,
        LowLoader: 'low loader' as VehicleConfigurationEnum,
        Other: 'other' as VehicleConfigurationEnum,
        Drawbar: 'drawbar' as VehicleConfigurationEnum,
        FourInLine: 'four-in-line' as VehicleConfigurationEnum,
        Dolly: 'dolly' as VehicleConfigurationEnum,
        FullDrawbar: 'full drawbar' as VehicleConfigurationEnum
    };
}