import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import {
  clearBatch,
  setApplicationId,
  setGenerateNumberFlag,
  upsertVehicleBatch,
  setVehicleStatus
} from '@store/technical-records/actions/batch-create.actions';
import { BatchRecord } from '@store/technical-records/reducers/batch-create.reducer';
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
  selectVehicleStatus
} from '@store/technical-records/selectors/batch-create.selectors';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BatchTechnicalRecordService {
  constructor(
    private store: Store,
    private techRecordHttpService: TechnicalRecordHttpService,
    private technicalRecordService: TechnicalRecordService
  ) {}

  validateForBatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const trailerIdControl = control.parent?.get('trailerId') as CustomFormControl;
      const vinControl = control.parent?.get('vin') as CustomFormControl;
      const systemNumberControl = control.parent?.get('systemNumber') as CustomFormControl;

      if (trailerIdControl && vinControl) {
        const trailerId = trailerIdControl.value;
        const vin = vinControl.value;
        delete vinControl.meta.warning;

        if (trailerId && vin) {
          return this.validateVinAndTrailerId(vin, trailerId, systemNumberControl);
        } else if (!trailerId && vin) {
          return this.validateVinForBatch(vinControl);
        } else if (trailerId && !vin) {
          return of({ validateForBatch: { message: 'VIN is required' } });
        }
      }
      return of(null);
    };
  }

  private validateVinAndTrailerId(vin: string, trailerId: string, systemNumberControl: CustomFormControl): Observable<ValidationErrors | null> {
    return this.techRecordHttpService.search$(SEARCH_TYPES.VIN, vin).pipe(
      map(result => {
        const recordsWithMatchingTrailerId = result.filter(
          vehicleTechRecord => vehicleTechRecord.trailerId === trailerId || vehicleTechRecord.primaryVrm === trailerId
        );
        if (!recordsWithMatchingTrailerId.length) {
          return { validateForBatch: { message: 'Could not find a record with matching VIN and VRM/Trailer ID' } };
        }
        if (new Set(recordsWithMatchingTrailerId.map(record => record.systemNumber)).size > 1) {
          return { validateForBatch: { message: 'More than one vehicle has this VIN and VRM/Trailer ID' } };
        }
        if (recordsWithMatchingTrailerId.find(techRecord => techRecord.techRecord_statusCode === StatusCodes.CURRENT)) {
          return { validateForBatch: { message: 'This record cannot be updated as it has a Current tech record' } };
        }
        systemNumberControl.setValue(result[0].systemNumber);
        return null;
      }),
      catchError(() => of({ validateForBatch: { message: 'Could not find a record with matching VIN' } }))
    );
  }

  private validateVinForBatch(vinControl: CustomFormControl): Observable<null> {
    return this.technicalRecordService.isUnique(vinControl.value, SEARCH_TYPES.VIN).pipe(
      map(result => {
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

  clearBatch() {
    this.store.dispatch(clearBatch());
  }

  get batchVehicles$(): Observable<BatchRecord[]> {
    return this.store.pipe(select(selectAllBatch));
  }

  get batchVehiclesSuccess$(): Observable<BatchRecord[]> {
    return this.store.pipe(select(selectBatchSuccess));
  }

  get isBatchCreate$(): Observable<boolean> {
    return this.store.pipe(select(selectIsBatch));
  }

  get batchCount$(): Observable<number> {
    return this.store.pipe(select(selectBatchCount));
  }

  get batchSuccessCount$(): Observable<number> {
    return this.store.pipe(select(selectBatchSuccessCount));
  }

  get batchCreatedCount$(): Observable<number> {
    return this.store.pipe(select(selectBatchCreatedSuccessCount));
  }

  get batchTotalCreatedCount$(): Observable<number> {
    return this.store.pipe(select(selectBatchCreatedCount));
  }

  get batchUpdatedCount$(): Observable<number> {
    return this.store.pipe(select(selectBatchUpdatedSuccessCount));
  }

  get batchTotalUpdatedCount$(): Observable<number> {
    return this.store.pipe(select(selectBatchUpdatedCount));
  }

  get applicationId$(): Observable<string | undefined> {
    return this.store.pipe(select(selectApplicationId));
  }

  get vehicleStatus$(): Observable<string | undefined> {
    return this.store.pipe(select(selectVehicleStatus));
  }

  get generateNumber$(): Observable<boolean> {
    return this.store.pipe(select(selectGenerateNumber));
  }
}
