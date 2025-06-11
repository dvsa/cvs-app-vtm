import { AsyncPipe, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import {
	ReasonForEditing,
	StatusCodes,
	TechRecordModel,
	V3TechRecordModel,
	VehicleTypes,
} from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { clearScrollPosition, updateTechRecordSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/technical-record-service.reducer';
import { Subject, take, takeUntil } from 'rxjs';
import { EditTechRecordButtonComponent } from '../edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordHistoryComponent } from '../tech-record-history/tech-record-history.component';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';
import { TestRecordSummaryComponent } from '../test-record-summary/test-record-summary.component';

@Component({
	selector: 'app-vehicle-technical-record',
	templateUrl: './vehicle-technical-record.component.html',
	styleUrls: ['./vehicle-technical-record.component.scss'],
	imports: [
		TechRecordTitleComponent,
		RoleRequiredDirective,
		EditTechRecordButtonComponent,
		TechRecordHistoryComponent,
		TestRecordSummaryComponent,
		TechRecordSummaryComponent,
		AsyncPipe,
	],
})
export class VehicleTechnicalRecordComponent implements OnInit, OnDestroy {
	globalErrorService = inject(GlobalErrorService);
	userService = inject(UserService);
	testRecordService = inject(TestRecordsService);
	activatedRoute = inject(ActivatedRoute);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store<TechnicalRecordServiceState>);
	actions$ = inject(Actions);
	viewportScroller = inject(ViewportScroller);
	adrService = inject(AdrService);

	readonly summary = viewChild.required(TechRecordSummaryComponent);
	readonly techRecord = input<V3TechRecordModel>();

	testResults$ = this.testRecordService.testRecords$;
	editingReason?: ReasonForEditing = this.activatedRoute.snapshot.data['reason'];
	recordHistory?: TechRecordSearchSchema[];

	isCurrent = false;
	isArchived = false;
	isEditing = this.activatedRoute.snapshot.data['isEditing'] ?? false;
	isDirty = false;
	isInvalid = false;

	private destroy$ = new Subject<void>();
	hasTestResultAmend: boolean | undefined = false;

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
	ngOnInit(): void {
		this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe((vehicleTechRecord) => {
			void this.router.navigate([
				`/tech-records/${vehicleTechRecord.vehicleTechRecord.systemNumber}/${vehicleTechRecord.vehicleTechRecord.createdTimestamp}`,
			]);
		});
		const techRecord = this.techRecord();
		this.isArchived = techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED;
		this.isCurrent = techRecord?.techRecord_statusCode === StatusCodes.CURRENT;

		this.userService.roles$.pipe(take(1)).subscribe((storedRoles) => {
			this.hasTestResultAmend = storedRoles?.some((role) => {
				return Roles.TestResultAmend.split(',').includes(role);
			});
		});
	}

	get currentVrm(): string | undefined {
		const techRecord = this.techRecord();
		return techRecord?.techRecord_vehicleType !== 'trl' ? (techRecord?.primaryVrm ?? '') : undefined;
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get vehicleTypes(): typeof VehicleTypes {
		return VehicleTypes;
	}

	get statusCodes(): typeof StatusCodes {
		return StatusCodes;
	}

	hasPlates(techRecord: TechRecordModel) {
		return (techRecord.plates?.length ?? 0) > 0;
	}

	getActions(techRecord?: V3TechRecordModel): TechRecordActions {
		switch (techRecord?.techRecord_statusCode) {
			case StatusCodes.CURRENT:
				return TechRecordActions.CURRENT;
			case StatusCodes.PROVISIONAL:
				return TechRecordActions.PROVISIONAL;
			case StatusCodes.ARCHIVED:
				return TechRecordActions.ARCHIVED;
			default:
				return TechRecordActions.NONE;
		}
	}

	getVehicleDescription(techRecord: TechRecordModel, vehicleType: VehicleTypes | undefined): string {
		switch (vehicleType) {
			case VehicleTypes.TRL:
				return techRecord.vehicleConfiguration ?? '';
			case VehicleTypes.PSV:
				return techRecord.bodyMake && techRecord.bodyModel ? `${techRecord.bodyMake}-${techRecord.bodyModel}` : '';
			case VehicleTypes.HGV:
				return techRecord.make && techRecord.model ? `${techRecord.make}-${techRecord.model}` : '';
			default:
				return 'Unknown Vehicle Type';
		}
	}

	showCreateTestButton(): boolean {
		return !this.isArchived && !this.isEditing;
	}

	async createTest(techRecord?: V3TechRecordModel): Promise<void> {
		this.store.dispatch(clearScrollPosition());
		if (
			(techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness === 'complete' ||
			(techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness === 'testable'
		) {
			await this.router.navigate(['test-records/create-test/type'], { relativeTo: this.route });
		} else {
			this.globalErrorService.setErrors([
				{
					error: this.getCreateTestErrorMessage(techRecord?.techRecord_hiddenInVta ?? false),
					anchorLink: 'create-test',
				},
			]);

			this.viewportScroller.scrollToPosition([0, 0]);
		}
	}

	async handleSubmit(): Promise<void> {
		this.summary().checkForms();
		if (this.isInvalid) return;

		await this.router.navigate(['change-summary'], { relativeTo: this.route });
	}

	private getCreateTestErrorMessage(hiddenInVta: boolean | undefined): string {
		if (hiddenInVta) {
			return 'Vehicle record is hidden in VTA. Show the vehicle record in VTA to start recording tests against it.';
		}

		return this.hasTestResultAmend
			? 'This vehicle does not have enough information to be tested. Please complete this record so tests can be recorded against it.'
			: 'This vehicle does not have enough information to be tested.' +
					' Call the Contact Centre to complete this record so tests can be recorded against it.';
	}
}
