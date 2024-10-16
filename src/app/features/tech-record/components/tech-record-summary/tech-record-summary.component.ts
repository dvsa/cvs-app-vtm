import { ViewportScroller } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	ViewChild,
	ViewChildren,
} from '@angular/core';
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
import { Observable, Subject, debounceTime, map, take, takeUntil } from 'rxjs';

@Component({
	selector: 'app-tech-record-summary',
	templateUrl: './tech-record-summary.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./tech-record-summary.component.scss'],
})
export class TechRecordSummaryComponent implements OnInit, OnDestroy {
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
	isADREnabled = false;
	isADRCertGenEnabled = false;

	private destroy$ = new Subject<void>();

	constructor(
		private axlesService: AxlesService,
		private errorService: GlobalErrorService,
		private warningService: GlobalWarningService,
		private referenceDataService: ReferenceDataService,
		private technicalRecordService: TechnicalRecordService,
		private routerService: RouterService,
		private activatedRoute: ActivatedRoute,
		private viewportScroller: ViewportScroller,
		private store: Store,
		private loading: LoadingService,
		private featureToggleService: FeatureToggleService
	) {}

	ngOnInit(): void {
		this.isADREnabled = this.featureToggleService.isFeatureEnabled('adrToggle');
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
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
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
				.filter((template) => template.name !== (this.isADREnabled ? '' : 'adrSection'))
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

	get hint(): string {
		return 'Complete all required fields to create a testable record';
	}

	get customSectionForms(): Array<CustomFormGroup | CustomFormArray> {
		const commonCustomSections = [
			this.body?.form,
			this.dimensions?.form,
			this.tyres?.form,
			this.weights?.form,
			this.approvalType?.form,
		];

		switch (this.vehicleType) {
			case VehicleTypes.PSV:
				return [...commonCustomSections, this.psvBrakes.form];
			case VehicleTypes.HGV:
				return this.isADREnabled ? [...commonCustomSections, this.adr.form] : commonCustomSections;
			case VehicleTypes.TRL:
				return this.isADREnabled
					? [...commonCustomSections, this.trlBrakes.form, this.letters.form, this.adr.form]
					: [...commonCustomSections, this.trlBrakes.form, this.letters.form];
			case VehicleTypes.LGV:
				return this.isADREnabled ? [this.adr.form] : [];
			default:
				return [];
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleFormState(event: any): void {
		const isPrimitiveArray = (a: unknown, b: unknown) =>
			Array.isArray(a) && !a.some((i) => typeof i === 'object') ? b : undefined;

		this.techRecordCalculated = mergeWith(cloneDeep(this.techRecordCalculated), event, isPrimitiveArray);
		this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated as TechRecordType<'put'>);
	}

	checkForms(): void {
		const forms = this.sections?.map((section) => section.form).concat(this.customSectionForms);

		this.isFormDirty.emit(forms.some((form) => form.dirty));

		this.setErrors(forms);

		this.isFormInvalid.emit(forms.some((form) => form.invalid));
	}

	setErrors(forms: Array<CustomFormGroup | CustomFormArray>): void {
		const errors: GlobalError[] = [];

		forms.forEach((form) => DynamicFormService.validate(form, errors));

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
