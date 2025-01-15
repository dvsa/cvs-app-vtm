import { ViewportScroller } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	ViewChild,
	ViewChildren,
	inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { GlobalWarning } from '@core/components/global-warning/global-warning.interface';
import { GlobalWarningService } from '@core/components/global-warning/global-warning.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { AdrComponent } from '@forms/custom-sections/adr/adr.component';
import { ApprovalTypeComponent } from '@forms/custom-sections/approval-type/approval-type.component';
import { BodyComponent } from '@forms/custom-sections/body/body.component';
import { DimensionsComponent } from '@forms/custom-sections/dimensions/dimensions.component';
import { LettersComponent } from '@forms/custom-sections/letters/letters.component';
import { PsvBrakesComponent } from '@forms/custom-sections/psv-brakes/psv-brakes.component';
import { TrlBrakesComponent } from '@forms/custom-sections/trl-brakes/trl-brakes.component';
import { TyresComponent } from '@forms/custom-sections/tyres/tyres.component';
import { WeightsComponent } from '@forms/custom-sections/weights/weights.component';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { ReasonForEditing, StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { AxlesService } from '@services/axles/axles.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { LoadingService } from '@services/loading/loading.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectScrollPosition } from '@store/technical-records';
import { cloneDeep, mergeWith } from 'lodash';
import { Observable, Subject, debounceTime, map, skipWhile, take, takeUntil } from 'rxjs';

@Component({
	selector: 'app-tech-record-summary',
	templateUrl: './tech-record-summary.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./tech-record-summary.component.scss'],
})
export class TechRecordSummaryComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;
	@ViewChild(BodyComponent) body!: BodyComponent;
	@ViewChild(DimensionsComponent) dimensions!: DimensionsComponent;
	@ViewChild(PsvBrakesComponent) psvBrakes!: PsvBrakesComponent;
	@ViewChild(TrlBrakesComponent) trlBrakes!: TrlBrakesComponent;
	@ViewChild(TyresComponent) tyres!: TyresComponent;
	@ViewChild(WeightsComponent) weights!: WeightsComponent;
	@ViewChild(LettersComponent) letters!: LettersComponent;
	@ViewChild(ApprovalTypeComponent) approvalType!: ApprovalTypeComponent;
	@ViewChild(AdrComponent) adr!: AdrComponent;

	@Output() isFormDirty = new EventEmitter<boolean>();
	@Output() isFormInvalid = new EventEmitter<boolean>();

	techRecordCalculated?: V3TechRecordModel;
	sectionTemplates: Array<FormNode> = [];
	middleIndex = 0;
	isEditing = false;
	scrollPosition: [number, number] = [0, 0];
	isADRCertGenEnabled = false;
	isADREnabled = false;

	private axlesService = inject(AxlesService);
	private errorService = inject(GlobalErrorService);
	private warningService = inject(GlobalWarningService);
	private referenceDataService = inject(ReferenceDataService);
	private technicalRecordService = inject(TechnicalRecordService);
	private routerService = inject(RouterService);
	private activatedRoute = inject(ActivatedRoute);
	private viewportScroller = inject(ViewportScroller);
	private store = inject(Store);
	private loading = inject(LoadingService);

	fb = inject(FormBuilder);
	featureToggleService = inject(FeatureToggleService);
	globalErrorService = inject(GlobalErrorService);

	private destroy$ = new Subject<void>();

	form: FormGroup = this.fb.group({});

	ngOnInit(): void {
		this.isADRCertGenEnabled = this.featureToggleService.isFeatureEnabled('adrCertToggle');
		this.isADREnabled = this.featureToggleService.isFeatureEnabled('FsAdr');

		this.technicalRecordService.techRecord$
			.pipe(
				map((record) => {
					if (!record) {
						return;
					}

					let techRecord = cloneDeep(record);
					techRecord = this.normaliseAxles(record);

					return techRecord;
				}),
				takeUntil(this.destroy$)
			)
			.subscribe((techRecord) => {
				if (techRecord) {
					this.techRecordCalculated = techRecord;
				}
				this.referenceDataService.removeTyreSearch();
				this.sectionTemplates = this.vehicleTemplates;
				this.middleIndex = Math.floor(this.sectionTemplates.length / 2);
			});

		const editingReason = this.activatedRoute.snapshot.data['reason'];
		if (this.isEditing) {
			this.technicalRecordService.clearReasonForCreation();
			this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$), take(1)).subscribe((techRecord) => {
				if (techRecord) {
					if (editingReason === ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED) {
						this.technicalRecordService.updateEditingTechRecord({
							...(techRecord as TechRecordType<'put'>),
							techRecord_statusCode: StatusCodes.PROVISIONAL,
						});
					}

					if (techRecord?.vin?.match('([IOQ])a*')) {
						const warnings: GlobalWarning[] = [];
						warnings.push({ warning: 'VIN should not contain I, O or Q', anchorLink: 'vin' });
						this.warningService.setWarnings(warnings);
					}
				}
			});
		} else if (!this.isEditing) {
			this.warningService.clearWarnings();
		}

		this.store
			.select(selectScrollPosition)
			.pipe(take(1), takeUntil(this.destroy$))
			.subscribe((position) => {
				this.scrollPosition = position;
			});

		this.loading.showSpinner$.pipe(takeUntil(this.destroy$), debounceTime(10)).subscribe((loading) => {
			if (!loading) {
				this.viewportScroller.scrollToPosition(this.scrollPosition);
			}
		});

		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
			// prevent merging of array of objects - always override
			const isArray = (a: unknown, b: unknown) => (Array.isArray(a) ? b : undefined);
			this.techRecordCalculated = mergeWith(cloneDeep(this.techRecordCalculated), changes, isArray);
			this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated as TechRecordType<'put'>);
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngAfterViewInit(): void {
		this.technicalRecordService.techRecord$
			.pipe(
				takeUntil(this.destroy$),
				skipWhile((techRecord) => !techRecord),
				take(1)
			)
			.subscribe((techRecord) => {
				if (this.isEditing && techRecord) this.form.patchValue({ ...techRecord });
			});

		this.handleVehicleConfigurationChanges();
	}

	handleVehicleConfigurationChanges() {
		// TODO clean this up in the future
		const formControl = this.form.get('techRecord_vehicleConfiguration');
		formControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			if (value && formControl?.dirty) {
				if (this.techRecordCalculated?.techRecord_vehicleType === VehicleTypes.HGV && value === 'articulated') {
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

				const functionCode = functionCodes[value];
				this.form.patchValue({
					techRecord_functionCode: functionCode,
				});
				formControl.markAsPristine();
			}
		});
	}

	get vehicleType() {
		return this.techRecordCalculated
			? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecordCalculated)
			: undefined;
	}

	get vehicleTemplates(): Array<FormNode> {
		this.isEditing$.pipe(takeUntil(this.destroy$)).subscribe((editing) => {
			this.isEditing = editing;
		});
		if (!this.vehicleType) {
			return [];
		}
		return (
			vehicleTemplateMap
				.get(this.vehicleType)
				?.filter((template) => template.name !== (this.isEditing ? 'audit' : 'reasonForCreationSection'))
				.filter((template) => template.name !== (this.isADRCertGenEnabled ? '' : 'adrCertificateSection')) ?? []
		);
	}

	get sectionTemplatesState$() {
		return this.technicalRecordService.sectionStates$;
	}

	isSectionExpanded$(sectionName: string | number) {
		return this.sectionTemplatesState$?.pipe(map((sections) => sections?.includes(sectionName)));
	}

	get isEditing$(): Observable<boolean> {
		return this.routerService.getRouteDataProperty$('isEditing').pipe(map((isEditing) => !!isEditing));
	}

	get customSectionForms(): Array<CustomFormGroup | CustomFormArray> {
		const commonCustomSections = this.addCustomSectionsBasedOffFlag();

		switch (this.vehicleType) {
			case VehicleTypes.PSV:
				return [...commonCustomSections, this.psvBrakes.form];
			case VehicleTypes.HGV:
				return !this.isADREnabled ? [...commonCustomSections, this.adr.form] : commonCustomSections;
			case VehicleTypes.TRL:
				return !this.isADREnabled
					? [...commonCustomSections, this.trlBrakes.form, this.letters.form, this.adr.form]
					: [...commonCustomSections, this.trlBrakes.form, this.letters.form];
			case VehicleTypes.LGV:
				return !this.isADREnabled ? [this.adr.form] : [];
			default:
				return [];
		}
	}

	addCustomSectionsBasedOffFlag(): CustomFormGroup[] {
		const sections = [];
		if (!this.featureToggleService.isFeatureEnabled('FsBody') && this.body?.form) {
			sections.push(this.body.form);
		}
		if (!this.featureToggleService.isFeatureEnabled('FsDimensions') && this.dimensions?.form) {
			sections.push(this.dimensions.form);
		}
		if (!this.featureToggleService.isFeatureEnabled('FsTyres') && this.tyres?.form) {
			sections.push(this.tyres.form);
		}
		if (!this.featureToggleService.isFeatureEnabled('FsWeights') && this.weights?.form) {
			sections.push(this.weights.form);
		}
		if (!this.featureToggleService.isFeatureEnabled('FsApprovalType') && this.approvalType?.form) {
			sections.push(this.approvalType.form);
		}
		return sections;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleFormState(event: any): void {
		const isPrimitiveArray = (a: unknown, b: unknown) =>
			Array.isArray(a) && !a.some((i) => typeof i === 'object') ? b : undefined;

		this.techRecordCalculated = mergeWith(cloneDeep(this.techRecordCalculated), event, isPrimitiveArray);
		this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated as TechRecordType<'put'>);
	}

	checkForms(): void {
		const forms: Array<CustomFormGroup | CustomFormArray | FormGroup> = this.sections
			?.map((section) => section.form)
			.concat(this.customSectionForms);

		this.isFormDirty.emit(forms.some((form) => form.dirty));

		this.setErrors(forms);

		this.isFormInvalid.emit(forms.some((form) => form.invalid || this.form.invalid));
	}

	setErrors(forms: Array<CustomFormGroup | CustomFormArray | FormGroup>): void {
		const errors: GlobalError[] = [];

		forms.forEach((form) => DynamicFormService.validate(form, errors));

		this.form.markAllAsTouched();
		this.form.updateValueAndValidity();
		errors.push(...this.globalErrorService.extractGlobalErrors(this.form));

		if (errors.length) {
			this.errorService.setErrors(errors);
		} else {
			this.errorService.clearErrors();
		}
	}

	private normaliseAxles(record: V3TechRecordModel): V3TechRecordModel {
		const type = record.techRecord_vehicleType;
		const category = record.techRecord_euVehicleCategory;

		if (type === VehicleTypes.HGV || (type === VehicleTypes.TRL && category !== 'o1' && category !== 'o2')) {
			const [axles, axleSpacing] = this.axlesService.normaliseAxles(
				record.techRecord_axles ?? [],
				record.techRecord_dimensions_axleSpacing
			);

			record.techRecord_dimensions_axleSpacing = axleSpacing;
			record.techRecord_axles = axles;
		}

		return record;
	}
}
