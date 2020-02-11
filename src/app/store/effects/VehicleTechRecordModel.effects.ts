import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  GetVehicleTechRecordModelHavingStatusAllFailure, SetVehicleTechRecordModelVinOnCreate
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {Action, Store} from '@ngrx/store';
import {map, switchMap, tap, catchError, mergeMap} from 'rxjs/operators';
import {forkJoin, Observable, of} from 'rxjs';
import { Router } from '@angular/router';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';

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
        this.router.navigate([`/technical-record`]);
      }),
      catchError((error) =>
        of(new GetVehicleTechRecordModelHavingStatusAllFailure(error))
      ))));

  @Effect()
  setVinOnCreate$: Observable<Action> = this._actions$.pipe(
    ofType<SetVehicleTechRecordModelVinOnCreate>(EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate),
    map(action => action.payload),
    mergeMap(payload => {
      const requests: Observable<any>[] = [];

      if (payload.vType === 'PSV' || payload.vType === 'HGV') {
        requests.push(
          this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vin).
          pipe(catchError( error => of(undefined)))
        );
        requests.push(
          this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vrm).
          pipe(catchError( error => of(undefined)))
        );

        forkJoin(requests).subscribe(result => {
          if ( result[0] === undefined && result[1] === undefined) {
            this.router.navigate([`/technical-record`]);
          }
          requests.length = 0;
        });
      } else if (payload.vType === 'Trailer') {
        this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vin).subscribe(
          result => false,
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
}
