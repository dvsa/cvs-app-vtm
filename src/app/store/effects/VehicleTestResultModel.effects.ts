import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';
import {TestResultService} from '@app/technical-record-search/test-result.service';

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
    private _actions$: Actions  ) {
  }
}
