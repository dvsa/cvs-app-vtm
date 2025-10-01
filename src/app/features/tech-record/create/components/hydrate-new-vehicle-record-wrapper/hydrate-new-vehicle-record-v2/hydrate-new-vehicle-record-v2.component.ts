import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { NumberPlateComponent } from '@/src/app/components/number-plate/number-plate.component';
import { TagComponent, TagType } from '@/src/app/components/tag/tag.component';
import { EmissionsAndExemptionsComponent } from '@/src/app/forms/custom-sections-v2/emissions-and-exemptions/emissions-and-exemptions.component';
import { RootRoutes, TechRecordCreateRoutes } from '@/src/app/models/routes.enum';
import { StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@/src/app/pipes/format-vehicle-type/format-vehicle-type.pipe';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectSectionState, selectTechRecord } from '@/src/app/store/technical-records';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { AdrComponent } from '@forms/custom-sections-v2/adr/adr.component';
import { DimensionsComponent } from '@forms/custom-sections-v2/dimensions/dimensions.component';
import { GeneralVehicleDetailsComponent } from '@forms/custom-sections-v2/general-vehicle-details/general-vehicle-details.component';
import { LastApplicantComponent } from '@forms/custom-sections-v2/last-applicant/last-applicant.component';
import { NotesComponent } from '@forms/custom-sections-v2/notes/notes.component';
import { ReasonForCreationComponent } from '@forms/custom-sections-v2/reason-for-creation/reason-for-creation.component';
import { WeightsComponent } from '@forms/custom-sections-v2/weights/weights.component';
import { Store } from '@ngrx/store';
import { AxlesService } from '@services/axles/axles.service';
import { RouterService } from '@services/router/router.service';
import { ReplaySubject, map, skipWhile, take, takeUntil } from 'rxjs';

@Component({
	selector: 'app-hydrate-new-vehicle-record-v2',
	templateUrl: './hydrate-new-vehicle-record-v2.component.html',
	styleUrls: ['./hydrate-new-vehicle-record-v2.component.scss'],
	imports: [
		AccordionControlComponent,
		AccordionComponent,
		NgTemplateOutlet,
		ButtonComponent,
		NumberPlateComponent,
		DefaultNullOrEmpty,
		TagComponent,
		FormatVehicleTypePipe,
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
	],
})
export class HydrateNewVehicleRecordV2Component implements OnInit, OnDestroy {
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);
	fb = inject(FormBuilder);
	techRecordService = inject(TechnicalRecordService);
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);
	axlesService = inject(AxlesService);
	private routerService = inject(RouterService);

	techRecord$ = this.store.selectSignal(selectTechRecord);
	sectionStates$ = this.store.selectSignal(selectSectionState);

	readonly TagType = TagType;
	readonly VehicleTypes = VehicleTypes;
	readonly StatusCodes = StatusCodes;

	form = this.fb.group<
		Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl' | 'car' | 'lgv' | 'motorcycle'>, FormControl>>
	>({});
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

	onChange(): void {
		this.router.navigate([RootRoutes.CREATE_TECHNICAL_RECORD]);
	}

	onCancel(): void {
		this.router.navigate([TechRecordCreateRoutes.NEW_RECORD_DETAILS_CANCEL], { relativeTo: this.route });
	}

	onCreateNewRecord(): void {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.globalErrorService.setErrors(this.globalErrorService.extractGlobalErrors(this.form));
		}

		if (this.form.valid) {
			this.globalErrorService.clearErrors();
			// TODO: submit record
		}
	}

	private handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe((val) => {
			// TODO: remove any type
			this.techRecordService.updateEditingTechRecord(this.form.getRawValue() as any);
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
				return 'Axle, gross and train weights.';
			case VehicleTypes.PSV:
				return 'Axle weights, unladen weight.';
			//case VehicleTypes.TRL:
			//return '';
			default:
				return '';
		}
	}
}
