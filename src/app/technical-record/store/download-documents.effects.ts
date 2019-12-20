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
                    // this._FileSaverService.save(_.payload.blob, _.payload.fileName);
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
        payload.blob.text().then(downloadURL => {
            // console.log(`base64 => below`);
            console.log(downloadURL);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = payload.fileName;
            link.click();
            // const fileType = this._FileSaverService.genType(payload.fileName);
            // const b64Data = text.split(';base64,').pop();
            // console.log(`b64Data base64 => below`);
            // console.log(b64Data);
            // const byteCharacters = atob(b64Data);
            // const byteNumbers = new Array(byteCharacters.length);
            // for (let i = 0; i < byteCharacters.length; i++) {
            //     byteNumbers[i] = byteCharacters.charCodeAt(i);
            // }
            // const byteArray = new Uint8Array(byteNumbers);
            // const blob = new Blob([byteArray], { type: fileType });
            // const blob = this.b64toBlob(b64Data, undefined);
            // this._FileSaverService.save(blob, payload.fileName);
        })
    }

    private b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

}
