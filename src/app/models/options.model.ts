import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { EUVehicleCategory as CARCategories } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryCar.enum.js';
import { EUVehicleCategory as HGVCategories } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryHgv.enum.js';
import { EUVehicleCategory as LGVCategories } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryLgv.enum.js';
import { EUVehicleCategory as PSVCategories } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
import { EUVehicleCategory as TRLCategories } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { TyreUseCode as HGVTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeHgv.enum.js';
import { TyreUseCode as TRLTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeTrl.enum.js';
import { CouplingTypeCodeEnum } from '@models/coupling-type-enum';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import {
	HgvPsvVehicleConfiguration,
	TrlVehicleConfiguration,
	VehicleConfiguration,
} from '@models/vehicle-configuration.enum';
import { getOptionsFromEnum, getOptionsFromEnumOneChar, getSortedOptionsFromEnum } from '../forms/utils/enum-map';
import { VehicleSize } from './vehicle-size.enum';
import {
	FitmentCode,
	FrameDescriptions,
	FuelTypes,
	SpeedCategorySymbol,
	VehicleSubclass,
} from './vehicle-tech-record.model';

export interface MultiOption<T = string | number | boolean> {
	label: string;
	value: T;
	hint?: string;
}
export type MultiOptions<T = string | number | boolean> = Array<MultiOption<T>>;

export const YES_NO_OPTIONS: MultiOptions = [
	{ value: true, label: 'Yes' },
	{ value: false, label: 'No' },
];

export const YES_NO_NULL_OPTIONS: MultiOptions<boolean | null> = [
	{ value: true, label: 'Yes' },
	{ value: false, label: 'No' },
	{ value: null, label: 'I do not know' },
];

export const EXEMPT_OR_NOT_OPTIONS: MultiOptions = [
	{ value: true, label: 'Exempt' },
	{ value: false, label: 'Not exempt' },
];

export const FUEL_PROPULSION_SYSTEM_OPTIONS: MultiOptions = getOptionsFromEnum(FuelTypes);

export const HGV_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(HGVCategories);

export const PSV_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(PSVCategories);

export const TRL_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(TRLCategories).filter(
	(option) => option.value !== EUVehicleCategory.O1 && option.value !== EUVehicleCategory.O2
);

export const SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(TRLCategories).filter(
	(option) => option.value !== EUVehicleCategory.O3 && option.value !== EUVehicleCategory.O4
);

export const LGV_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(LGVCategories);

export const CAR_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(CARCategories);

// TODO This should be replaced with an import from cvs-type-definitions when available
export enum MotorcycleCategories {
	L1E_A = 'l1e-a',
	L1E = 'l1e',
	L2E = 'l2e',
	L3E = 'l3e',
	L4E = 'l4e',
	L5E = 'l5e',
	L6E = 'l6e',
	L7E = 'l7e',
}

export const MOTORCYCLE_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(MotorcycleCategories);

export const ALL_EU_VEHICLE_CATEGORY_OPTIONS: MultiOptions = getOptionsFromEnum(EUVehicleCategory);

export const HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS: MultiOptions = [
	{ label: 'heavy goods vehicle', value: 'heavy goods vehicle' },
];

export const FUNCTION_CODE_OPTIONS: MultiOptions = [
	{ label: 'R', value: 'R' },
	{ label: 'A', value: 'A' },
];

export const BODY_TYPE_OPTIONS: MultiOptions = [];

export const PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS: MultiOptions = [
	{
		label: 'small psv (ie: less than or equal to 22 passengers)',
		value: 'small psv (ie: less than or equal to 22 seats)',
	},
	{
		label: 'large psv(ie: greater than or equal to 23 passengers)',
		value: 'large psv(ie: greater than 23 seats)',
	},
];

export const TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS: MultiOptions = [{ label: 'trailer', value: 'trailer' }];

export const MOTORCYCLE_VEHICLE_CLASS_DESCRIPTION_OPTIONS: MultiOptions = [
	{ label: 'Motorcycles up to 200cc', value: 'motorbikes up to 200cc' },
	{ label: 'Motorcycles over 200cc or with a sidecar', value: 'motorbikes over 200cc or with a sidecar' },
	{ label: '3 wheelers', value: '3 wheelers' },
];

export const ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS: MultiOptions = [
	{ label: 'motorbikes over 200cc or with a sidecar', value: 'motorbikes over 200cc or with a sidecar' },
	{ label: 'not applicable', value: 'not applicable' },
	{
		label: 'small psv (ie: less than or equal to 22 passengers)',
		value: 'small psv (ie: less than or equal to 22 seats)',
	},
	{ label: 'motorbikes up to 200cc', value: 'motorbikes up to 200cc' },
	{ label: 'trailer', value: 'trailer' },
	{
		label: 'large psv(ie: greater than or equal to 23 passengers)',
		value: 'large psv(ie: greater than 23 seats)',
	},
	{ label: '3 wheelers', value: '3 wheelers' },
	{ label: 'heavy goods vehicle', value: 'heavy goods vehicle' },
	{ label: 'MOT class 4', value: 'MOT class 4' },
	{ label: 'MOT class 7', value: 'MOT class 7' },
	{ label: 'MOT class 5', value: 'MOT class 5' },
];

export const MONTHS: MultiOptions = [
	{ value: 'January', label: 'January' },
	{ value: 'February', label: 'February' },
	{ value: 'March', label: 'March' },
	{ value: 'April', label: 'April' },
	{ value: 'May', label: 'May' },
	{ value: 'June', label: 'June' },
	{ value: 'July', label: 'July' },
	{ value: 'August', label: 'August' },
	{ value: 'September', label: 'September' },
	{ value: 'October', label: 'October' },
	{ value: 'November', label: 'November' },
	{ value: 'December', label: 'December' },
];

export const SUSPENSION_TYRE_OPTIONS: MultiOptions = [
	{ value: 'S', label: 'Steel' },
	{ value: 'R', label: 'Rubber' },
	{ value: 'A', label: 'Air' },
	{ value: 'H', label: 'Hydraulic' },
	{ value: 'O', label: 'Other' },
];

export const EMISSION_STANDARD_OPTIONS: MultiOptions = [
	{ label: '0.10 g/kWh Euro III PM', value: '0.10 g/kWh Euro 3 PM' },
	{ label: '0.03 g/kWh Euro IV PM', value: EmissionStandard.EuroIVPM },
	{ label: 'Euro 3', value: EmissionStandard.Euro3 },
	{ label: 'Euro 4', value: EmissionStandard.Euro4 },
	{ label: 'Euro 5', value: EmissionStandard.Euro5 },
	{ label: 'Euro 6', value: EmissionStandard.Euro6 },
	{ label: 'Euro V', value: EmissionStandard.EuroV },
	{ label: 'Euro VI', value: EmissionStandard.EuroVI },
	{ label: 'Full electric', value: EmissionStandard.FullElectric },
];

export const COUPLING_TYPE_OPTIONS: MultiOptions = [
	{ label: 'Fifth wheel', value: CouplingTypeCodeEnum.F },
	{ label: 'Drawbar', value: CouplingTypeCodeEnum.B },
	{ label: 'Other', value: CouplingTypeCodeEnum.O },
	{ label: 'Automatic', value: CouplingTypeCodeEnum.A },
	{ label: 'Dolly', value: CouplingTypeCodeEnum.D },
	{ label: 'Semi', value: CouplingTypeCodeEnum.S },
];

export const HGV_PSV_VEHICLE_CONFIGURATION_OPTIONS = getOptionsFromEnum(HgvPsvVehicleConfiguration);

export const TRL_VEHICLE_CONFIGURATION_OPTIONS = getSortedOptionsFromEnum(TrlVehicleConfiguration);

export const ALL_VEHICLE_CONFIGURATION_OPTIONS = getOptionsFromEnum(VehicleConfiguration);

export const VEHICLE_SUBCLASS_OPTIONS = getOptionsFromEnum(VehicleSubclass);

export const VEHICLE_SIZE_OPTIONS = getOptionsFromEnum(VehicleSize);

export const FRAME_DESCRIPTION_OPTIONS = getSortedOptionsFromEnum(FrameDescriptions);

export const HGV_TYRE_USE_CODE_OPTIONS = getOptionsFromEnum(HGVTyreUseCode);

export const TRL_TYRE_USE_CODE_OPTIONS = getOptionsFromEnum(TRLTyreUseCode);

export const SPEED_CATEGORY_SYMBOL_OPTIONS = getOptionsFromEnum(SpeedCategorySymbol);

export const FITMENT_CODE_OPTIONS = getOptionsFromEnumOneChar(FitmentCode);

export const PERMITTED_DANGEROUS_GOODS_OPTIONS = [
	{ value: ADRDangerousGood.FP, label: 'FP <61 (FL)' },
	{ value: ADRDangerousGood.AT, label: 'AT' },
	{ value: ADRDangerousGood.MEMU, label: 'MEMU' },
	{ value: ADRDangerousGood.CARBON_DISULPHIDE, label: 'Carbon disulphide' },
	{ value: ADRDangerousGood.HYDROGEN, label: 'Hydrogen' },
	{ value: ADRDangerousGood.EXPLOSIVES_TYPE_2, label: 'Explosives (type 2)' },
	{ value: ADRDangerousGood.EXPLOSIVES_TYPE_3, label: 'Explosives (type 3)' },
];

export const ADR_TANK_STATEMENT_SUBSTANCES_PERMITTED = [
	{
		value: 'Substances permitted under the tank code and any special provisions specified in 9 may be carried',
		label: 'Substances permitted under the tank code and any special provisions specified in no.9 may be carried',
	},
	{
		value: 'Substances (Class UN number and if necessary packing group and proper shipping name) may be carried',
		label: 'Substances (Class UN number and if necessary packing group and proper shipping name) may be carried',
	},
];
