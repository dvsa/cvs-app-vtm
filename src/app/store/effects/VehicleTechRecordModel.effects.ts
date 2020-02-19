import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllFailure,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  SetSelectedVehicleTechnicalRecord,
  SetSelectedVehicleTechnicalRecordSucess,
  SetVehicleTechRecordModelVinOnCreate,
  SetVehicleTechRecordModelVinOnCreateSucess,
  SetViewState,
  UpdateVehicleTechRecord,
  UpdateVehicleTechRecordsSuccess
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';
import { ClearErrorMessage, SetErrorMessage } from '../actions/Error.actions';
import { VEHICLE_TECH_RECORD_SEARCH_ERRORS, VIEW_STATE } from '@app/app.enums';
import {
  getSelectedVehicleTechRecord,
  selectVehicleTechRecordModelHavingStatusAll
} from '../selectors/VehicleTechRecordModel.selectors';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleTechRecordUpdate } from '@app/models/vehicle-tech-record-update';
import { SearchParams } from '@app/models/search-params';

@Injectable()
export class VehicleTechRecordModelEffects {
  @Effect()
  getTechnicalRecords$ = this._actions$.pipe(
    ofType<GetVehicleTechRecordModelHavingStatusAll>(
      EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll
    ),
    map((action) => action.payload),
    switchMap((searchParams: SearchParams) =>
      this._technicalRecordService
        .getTechnicalRecordsAllStatuses(
          searchParams.searchIdentifier,
          searchParams.searchCriteria
        )
        .pipe(
          switchMap((vTechRecords: VehicleTechRecordModel[]) =>
            of(new GetVehicleTechRecordModelHavingStatusAllSuccess(vTechRecords))
          ),
          tap((action) => {
            if (action.payload.length > 1) {
              this.router.navigate(['/multiple-records']);
            } else {
              console.log(action.payload[0]);
              this._store.dispatch(new SetSelectedVehicleTechnicalRecord(action.payload[0]));
              this._store.dispatch(new GetVehicleTestResultModel(action.payload[0].systemNumber));
              this._store.dispatch(new ClearErrorMessage());
            }
          }),
          catchError((error) => {
            const errorMessage = this.getSearchResultError(error);

            this._store.dispatch(new SetErrorMessage([errorMessage]));
            return of(new GetVehicleTechRecordModelHavingStatusAllFailure(error));
          })
        )
    )
  );

  @Effect()
  setSelectedVehicleTechRecord$ = this._actions$.pipe(
    ofType<SetSelectedVehicleTechnicalRecord>(
      EVehicleTechRecordModelActions.SetSelectedVehicleTechnicalRecord
    ),
    switchMap((action) => {
      this.router.navigate(['/technical-record']);
      return [new SetSelectedVehicleTechnicalRecordSucess(action.vehicleTechRecord)];
    })
  );

  @Effect({ dispatch: false })
  setVinOnCreate$ = this._actions$.pipe(
    ofType<SetVehicleTechRecordModelVinOnCreate>(
      EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate
    ),
    map((action) => action.payload),
    switchMap((payload) => {
      const requests: Observable<any>[] = [];
      const requestErrors = [];

      if (payload.vType === 'PSV' || payload.vType === 'HGV') {
        requests.push(
          this._technicalRecordService
            .getTechnicalRecordsAllStatuses(payload.vin, 'all')
            .pipe(catchError((error) => of(undefined)))
        );
        requests.push(
          this._technicalRecordService
            .getTechnicalRecordsAllStatuses(payload.vrm, 'all')
            .pipe(catchError((error) => of(undefined)))
        );

        forkJoin(requests).subscribe((result) => {
          if (result[0] !== undefined) {
            requestErrors.push(
              'A technical record with this VIN already exists, check the VIN or change the existing technical record'
            );
          }
          if (result[1] !== undefined) {
            requestErrors.push(
              'A technical record with this VRM already exists, check the VRM or change the existing technical record'
            );
          }
          if (result[0] === undefined && result[1] === undefined) {
            this.router.navigate([`/technical-record`]);
          }
          requests.length = 0;
          this._store.dispatch(
            new SetVehicleTechRecordModelVinOnCreateSucess({
              vin: payload.vin,
              vrm: payload.vrm,
              vType: payload.vType,
              error: requestErrors
            })
          );
        });
      } else if (payload.vType === 'Trailer') {
        this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vin, 'all').subscribe(
          (result) => {
            requestErrors.push(
              'A technical record with this VIN already exists, check the VIN or change the existing technical record'
            );
            this._store.dispatch(
              new SetVehicleTechRecordModelVinOnCreateSucess({
                vin: payload.vin,
                vrm: payload.vrm,
                vType: payload.vType,
                error: requestErrors
              })
            );
          },
          (error) => {
            this.router.navigate([`/technical-record`]);
          }
        );
      }

      return of(payload);
    })
  );

  @Effect()
  updateTechnicalRecords$ = this._actions$.pipe(
    ofType<UpdateVehicleTechRecord>(EVehicleTechRecordModelActions.UpdateVehicleTechRecord),
    withLatestFrom(
      this._store.pipe(select(getSelectedVehicleTechRecord)),
      this._store.pipe(select(selectVehicleTechRecordModelHavingStatusAll))
    ),
    switchMap(
      ([{ techRecord }, vehicleTechRecord, vehicleTechRecordsInState]: [
        { techRecord: TechRecord },
        VehicleTechRecordModel,
        VehicleTechRecordModel[]
      ]) => {
        const dataToSave: VehicleTechRecordUpdate = {} as VehicleTechRecordUpdate;
        // TODO - use a separate selector to get msUserDetails once in the store

        dataToSave.msUserDetails = { msUser: 'catalin', msOid: '123243424-234234245' };
        dataToSave.techRecord = [techRecord];
        dataToSave.systemNumber = vehicleTechRecord.systemNumber;
        return this._technicalRecordService
          .updateTechnicalRecords(dataToSave, vehicleTechRecord.vin)
          .pipe(
            switchMap((updatedVehicleTechRecord: VehicleTechRecordModel) => {
              const vTechRecords: VehicleTechRecordModel[] = JSON.parse(
                JSON.stringify(vehicleTechRecordsInState)
              );
              const position = vTechRecords.findIndex((vTechInState) => {
                return vTechInState.systemNumber === updatedVehicleTechRecord.systemNumber;
              });

              vTechRecords[position] = updatedVehicleTechRecord;
              return [
                new UpdateVehicleTechRecordsSuccess(vTechRecords),
                new SetViewState(VIEW_STATE.VIEW_ONLY)
              ];
            }),
            catchError(({ error }) => {
              this._store.dispatch(new SetErrorMessage([error]));
              return [];
            })
          );
      }
    )
  );

  constructor(
    private _technicalRecordService: TechnicalRecordService,
    private _actions$: Actions,
    private _store: Store<IVehicleTechRecordModelState>,
    private router: Router
  ) {}

  public getSearchResultError(error: any) {
    let errorMessage: string;
    switch (true) {
      case error.error === 'No resources match the search criteria.':
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.NOT_FOUND;
        break;
      case error.error === 'The provided partial VIN returned more than one match.':
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.MULTIPLE_FOUND;
        break;
      case error.error.error !== undefined:
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.NO_INPUT;
        break;
      default:
        errorMessage = error.error;
    }
    return errorMessage;
  }
}
