import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/app.state';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {TestResultService} from '@app/components/technical-record/test-result.service';
import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';

@Injectable()
export class VehicleTestResultModelEffects {
  @Effect()
  getTestResults$ = this._actions$.pipe(
    ofType<GetVehicleTestResultModel>(EVehicleTestResultModelActions.GetVehicleTestResultModel),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._testResultService.getTestResults(searchIdentifier)),
    switchMap( (testResultJson: any) => of( new GetVehicleTestResultModelSuccess(testResultJson)))
  );

  constructor(
    private _testResultService: TestResultService,
    private _actions$: Actions,
    private _store: Store<IAppState>
  ) {
  }
}
