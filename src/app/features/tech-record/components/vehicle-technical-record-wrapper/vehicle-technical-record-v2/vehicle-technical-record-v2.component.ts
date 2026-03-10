import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { FilterByTagsDirective } from '@/src/app/directives/filter-by-tags/filter-by-tags.directive';
import { AdrCertificatesComponent } from '@/src/app/forms/custom-sections-v2/adr-certificates/adr-certificates.component';
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
import { PlatesComponent } from '@/src/app/forms/custom-sections-v2/plates/plates.component';
import { PurchasersComponent } from '@/src/app/forms/custom-sections-v2/purchasers/purchasers.component';
import { ReasonForCreationComponent } from '@/src/app/forms/custom-sections-v2/reason-for-creation/reason-for-creation.component';
import { SeatsAndVehicleSizeComponent } from '@/src/app/forms/custom-sections-v2/seats-and-vehicle-size/seats-and-vehicle-size.component';
import { TyresComponent } from '@/src/app/forms/custom-sections-v2/tyres/tyres.component';
import { WeightsComponent } from '@/src/app/forms/custom-sections-v2/weights/weights.component';
import { Modes } from '@/src/app/models/modes.enum';
import { Roles } from '@/src/app/models/roles.enum';
import { V3TechRecordModel, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { AxlesService } from '@/src/app/services/axles/axles.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { getBySystemNumber, selectSectionState } from '@/src/app/store/technical-records';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject, input, model } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechnicalRecordsHistoryComponent } from '@forms/custom-sections-v2/tech-record-history/tech-record-history.component';
import { TestResultsComponent } from '@forms/custom-sections-v2/test-history/test-records.component';
import { Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { ReplaySubject, skipWhile, take, takeUntil } from 'rxjs';
import { EditTechRecordButtonComponent } from '../../edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordFiltersComponent } from '../../tech-record-filters/tech-record-filters.component';
import { TechRecordSummaryCardComponent } from '../../tech-record-summary-card/tech-record-summary-card.component';

@Component({
	selector: 'app-vehicle-technical-record-v2',
	templateUrl: './vehicle-technical-record-v2.component.html',
	styleUrls: ['./vehicle-technical-record-v2.component.scss'],
	imports: [
		RoleRequiredDirective,
		EditTechRecordButtonComponent,
		BannerComponent,
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
		TechRecordFiltersComponent,
		LetterOfAuthorisationComponent,
		AdrCertificatesComponent,
		PlatesComponent,
		ApprovalTypeComponent,
		FilterByTagsDirective,
		ReasonForCreationComponent,
		TechnicalRecordsHistoryComponent,
		TestResultsComponent,
		AsyncPipe,
	],
})
export class VehicleTechnicalRecordV2Component implements OnInit, AfterViewInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);
	axlesService = inject(AxlesService);
	technicalRecordService = inject(TechnicalRecordService);
	testRecordService = inject(TestRecordsService);
	techRecord = input<V3TechRecordModel>();
	from = this.store.selectSignal(selectQueryParam('from'));
	sectionStates$ = this.store.selectSignal(selectSectionState);
	globalErrorService = inject(GlobalErrorService);

	Modes = Modes;
	roles = Roles;
	isEditing = this.route.snapshot.data['isEditing'] ?? false;
	isDirty = false;

	form = this.fb.group({});
	filters = model<string[]>([]);
	testResults$ = this.testRecordService.testRecords$;
	destroy = new ReplaySubject<boolean>(1);

	readonly VehicleTypes = VehicleTypes;

	ngOnInit(): void {
		this.handleFormChanges();

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
						this.axlesService.setLockAxles(true);

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

	getCurrentMode(): Modes {
		return this.isEditing ? Modes.EDIT : Modes.VIEW;
	}

	ngAfterViewInit(): void {
		if (!this.isEditing) {
			this.form.disable();
		}
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	private handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			this.technicalRecordService.updateEditingTechRecord(this.form.getRawValue() as TechRecordTypeVerb<'put'>);
		});
	}

	handleSubmit(): void {
		this.form.markAllAsTouched();

		if (this.form.valid) {
			this.router.navigate(['change-summary'], { relativeTo: this.route });
		}

		if (this.form.invalid) {
			this.globalErrorService.setErrors(this.globalErrorService.extractGlobalErrors(this.form));
		}
	}

	navigateBack(): void {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	get tags(): string[] {
		const techRecord = this.techRecord();
		if (!techRecord) {
			return [];
		}
		switch (this.technicalRecordService.getVehicleTypeWithSmallTrl(techRecord)) {
			case VehicleTypes.HGV:
				return this.isEditing ? ['Plates', 'Required', 'ADR'] : ['Plates', 'Required', 'ADR', 'Records'];
			case VehicleTypes.PSV:
				return this.isEditing ? ['Required'] : ['Required', 'Records'];
			case VehicleTypes.CAR:
				return this.isEditing ? ['Required'] : ['Required', 'Records'];
			case VehicleTypes.LGV:
				return this.isEditing ? ['Required', 'ADR'] : ['Required', 'ADR', 'Records'];
			case VehicleTypes.TRL:
				return this.isEditing ? ['Plates', 'Required', 'ADR'] : ['Plates', 'Required', 'ADR', 'Records'];
			case VehicleTypes.SMALL_TRL:
				return this.isEditing ? ['Required'] : ['Required', 'Records'];
			case VehicleTypes.MOTORCYCLE:
				return this.isEditing ? ['Required'] : ['Required', 'Records'];
			default:
				return [];
		}
	}
}
