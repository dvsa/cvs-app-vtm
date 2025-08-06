import { ReasonForCreationSectionComponent } from '@/src/app/forms/custom-sections/reason-for-creation-section/reason-for-creation-section.component';
import { AsyncPipe, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
	inject,
	input,
	output,
	viewChild,
	viewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccordionControlComponent } from '@components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@components/accordion/accordion.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { GlobalWarning } from '@core/components/global-warning/global-warning.interface';
import { GlobalWarningService } from '@core/components/global-warning/global-warning.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
	DynamicFormGroupComponent,
	DynamicFormGroupComponent as DynamicFormGroupComponent_1,
} from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { AdrCertificateHistoryComponent } from '@forms/custom-sections/adr-certificate-history/adr-certificate-history.component';
import { AdrCertsSectionComponent } from '@forms/custom-sections/adr-certs-section/adr-certs-section.component';
import { AdrSectionComponent } from '@forms/custom-sections/adr-section/adr-section.component';
import {
	ApprovalTypeComponent,
	ApprovalTypeComponent as ApprovalTypeComponent_1,
} from '@forms/custom-sections/approval-type/approval-type.component';
import { AuditSectionComponent } from '@forms/custom-sections/audit-section/audit-section.component';
import { AuthorisationIntoServiceSectionComponent } from '@forms/custom-sections/authorisation-into-service-section/authorisation-into-service-section.component';
import { BodySectionComponent } from '@forms/custom-sections/body-section/body-section.component';
import { BrakesSectionComponent } from '@forms/custom-sections/brakes-section/brakes-section.component';
import { DDASectionComponent } from '@forms/custom-sections/dda-section/dda-section.component';
import { DimensionsSectionComponent } from '@forms/custom-sections/dimensions-section/dimensions-section.component';
import { DocumentsSectionComponent } from '@forms/custom-sections/documents-section/documents-section.component';
import { LastApplicantSectionComponent } from '@forms/custom-sections/last-applicant-section/last-applicant-section.component';
import { LettersSectionComponent } from '@forms/custom-sections/letters-section/letters-section.component';
import { ManufacturerSectionComponent } from '@forms/custom-sections/manufacturer-section/manufacturer-section.component';
import { NotesSectionComponent } from '@forms/custom-sections/notes-section/notes-section.component';
import { PlatesSectionComponent } from '@forms/custom-sections/plates-section/plates-section.component';
import { PlatesComponent } from '@forms/custom-sections/plates/plates.component';
import { TRLPurchasersSectionComponent } from '@forms/custom-sections/trl-purchasers-section/trl-purchasers-section.component';
import { TypeApprovalSectionComponent } from '@forms/custom-sections/type-approval-section/type-approval-section.component';
import { TyresSectionComponent } from '@forms/custom-sections/tyres-section/tyres-section.component';
import { VehicleSectionComponent } from '@forms/custom-sections/vehicle-section/vehicle-section.component';
import { WeightsSectionComponent } from '@forms/custom-sections/weights-section/weights-section.component';
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
import { addSectionState, selectScrollPosition } from '@store/technical-records';
import { cloneDeep, mergeWith } from 'lodash';
import { Subject, debounceTime, map, skipWhile, take, takeUntil } from 'rxjs';

@Component({
	selector: 'app-tech-record-summary',
	templateUrl: './tech-record-summary.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./tech-record-summary.component.scss'],
	imports: [
		AccordionControlComponent,
		AccordionComponent,
		NgTemplateOutlet,
		FormsModule,
		ReactiveFormsModule,
		NotesSectionComponent,
		DynamicFormGroupComponent_1,
		VehicleSectionComponent,
		BodySectionComponent,
		TRLPurchasersSectionComponent,
		DimensionsSectionComponent,
		TypeApprovalSectionComponent,
		ApprovalTypeComponent_1,
		TyresSectionComponent,
		WeightsSectionComponent,
		PlatesSectionComponent,
		PlatesComponent,
		AdrSectionComponent,
		AdrCertificateHistoryComponent,
		LastApplicantSectionComponent,
		AsyncPipe,
		BrakesSectionComponent,
		DDASectionComponent,
		LettersSectionComponent,
		DocumentsSectionComponent,
		AuthorisationIntoServiceSectionComponent,
		ManufacturerSectionComponent,
		AuditSectionComponent,
		AdrCertsSectionComponent,
		ReasonForCreationSectionComponent,
	],
})
export class TechRecordSummaryComponent implements OnInit, OnDestroy, AfterViewInit {
	readonly sections = viewChildren(DynamicFormGroupComponent);
	readonly approvalType = viewChild(ApprovalTypeComponent);
	readonly isFormDirty = output<boolean>();
	readonly isFormInvalid = output<boolean>();
	readonly isCreateMode = input.required<boolean>();

	techRecordCalculated?: V3TechRecordModel;
	sectionTemplates: Array<FormNode> = [];
	middleIndex = 0;
	isEditing = false;
	scrollPosition: [number, number] = [0, 0];
	isADRCertGenEnabled = false;

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

	isEditing$ = this.routerService.getRouteDataProperty$('isEditing').pipe(map((isEditing) => !!isEditing));

	ngOnInit(): void {
		this.isADRCertGenEnabled = this.featureToggleService.isFeatureEnabled('adrCertToggle');

		this.isEditing$.pipe(takeUntil(this.destroy$)).subscribe((editing) => {
			this.isEditing = editing;
		});

		this.technicalRecordService.techRecord$
			.pipe(
				map((record) => {
					if (!record) {
						return;
					}

					return cloneDeep(record);
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

		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.techRecordCalculated = { ...this.techRecordCalculated, ...this.form.getRawValue() };
			this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated as TechRecordType<'put'>);
		});

		this.store.dispatch(addSectionState({ section: 'reasonForCreationSection' }));

		this.technicalRecordService.techRecord$
			.pipe(
				takeUntil(this.destroy$),
				skipWhile((techRecord) => !techRecord),
				take(1)
			)
			.subscribe((techRecord) => {
				if (this.isEditing && techRecord) {
					if (
						techRecord.techRecord_vehicleType === VehicleTypes.PSV ||
						techRecord.techRecord_vehicleType === VehicleTypes.HGV ||
						techRecord.techRecord_vehicleType === VehicleTypes.TRL
					) {
						this.form.addControl('techRecord_axles', this.axlesService.generateAxlesForm(techRecord));

						if (
							techRecord.techRecord_vehicleType === VehicleTypes.TRL ||
							techRecord.techRecord_vehicleType === VehicleTypes.HGV
						) {
							this.form.addControl(
								'techRecord_dimensions_axleSpacing',
								this.axlesService.generateAxleSpacingsForm(techRecord)
							);
						}
					}
				}
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
				if (this.isEditing && techRecord) {
					// Ensure small TRL is saved as TRL in the back-end
					if ((techRecord.techRecord_vehicleType as VehicleTypes) === VehicleTypes.SMALL_TRL) {
						techRecord.techRecord_vehicleType = VehicleTypes.TRL;
					}

					this.form.patchValue({ ...techRecord });
				}
			});
	}

	get vehicleType() {
		return this.techRecordCalculated
			? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecordCalculated)
			: undefined;
	}

	get vehicleTemplates(): Array<FormNode> {
		if (!this.vehicleType) return [];

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

	get customSectionForms(): Array<CustomFormGroup | CustomFormArray> {
		const commonCustomSections = this.addCustomSectionsBasedOffFlag();

		switch (this.vehicleType) {
			case VehicleTypes.LGV:
			case VehicleTypes.PSV:
			case VehicleTypes.TRL:
			case VehicleTypes.HGV: {
				return commonCustomSections;
			}
			default:
				return [];
		}
	}

	addCustomSectionsBasedOffFlag(): CustomFormGroup[] {
		const sections = [];
		const approvalType = this.approvalType();
		if (approvalType && !this.featureToggleService.isFeatureEnabled('FsApprovalType') && approvalType?.form) {
			sections.push(approvalType.form);
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

	checkForms(): boolean {
		const forms: Array<CustomFormGroup | CustomFormArray | FormGroup> = this.sections()
			?.map((section) => section.form)
			.concat(this.customSectionForms);

		this.isFormDirty.emit(forms.some((form) => form.dirty));

		this.setErrors(forms);

		const isInvalid = forms.some((form) => form.invalid) || this.form.invalid;
		this.isFormInvalid.emit(isInvalid);

		return isInvalid;
	}

	setErrors(forms: Array<CustomFormGroup | CustomFormArray | FormGroup>): void {
		const errors: GlobalError[] = [];

		forms.forEach((form) => DynamicFormService.validate(form, errors));

		this.form.markAllAsTouched();
		this.form.updateValueAndValidity();
		errors.push(...this.getAxleErrors());
		errors.push(...this.globalErrorService.extractGlobalErrors(this.form));

		if (errors.length) {
			this.form.setErrors(errors);
			this.errorService.setErrors(errors);
		} else {
			this.errorService.clearErrors();
		}
	}

	getAxleErrors(): GlobalError[] {
		const value = this.form.getRawValue() as V3TechRecordModel;

		if (
			value.techRecord_vehicleType === VehicleTypes.PSV &&
			Array.isArray(value.techRecord_axles) &&
			value.techRecord_axles.length === 1
		) {
			return [{ error: 'You cannot submit a PSV with less than 2 axles', anchorLink: 'weightsAddAxle' }];
		}

		if (
			value.techRecord_vehicleType === VehicleTypes.HGV &&
			Array.isArray(value.techRecord_axles) &&
			value.techRecord_axles.length === 1
		) {
			return [{ error: 'You cannot submit a HGV with less than 2 axles', anchorLink: 'weightsAddAxle' }];
		}

		return [];
	}
}
