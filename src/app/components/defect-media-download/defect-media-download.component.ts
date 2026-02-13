import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { environment } from '@environments/environment';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Store } from '@ngrx/store';
import { DocumentsService } from '@services/documents/documents.service';
import { HttpService } from '@services/http/http.service';
import { selectedTestResultState } from '@store/test-records';
import JSZip from 'jszip';
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'app-defect-media-download',
	templateUrl: './defect-media-download.component.html',
	styleUrls: ['./defect-media-download.component.scss'],
	host: {
		class: 'govuk-table__row',
	},
})
export class DefectMediaDownloadComponent extends CustomFormControlComponent implements OnDestroy {
	store = inject(Store);
	router = inject(Router);
	httpService = inject(HttpService);
	documentsService = inject(DocumentsService);
	globalErrorService = inject(GlobalErrorService);
	http: HttpClient = inject(HttpClient);

	testResult = this.store.selectSignal(selectedTestResultState) as Signal<TestResultSchema | undefined>;
	@Input() defect!: DefectDetailsSchema;

	ngOnDestroy(): void {
		this.globalErrorService.clearErrors();
	}

	get params(): Map<string, string> {
		return new Map([['category', 'defects']]);
	}

	canDownloadMedia(): boolean {
		if (!this.defect.media) return false;
		return this.defect.media.some((media) => media.type !== 'failReason');
	}

	async downloadMedia(test: TestResultSchema) {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/zip');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);
		const fileName = `${test.testResultId}`;

		let localParams = new HttpParams();
		this.params.forEach((value, key) => (localParams = localParams.set(key, value)));

		const url = await lastValueFrom(
			this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval/${fileName}`, {
				params: localParams,
				headers,
				responseType: 'text',
			})
		);

		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
		const zip = new JSZip();
		await zip.loadAsync(blob);
		const media = this.defect.media;
		const newZip = new JSZip();
		if (media) {
			for (const mediaObject of media) {
				const file = zip.files[mediaObject.path];
				if (file) {
					console.log('test');
					console.log(JSON.stringify(newZip));
					newZip.file(mediaObject.path, await file.async('blob'));
					console.log('test 2');
					console.log(JSON.stringify(newZip));
				}
			}
		}

		this.documentsService.openDocumentFromResponse(newZip.name, newZip, 'zip');
	}
}
