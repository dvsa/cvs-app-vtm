import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { TechnicalRecordService } from '@app/components/technical-record/technical-record.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';

@Injectable()
export class VehicleTechRecordModelEffects {
  @Effect()
  getTechnicalRecords$ = this._actions$.pipe(
    ofType<GetVehicleTechRecordModelHavingStatusAll>(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._technicalRecordService.getTechnicalRecordsAllStatuses(searchIdentifier)),
    switchMap((techRecordJson: any) => of(new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordJson))),
    tap((_) =>  {
      this._store.dispatch(new GetVehicleTestResultModel(_.payload.vin));
      this.router.navigate([`/technical-record`]);
    }));

  constructor(
    private _technicalRecordService: TechnicalRecordService,
    private _actions$: Actions,
    private _store: Store<IAppState>,
    private router: Router
  ) {
  }
}
