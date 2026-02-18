import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Store } from '@ngrx/store';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
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
	defectMediaService = inject(DefectMediaService, { optional: true });

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

	async downloadMedia() {
		const testResultId = this.testResult()?.testResultId;
		if (!testResultId || !this.defectMediaService) {
			return;
		}

		const url = await lastValueFrom(this.defectMediaService.getPresignedUrlValue(testResultId));
		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
		const zip = new JSZip();
		await zip.loadAsync(blob);
		const media = this.defect.media;
		const newZip = new JSZip();
		if (media) {
			for (const mediaObject of media) {
				const file = zip.files[mediaObject.path];
				if (file) {
					const fileData = await file.async('blob');
					newZip.file(mediaObject.path, fileData);
				}
			}
		}
		const base64 = await newZip.generateAsync({ type: 'base64' });

		this.documentsService.openDocumentFromResponse(
			`${this.defect.imNumber}-${this.defect.imDescription}`,
			`data:application/zip;base64, ${base64}`,
			'zip'
		);
	}
}
