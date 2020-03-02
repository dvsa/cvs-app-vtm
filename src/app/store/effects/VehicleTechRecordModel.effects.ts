import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  GetVehicleTechRecordModelHavingStatusAllFailure, SetVehicleTechRecordModelVinOnCreate, SetVehicleTechRecordModelVinOnCreateSucess

} from '@app/store/actions/VehicleTechRecordModel.actions';
import { Store } from '@ngrx/store';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';
import { SetErrorMessage, ClearErrorMessage } from '../actions/Error.actions';
import { VEHICLE_TECH_RECORD_SEARCH_ERRORS } from '@app/app.enums';
@Injectable()
export class VehicleTechRecordModelEffects {
  @Effect()
  getTechnicalRecords$ = this._actions$.pipe(
    ofType<GetVehicleTechRecordModelHavingStatusAll>(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._technicalRecordService.getTechnicalRecordsAllStatuses(searchIdentifier).pipe(
      switchMap((techRecordJson: any) => of(new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordJson))),
      tap((_) => {
        this._store.dispatch(new GetVehicleTestResultModel(_.payload.vin));
        this._store.dispatch(new ClearErrorMessage());
        this.router.navigate([`/technical-record`]);
      }),
      catchError((error) => {
        let errorMessage: string;
        errorMessage = this.getSearchResultError(error, errorMessage);

        this._store.dispatch(new SetErrorMessage([errorMessage]));
        return of(new GetVehicleTechRecordModelHavingStatusAllFailure(error))
      }
      ))));

  @Effect({ dispatch: false })
  setVinOnCreate$ = this._actions$.pipe(
    ofType<SetVehicleTechRecordModelVinOnCreate>(EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate),
    map(action => action.payload),
    switchMap(payload => {
      const requests: Observable<any>[] = [];
      const requestErrors = [];

      if (payload.vType === 'PSV' || payload.vType === 'HGV') {
        requests.push(
          this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vin).
            pipe(catchError(error => of(undefined)))
        );
        requests.push(
          this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vrm).
            pipe(catchError(error => of(undefined)))
        );

        forkJoin(requests).subscribe(result => {
          if (result[0] !== undefined) {
            requestErrors.push('A technical record with this VIN already exists, check the VIN or change the existing technical record');
          }
          if (result[1] !== undefined) {
            requestErrors.push('A technical record with this VRM already exists, check the VRM or change the existing technical record');
          }
          if (result[0] === undefined && result[1] === undefined) {
            this.router.navigate([`/technical-record`]);
          }
          requests.length = 0;
          this._store.dispatch(new SetVehicleTechRecordModelVinOnCreateSucess({ vin: payload.vin, vrm: payload.vrm, vType: payload.vType, error: requestErrors }));
        });

      } else if (payload.vType === 'Trailer') {
        this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vin).subscribe(
          result => {
            requestErrors.push('A technical record with this VIN already exists, check the VIN or change the existing technical record');
            this._store.dispatch(new SetVehicleTechRecordModelVinOnCreateSucess({ vin: payload.vin, vrm: payload.vrm, vType: payload.vType, error: requestErrors }));
          },
          error => {
            this.router.navigate([`/technical-record`]);
          }
        );
      }

      return of(payload);

    })
  );

  constructor(
    private _technicalRecordService: TechnicalRecordService,
    private _actions$: Actions,
    private _store: Store<IVehicleTechRecordModelState>,
    private router: Router
  ) {
  }

  private getSearchResultError(error: any, errorMessage: string) {
    switch (true) {
      case error.error === "No resources match the search criteria.":
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.NOT_FOUND;
        break;
      case error.error === 'The provided partial VIN returned more than one match.':
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.MULTIPLE_FOUND;
        break;
      case error.error.error !== undefined:
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.NO_INPUT;
        break;
      default: errorMessage = error.error;
    }
    return errorMessage;
  }
}
