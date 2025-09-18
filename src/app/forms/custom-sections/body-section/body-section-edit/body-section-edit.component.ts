import { VehicleConfiguration } from '@/src/app/models/vehicle-configuration.enum';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import {
	BodyTypeCode,
	BodyTypeDescription,
	articulatedHgvBodyTypeCodeMap,
	hgvBodyTypeCodeMap,
	trlBodyTypeCodeMap,
	vehicleBodyTypeCodeMap,
	vehicleBodyTypeDescriptionMap,
} from '@models/body-type-enum';
import { FUNCTION_CODE_OPTIONS, MultiOptions } from '@models/options.model';
import { PsvMake, ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectReferenceDataByResourceKey } from '@store/reference-data';
import { updateVehicleConfiguration } from '@store/technical-records';
import { ReplaySubject, combineLatest, map, of, skipWhile, switchMap, take, takeUntil } from 'rxjs';
import { GovukFormGroupAutocompleteComponent } from '../../../components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '../../../components/govuk-form-group-select/govuk-form-group-select.component';
import { getOptionsFromEnum, getSortedOptionsFromEnum } from '../../../utils/enum-map';

@Component({
	selector: 'app-body-section-edit',
	templateUrl: './body-section-edit.component.html',
	styleUrls: ['./body-section-edit.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupAutocompleteComponent,
		AsyncPipe,
	],
})
export class BodySectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy {
	actions = inject(Actions);
	referenceDataService = inject(ReferenceDataService);
	optionsService = inject(MultiOptionsService);
	cdr = inject(ChangeDetectorRef);
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

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

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);
		// Attach all form controls to parent
		this.init(this.form);

		this.loadOptions();
		this.loadBodyMakes();

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

		this.form
			.get('techRecord_bodyType_description')
			?.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value) {
					this.handleBodyTypeDescriptionChange(value);
				}
			});

		if (this.techRecord().techRecord_vehicleType === VehicleTypes.TRL) {
			this.bodyTypes = getSortedOptionsFromEnum(Array.from(trlBodyTypeCodeMap.values()).flat());
		}

		this.handleUpdateVehicleConfiguration();
	}

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

	handleUpdateVehicleConfiguration() {
		this.actions
			.pipe(ofType(updateVehicleConfiguration))
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ vehicleConfiguration }) => {
				const vehicleType = this.techRecord()?.techRecord_vehicleType;

				if (!vehicleConfiguration) {
					return;
				}

				if (vehicleType === VehicleTypes.HGV) {
					if (vehicleConfiguration === null) {
						this.bodyTypes = [];
					}

					// When vehicle configuration is set to articulated, update the body type description and code
					if (vehicleConfiguration === VehicleConfiguration.ARTICULATED) {
						this.bodyTypes = getOptionsFromEnum(Array.from(articulatedHgvBodyTypeCodeMap.values()).flat().sort());

						this.form.patchValue({
							techRecord_bodyType_description: BodyTypeDescription.ARTICULATED,
							techRecord_bodyType_code: BodyTypeCode.A,
						});
					}

					// When vehicle configuration is rigid, clear artic body description and code
					if (vehicleConfiguration === VehicleConfiguration.RIGID) {
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

				const functionCode = functionCodes[vehicleConfiguration];

				if (functionCode) {
					this.form.patchValue({
						techRecord_functionCode: functionCode,
					});
				}
			});
	}

	handleBodyTypeDescriptionChange(value: string) {
		const vehicleType = this.techRecord().techRecord_vehicleType;
		const bodyConfig = vehicleType === 'hgv' ? `${this.techRecord().techRecord_vehicleConfiguration}Hgv` : vehicleType;
		const bodyTypes = vehicleBodyTypeDescriptionMap.get(bodyConfig as VehicleTypes) as Map<
			BodyTypeDescription,
			BodyTypeCode
		>;
		this.form.patchValue({
			techRecord_bodyType_code: bodyTypes?.get(value as BodyTypeDescription),
		});
		this.technicalRecordService.updateEditingTechRecord({
			...this.techRecord(),
			...this.form.getRawValue(),
		});
		this.cdr.detectChanges();
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
				...this.form.getRawValue(),
			});
			this.cdr.detectChanges();
		}
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	loadOptions(): void {
		if (this.techRecord().techRecord_vehicleType === VehicleTypes.HGV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.HgvMake);
		} else if (this.techRecord().techRecord_vehicleType === VehicleTypes.PSV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
		} else {
			this.optionsService.loadOptions(ReferenceDataResourceType.TrlMake);
		}
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case 'hgv':
			case 'trl':
				return this.hgvAndTrailerFields;
			case 'psv':
				return this.psvFields;
			default:
				return {};
		}
	}

	get hgvAndTrailerFields(): Partial<Record<keyof TechRecordType<'hgv' | 'trl'>, FormControl>> {
		return {
			techRecord_make: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(50, 'Body make must be less than or equal to 50 characters'),
				this.bodyMakeRequiredWithDangerousGoods(),
			]),
			techRecord_model: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Body model must be less than or equal to 30 characters'),
			]),
			techRecord_bodyType_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Body type is required'),
			]),
			techRecord_bodyType_code: this.fb.control<string | null>(null, []),
			techRecord_brakes_dtpNumber: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(6, 'DTp number must be less than or equal to 6 characters'),
			]),
			techRecord_functionCode: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1, 'Function code must be less than or equal to 1 characters'),
			]),
			techRecord_conversionRefNo: this.fb.control<string | null>(null, [
				this.commonValidators.pattern(
					'^[A-Z0-9 ]{0,10}$',
					'Conversion reference number max length 10 uppercase letters or numbers'
				),
			]),
		};
	}

	get psvFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			techRecord_chassisMake: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(30, 'Chassis make must be less than or equal to 30 characters'),
			]),
			techRecord_chassisModel: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(20, 'Chassis model must be less than or equal to 20 characters'),
			]),
			techRecord_bodyMake: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(20, 'Body make must be less than or equal to 20 characters'),
			]),
			techRecord_bodyModel: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(20, 'Body model must be less than or equal to 20 characters'),
			]),
			techRecord_bodyType_code: this.fb.control<string | null>(null, []),
			techRecord_bodyType_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Body type is required'),
			]),
			techRecord_modelLiteral: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Model literal must be less than or equal to 30 characters'),
			]),
			techRecord_brakes_dtpNumber: this.fb.control<string | null>(null, [
				this.commonValidators.required('DTp number is required'),
			]),
			techRecord_functionCode: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1, 'Function code must be less than or equal to 1 characters'),
			]),
			techRecord_conversionRefNo: this.fb.control<string | null>(null, [
				this.commonValidators.pattern(
					'^[A-Z0-9 ]{0,10}$',
					'Conversion reference number max length 10 uppercase letters or numbers'
				),
			]),
		};
	}

	bodyMakeRequiredWithDangerousGoods(): ValidatorFn {
		return (control) => {
			if (control.parent && control.parent.get('techRecord_adrDetails_dangerousGoods')?.value && !control.value) {
				return { required: 'Body make is required' };
			}
			return null;
		};
	}

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FUNCTION_CODE_OPTIONS = FUNCTION_CODE_OPTIONS;
}
