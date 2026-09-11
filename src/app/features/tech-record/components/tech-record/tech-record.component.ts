import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
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
import {
	ReasonForEditing,
	StatusCodes,
	V3TechRecordModel,
	VehicleTypes,
} from '@/src/app/models/vehicle-tech-record.model';
import { AxlesService } from '@/src/app/services/axles/axles.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectSectionState } from '@/src/app/store/technical-records';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
	computed,
	inject,
	input,
	model,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	TechRecordType,
	TechRecordType as TechRecordTypeVerb,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechnicalRecordsHistoryComponent } from '@forms/custom-sections-v2/tech-record-history/tech-record-history.component';
import { TestResultsComponent } from '@forms/custom-sections-v2/test-history/test-records.component';
import { Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { ReplaySubject, debounceTime, skipWhile, take, takeUntil } from 'rxjs';
import { TechRecordFiltersComponent } from '../tech-record-filters/tech-record-filters.component';

@Component({
	selector: 'app-tech-record',
	templateUrl: './tech-record.component.html',
	styleUrls: ['./tech-record.component.scss'],
	imports: [
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechRecordComponent implements OnInit, AfterViewInit, OnDestroy {
	readonly fb = inject(FormBuilder);
	readonly store = inject(Store);
	readonly route = inject(ActivatedRoute);
	readonly router = inject(Router);
	readonly axlesService = inject(AxlesService);
	readonly technicalRecordService = inject(TechnicalRecordService);
	readonly testRecordService = inject(TestRecordsService);
	readonly sectionStates$ = this.store.selectSignal(selectSectionState);
	readonly globalErrorService = inject(GlobalErrorService);

	readonly isEditing = input(false);
	readonly techRecord = input<V3TechRecordModel>();
	readonly tags = computed(() => this.computeTags());

	readonly Modes = Modes;
	readonly roles = Roles;

	isDirty = false;
	form = this.fb.group({});
	filters = model<string[]>([]);
	testResults$ = this.testRecordService.testRecords$;
	destroy = new ReplaySubject<boolean>(1);

	readonly VehicleTypes = VehicleTypes;

	// Precompute accordion descriptions once per techRecord change instead of on every
	// change-detection cycle. Vehicle-type type-guard predicates stay inline in the template
	// so their control-flow narrowing of `techRecord` is preserved for child inputs.
	vehicleMeta = computed(() => {
		const techRecord = this.techRecord();
		const svc = this.technicalRecordService;
		return {
			approvalTypeDescription: techRecord ? svc.getApprovalTypeAccordionDescription(techRecord) : '',
			weightsDescription: techRecord ? svc.getWeightsAccordionDescription(techRecord) : '',
			tyresDescription: techRecord ? svc.getTyresAccordionDescription(techRecord) : '',
			configDescription: techRecord ? svc.getConfigAccordionDescription(techRecord) : '',
			brakesDescription: techRecord ? svc.getBrakesAccordionDescription(techRecord) : '',
		};
	});

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
						const form = this.axlesService.generateAxlesForm(techRecord);
						this.form.addControl('techRecord_axles', form);

						if (form.controls.length > 0) {
							this.axlesService.setLockAxles(true);
						}

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

					// If the the editing reason is notifiable alteration needed, then create a provisional record
					if (
						this.isEditing() &&
						this.route.snapshot.data['reason'] === ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED
					) {
						this.technicalRecordService.updateEditingTechRecord({
							...(techRecord as TechRecordType<'put'>),
							techRecord_statusCode: StatusCodes.PROVISIONAL,
						});
					}
				}
			});
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
		// Debounce the live store mirror so rapid typing does not push a new editing record
		// (which re-feeds every section's techRecord input) on every keystroke. Submit flushes synchronously.
		this.form.valueChanges.pipe(debounceTime(100), takeUntil(this.destroy)).subscribe(() => this.syncFormToStore());
	}

	/** Immediately mirror the form into the store editing record (flushes any pending debounced change). */
	private syncFormToStore(): void {
		this.technicalRecordService.updateEditingTechRecord(this.form.getRawValue() as TechRecordTypeVerb<'put'>);
	}

	computeTags(): string[] {
		const techRecord = this.techRecord();
		if (!techRecord) return [];

		const isEditing = this.isEditing();

		switch (this.technicalRecordService.getVehicleTypeWithSmallTrl(techRecord)) {
			case VehicleTypes.HGV:
				return isEditing ? ['Plates', 'Required', 'ADR'] : ['Plates', 'Required', 'ADR', 'Records'];
			case VehicleTypes.PSV:
				return isEditing ? ['Required'] : ['Required', 'Records'];
			case VehicleTypes.CAR:
				return isEditing ? ['Required'] : ['Required', 'Records'];
			case VehicleTypes.LGV:
				return isEditing ? ['Required', 'ADR'] : ['Required', 'ADR', 'Records'];
			case VehicleTypes.TRL:
				return isEditing ? ['Plates', 'Required', 'ADR'] : ['Plates', 'Required', 'ADR', 'Records'];
			case VehicleTypes.SMALL_TRL:
				return isEditing ? ['Required'] : ['Required', 'Records'];
			case VehicleTypes.MOTORCYCLE:
				return isEditing ? ['Required'] : ['Required', 'Records'];
			default:
				return [];
		}
	}
}
