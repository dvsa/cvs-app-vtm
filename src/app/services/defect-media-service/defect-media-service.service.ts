import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectDetailsSchema, MediaSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { environment } from '@environments/environment';
import { RootRoutes } from '@models/routes.enum';
import { DocumentsService } from '@services/documents/documents.service';
import dayjs from 'dayjs';
import JSZip from 'jszip';
import { isEqual } from 'lodash';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class DefectMediaService {
	http = inject(HttpClient);
	images: Record<string, string> = {};
	documentsService = inject(DocumentsService);
	globalErrorService = inject(GlobalErrorService);
	router = inject(Router);

	getHeaders(): HttpHeaders {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/zip');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);
		return headers;
	}

	getParams(): HttpParams {
		let localParams = new HttpParams();
		this.params.forEach((value, key) => (localParams = localParams.set(key, value)));
		return localParams;
	}

	async getDefectZip(testResultId: string) {
		// get presigned url
		const url = await lastValueFrom(this.getPresignedUrlValue(testResultId));

		// get zip file for test result id
		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));

		// load response into zip file
		const zip = new JSZip();

		await zip.loadAsync(blob, { base64: true });

		return zip;
	}

	getPresignedUrlValue(testResultId: string): Observable<string> {
		return this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval/${testResultId}`, {
			params: this.getParams(),
			headers: this.getHeaders(),
			responseType: 'text',
		});
	}

	getImage(media: MediaSchema) {
		return this.images[media.path];
	}

	hasCachedImages(defect: DefectDetailsSchema) {
		const defectMedia = defect.media;
		if (!defectMedia || defectMedia.length === 0) {
			return false;
		}

		if (!isEqual(this.images, {})) {
			const images = defectMedia.filter((media) => media.type !== 'failReason' && !!media.path);
			for (const image of images) {
				if (this.images[image.path]) {
					return true;
				}
			}
		}
		return false;
	}

	hasRententionPeriodExpired(testResult?: TestResultSchema): boolean {
		if (!testResult) return false;

		const now = new Date();
		const testType = testResult.testTypes[0];
		const daysSinceTest = dayjs(now).diff(testType.testTypeEndTimestamp, 'months');
		return daysSinceTest >= 15;
	}

	hasCachedTestResultImages(testResult: TestResultSchema) {
		const testType = testResult.testTypes[0];
		if (!testType) {
			return;
		}

		const defectsWithImages = testType.defects.filter((defect) => this.hasImages(defect));
		if (defectsWithImages.length === 0) {
			return true;
		}

		let isTestResultCached = true;
		for (const defect of defectsWithImages) {
			if (!this.hasCachedImages(defect)) {
				isTestResultCached = false;
			}
		}
		return isTestResultCached;
	}

	async loadImages(testResult: TestResultSchema) {
		try {
			const testType = testResult.testTypes[0];
			const testResultId = testResult.testResultId;

			if (this.hasCachedTestResultImages(testResult) || !testType) {
				return;
			}

			const defectsWithImages = testType.defects.filter((defect) => this.hasImages(defect));
			if (defectsWithImages.length === 0) {
				return;
			}

			const zip = await this.getDefectZip(testResultId);

			for (const defect of defectsWithImages) {
				const defectMedia = defect.media;
				if (!defectMedia) {
					return;
				}
				for (const image of defectMedia) {
					const file = zip.files[image.path];
					if (file) {
						this.images[image.path] = await file.async('base64');
					}
				}
			}
		} catch (error) {
			console.log(error);
			this.handleError(error);
		}
	}

	async openDocumentFromZip(zip: JSZip, fileName: string) {
		const blob = await zip.generateAsync({ type: 'blob' });
		const link = this.documentsService.createFileLink(fileName, blob, 'zip');
		this.documentsService.simulateClick(link);
	}

	get params(): Map<string, string> {
		return new Map([['category', 'defects']]);
	}

	getImages(): Record<string, string> {
		return this.images;
	}

	formatMediaFailureReason(reason?: string): string {
		if (!reason) {
			return 'Reason for failure to capture media not available';
		}

		const cleanedReason = reason.trim().replace(/\.$/, '');
		if (cleanedReason.toLowerCase() === 'failed to upload') {
			return 'Media failed to upload';
		}

		return reason;
	}

	hasImages(defect: DefectDetailsSchema): boolean {
		if (!defect.media) return false;
		return defect.media.some((media) => media.type !== 'failReason' && !!media.path);
	}

	handleError(error: unknown) {
		if (error instanceof HttpErrorResponse) {
			switch (error.status) {
				case HttpStatusCode.NotFound:
					this.globalErrorService.setErrors([
						{
							error:
								'Media could not be found. <br>Try again later or contact the service desk if this issue keeps happening.',
							anchorLink: '',
						},
					]);
					break;
				case HttpStatusCode.InternalServerError:
					this.router.navigate([RootRoutes.ERROR]);
					break;
				default:
					// for sentry reporting
					console.error(error);
					break;
			}
		}
	}
}
