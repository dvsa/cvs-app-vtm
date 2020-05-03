import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  SetSelectedVehicleTechnicalRecord,
  SetSelectedVehicleTechnicalRecordSucess,
  SetVehicleTechRecordModelOnCreate,
  SetViewState,
  UpdateVehicleTechRecord,
  UpdateVehicleTechRecordSuccess
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';
import { ClearErrorMessage, SetErrorMessage } from '../actions/Error.actions';
import {
  CREATE_PAGE_LABELS,
  VEHICLE_TECH_RECORD_SEARCH_ERRORS,
  VIEW_STATE
} from '@app/app.enums';
import { getSelectedVehicleTechRecord } from '../selectors/VehicleTechRecordModel.selectors';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleTechRecordUpdate } from '@app/models/vehicle-tech-record-update';
import { SearchParams } from '@app/models/search-params';
import { UserService } from '@app/app-user.service';
import { VrmModel } from '@app/models/vrm.model';

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
              this._store.dispatch(new SetSelectedVehicleTechnicalRecord(action.payload[0]));
              this._store.dispatch(new GetVehicleTestResultModel(action.payload[0].systemNumber));
              this._store.dispatch(new ClearErrorMessage());
            }
          }),
          catchError((error) => {
            const errorMessage = this.getSearchResultError(error);
            return [new SetErrorMessage([errorMessage])];
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
    ofType<SetVehicleTechRecordModelOnCreate>(
      EVehicleTechRecordModelActions.SetVehicleTechRecordModelOnCreate
    ),
    map((action) => action.payload),
    switchMap((payload) => {
      let requests: Observable<any>[] = [];
      const requestErrors = [];

      requests.push(
        this._technicalRecordService
          .getTechnicalRecordsAllStatuses(payload.vin, 'all')
          .pipe(catchError((error) => of(undefined)))
      );

      if (payload.vType === 'PSV' || payload.vType === 'HGV') {
        requests.push(
          this._technicalRecordService
            .getTechnicalRecordsAllStatuses(payload.vrm, 'all')
            .pipe(catchError((error) => of(undefined)))
        );
      }

      forkJoin(requests).subscribe(([res1, res2]) => {
        if (res1) {
          requestErrors.push(CREATE_PAGE_LABELS.CREATE_VIN_LABEL_ERROR);
        }
        if (res2) {
          requestErrors.push(CREATE_PAGE_LABELS.CREATE_VRM_LABEL_ERROR);
        }
        if (!res1 && !res2) {
          const vehicleTechRecord = {} as VehicleTechRecordModel;
          vehicleTechRecord.vin = payload.vin;
          vehicleTechRecord.vrms = [{ vrm: payload.vrm, isPrimary: true }] as VrmModel[];
          vehicleTechRecord.techRecord = [
            { statusCode: 'provisional', vehicleType: payload.vType } as TechRecord
          ];

          // this._store.dispatch(new SetSelectedVehicleTechnicalRecordSucess(vehicleTechRecord));
          // this.router.navigate(['/technical-record/create']);
        }
        requests = [];
        if (requestErrors.length > 0) {
          this._store.dispatch(new SetErrorMessage(requestErrors));
        }
      });

      return of(payload);
    })
  );

  @Effect()
  updateTechnicalRecords$ = this._actions$.pipe(
    ofType<UpdateVehicleTechRecord>(EVehicleTechRecordModelActions.UpdateVehicleTechRecord),
    withLatestFrom(this._store.pipe(select(getSelectedVehicleTechRecord))),
    switchMap(
      ([{ techRecord }, vehicleTechRecord]: [
        { techRecord: TechRecord },
        VehicleTechRecordModel
      ]) => {
        const dataToSave: VehicleTechRecordUpdate = {} as VehicleTechRecordUpdate;
        dataToSave.msUserDetails = { ...this.loggedUser.getUser() };
        dataToSave.techRecord = [techRecord];
        dataToSave.systemNumber = vehicleTechRecord.systemNumber;

        return this._technicalRecordService
          .updateTechnicalRecords(dataToSave, vehicleTechRecord.vin)
          .pipe(
            switchMap((updatedVehicleTechRecord: VehicleTechRecordModel) => {
              updatedVehicleTechRecord.metadata = vehicleTechRecord.metadata;
              return [
                new UpdateVehicleTechRecordSuccess(updatedVehicleTechRecord),
                new SetSelectedVehicleTechnicalRecordSucess(updatedVehicleTechRecord),
                new SetViewState(VIEW_STATE.VIEW_ONLY)
              ];
            }),
            catchError(({ error }) => {
              const errorMessages = error.errors;
              return [new SetErrorMessage(errorMessages)];
            })
          );
      }
    )
  );

  constructor(
    private _actions$: Actions,
    private _store: Store<IVehicleTechRecordModelState>,
    private router: Router,
    private _technicalRecordService: TechnicalRecordService,
    private loggedUser: UserService
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
