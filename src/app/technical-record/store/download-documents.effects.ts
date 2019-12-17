import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, tap, withLatestFrom, map } from 'rxjs/operators';
import { DownloadDocumentFileAction, DownloadDocumentFileActionSuccess, DownloadDocumentFileActionFailure } from '@app/store/actions/VehicleTechRecordModel.actions';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { FileSaverService } from 'ngx-filesaver';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';


@Injectable()
export class DownloadDocumentsEffects {
    @Effect()
    downloadDocuments$ = this._actions$.pipe(
        ofType<DownloadDocumentFileAction>(DownloadDocumentFileAction.TYPE),
        withLatestFrom(this._store$.select(selectVehicleTechRecordModelHavingStatusAll)
            .pipe(
                map(s => s.vin),
                tap(_ => {
                    console.log(`withLatestFrom _ => ${JSON.stringify(_)}`);
                })
            )),
        switchMap(([action, vin]) => this._technicalRecordService.downloadDocument(vin, action.filename)
            .pipe(switchMap((payload: any) => of(new DownloadDocumentFileActionSuccess(payload))),
                tap((_) => {
                    console.log(`_.payload.fileName => ${JSON.stringify(_.payload.fileName)}`);
                    console.log(`blob pre "" trim => ${JSON.stringify(_.payload.blob)}`);
                    console.log(`blob post "" trim => ${JSON.stringify(_.payload.blob.replace(/^"(.*)"$/, '$1'))}`);
                    this._FileSaverService.save(_.payload.blob.replace(/^"(.*)"$/, '$1'), _.payload.fileName);
                }),
                catchError((error) =>
                    of(new DownloadDocumentFileActionFailure(error))
                ))));

    constructor(
        private _actions$: Actions,
        private _technicalRecordService: TechnicalRecordService,
        private _store$: Store<IAppState>,
        private _FileSaverService: FileSaverService) { }
}
