import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, tap, withLatestFrom, map } from 'rxjs/operators';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { FileSaverService } from 'ngx-filesaver';
import { Store } from '@ngrx/store';
import { DownloadDocumentFileAction, DownloadDocumentFileActionSuccess, DownloadDocumentFileActionFailure } from './adrDetails.actions';
import { IVehicleTechRecordModelState } from '@app/store/state/VehicleTechRecordModel.state';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { IAppState } from '@app/store/state/app.state';


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
                    this.saveFile(_.payload);
                    this._FileSaverService.save(_.payload.blob, _.payload.fileName);
                }),
                catchError((error) =>
                    of(new DownloadDocumentFileActionFailure(error))
                ))));

    constructor(
        private _actions$: Actions,
        private _technicalRecordService: TechnicalRecordService,
        private _store$: Store<IAppState>,
        private _FileSaverService: FileSaverService) { }

    private saveFile(payload) {
        payload.blob.text().then( text => {
            console.log(text);
            // const fileType = this._FileSaverService.genType(payload.fileName);
            // const txtBlob = new Blob([btoa(text.replace(/^data:.+;base64,/, '')] , { type: fileType });
            this._FileSaverService.save(text.replace(/^data:.+;base64,/, ''), payload.fileName);
        })
    }

    private textBlob:string;
}
