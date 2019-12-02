import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  GetVehicleTechRecordModelHavingStatusAllFailure
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { TechnicalRecordService } from '@app/components/technical-record/technical-record.service';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { CreatePermittedDangerousGoodElementAction } from '../actions/adrDetailsForm.actions';

@Injectable()
export class VehicleTechRecordModelEffects {
  @Effect()
  getTechnicalRecords$ = this._actions$.pipe(
    ofType<GetVehicleTechRecordModelHavingStatusAll>(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._technicalRecordService.getTechnicalRecordsAllStatuses(searchIdentifier).pipe(
      switchMap((techRecordJson: any) => of(new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordJson))),
      tap((_) => {
        _.payload.metadata.adrDetails.permittedDangerousGoodsFe.forEach(good => {
          console.log(`dispatching create element for good => ${JSON.stringify(good)}`);
          this._store.dispatch(new CreatePermittedDangerousGoodElementAction(good, false));
        });
        this._store.dispatch(new GetVehicleTestResultModel(_.payload.vin));
        this.router.navigate([`/technical-record`]);
      }),
      catchError((error) => 
        of(new GetVehicleTechRecordModelHavingStatusAllFailure(error))
      ))));

  constructor(
    private _technicalRecordService: TechnicalRecordService,
    private _actions$: Actions,
    private _store: Store<IAppState>,
    private router: Router
  ) {
  }
}
