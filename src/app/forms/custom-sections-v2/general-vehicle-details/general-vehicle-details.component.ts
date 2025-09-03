import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import {
	BodyTypeCode,
	BodyTypeDescription,
	articulatedHgvBodyTypeCodeMap,
	hgvBodyTypeCodeMap,
	trlBodyTypeCodeMap,
	vehicleBodyTypeCodeMap,
	vehicleBodyTypeDescriptionMap,
} from '@models/body-type-enum';
import {
	ALL_EU_VEHICLE_CATEGORY_OPTIONS,
	ALL_VEHICLE_CONFIGURATION_OPTIONS,
	CAR_EU_VEHICLE_CATEGORY_OPTIONS,
	FRAME_DESCRIPTION_OPTIONS,
	FUNCTION_CODE_OPTIONS,
	HGV_EU_VEHICLE_CATEGORY_OPTIONS,
	HGV_PSV_VEHICLE_CONFIGURATION_OPTIONS,
	LGV_EU_VEHICLE_CATEGORY_OPTIONS,
	MONTHS,
	MultiOptions,
	PSV_EU_VEHICLE_CATEGORY_OPTIONS,
	SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS,
	TRL_EU_VEHICLE_CATEGORY_OPTIONS,
	TRL_VEHICLE_CONFIGURATION_OPTIONS,
	VEHICLE_SUBCLASS_OPTIONS,
} from '@models/options.model';
import { PsvMake, ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectReferenceDataByResourceKey } from '@store/reference-data';
import { ReplaySubject, combineLatest, map, of, skipWhile, switchMap, take, takeUntil } from 'rxjs';
import { GovukCheckboxGroupComponent } from '../../components/govuk-checkbox-group/govuk-checkbox-group.component';

// type VehicleSectionForm = Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>;

@Component({
	selector: 'app-general-vehicle-details',
	templateUrl: './general-vehicle-details.component.html',
	styleUrls: ['./general-vehicle-details.component.scss'],
	imports: [
		GovukFormGroupDateComponent,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		AsyncPipe,
		GovukFormGroupSelectComponent,
		GovukFormGroupRadioComponent,
		ToUppercaseDirective,
		GovukCheckboxGroupComponent,
		GovukFormGroupAutocompleteComponent,
	],
})
export class GeneralVehicleDetailsComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FUNCTION_CODE_OPTIONS = FUNCTION_CODE_OPTIONS;
	protected readonly VEHICLE_SUBCLASS_OPTIONS = VEHICLE_SUBCLASS_OPTIONS;
	protected readonly MONTHS = MONTHS;
	protected readonly FRAME_DESCRIPTION_OPTIONS = FRAME_DESCRIPTION_OPTIONS;

	optionsService = inject(MultiOptionsService);
	referenceDataService = inject(ReferenceDataService);
	cdr = inject(ChangeDetectorRef);

	bodyTypes: MultiOptions = [];
	bodyMakes$ = of<MultiOptions | undefined>([]);
	dtpNumbers$ = combineLatest([
		this.referenceDataService.getAll$(ReferenceDataResourceType.PsvMake),
		this.referenceDataService.getReferencePsvMakeDataLoading$(),
	]).pipe(
		skipWhile(([, loading]) => loading),
		take(1),
		map(([data]) => data?.map((option) => option.resourceKey) ?? [])
	);

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	// TODO properly type this at some point
	form = this.fb.group<any>({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

		// Attach all form controls to parent
		this.init(this.form);

		this.loadOptions();
		this.loadBodyMakes();

		const vehicleConfigurationControl = this.form.get('techRecord_vehicleConfiguration');
		vehicleConfigurationControl?.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => this.handleVehicleConfigurationChange());

		const bodyTypeControl = this.form.get('techRecord_bodyType_description');
		bodyTypeControl?.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => this.handleBodyTypeDescriptionChange());

		if (this.techRecord().techRecord_vehicleType === VehicleTypes.PSV) {
			this.form
				.get('techRecord_brakes_dtpNumber')
				?.valueChanges.pipe(
					takeUntil(this.destroy$),
					switchMap((value) => {
						return this.store.select(
							selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, value as string)
						);
					})
				)
				.subscribe((value) => {
					if (value) {
						this.handleDTpNumberChange(value);
					}
				});
		}

		const vehicleType = this.getVehicleType();
		if (vehicleType === VehicleTypes.TRL) {
			this.bodyTypes = getOptionsFromEnum(Array.from(trlBodyTypeCodeMap.values()).flat());
		}
	}

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			case VehicleTypes.PSV:
				return this.psvFields;
			case VehicleTypes.TRL:
				return this.trlFields;
			case VehicleTypes.SMALL_TRL:
				return this.smallTrlFields;
			// case VehicleTypes.LGV:
			//   return this.lgvFields;
			case VehicleTypes.CAR:
				return this.carFields;
			// case VehicleTypes.MOTORCYCLE:
			//   return this.motorcycleFields;
			default:
				return {};
		}
	}

	get hgvFields(): Partial<Record<keyof TechRecordType<'hgv'>, FormControl>> {
		return {
			techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: VehicleTypes.HGV, disabled: true }),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
				this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
				this.commonValidators.xYearsAfterCurrent(
					1,
					`Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
				),
			]),
			techRecord_brakes_dtpNumber: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(6, 'DTp number must be less than or equal to 6 characters'),
			]),
			techRecord_make: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(50, 'Body make must be less than or equal to 50 characters'),
				// this.bodyMakeRequiredWithDangerousGoods(),
			]),
			techRecord_model: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Body model must be less than or equal to 30 characters'),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_bodyType_code: this.fb.control<string | null>(null),
			techRecord_bodyType_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Body type is required'),
			]),
			techRecord_functionCode: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1, 'Function code must be less than or equal to 1 characters'),
			]),
			techRecord_conversionRefNo: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(10, 'Conversion reference number must be 10 characters or less'),
				this.commonValidators.pattern(
					'^[A-Z0-9 ]{0,10}$',
					'Conversion reference number must only include numbers and letters A to Z'
				),
			]),
			techRecord_euVehicleCategory: this.fb.control<string | null>(null),
			techRecord_noOfAxles: this.fb.control<number | null>(null, [
				this.commonValidators.range(2, 10, 'Number of axles must be between 2 and 10'),
			]),
		};
	}

	get psvFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: VehicleTypes.PSV, disabled: true }),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
				this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
				this.commonValidators.xYearsAfterCurrent(
					1,
					`Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
				),
			]),
			techRecord_brakes_dtpNumber: this.fb.control<string | null>(null, [
				this.commonValidators.required('DTp number is required'),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_chassisMake: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_chassisModel: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_bodyMake: this.fb.control<string | null>({ value: null, disabled: true }),
			techRecord_bodyModel: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Body model must be less than or equal to 20 characters'),
			]),
			techRecord_bodyType_code: this.fb.control<string | null>(null),
			techRecord_bodyType_description: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.required('Body type is required'),
			]),
			techRecord_modelLiteral: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Model literal must be less than or equal to 30 characters'),
			]),
			techRecord_functionCode: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1, 'Function code must be less than or equal to 1 characters'),
			]),
			techRecord_conversionRefNo: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(10, 'Conversion reference number must be 10 characters or less'),
				this.commonValidators.pattern(
					'^[A-Z0-9 ]{0,10}$',
					'Conversion reference number must only include numbers and letters A to Z'
				),
			]),
			techRecord_euVehicleCategory: this.fb.control<string | null>(null),
			techRecord_noOfAxles: this.fb.control<number | null>(null, [
				this.commonValidators.range(2, 10, 'Number of axles must be between 2 and 10'),
			]),
		};
	}

	get trlFields(): Partial<Record<keyof TechRecordType<'trl'>, FormControl>> {
		return {
			techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: VehicleTypes.TRL, disabled: true }),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_manufactureMonth: this.fb.control<string | null>(null),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
				this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
				this.commonValidators.xYearsAfterCurrent(
					1,
					`Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
				),
			]),
			techRecord_firstUseDate: this.fb.control<string | null>(null, [this.commonValidators.date('Date of first use')]),
			techRecord_brakes_dtpNumber: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(6, 'DTp number must be less than or equal to 6 characters'),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_frameDescription: this.fb.control<string | null>(null),
			techRecord_make: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(50, 'Body make must be less than or equal to 50 characters'),
				// this.bodyMakeRequiredWithDangerousGoods(),
			]),
			techRecord_model: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Body model must be less than or equal to 30 characters'),
			]),
			techRecord_bodyType_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Body type is required'),
			]),
			techRecord_functionCode: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1, 'Function code must be less than or equal to 1 characters'),
			]),
			techRecord_conversionRefNo: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(10, 'Conversion reference number must be 10 characters or less'),
				this.commonValidators.pattern(
					'^[A-Z0-9 ]{0,10}$',
					'Conversion reference number must only include numbers and letters A to Z'
				),
			]),
			techRecord_euVehicleCategory: this.fb.control<string | null>(null),
			techRecord_noOfAxles: this.fb.control<number | null>(null, [
				this.commonValidators.range(1, 10, 'Number of axles must be between 1 and 10'),
			]),
		};
	}

	get carFields(): Partial<Record<keyof TechRecordType<'car'>, FormControl>> {
		return {
			techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: VehicleTypes.CAR, disabled: true }),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
				this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
				this.commonValidators.xYearsAfterCurrent(
					1,
					`Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
				),
			]),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(VehicleConfiguration.OTHER, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			// default subclass to undefined as null is not allowed and an emtpy array creates a complete record instead of skeleton
			techRecord_vehicleSubclass: this.fb.control<string[] | undefined>({ value: undefined, disabled: false }),
			techRecord_euVehicleCategory: this.fb.control<string | null>({ value: EUVehicleCategory.M1, disabled: true }),
			techRecord_noOfAxles: this.fb.control<number | null>(2, [
				this.commonValidators.range(2, 20, 'Number of axles must be between 2 and 20'),
			]),
		};
	}

	get smallTrlFields(): Partial<Record<any, FormControl>> {
		return {
			techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: VehicleTypes.SMALL_TRL, disabled: true }),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_manufactureMonth: this.fb.control<string | null>(null),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
				this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
				this.commonValidators.xYearsAfterCurrent(
					1,
					`Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
				),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null),
			techRecord_vehicleClass_description: this.fb.control<string | null>({ value: 'trailer', disabled: true }),
			techRecord_euVehicleCategory: this.fb.control<string | null>(EUVehicleCategory.O1),
			techRecord_noOfAxles: this.fb.control<number | null>(null, [
				this.commonValidators.range(1, 10, 'Number of axles must be between 1 and 10'),
			]),
		};
	}

	get vehicleConfigurationOptions() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
			case VehicleTypes.PSV:
				return HGV_PSV_VEHICLE_CONFIGURATION_OPTIONS;
			case VehicleTypes.TRL:
			case VehicleTypes.SMALL_TRL:
				return TRL_VEHICLE_CONFIGURATION_OPTIONS;
			default:
				return ALL_VEHICLE_CONFIGURATION_OPTIONS;
		}
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get EUCategoryOptions() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return HGV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.PSV:
				return PSV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.TRL:
				return TRL_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.SMALL_TRL:
				return SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.LGV:
				return LGV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.CAR:
				return CAR_EU_VEHICLE_CATEGORY_OPTIONS;
			default:
				return ALL_EU_VEHICLE_CATEGORY_OPTIONS;
		}
	}

	// Returns a local copy of the bodyMake options
	loadBodyMakes() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.HGV:
				this.bodyMakes$ = this.optionsService.getOptions(ReferenceDataResourceType.HgvMake);
				break;
			case VehicleTypes.PSV:
				this.bodyMakes$ = this.optionsService.getOptions(ReferenceDataResourceType.PsvMake);
				break;
			case VehicleTypes.TRL:
				this.bodyMakes$ = this.optionsService.getOptions(ReferenceDataResourceType.TrlMake);
				break;
		}
	}

	handleVehicleConfigurationChange() {
		const vehicleType = this.techRecord()?.techRecord_vehicleType;
		const vehicleConfigurationControl = this.form.get('techRecord_vehicleConfiguration');
		const vehicleConfigurationValue = vehicleConfigurationControl?.getRawValue() as VehicleConfiguration;

		if (!vehicleConfigurationValue) {
			return;
		}

		if (vehicleType === VehicleTypes.HGV) {
			if (vehicleConfigurationValue === null) {
				this.bodyTypes = [];
			}

			// When vehicle configuration is set to articulated, update the body type description and code
			if (vehicleConfigurationValue === VehicleConfiguration.ARTICULATED) {
				this.bodyTypes = getOptionsFromEnum(Array.from(articulatedHgvBodyTypeCodeMap.values()).flat().sort());

				this.form.patchValue({
					techRecord_bodyType_description: BodyTypeDescription.ARTICULATED,
					techRecord_bodyType_code: BodyTypeCode.A,
				});
			}

			// When vehicle configuration is rigid, clear artic body description and code
			if (vehicleConfigurationValue === VehicleConfiguration.RIGID) {
				this.bodyTypes = getOptionsFromEnum(Array.from(hgvBodyTypeCodeMap.values()).flat().sort());

				const bodyTypeCode = this.form.get('techRecord_bodyType_code')?.getRawValue();
				const bodyTypeDescription = this.form.get('techRecord_bodyType_description')?.getRawValue();

				if (bodyTypeCode === BodyTypeCode.A || bodyTypeDescription === BodyTypeDescription.ARTICULATED) {
					this.form.patchValue({
						techRecord_bodyType_description: null,
						techRecord_bodyType_code: null,
					});
				}
			}
		}

		const functionCodes: Record<string, string> = {
			rigid: 'R',
			articulated: 'A',
			'semi-trailer': 'A',
		};

		const functionCode = functionCodes[vehicleConfigurationValue];

		if (functionCode) {
			this.form.patchValue({
				techRecord_functionCode: functionCode,
			});
		}
	}

	// Makes network requests to grab the body make options
	loadOptions(): void {
		if (this.techRecord().techRecord_vehicleType === VehicleTypes.HGV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.HgvMake);
		} else if (this.techRecord().techRecord_vehicleType === VehicleTypes.PSV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
		} else {
			this.optionsService.loadOptions(ReferenceDataResourceType.TrlMake);
		}
	}

	handleBodyTypeDescriptionChange() {
		const bodyType = this.form.get('techRecord_bodyType_description')?.getRawValue();
		const vehicleType = this.techRecord().techRecord_vehicleType;
		const bodyConfig = vehicleType === 'hgv' ? `${this.techRecord().techRecord_vehicleConfiguration}Hgv` : vehicleType;
		const bodyTypes = vehicleBodyTypeDescriptionMap.get(bodyConfig as VehicleTypes) as Map<
			BodyTypeDescription,
			BodyTypeCode
		>;
		this.form.patchValue({
			techRecord_bodyType_code: bodyTypes?.get(bodyType as BodyTypeDescription),
		});
	}

	handleDTpNumberChange(refData: ReferenceDataModelBase) {
		const modelBase = refData as PsvMake;
		if (modelBase?.dtpNumber && modelBase?.dtpNumber.length >= 4 && refData) {
			const code = modelBase.psvBodyType.toLowerCase() as BodyTypeCode;
			this.form.patchValue({
				techRecord_bodyType_code: code,
				techRecord_bodyType_description: vehicleBodyTypeCodeMap.get(VehicleTypes.PSV)?.get(code),
				techRecord_bodyMake: modelBase.psvBodyMake,
				techRecord_chassisMake: modelBase.psvChassisMake,
				techRecord_chassisModel: modelBase.psvChassisModel,
			});
			this.technicalRecordService.updateEditingTechRecord({
				...(this.form.getRawValue() as any),
			});
			this.cdr.detectChanges();
		}
	}
}
