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
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { resolveReflectiveProviders } from '@angular/core/src/di/reflective_provider';


@Injectable()
export class DownloadDocumentsEffects {
    @Effect()
    downloadDocuments$ = this._actions$.pipe(
        ofType<DownloadDocumentFileAction>(DownloadDocumentFileAction.TYPE),
        withLatestFrom(this._store$.select(selectVehicleTechRecordModelHavingStatusAll)
            .pipe(
                map(s => s.vin),
                tap(_ => {
                    console.log(`DownloadDocumentsEffects withLatestFrom _ => ${JSON.stringify(_)}`);
                })
            )),
        switchMap(([action, vin]) => this._technicalRecordService.getDocumentBlob(vin, action.filename)
            .pipe(
                switchMap((response: { buffer: ArrayBuffer, fileName?: string }) => {
                                console.log(`getDocumentBlob response => ${JSON.stringify(response.buffer)}`);
                                const fileblob = new Blob([response.buffer], {type: 'application/octet-stream'});
                                this._FileSaverService.save(fileblob, response.fileName);
                                return of(new DownloadDocumentFileActionSuccess({blob: fileblob , fileName: response.fileName}));

                }),
                tap((_) => {
                    console.log(`DownloadDocumentFileActionSuccess _.payload.blob => ${JSON.stringify(_.payload.blob)}`);
                }),
                catchError((error) =>
                    of(new DownloadDocumentFileActionFailure(error))
                ))));

    constructor(
        private _actions$: Actions,
        private _technicalRecordService: TechnicalRecordService,
        private _store$: Store<IAppState>,
        private httpClient: HttpClient,
        private _FileSaverService: FileSaverService) { }

    private saveFile(payload) {
        payload.blob.text().then(downloadURL => {
            // console.log(`base64 => below`);
            console.log(downloadURL);
            saveAs(downloadURL, payload.fileName);
            // var link = document.createElement('a');
            // link.href = this.sanitizer.bypassSecurityTrustResourceUrl(downloadURL);
            // link.download = payload.fileName;
            // link.click();
            // this.httpClient.get(`${downloadURL}`, {
            //     observe: 'response',
            //     responseType: 'blob'
            //   }).subscribe(res => {
            //     this._FileSaverService.save(res.body, payload.fileName);
            //   });
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


    private downloadFile(payload) {
        payload.blob.text().then(downloadURL => {
            console.log(`downloadURL => ${downloadURL}`);
            this.httpClient
                .get(downloadURL, {
                    observe: 'response',
                    responseType: 'blob'
                }).pipe(
                    map(res => {
                        return {
                            filename: payload.fileName,
                            data: res.body
                        };
                    }))
                .subscribe(res => {
                    console.log('start download:', res);
                    var url = window.URL.createObjectURL(res.data);
                    var a = document.createElement('a');
                    document.body.appendChild(a);
                    a.setAttribute('style', 'display: none');
                    a.href = url;
                    a.download = res.filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove(); // remove the element
                }, error => {
                    console.log('download error:', JSON.stringify(error));
                }, () => {
                    console.log('Completed file download.')
                });
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
