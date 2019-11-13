import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  GetVehicleTechRecordModelHavingStatusAllDropDowns,
  GetVehicleTechRecordModelHavingStatusAllDropDownsSuccess
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/app.state';
import {TechnicalRecordService} from '@app/components/technical-record/technical-record.service';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class VehicleTechRecordModelEffects {
  @Effect()
  getTechnicalRecords$ = this._actions$.pipe(
    ofType<GetVehicleTechRecordModelHavingStatusAll>(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._technicalRecordService.getTechnicalRecordsAllStatuses(searchIdentifier)),
    switchMap( (techRecordJson: any) => of( new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordJson)))
  );

  @Effect()
  getTechnicalRecordsDropDowns$ = this._actions$.pipe(
    ofType<GetVehicleTechRecordModelHavingStatusAllDropDowns>(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllDropDowns),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._technicalRecordService.getTechnicalRecordsAllStatusesDropDowns(searchIdentifier)),
    switchMap( (techRecordJson: any) => of( new GetVehicleTechRecordModelHavingStatusAllDropDownsSuccess(techRecordJson)))
  );

  constructor(
    private _technicalRecordService: TechnicalRecordService,
    private _actions$: Actions,
    private _store: Store<IAppState>
  ) {
  }
}
