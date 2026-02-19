import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Store } from '@ngrx/store';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
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
	globalErrorService = inject(GlobalErrorService);
	http: HttpClient = inject(HttpClient);
	defectMediaService = inject(DefectMediaService, { optional: true });

	testResult = this.store.selectSignal(selectedTestResultState) as Signal<TestResultSchema | undefined>;
	@Input() defect!: DefectDetailsSchema;

	ngOnDestroy(): void {
		this.globalErrorService.clearErrors();
	}

	canDownloadMedia(): boolean {
		if (!this.defect.media) return false;
		return this.defect.media.some((media) => media.type !== 'failReason');
	}

	async downloadMedia() {
		if (!this.defectMediaService) {
			return;
		}
		if (this.defectMediaService.hasCachedImages(this.defect)) {
			console.log('loading from cache');
			await this.downloadMediaFromCache();
		} else {
			console.log('loading from http');
			await this.downloadMediaFromHttp();
		}
	}

	async downloadMediaFromCache(): Promise<void> {
		const images = this.defectMediaService?.getImages();
		if (!this.defectMediaService || !images) {
			return;
		}
		// check media exists
		const media = this.defect.media;
		if (media && this.canDownloadMedia()) {
			// create new zip file
			const newZip = new JSZip();
			for (const mediaObject of media) {
				// grab image file from cache
				const file = images[mediaObject.path];
				if (file) {
					// add image to new zip file
					newZip.file(mediaObject.path, file);
				}
			}
			// download zip
			await this.defectMediaService.openDocumentFromZip(newZip, `${this.defect.imNumber}-${this.defect.imDescription}`);
		}
	}

	async downloadMediaFromHttp() {
		const testResultId = this.testResult()?.testResultId;
		if (!this.defectMediaService || !testResultId) {
			return;
		}

		// get pre signed url
		const url = await lastValueFrom(this.defectMediaService.getPresignedUrlValue(testResultId));

		// get media for testresultid
		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));

		// check media exists
		const media = this.defect.media;
		if (media && this.canDownloadMedia()) {
			// load media into zip file
			const zip = new JSZip();
			await zip.loadAsync(blob);

			// create zip to hold defect specific images
			const newZip = new JSZip();

			// loop through media
			for (const mediaObject of media) {
				const file = zip.files[mediaObject.path];
				if (file) {
					// if file exists add to zip file and add image to cache
					const fileData = await file.async('blob');
					this.defectMediaService.images[mediaObject.path] = await file.async('base64');
					newZip.file(mediaObject.path, fileData);
				}
			}
			// download zip
			await this.defectMediaService.openDocumentFromZip(newZip, `${this.defect.imNumber}-${this.defect.imDescription}`);
		}
	}
}
