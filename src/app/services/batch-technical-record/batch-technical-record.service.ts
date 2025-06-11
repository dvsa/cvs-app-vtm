import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { CustomFormControl } from '@services/dynamic-forms/dynamic-form.types';
import { HttpService } from '@services/http/http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import {
	clearBatch,
	setApplicationId,
	setGenerateNumberFlag,
	setVehicleStatus,
	setVehicleType,
	upsertVehicleBatch,
} from '@store/technical-records/batch-create.actions';
import {
	selectAllBatch,
	selectApplicationId,
	selectBatchCount,
	selectBatchCreatedCount,
	selectBatchCreatedSuccessCount,
	selectBatchSuccess,
	selectBatchSuccessCount,
	selectBatchUpdatedCount,
	selectBatchUpdatedSuccessCount,
	selectGenerateNumber,
	selectIsBatch,
	selectVehicleStatus,
	selectVehicleType,
} from '@store/technical-records/batch-create.selectors';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BatchTechnicalRecordService {
	private store = inject(Store);
	private httpService = inject(HttpService);
	private technicalRecordService = inject(TechnicalRecordService);

	batchVehicles$ = this.store.pipe(select(selectAllBatch));
	batchVehiclesSuccess$ = this.store.pipe(select(selectBatchSuccess));
	isBatchCreate$ = this.store.pipe(select(selectIsBatch));
	batchCount$ = this.store.pipe(select(selectBatchCount));
	batchSuccessCount$ = this.store.pipe(select(selectBatchSuccessCount));
	batchCreatedCount$ = this.store.pipe(select(selectBatchCreatedSuccessCount));
	batchTotalCreatedCount$ = this.store.pipe(select(selectBatchCreatedCount));
	batchUpdatedCount$ = this.store.pipe(select(selectBatchUpdatedSuccessCount));
	batchTotalUpdatedCount$ = this.store.pipe(select(selectBatchUpdatedCount));
	applicationId$ = this.store.pipe(select(selectApplicationId));
	vehicleStatus$ = this.store.pipe(select(selectVehicleStatus));
	vehicleType$ = this.store.pipe(select(selectVehicleType));
	generateNumber$ = this.store.pipe(select(selectGenerateNumber));

	validateForBatch(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			const trailerIdOrVrmControl = control.parent?.get('trailerIdOrVrm') as CustomFormControl;
			const vinControl = control.parent?.get('vin') as CustomFormControl;
			const systemNumberControl = control.parent?.get('systemNumber') as CustomFormControl;
			const createdTimeStampControl = control.parent?.get('createdTimestamp') as CustomFormControl;

			if (trailerIdOrVrmControl && vinControl) {
				const trailerIdOrVrm = trailerIdOrVrmControl.value;
				const vin = vinControl.value;
				delete vinControl.meta.warning;

				if (trailerIdOrVrm && vin) {
					return this.validateVinAndTrailerIdOrVrm(vin, trailerIdOrVrm, systemNumberControl, createdTimeStampControl);
				}
				if (!trailerIdOrVrm && vin) {
					return this.validateVinForBatch(vinControl);
				}
				if (trailerIdOrVrm && !vin) {
					return of({ validateForBatch: { message: 'VIN is required' } });
				}
			}
			return of(null);
		};
	}

	private validateVinAndTrailerIdOrVrm(
		vin: string,
		trailerIdOrVrm: string,
		systemNumberControl: CustomFormControl,
		createdTimestampControl: CustomFormControl
	): Observable<ValidationErrors | null> {
		return this.httpService.searchTechRecords(SEARCH_TYPES.VIN, vin).pipe(
			map((result) => {
				const recordsWithTrailerIdOrVrm = result.filter(
					(vehicleTechRecord) =>
						vehicleTechRecord.trailerId === trailerIdOrVrm || vehicleTechRecord.primaryVrm === trailerIdOrVrm
				);
				if (!recordsWithTrailerIdOrVrm.length) {
					return { validateForBatch: { message: 'Could not find a record with matching VIN and VRM/Trailer ID' } };
				}
				if (new Set(recordsWithTrailerIdOrVrm.map((record) => record.systemNumber)).size > 1) {
					return { validateForBatch: { message: 'More than one vehicle has this VIN and VRM/Trailer ID' } };
				}
				if (
					recordsWithTrailerIdOrVrm.find(
						(techRecord) =>
							techRecord.techRecord_statusCode === StatusCodes.CURRENT &&
							techRecord.techRecord_vehicleType === VehicleTypes.TRL
					)
				) {
					return { validateForBatch: { message: 'This record cannot be updated as it has a current tech record' } };
				}
				systemNumberControl.setValue(result[0].systemNumber);
				const techRecordToUpdate = recordsWithTrailerIdOrVrm.find(
					(techRecord) => techRecord.techRecord_statusCode !== StatusCodes.ARCHIVED
				);
				createdTimestampControl.setValue(techRecordToUpdate?.createdTimestamp);
				return null;
			}),
			catchError(() => of({ validateForBatch: { message: 'Could not find a record with matching VIN' } }))
		);
	}

	private validateVinForBatch(vinControl: CustomFormControl): Observable<null> {
		return this.technicalRecordService.isUnique(vinControl.value, SEARCH_TYPES.VIN).pipe(
			map((result) => {
				if (!result) {
					vinControl.meta.warning = 'This VIN already exists, if you continue it will be associated with two vehicles';
				}
				return null;
			}),
			catchError(() => of(null))
		);
	}

	upsertVehicleBatch(vehicles: Array<{ vin: string; trailerId?: string; primaryVrm?: string }>) {
		this.store.dispatch(upsertVehicleBatch({ vehicles }));
	}

	clearEditingTechRecord() {
		this.store.dispatch(updateEditingTechRecordCancel());
	}

	setApplicationId(applicationId: string) {
		this.store.dispatch(setApplicationId({ applicationId }));
	}
	setGenerateNumberFlag(generateNumber: boolean) {
		this.store.dispatch(setGenerateNumberFlag({ generateNumber }));
	}
	setVehicleStatus(vehicleStatus: string) {
		this.store.dispatch(setVehicleStatus({ vehicleStatus }));
	}
	setVehicleType(vehicleType: VehicleTypes) {
		this.store.dispatch(setVehicleType({ vehicleType }));
	}

	clearBatch() {
		this.store.dispatch(clearBatch());
	}
}
