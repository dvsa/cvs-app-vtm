import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryHgv.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationHgvPsv.enum.js';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import { ValidatorNames } from '@models/validators.enum';
import { FuelTypes } from '@models/vehicle-tech-record.model';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
	TagTypeLabels,
} from '@services/dynamic-forms/dynamic-form.types';
import { TagType } from '../../../components/tag/tag.component';

export const HgvTechRecord: FormNode = {
	name: 'techRecordSummary',
	type: FormNodeTypes.GROUP,
	label: 'Vehicle Summary',
	children: [
		{
			name: 'techRecord_vehicleType',
			label: 'Vehicle type',
			value: '',
			width: FormNodeWidth.XS,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.VEHICLETYPE,
			disabled: true,
			customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
		},
		{
			name: 'techRecord_statusCode',
			label: 'Record status',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
		},
		{
			name: 'techRecord_numberOfWheelsDriven',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'techRecord_regnDate',
			label: 'Date of first registration',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.DATE,
			editType: FormNodeEditTypes.DATE,
			validators: [],
			isoDate: false,
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_manufactureYear',
			label: 'Year of manufacture',
			value: null,
			width: FormNodeWidth.XS,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.NUMBER,
			validators: [
				{ name: ValidatorNames.Max, args: 9999 },
				{ name: ValidatorNames.Min, args: 1000 },
				{ name: ValidatorNames.PastYear },
			],
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_noOfAxles',
			label: 'Number of axles',
			value: null,
			width: FormNodeWidth.XXS,
			type: FormNodeTypes.CONTROL,
			validators: [],
			disabled: true,
			customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
		},
		{
			name: 'techRecord_speedLimiterMrk',
			label: 'Speed limiter exempt',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ value: true, label: 'Exempt' },
				{ value: false, label: 'Not exempt' },
			],
			validators: [],
			class: 'flex--half',
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_tachoExemptMrk',
			label: 'Tacho exempt',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ value: true, label: 'Exempt' },
				{ value: false, label: 'Not exempt' },
			],
			validators: [],
			class: 'flex--half',
		},
		{
			name: 'techRecord_euroStandard',
			label: 'Euro standard',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ label: '0.10 g/kWh Euro III PM', value: '0.10 g/kWh Euro 3 PM' },
				...getOptionsFromEnum(EmissionStandard),
			],
		},
		{
			name: 'techRecord_roadFriendly',
			label: 'Road friendly suspension',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ value: true, label: 'Yes' },
				{ value: false, label: 'No' },
			],
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_fuelPropulsionSystem',
			label: 'Fuel / propulsion system',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			options: getOptionsFromEnum(FuelTypes),
			validators: [],
		},
		{
			name: 'techRecord_drawbarCouplingFitted',
			label: 'Drawbar coupling fitted',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ value: true, label: 'Yes' },
				{ value: false, label: 'No' },
			],
		},
		{
			name: 'techRecord_vehicleClass_description',
			label: 'Vehicle class',
			value: '',
			customId: 'vehicleClassDescription',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			options: [{ label: 'heavy goods vehicle', value: 'heavy goods vehicle' }],
			validators: [{ name: ValidatorNames.Required }],
			customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
		},
		{
			name: 'techRecord_vehicleConfiguration',
			label: 'Vehicle configuration',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			options: getOptionsFromEnum(VehicleConfiguration),
			validators: [{ name: ValidatorNames.UpdateFunctionCode }],
			customTags: [
				{ colour: TagType.RED, label: TagTypeLabels.REQUIRED },
				{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES },
			],
		},
		{
			name: 'techRecord_offRoad',
			label: 'Off road vehicle',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ value: true, label: 'Yes' },
				{ value: false, label: 'No' },
			],
		},
		{
			name: 'techRecord_euVehicleCategory',
			label: 'EU vehicle category',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			width: FormNodeWidth.S,
			options: getOptionsFromEnum(EUVehicleCategory),
			validators: [],
		},
		{
			name: 'techRecord_emissionsLimit',
			label: 'Emission limit (m-1) (plate value)',
			value: null,
			width: FormNodeWidth.XXS,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.NUMBER,
			validators: [
				{ name: ValidatorNames.Max, args: 99 },
				{
					name: ValidatorNames.CustomPattern,
					args: ['^\\d*(\\.\\d{0,5})?$', 'Max 5 decimal places'],
				},
			],
			enableDecimals: true,
		},
		{
			name: 'techRecord_departmentalVehicleMarker',
			label: 'Departmental vehicle marker',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ value: true, label: 'Yes' },
				{ value: false, label: 'No' },
			],
		},
		{
			name: 'techRecord_alterationMarker',
			label: 'Alteration marker',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.RADIO,
			options: [
				{ value: true, label: 'Yes' },
				{ value: false, label: 'No' },
			],
		},
		{
			name: 'techRecord_functionCode',
			label: 'Function code',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
	],
};
