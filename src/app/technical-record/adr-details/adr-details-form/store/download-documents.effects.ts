import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, tap, withLatestFrom, map } from 'rxjs/operators';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { FileSaverService } from 'ngx-filesaver';
import { Store } from '@ngrx/store';
import { DownloadDocumentFileAction, DownloadDocumentFileActionSuccess, DownloadDocumentFileActionFailure } from './adrDetails.actions';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { IAppState } from '@app/store/state/app.state';
import { SetErrorMessage, ClearErrorMessage } from '@app/store/actions/Error.actions';


@Injectable()
export class DownloadDocumentsEffects {
  @Effect()
  downloadDocuments$ = this._actions$.pipe(
    ofType<DownloadDocumentFileAction>(DownloadDocumentFileAction.TYPE),
    withLatestFrom(this._store$.select(selectVehicleTechRecordModelHavingStatusAll)
      .pipe(
        map(s => s[0].vin)
      )),
    switchMap(([action, vin]) => this._technicalRecordService.getDocumentBlob(vin, action.filename)
      .pipe(
        switchMap((response: { buffer: ArrayBuffer, contentType: string, fileName?: string }) => {
          this._store$.dispatch(new ClearErrorMessage())
          const fileblob = new Blob([response.buffer], { type: response.contentType });
          this._FileSaverService.save(fileblob, response.fileName);
          return of(new DownloadDocumentFileActionSuccess({ blob: fileblob, fileName: response.fileName }));
        }),
        catchError((error) => {
          this._store$.dispatch(new SetErrorMessage([error.error]));
          return of(new DownloadDocumentFileActionFailure(error))
        }
        ))));

  constructor(
    private _actions$: Actions,
    private _technicalRecordService: TechnicalRecordService,
    private _store$: Store<IAppState>,
    private _FileSaverService: FileSaverService) { }
}
