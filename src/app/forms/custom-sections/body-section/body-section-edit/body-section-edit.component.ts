import { updateVehicleConfiguration } from '@/src/app/store/technical-records';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import {
	ControlContainer,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	ValidatorFn,
} from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import {
	BodyTypeCode,
	BodyTypeDescription,
	vehicleBodyTypeCodeMap,
	vehicleBodyTypeDescriptionMap,
} from '@models/body-type-enum';
import { FUNCTION_CODE_OPTIONS, MultiOptions } from '@models/options.model';
import { PsvMake, ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, ReplaySubject, combineLatest, map, of, skipWhile, switchMap, take, takeUntil } from 'rxjs';
import { GovukFormGroupAutocompleteComponent } from '../../../components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '../../../components/govuk-form-group-select/govuk-form-group-select.component';

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
export class BodySectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	actions = inject(Actions);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	referenceDataService = inject(ReferenceDataService);
	optionsService = inject(MultiOptionsService);
	cdr = inject(ChangeDetectorRef);
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	bodyMakes$ = of<MultiOptions | undefined>([]);

	ngOnInit(): void {
		this.addControlsBasedOffVehicleType();
		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control, { emitEvent: false });
			}
		}

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
				if (this.techRecord()?.techRecord_vehicleType === VehicleTypes.HGV && vehicleConfiguration === 'articulated') {
					this.form.patchValue({
						techRecord_bodyType_description: 'articulated',
						techRecord_bodyType_code: 'a',
					});
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
		this.technicalRecordService.updateEditingTechRecord({ ...this.techRecord(), ...this.form.getRawValue() });
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
			this.technicalRecordService.updateEditingTechRecord({ ...this.form.getRawValue() });
			this.cdr.detectChanges();
		}
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const key of Object.keys(this.form.controls)) {
				parent.removeControl(key, { emitEvent: false });
			}
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get dtpNumbers$(): Observable<(string | number)[]> {
		return combineLatest([
			this.referenceDataService.getAll$(ReferenceDataResourceType.PsvMake),
			this.referenceDataService.getReferencePsvMakeDataLoading$(),
		]).pipe(
			skipWhile(([, loading]) => loading),
			take(1),
			map(([data]) => data?.map((option) => option.resourceKey) ?? [])
		);
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

	get bodyTypes(): MultiOptions {
		let vehicleType: string = this.techRecord().techRecord_vehicleType;

		if (this.techRecord().techRecord_vehicleType === 'hgv') {
			vehicleType = `${this.techRecord().techRecord_vehicleConfiguration}Hgv`;
		}
		const optionsMap = vehicleBodyTypeCodeMap.get(vehicleType) ?? [];
		const values = [...optionsMap.values()];
		return getOptionsFromEnum(values.sort());
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
				this.commonValidators.maxLength(30, 'Model Literal must be less than or equal to 30 characters'),
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
