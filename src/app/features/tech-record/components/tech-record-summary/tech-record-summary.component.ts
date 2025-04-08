import { AsyncPipe, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
	inject,
	output,
	viewChild,
	viewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { GlobalWarning } from '@core/components/global-warning/global-warning.interface';
import { GlobalWarningService } from '@core/components/global-warning/global-warning.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordType as TechRecordVerbVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
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
import { AccordionControlComponent } from '../../../../components/accordion-control/accordion-control.component';
import { AccordionComponent } from '../../../../components/accordion/accordion.component';
import { DynamicFormGroupComponent as DynamicFormGroupComponent_1 } from '../../../../forms/components/dynamic-form-group/dynamic-form-group.component';
import { AdrCertificateHistoryComponent } from '../../../../forms/custom-sections/adr-certificate-history/adr-certificate-history.component';
import { AdrSectionComponent } from '../../../../forms/custom-sections/adr-section/adr-section.component';
import { AdrComponent as AdrComponent_1 } from '../../../../forms/custom-sections/adr/adr.component';
import { ApprovalTypeComponent as ApprovalTypeComponent_1 } from '../../../../forms/custom-sections/approval-type/approval-type.component';
import { BodySectionComponent } from '../../../../forms/custom-sections/body-section/body-section.component';
import { BodyComponent as BodyComponent_1 } from '../../../../forms/custom-sections/body/body.component';
import { DimensionsSectionComponent } from '../../../../forms/custom-sections/dimensions-section/dimensions-section.component';
import { DimensionsComponent as DimensionsComponent_1 } from '../../../../forms/custom-sections/dimensions/dimensions.component';
import { LastApplicantSectionComponent } from '../../../../forms/custom-sections/last-applicant-section/last-applicant-section.component';
import { LettersComponent as LettersComponent_1 } from '../../../../forms/custom-sections/letters/letters.component';
import { NotesSectionComponent } from '../../../../forms/custom-sections/notes-section/notes-section.component';
import { PlatesSectionComponent } from '../../../../forms/custom-sections/plates-section/plates-section.component';
import { PlatesComponent } from '../../../../forms/custom-sections/plates/plates.component';
import { PsvBrakesComponent as PsvBrakesComponent_1 } from '../../../../forms/custom-sections/psv-brakes/psv-brakes.component';
import { TrlBrakesComponent as TrlBrakesComponent_1 } from '../../../../forms/custom-sections/trl-brakes/trl-brakes.component';
import { TRLPurchasersSectionComponent } from '../../../../forms/custom-sections/trl-purchasers-section/trl-purchasers-section.component';
import { TypeApprovalSectionComponent } from '../../../../forms/custom-sections/type-approval-section/type-approval-section.component';
import { TyresSectionComponent } from '../../../../forms/custom-sections/tyres-section/tyres-section.component';
import { TyresComponent as TyresComponent_1 } from '../../../../forms/custom-sections/tyres/tyres.component';
import { VehicleSectionComponent } from '../../../../forms/custom-sections/vehicle-section/vehicle-section.component';
import { WeightsSectionComponent } from '../../../../forms/custom-sections/weights-section/weights-section.component';
import { WeightsComponent as WeightsComponent_1 } from '../../../../forms/custom-sections/weights/weights.component';

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
		BodyComponent_1,
		TRLPurchasersSectionComponent,
		DimensionsSectionComponent,
		DimensionsComponent_1,
		TypeApprovalSectionComponent,
		ApprovalTypeComponent_1,
		PsvBrakesComponent_1,
		TrlBrakesComponent_1,
		TyresSectionComponent,
		TyresComponent_1,
		WeightsSectionComponent,
		WeightsComponent_1,
		LettersComponent_1,
		PlatesSectionComponent,
		PlatesComponent,
		AdrSectionComponent,
		AdrComponent_1,
		AdrCertificateHistoryComponent,
		LastApplicantSectionComponent,
		AsyncPipe,
	],
})
export class TechRecordSummaryComponent implements OnInit, OnDestroy, AfterViewInit {
	readonly sections = viewChildren(DynamicFormGroupComponent);
	readonly body = viewChild(BodyComponent);
	readonly dimensions = viewChild(DimensionsComponent);
	readonly psvBrakes = viewChild(PsvBrakesComponent);
	readonly trlBrakes = viewChild(TrlBrakesComponent);
	readonly tyres = viewChild(TyresComponent);
	readonly weights = viewChild(WeightsComponent);
	readonly letters = viewChild(LettersComponent);
	readonly approvalType = viewChild(ApprovalTypeComponent);
	readonly adr = viewChild(AdrComponent);

	readonly isFormDirty = output<boolean>();
	readonly isFormInvalid = output<boolean>();

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

	ngOnInit(): void {
		this.isADRCertGenEnabled = this.featureToggleService.isFeatureEnabled('adrCertToggle');

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
			// TODO: remove hacky solution
			let techRecord = this.techRecordCalculated as TechRecordType<'put'>;
			if (
				techRecord?.techRecord_vehicleType === VehicleTypes.PSV ||
				techRecord?.techRecord_vehicleType === VehicleTypes.HGV ||
				techRecord?.techRecord_vehicleType === VehicleTypes.TRL
			) {
				const axles = mergeWith(cloneDeep(techRecord.techRecord_axles || []), changes.techRecord_axles || []);
				techRecord = { ...techRecord, ...changes } as TechRecordVerbVehicleType<'psv' | 'hgv' | 'trl', 'put'>;
				techRecord.techRecord_axles = axles;
				this.techRecordCalculated = techRecord;
				this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated as TechRecordType<'put'>);
				return;
			}

			this.techRecordCalculated = { ...this.techRecordCalculated, ...changes };
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
		const adr = this.adr();
		const trlBrakes = this.trlBrakes();
		const letters = this.letters();
		const psvBrakes = this.psvBrakes();

		switch (this.vehicleType) {
			case VehicleTypes.PSV: {
				if (!psvBrakes?.form) return [];
				return [...commonCustomSections, psvBrakes.form];
			}
			case VehicleTypes.HGV: {
				if (!adr?.form) return commonCustomSections;
				return [...commonCustomSections, adr.form];
			}
			case VehicleTypes.TRL: {
				const arr = [...commonCustomSections];
				if (trlBrakes?.form) arr.push(trlBrakes.form);
				if (letters?.form) arr.push(letters.form);
				if (adr?.form) arr.push(adr.form);
				return arr;
			}
			case VehicleTypes.LGV: {
				if (!adr?.form) return commonCustomSections;
				return [adr.form];
			}
			default:
				return [];
		}
	}

	addCustomSectionsBasedOffFlag(): CustomFormGroup[] {
		const sections = [];
		const body = this.body();
		if (body && !this.featureToggleService.isFeatureEnabled('FsBody') && body?.form) {
			sections.push(body.form);
		}
		const dimensions = this.dimensions();
		if (dimensions && !this.featureToggleService.isFeatureEnabled('FsDimensions') && dimensions?.form) {
			sections.push(dimensions.form);
		}
		const tyres = this.tyres();
		if (tyres && !this.featureToggleService.isFeatureEnabled('FsTyres') && tyres?.form) {
			sections.push(tyres.form);
		}
		const weights = this.weights();
		if (weights && !this.featureToggleService.isFeatureEnabled('FsWeights') && weights?.form) {
			sections.push(weights.form);
		}
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

	checkForms(): void {
		const forms: Array<CustomFormGroup | CustomFormArray | FormGroup> = this.sections()
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
