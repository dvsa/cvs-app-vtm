import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import {
	clearADRDetailsBeforeUpdate,
	createVehicleRecord,
	createVehicleRecordSuccess,
	selectTechRecord,
	updateADRAdditionalExaminerNotes,
} from '@store/technical-records';
import { BatchRecord } from '@store/technical-records/batch-create.reducer';
import { TechnicalRecordServiceState, nullADRDetails } from '@store/technical-records/technical-record-service.reducer';
import { Observable, Subject, map, take, takeUntil, withLatestFrom } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';

@Component({
	selector: 'app-hydrate-new-vehicle-record',
	templateUrl: './hydrate-new-vehicle-record.component.html',
})
export class HydrateNewVehicleRecordComponent implements OnDestroy, OnInit {
	@ViewChild(TechRecordSummaryComponent) summary?: TechRecordSummaryComponent;
	isInvalid = false;
	batchForm?: FormGroup;
	username = '';

	private destroy$ = new Subject<void>();

	constructor(
		private actions$: Actions,
		private globalErrorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<TechnicalRecordServiceState>,
		private technicalRecordService: TechnicalRecordService,
		private batchTechRecordService: BatchTechnicalRecordService,
		public userService$: UserService
	) {}

	ngOnInit(): void {
		this.actions$
			.pipe(ofType(createVehicleRecordSuccess), takeUntil(this.destroy$))
			.subscribe(({ vehicleTechRecord }) => {
				void this.router.navigate([
					`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`,
				]);
			});

		this.userService$.name$.pipe(takeUntil(this.destroy$)).subscribe((name) => {
			this.username = name;
		});

		this.store
			.select(selectTechRecord)
			.pipe(take(1))
			.subscribe((vehicle) => {
				if (!vehicle) {
					void this.router.navigate(['..'], { relativeTo: this.route });
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get vehicle$(): Observable<V3TechRecordModel | undefined> {
		return this.store.select(selectTechRecord);
	}

	get isBatch$(): Observable<boolean> {
		return this.batchTechRecordService.isBatchCreate$;
	}

	get batchCount$(): Observable<number> {
		return this.batchTechRecordService.batchCount$;
	}

	get vehicleTypes(): typeof VehicleTypes {
		return VehicleTypes;
	}

	navigate(systemNumber?: string, createdTimestamp?: string): void {
		this.globalErrorService.clearErrors();

		if (systemNumber && createdTimestamp) {
			void this.router.navigate([`/tech-records/${systemNumber}/${createdTimestamp}`]);
		} else {
			void this.router.navigate(['batch-results'], { relativeTo: this.route });
		}
	}

	handleSubmit(): void {
		this.summary?.checkForms();

		if (this.isInvalid) return;

		this.store.dispatch(updateADRAdditionalExaminerNotes({ username: this.username }));
		this.store.dispatch(clearADRDetailsBeforeUpdate());
		this.store
			.select(selectTechRecord)
			.pipe(
				withLatestFrom(this.batchTechRecordService.batchVehicles$),
				take(1),
				map(([record, batch]) =>
					(record ? [record as BatchRecord] : []).concat(
						batch.map(
							(v) =>
								({
									...(record as BatchRecord),
									vin: v.vin,
									vrms:
										v.vehicleType !== VehicleTypes.TRL && v.trailerIdOrVrm
											? [{ vrm: v.trailerIdOrVrm, isPrimary: true }]
											: null,
									trailerId: v.vehicleType === VehicleTypes.TRL && v.trailerIdOrVrm ? v.trailerIdOrVrm : null,
								}) as VehicleTechRecordModel
						)
					)
				),
				withLatestFrom(this.isBatch$)
			)
			.subscribe(([vehicleList, isBatch]) => {
				vehicleList.forEach((vehicle) => {
					const cleansedVehicle = nullADRDetails(vehicle as unknown as TechRecordType<'put'>);
					this.store.dispatch(createVehicleRecord({ vehicle: cleansedVehicle }));
				});
				this.technicalRecordService.clearSectionTemplateStates();
				if (isBatch) this.navigate();
			});
	}
}
