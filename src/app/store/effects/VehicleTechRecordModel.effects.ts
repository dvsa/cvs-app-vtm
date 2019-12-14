import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  GetVehicleTechRecordModelHavingStatusAllFailure
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/app.state';
import {map, switchMap, tap, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {GetVehicleTestResultModel} from '../actions/VehicleTestResultModel.actions';
import {CreatePermittedDangerousGoodElementAction} from '../actions/adrDetailsForm.actions';
import {TechnicalRecordService} from '@app/technical-record-search/technical-record.service';

@Injectable()
export class VehicleTechRecordModelEffects {

  @Effect()
  getTechnicalRecords$ = this._actions$.pipe(
    ofType<GetVehicleTechRecordModelHavingStatusAll>(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => {
      return this._technicalRecordService.getTechnicalRecordsAllStatuses(searchIdentifier);
    }),
    map(techRecordResponse => {
      return new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordResponse)
    }),
    catchError((error) => {
      return of(new GetVehicleTechRecordModelHavingStatusAllFailure(error));
    })
  );

  @Effect({dispatch : false})
  getTechnicalRecordsStatusSuccess$ = this._actions$.pipe(
    ofType(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess),
    map((action: GetVehicleTechRecordModelHavingStatusAllSuccess) => {
      action.payload.metadata.adrDetails.permittedDangerousGoodsFe.forEach(good => {
        this._store.dispatch(new CreatePermittedDangerousGoodElementAction(good, false));
      });
      this._store.dispatch(new GetVehicleTestResultModel(action.payload.vin));
      this.router.navigate([`/technical-record`]);
    })
  );

  constructor(
    private _technicalRecordService: TechnicalRecordService,
    private _actions$: Actions,
    private _store: Store<IAppState>,
    private router: Router
  ) {
  }
}
