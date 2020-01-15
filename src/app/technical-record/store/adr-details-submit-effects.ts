import { Injectable } from '@angular/core';
import { Actions, Effect, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { tap, exhaustMap, switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectVehicleTechRecordModelHavingStatusAll } from '../../store/selectors/VehicleTechRecordModel.selectors';
import { SubmitAdrAction, SubmitAdrActionFailure, SubmitAdrActionSuccess } from './adrDetailsSubmit.actions';
import { GetVehicleTechRecordModelHavingStatusAllSuccess } from '@app/store/actions/VehicleTechRecordModel.actions';
import { GetVehicleTestResultModel } from '@app/store/actions/VehicleTestResultModel.actions';
import { IAppState } from '@app/store/state/app.state';
import { SetValueAction, ResetAction } from 'ngrx-forms';
import { INITIAL_STATE } from '@app/adr-details-form/store/adrDetailsForm.state';

@Injectable()
export class AdrDetailsSubmitEffects implements OnRunEffects {
  @Effect()
  adrSubmit$ = this._actions$.pipe(
    ofType<SubmitAdrAction>(SubmitAdrAction.TYPE),
    withLatestFrom(this._store$.select(selectVehicleTechRecordModelHavingStatusAll)
      .pipe(
        map(s => s.vin)
      )),
    switchMap(([action, vin]) => {
      return this._technicalRecordService.uploadDocuments()
        .pipe(
          switchMap((searchIdentifier: string) => this._technicalRecordService.getTechnicalRecordsAllStatuses(vin)
            .pipe(
              switchMap((techRecordJson: any) => of(new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordJson))),
              tap((vin: string) => {
                this._store$.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
                this._store$.dispatch(new ResetAction(INITIAL_STATE.id));
                this._store$.dispatch(new SubmitAdrActionSuccess({}));
                this._store$.dispatch(new GetVehicleTestResultModel(vin));
                this._router$.navigate([`/technical-record`]);
              })
            )),
          catchError((error) =>
            of(new SubmitAdrActionFailure(error))
          ))
    }));

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this._actions$.pipe(
      exhaustMap((res) => {
        return resolvedEffects$;
      })
    );
  }

  constructor(
    private _actions$: Actions,
    private _technicalRecordService: TechnicalRecordService,
    private _store$: Store<IAppState>,
    private _router$: Router
  ) {}
}
