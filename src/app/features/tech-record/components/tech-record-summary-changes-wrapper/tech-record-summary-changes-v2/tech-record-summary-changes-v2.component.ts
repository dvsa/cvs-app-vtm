import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { AdrComponent } from '@/src/app/forms/custom-sections-v2/adr/adr.component';
import { ApprovalTypeComponent } from '@/src/app/forms/custom-sections-v2/approval-type/approval-type.component';
import { AuthorisationIntoServiceComponent } from '@/src/app/forms/custom-sections-v2/authorisation-into-service/authorisation-into-service.component';
import { BrakesComponent } from '@/src/app/forms/custom-sections-v2/brakes/brakes.component';
import { ConfigurationComponent } from '@/src/app/forms/custom-sections-v2/configuration/configuration.component';
import { DDAComponent } from '@/src/app/forms/custom-sections-v2/dda/dda.component';
import { DimensionsComponent } from '@/src/app/forms/custom-sections-v2/dimensions/dimensions.component';
import { DocumentsComponent } from '@/src/app/forms/custom-sections-v2/documents/documents.component';
import { EmissionsAndExemptionsComponent } from '@/src/app/forms/custom-sections-v2/emissions-and-exemptions/emissions-and-exemptions.component';
import { GeneralVehicleDetailsComponent } from '@/src/app/forms/custom-sections-v2/general-vehicle-details/general-vehicle-details.component';
import { LastApplicantComponent } from '@/src/app/forms/custom-sections-v2/last-applicant/last-applicant.component';
import { LetterOfAuthorisationComponent } from '@/src/app/forms/custom-sections-v2/letter-of-authorisation/letter-of-authorisation.component';
import { ManufacturerComponent } from '@/src/app/forms/custom-sections-v2/manufacturer/manufacturer.component';
import { NotesComponent } from '@/src/app/forms/custom-sections-v2/notes/notes.component';
import { PurchasersComponent } from '@/src/app/forms/custom-sections-v2/purchasers/purchasers.component';
import { ReasonForCreationComponent } from '@/src/app/forms/custom-sections-v2/reason-for-creation/reason-for-creation.component';
import { SeatsAndVehicleSizeComponent } from '@/src/app/forms/custom-sections-v2/seats-and-vehicle-size/seats-and-vehicle-size.component';
import { TyresComponent } from '@/src/app/forms/custom-sections-v2/tyres/tyres.component';
import { WeightsComponent } from '@/src/app/forms/custom-sections-v2/weights/weights.component';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { AxlesService } from '@/src/app/services/axles/axles.service';
import { RouterService } from '@/src/app/services/router/router.service';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import {
	clearADRDetailsBeforeUpdate,
	editingTechRecord,
	getBySystemNumber,
	selectSectionState,
	techRecord,
	updateADRAdditionalExaminerNotes,
	updateTechRecord,
} from '@/src/app/store/technical-records';
import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject, combineLatest, skipWhile, take, takeUntil } from 'rxjs';
import { TechRecordSummaryCardComponent } from '../../tech-record-summary-card/tech-record-summary-card.component';

@Component({
	selector: 'app-tech-record-summary-changes-v2',
	templateUrl: './tech-record-summary-changes-v2.component.html',
	styleUrls: ['./tech-record-summary-changes-v2.component.scss'],
	imports: [
		TechRecordSummaryCardComponent,
		AccordionComponent,
		AccordionControlComponent,
		GeneralVehicleDetailsComponent,
		ReactiveFormsModule,
		NotesComponent,
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
		FormsModule,
		ReactiveFormsModule,
		NgTemplateOutlet,
		LetterOfAuthorisationComponent,
		ApprovalTypeComponent,
		ReasonForCreationComponent,
		BannerComponent,
		ButtonComponent,
		ButtonGroupComponent,
	],
})
export class TechRecordSummaryChangesV2Component implements OnInit, AfterViewInit, OnDestroy {
	store = inject(Store);
	fb = inject(FormBuilder);
	axlesService = inject(AxlesService);
	technicalRecordService = inject(TechnicalRecordService);
	tcs = inject(TechnicalRecordChangesService);
	router = inject(Router);
	routerService = inject(RouterService);
	userService = inject(UserService);
	globalErrorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);
	sectionStates$ = this.store.selectSignal(selectSectionState);

	form = this.fb.group({});

	username = '';
	destroy = new ReplaySubject<boolean>(1);

	readonly VehicleTypes = VehicleTypes;

	ngOnInit(): void {
		this.userService.name$.pipe(takeUntil(this.destroy)).subscribe((name) => {
			this.username = name;
		});

		this.technicalRecordService.techRecord$
			.pipe(
				skipWhile((techRecord) => !techRecord),
				take(1)
			)
			.subscribe((techRecord) => {
				if (techRecord) {
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

					// Fetch technical record history and load into state
					if ('systemNumber' in techRecord && techRecord['systemNumber']) {
						this.store.dispatch(getBySystemNumber({ systemNumber: techRecord.systemNumber }));
					}
				}
			});
	}

	ngAfterViewInit(): void {
		this.form.disable();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	submit(): void {
		combineLatest([
			this.routerService.getRouteNestedParam$('systemNumber'),
			this.routerService.getRouteNestedParam$('createdTimestamp'),
		])
			.pipe(take(1), takeUntil(this.destroy))
			.subscribe(([systemNumber, createdTimestamp]) => {
				if (systemNumber && createdTimestamp) {
					this.store.dispatch(updateADRAdditionalExaminerNotes({ username: this.username }));
					this.store.dispatch(clearADRDetailsBeforeUpdate());
					this.store.dispatch(updateTechRecord({ systemNumber, createdTimestamp }));
				}
			});
	}

	cancel(): void {
		this.globalErrorService.clearErrors();
		this.router.navigate(['..'], { relativeTo: this.route });
	}
}
