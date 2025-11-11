import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { AdrComponent } from '@/src/app/forms/custom-sections-v2/adr/adr.component';
import { AuthorisationIntoServiceComponent } from '@/src/app/forms/custom-sections-v2/authorisation-into-service/authorisation-into-service.component';
import { BrakesComponent } from '@/src/app/forms/custom-sections-v2/brakes/brakes.component';
import { ConfigurationComponent } from '@/src/app/forms/custom-sections-v2/configuration/configuration.component';
import { DDAComponent } from '@/src/app/forms/custom-sections-v2/dda/dda.component';
import { DimensionsComponent } from '@/src/app/forms/custom-sections-v2/dimensions/dimensions.component';
import { DocumentsComponent } from '@/src/app/forms/custom-sections-v2/documents/documents.component';
import { EmissionsAndExemptionsComponent } from '@/src/app/forms/custom-sections-v2/emissions-and-exemptions/emissions-and-exemptions.component';
import { GeneralVehicleDetailsComponent } from '@/src/app/forms/custom-sections-v2/general-vehicle-details/general-vehicle-details.component';
import { LastApplicantComponent } from '@/src/app/forms/custom-sections-v2/last-applicant/last-applicant.component';
import { ManufacturerComponent } from '@/src/app/forms/custom-sections-v2/manufacturer/manufacturer.component';
import { NotesComponent } from '@/src/app/forms/custom-sections-v2/notes/notes.component';
import { PurchasersComponent } from '@/src/app/forms/custom-sections-v2/purchasers/purchasers.component';
import { SeatsAndVehicleSizeComponent } from '@/src/app/forms/custom-sections-v2/seats-and-vehicle-size/seats-and-vehicle-size.component';
import { TyresComponent } from '@/src/app/forms/custom-sections-v2/tyres/tyres.component';
import { WeightsComponent } from '@/src/app/forms/custom-sections-v2/weights/weights.component';
import { Roles } from '@/src/app/models/roles.enum';
import { V3TechRecordModel, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { AxlesService } from '@/src/app/services/axles/axles.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { selectSectionState } from '@/src/app/store/technical-records';
import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
	],
})
export class VehicleTechnicalRecordV2Component implements OnInit, AfterViewInit {
	fb = inject(FormBuilder);
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);
	axlesService = inject(AxlesService);
	technicalRecordService = inject(TechnicalRecordService);

	techRecord = input<V3TechRecordModel>();
	from = this.store.selectSignal(selectQueryParam('from'));
	sectionStates$ = this.store.selectSignal(selectSectionState);

	roles = Roles;
	isEditing = this.route.snapshot.data['isEditing'] ?? false;
	isDirty = false;
	destroy = new ReplaySubject<boolean>(1);

	form = this.fb.group({});

	readonly VehicleTypes = VehicleTypes;

	ngOnInit(): void {
		this.technicalRecordService.techRecord$
			.pipe(
				takeUntil(this.destroy),
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
				}
			});
	}

	ngAfterViewInit(): void {
		if (!this.isEditing) {
			this.form.disable();
		}
	}

	handleSubmit(): void {
		this.router.navigate(['change-summary'], { relativeTo: this.route });
	}

	navigateBack(): void {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	get weightsAccordionDescription(): string {
		switch (this.techRecord()?.techRecord_vehicleType) {
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
		switch (this.techRecord()?.techRecord_vehicleType) {
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
		return this.techRecord()?.techRecord_vehicleType === VehicleTypes.PSV
			? 'Brake codes, retarders, parking brakes.'
			: 'Axle brake details, parking brakes.';
	}
}
