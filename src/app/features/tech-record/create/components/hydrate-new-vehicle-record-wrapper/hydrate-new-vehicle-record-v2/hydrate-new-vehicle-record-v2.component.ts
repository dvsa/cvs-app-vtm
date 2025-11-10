import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { BrakesComponent } from '@/src/app/forms/custom-sections-v2/brakes/brakes.component';
import { DDAComponent } from '@/src/app/forms/custom-sections-v2/dda/dda.component';
import { EmissionsAndExemptionsComponent } from '@/src/app/forms/custom-sections-v2/emissions-and-exemptions/emissions-and-exemptions.component';
import { ManufacturerComponent } from '@/src/app/forms/custom-sections-v2/manufacturer/manufacturer.component';
import { RootRoutes } from '@/src/app/models/routes.enum';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import {
	clearADRDetailsBeforeUpdate,
	createVehicleRecord,
	selectSectionState,
	selectTechRecord,
	updateADRAdditionalExaminerNotes,
} from '@/src/app/store/technical-records';
import { nullADRDetails } from '@/src/app/store/technical-records/technical-record-service.reducer';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { AdrComponent } from '@forms/custom-sections-v2/adr/adr.component';
import { ApprovalTypeComponent } from '@forms/custom-sections-v2/approval-type/approval-type.component';
import { AuthorisationIntoServiceComponent } from '@forms/custom-sections-v2/authorisation-into-service/authorisation-into-service.component';
import { ConfigurationComponent } from '@forms/custom-sections-v2/configuration/configuration.component';
import { DimensionsComponent } from '@forms/custom-sections-v2/dimensions/dimensions.component';
import { DocumentsComponent } from '@forms/custom-sections-v2/documents/documents.component';
import { GeneralVehicleDetailsComponent } from '@forms/custom-sections-v2/general-vehicle-details/general-vehicle-details.component';
import { LastApplicantComponent } from '@forms/custom-sections-v2/last-applicant/last-applicant.component';
import { NotesComponent } from '@forms/custom-sections-v2/notes/notes.component';
import { PurchasersComponent } from '@forms/custom-sections-v2/purchasers/purchasers.component';
import { ReasonForCreationComponent } from '@forms/custom-sections-v2/reason-for-creation/reason-for-creation.component';
import { SeatsAndVehicleSizeComponent } from '@forms/custom-sections-v2/seats-and-vehicle-size/seats-and-vehicle-size.component';
import { TyresComponent } from '@forms/custom-sections-v2/tyres/tyres.component';
import { WeightsComponent } from '@forms/custom-sections-v2/weights/weights.component';
import { Store } from '@ngrx/store';
import { AxlesService } from '@services/axles/axles.service';
import { RouterService } from '@services/router/router.service';
import { name } from '@store/user/user-service.reducer';
import { ReplaySubject, map, skipWhile, take, takeUntil } from 'rxjs';
import { TechRecordFiltersComponent } from '../../../../components/tech-record-filters/tech-record-filters.component';
import { TechRecordSummaryCardComponent } from '../../../../components/tech-record-summary-card/tech-record-summary-card.component';

@Component({
	selector: 'app-hydrate-new-vehicle-record-v2',
	templateUrl: './hydrate-new-vehicle-record-v2.component.html',
	styleUrls: ['./hydrate-new-vehicle-record-v2.component.scss'],
	imports: [
		AccordionControlComponent,
		AccordionComponent,
		NgTemplateOutlet,
		ButtonComponent,
		GeneralVehicleDetailsComponent,
		ReactiveFormsModule,
		NotesComponent,
		ReasonForCreationComponent,
		AdrComponent,
		LastApplicantComponent,
		AdrComponent,
		EmissionsAndExemptionsComponent,
		WeightsComponent,
		DimensionsComponent,
		DDAComponent,
		DocumentsComponent,
		AuthorisationIntoServiceComponent,
		PurchasersComponent,
		TyresComponent,
		ManufacturerComponent,
		ConfigurationComponent,
		SeatsAndVehicleSizeComponent,
		BrakesComponent,
		TechRecordSummaryCardComponent,
		TechRecordFiltersComponent,
		ApprovalTypeComponent,
	],
})
export class HydrateNewVehicleRecordV2Component implements OnInit, OnDestroy {
	store = inject(Store);
	router = inject(Router);
	fb = inject(FormBuilder);
	techRecordService = inject(TechnicalRecordService);
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);
	axlesService = inject(AxlesService);
	private routerService = inject(RouterService);

	techRecord$ = this.store.selectSignal(selectTechRecord);
	sectionStates$ = this.store.selectSignal(selectSectionState);
	username$ = this.store.selectSignal(name);

	readonly VehicleTypes = VehicleTypes;

	form = this.fb.group<Partial<Record<keyof TechRecordType<'put'>, FormControl>>>({});
	destroy = new ReplaySubject<boolean>(1);
	isEditing$ = this.routerService.getRouteDataProperty$('isEditing').pipe(map((isEditing) => !!isEditing));

	isEditing = false;

	ngOnInit(): void {
		this.isEditing$.pipe(takeUntil(this.destroy)).subscribe((editing) => {
			this.isEditing = editing;
		});

		this.handleFormChanges();
		this.handleEmptyEditingTechRecord();

		this.technicalRecordService.techRecord$
			.pipe(
				takeUntil(this.destroy),
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
		this.destroy.next(true);
		this.destroy.complete();
	}

	onCreateNewRecord(): void {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.globalErrorService.setErrors(this.globalErrorService.extractGlobalErrors(this.form));
		}

		if (this.form.valid) {
			this.globalErrorService.clearErrors();

			// TODO: modify if new design is included in batch create
			this.store.dispatch(updateADRAdditionalExaminerNotes({ username: this.username$() }));
			this.store.dispatch(clearADRDetailsBeforeUpdate());

			const vehicle = nullADRDetails(this.techRecord$() as TechRecordType<'put'>);
			this.store.dispatch(createVehicleRecord({ vehicle }));
		}
	}

	private handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			this.techRecordService.updateEditingTechRecord(this.form.getRawValue() as TechRecordType<'put'>);
		});
	}

	private handleEmptyEditingTechRecord(): void {
		if (!this.techRecord$()) {
			this.router.navigate([RootRoutes.CREATE_TECHNICAL_RECORD]);
		}
	}

	generateRFCDescription(): string {
		// TODO: Update this method to return a dynamic description message
		// based on if user is creating or amending a record.
		// return "Tell us why you're amending this record.";

		return "Tell us why you're creating this record.";
	}

	get weightsAccordionDescription(): string {
		switch (this.techRecord$()?.techRecord_vehicleType) {
			case VehicleTypes.HGV:
				return 'Axle, gross, and train weights.';
			case VehicleTypes.PSV:
				return 'Axle weights, unladen weight.';
			case VehicleTypes.TRL:
				return 'Axle, gross weights and coupling type.';
			default:
				return '';
		}
	}

	get configAccordionDescription(): string {
		switch (this.techRecord$()?.techRecord_vehicleType) {
			case VehicleTypes.HGV:
				return 'Off-road, fuel system, road friendly suspension.';
			case VehicleTypes.TRL:
				return 'Vehicle markers, road friendly suspension.';
			case VehicleTypes.PSV:
				return 'Vehicle markers, fuel system, speed restriction.';
			default:
				return '';
		}
	}

	get brakesAccordionDescription(): string {
		return this.techRecord$()?.techRecord_vehicleType === VehicleTypes.PSV
			? 'Brake codes, retarders, parking brakes.'
			: 'Axle brake details, parking brakes.';
	}
}
