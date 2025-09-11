import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { NumberPlateComponent } from '@/src/app/components/number-plate/number-plate.component';
import { TagComponent, TagType } from '@/src/app/components/tag/tag.component';
import { RootRoutes, TechRecordCreateRoutes } from '@/src/app/models/routes.enum';
import { StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@/src/app/pipes/format-vehicle-type/format-vehicle-type.pipe';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectSectionState, selectTechRecord } from '@/src/app/store/technical-records';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { AdrComponent } from '@forms/custom-sections-v2/adr/adr.component';
import { GeneralVehicleDetailsComponent } from '@forms/custom-sections-v2/general-vehicle-details/general-vehicle-details.component';
import { LastApplicantComponent } from '@forms/custom-sections-v2/last-applicant/last-applicant.component';
import { NotesComponent } from '@forms/custom-sections-v2/notes/notes.component';
import { ReasonForCreationComponent } from '@forms/custom-sections-v2/reason-for-creation/reason-for-creation.component';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';

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
	],
})
export class HydrateNewVehicleRecordV2Component implements OnInit, OnDestroy {
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);
	fb = inject(FormBuilder);
	techRecordService = inject(TechnicalRecordService);
	globalErrorService = inject(GlobalErrorService);

	techRecord$ = this.store.selectSignal(selectTechRecord);
	sectionStates$ = this.store.selectSignal(selectSectionState);

	readonly TagType = TagType;
	readonly VehicleTypes = VehicleTypes;
	readonly StatusCodes = StatusCodes;

	form = this.fb.group({});
	destroy = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.handleFormChanges();
		this.handleEmptyEditingTechRecord();
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
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
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
}
