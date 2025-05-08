import { NumberPlateComponent } from '@/src/app/components/number-plate/number-plate.component';
import { AuditSectionComponent } from '@/src/app/forms/custom-sections/audit-section/audit-section.component';
import { FormNodeViewTypes } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
	TechRecordGETCar,
	TechRecordGETHGV,
	TechRecordGETLGV,
	TechRecordGETPSV,
	TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { AuthorisationIntoServiceSectionComponent } from '@forms/custom-sections/authorisation-into-service-section/authorisation-into-service-section.component';
import { BrakesSectionComponent } from '@forms/custom-sections/brakes-section/brakes-section.component';
import { DDASectionComponent } from '@forms/custom-sections/dda-section/dda-section.component';
import { DocumentsSectionComponent } from '@forms/custom-sections/documents-section/documents-section.component';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { Axles, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/index';
import {
	clearADRDetailsBeforeUpdate,
	clearAllSectionStates,
	clearScrollPosition,
	editingTechRecord,
	selectTechRecordChanges,
	selectTechRecordDeletions,
	techRecord,
	updateADRAdditionalExaminerNotes,
	updateTechRecord,
	updateTechRecordSuccess,
} from '@store/technical-records';
import { Subject, combineLatest, map, take, takeUntil } from 'rxjs';
import { AccordionControlComponent } from '../../../../components/accordion-control/accordion-control.component';
import { AccordionComponent } from '../../../../components/accordion/accordion.component';
import { BannerComponent } from '../../../../components/banner/banner.component';
import { ButtonGroupComponent } from '../../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { IconComponent } from '../../../../components/icon/icon.component';
import { DynamicFormGroupComponent } from '../../../../forms/components/dynamic-form-group/dynamic-form-group.component';
import { AdrSectionComponent } from '../../../../forms/custom-sections/adr-section/adr-section.component';
import { ApprovalTypeComponent } from '../../../../forms/custom-sections/approval-type/approval-type.component';
import { BodySectionComponent } from '../../../../forms/custom-sections/body-section/body-section.component';
import { BodyComponent } from '../../../../forms/custom-sections/body/body.component';
import { DimensionsSectionComponent } from '../../../../forms/custom-sections/dimensions-section/dimensions-section.component';
import { DimensionsComponent } from '../../../../forms/custom-sections/dimensions/dimensions.component';
import { LastApplicantSectionComponent } from '../../../../forms/custom-sections/last-applicant-section/last-applicant-section.component';
import { ModifiedWeightsComponent } from '../../../../forms/custom-sections/modified-weights/modified-weights.component';
import { NotesSectionComponent } from '../../../../forms/custom-sections/notes-section/notes-section.component';
import { PsvBrakesComponent } from '../../../../forms/custom-sections/psv-brakes/psv-brakes.component';
import { TrlBrakesComponent } from '../../../../forms/custom-sections/trl-brakes/trl-brakes.component';
import { TRLPurchasersSectionComponent } from '../../../../forms/custom-sections/trl-purchasers-section/trl-purchasers-section.component';
import { TypeApprovalSectionComponent } from '../../../../forms/custom-sections/type-approval-section/type-approval-section.component';
import { TyresSectionComponent } from '../../../../forms/custom-sections/tyres-section/tyres-section.component';
import { TyresComponent } from '../../../../forms/custom-sections/tyres/tyres.component';
import { VehicleSectionComponent } from '../../../../forms/custom-sections/vehicle-section/vehicle-section.component';
import { WeightsSectionComponent } from '../../../../forms/custom-sections/weights-section/weights-section.component';
import { WeightsComponent } from '../../../../forms/custom-sections/weights/weights.component';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '../../../../pipes/format-vehicle-type/format-vehicle-type.pipe';

@Component({
	selector: 'app-tech-record-summary-changes',
	templateUrl: './tech-record-summary-changes.component.html',
	styleUrls: ['./tech-record-summary-changes.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		BannerComponent,
		IconComponent,
		AccordionControlComponent,
		AccordionComponent,
		NgTemplateOutlet,
		NotesSectionComponent,
		DynamicFormGroupComponent,
		VehicleSectionComponent,
		BodySectionComponent,
		BodyComponent,
		DimensionsSectionComponent,
		DimensionsComponent,
		TRLPurchasersSectionComponent,
		TypeApprovalSectionComponent,
		ApprovalTypeComponent,
		PsvBrakesComponent,
		TrlBrakesComponent,
		TyresSectionComponent,
		TyresComponent,
		WeightsSectionComponent,
		WeightsComponent,
		ModifiedWeightsComponent,
		AdrSectionComponent,
		LastApplicantSectionComponent,
		ButtonGroupComponent,
		ButtonComponent,
		AsyncPipe,
		DefaultNullOrEmpty,
		FormatVehicleTypePipe,
		BrakesSectionComponent,
		DDASectionComponent,
		DocumentsSectionComponent,
		NumberPlateComponent,
		AuthorisationIntoServiceSectionComponent,
		AuditSectionComponent,
	],
})
export class TechRecordSummaryChangesComponent implements OnInit, OnDestroy {
	destroy$ = new Subject<void>();

	techRecord?: TechRecordType<'get'>;
	techRecordEdited?: TechRecordType<'put'>;
	techRecordChanges?: Partial<TechRecordType<'get'>>;
	techRecordDeletions?: Partial<TechRecordType<'get'>>;

	username = '';

	store$ = inject(Store<State>);
	technicalRecordService = inject(TechnicalRecordService);
	router = inject(Router);
	globalErrorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);
	routerService = inject(RouterService);
	actions$ = inject(Actions);
	userService$ = inject(UserService);
	featureToggleService = inject(FeatureToggleService);
	techRecordChangesService = inject(TechnicalRecordChangesService);

	ngOnInit(): void {
		this.navigateUponSuccess();
		this.initSubscriptions();
	}

	navigateUponSuccess(): void {
		this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe((vehicleTechRecord) => {
			this.store$.dispatch(clearAllSectionStates());
			this.store$.dispatch(clearScrollPosition());
			void this.router.navigate([
				`/tech-records/${vehicleTechRecord.vehicleTechRecord.systemNumber}/${vehicleTechRecord.vehicleTechRecord.createdTimestamp}`,
			]);
		});
	}

	initSubscriptions(): void {
		this.userService$.name$.pipe(takeUntil(this.destroy$)).subscribe((name) => {
			this.username = name;
		});
		this.store$
			.select(techRecord)
			.pipe(take(1), takeUntil(this.destroy$))
			.subscribe((data) => {
				if (!data) this.cancel();
				this.techRecord = data;
			});

		this.store$
			.select(editingTechRecord)
			.pipe(take(1), takeUntil(this.destroy$))
			.subscribe((data) => {
				if (!data) this.cancel();
				this.techRecordEdited = data;
			});

		this.store$
			.select(selectTechRecordChanges)
			.pipe(take(1), takeUntil(this.destroy$))
			.subscribe((changes) => {
				this.techRecordChanges = changes;
				if (this.vehicleType === VehicleTypes.PSV || this.vehicleType === VehicleTypes.HGV) {
					delete (this.techRecordChanges as Partial<TechRecordGETPSV | TechRecordGETHGV>)
						.techRecord_numberOfWheelsDriven;
				}
				if (
					(this.vehicleType === VehicleTypes.CAR || this.vehicleType === VehicleTypes.LGV) &&
					(changes as TechRecordGETCar | TechRecordGETLGV).techRecord_vehicleSubclass
				) {
					(this.techRecordChanges as TechRecordGETCar | TechRecordGETLGV).techRecord_vehicleSubclass = (
						this.techRecordEdited as TechRecordGETCar | TechRecordGETLGV
					).techRecord_vehicleSubclass;
				}
			});

		this.store$
			.select(selectTechRecordDeletions)
			.pipe(take(1), takeUntil(this.destroy$))
			.subscribe((deletions) => {
				this.techRecordDeletions = deletions;
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get vehicleType() {
		return this.techRecordEdited
			? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecordEdited)
			: undefined;
	}

	get deletedAxles(): Axles {
		if (this.techRecordEdited?.techRecord_vehicleType === 'hgv' && this.techRecordDeletions) {
			return Object.values((this.techRecordDeletions as Partial<TechRecordGETHGV>).techRecord_axles ?? {});
		}

		if (this.techRecordEdited?.techRecord_vehicleType === 'trl' && this.techRecordDeletions) {
			return Object.values((this.techRecordDeletions as Partial<TechRecordGETTRL>).techRecord_axles ?? {});
		}

		if (this.techRecordEdited?.techRecord_vehicleType === 'psv' && this.techRecordDeletions) {
			return Object.values((this.techRecordDeletions as Partial<TechRecordGETPSV>).techRecord_axles ?? {});
		}

		return [];
	}

	get sectionTemplatesState$() {
		return this.technicalRecordService.sectionStates$;
	}

	isSectionExpanded$(sectionName: string | number) {
		return this.sectionTemplatesState$?.pipe(map((sections) => sections?.includes(sectionName)));
	}

	submit() {
		combineLatest([
			this.routerService.getRouteNestedParam$('systemNumber'),
			this.routerService.getRouteNestedParam$('createdTimestamp'),
		])
			.pipe(take(1), takeUntil(this.destroy$))
			.subscribe(([systemNumber, createdTimestamp]) => {
				if (systemNumber && createdTimestamp) {
					this.store$.dispatch(updateADRAdditionalExaminerNotes({ username: this.username }));
					this.store$.dispatch(clearADRDetailsBeforeUpdate());
					this.store$.dispatch(updateTechRecord({ systemNumber, createdTimestamp }));
				}
			});
	}

	cancel() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	get changesForWeights() {
		if (this.techRecordEdited == null) return undefined;

		return ['hgv', 'trl', 'psv'].includes(this.techRecordEdited.techRecord_vehicleType)
			? (this.techRecordChanges as Partial<TechRecordGETHGV | TechRecordGETPSV | TechRecordGETTRL>)
			: undefined;
	}

	get vehicleTemplates() {
		const template = vehicleTemplateMap.get(this.techRecordEdited?.techRecord_vehicleType as VehicleTypes);

		// TODO: remove this once reason for creation is under DFS
		const reasonForCreation = template?.find((section) => section.name === 'reasonForCreationSection');
		if (reasonForCreation && reasonForCreation.children?.length) {
			reasonForCreation.children[0].viewType = FormNodeViewTypes.STRING;
		}

		return template;
	}
}
