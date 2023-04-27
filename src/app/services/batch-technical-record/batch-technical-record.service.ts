import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import { clearBatch, setApplicationId, setGenerateNumberFlag, upsertVehicleBatch } from '@store/technical-records/actions/batch-create.actions';
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
  selectIsBatch
} from '@store/technical-records/selectors/batch-create.selectors';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BatchTechnicalRecordService {
  constructor(private store: Store, private techRecordHttpService: TechnicalRecordHttpService) {}

  isUnique(valueToCheck: string, searchType: SEARCH_TYPES): Observable<boolean> {
    return this.techRecordHttpService.getVehicleTechRecordModels(valueToCheck, searchType).pipe(
      map(vehicleTechRecord => {
        const allTechRecords = vehicleTechRecord.flatMap(record => record.techRecord);
        if (allTechRecords.every(record => record.statusCode === StatusCodes.ARCHIVED)) {
          return true;
        }

        if (searchType === SEARCH_TYPES.VRM) {
          const allVrms = vehicleTechRecord.flatMap(record => record.vrms);
          return !allVrms.some(vrm => vrm.isPrimary && vrm.vrm === valueToCheck);
        }

        return false;
      }),
      catchError((error: HttpErrorResponse) => {
        return (error.status == 404 && of(true)) || throwError(() => error);
      })
    );
  }

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
    return this.techRecordHttpService.getByVin(vin).pipe(
      map(result => {
        const filteredResults = result.filter(vehicleTechRecord => vehicleTechRecord.trailerId === trailerId);
        if (!filteredResults.length) {
          return { validateForBatch: { message: 'Could not find a record with matching VIN and Trailer ID' } };
        }
        if (filteredResults.length > 1) {
          return { validateForBatch: { message: 'More than one vehicle has this VIN and Trailer ID' } };
        }
        if (filteredResults[0].techRecord.find(techRecord => techRecord.statusCode === StatusCodes.CURRENT)) {
          return { validateForBatch: { message: 'This record cannot be updated as it has a Current tech record' } };
        }
        systemNumberControl.setValue(result[0].systemNumber);
        return null;
      }),
      catchError(() => of({ validateForBatch: { message: 'Could not find a record with matching VIN' } }))
    );
  }

  private validateVinForBatch(vinControl: CustomFormControl): Observable<null> {
    return this.isUnique(vinControl.value, SEARCH_TYPES.VIN).pipe(
      map(result => {
        if (!result) {
          vinControl.meta.warning = 'This VIN already exists, if you continue it will be associated with two vehicles';
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  upsertVehicleBatch(vehicles: Array<{ vin: string; trailerId?: string }>) {
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

  get generateNumber$(): Observable<boolean> {
    return this.store.pipe(select(selectGenerateNumber));
  }
}
