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
import { FeatureToggleService } from '../feature-toggle-service/feature-toggle-service';

@Injectable()
export class DefectMediaService {
	http = inject(HttpClient);
	images: Record<string, string> = {};
	documentsService = inject(DocumentsService);
	globalErrorService = inject(GlobalErrorService);
	featureToggleService = inject(FeatureToggleService);
	router = inject(Router);

	//
	//
	// NEW SERVICE METHODS
	//
	//

	zipCache: Record<string, JSZip> = {};
	fileCache: Record<string, string> = {};

	hasMedia(defect: DefectDetailsSchema): boolean {
		if (!Array.isArray(defect.media) || defect.media.length === 0) return false;
		return defect.media.some((media) => media.type !== 'failReason');
	}

	canDownloadAdasMediaItems(defect: DefectDetailsSchema): boolean {
		if (!this.featureToggleService.isFeatureEnabled('media-capture-adas')) return false;

		return defect.imNumber === 29 && this.hasMedia(defect);
	}

	canDownloadAdasMedia(testResult: TestResultSchema): boolean {
		if (!this.featureToggleService.isFeatureEnabled('media-capture-adas')) return false;

		const defects = testResult.testTypes[0].defects;
		if (!Array.isArray(defects) || defects.length === 0) return false;

		return defects.some((defect) => this.canDownloadAdasMediaItems(defect));
	}

	canDownloadDefectMediaItems(defect: DefectDetailsSchema): boolean {
		return defect.deficiencyCategory === 'dangerous' && this.hasMedia(defect);
	}

	canDownloadDefectMedia(testResult: TestResultSchema): boolean {
		const defects = testResult.testTypes[0].defects;
		if (!Array.isArray(defects) || defects.length === 0) return false;

		return defects.some((defect) => this.canDownloadDefectMediaItems(defect));
	}

	canDownloadMediaItems(defect: DefectDetailsSchema): boolean {
		return this.canDownloadAdasMediaItems(defect) || this.canDownloadDefectMediaItems(defect);
	}

	canDownloadMedia(testResult: TestResultSchema): boolean {
		if (this.hasRententionPeriodExpired(testResult)) return false;
		return this.canDownloadAdasMedia(testResult) || this.canDownloadDefectMedia(testResult);
	}

	zipContainsMediaItems(zip: JSZip, defect: DefectDetailsSchema): boolean {
		if (!Array.isArray(defect.media) || defect.media.length === 0) return false;
		return defect.media.some((media) => zip.files[media.path]);
	}

	mediaItemsExistInCache(id: string, defect: DefectDetailsSchema): boolean {
		if (this.canDownloadAdasMediaItems(defect)) {
			return this.zipContainsMediaItems(this.zipCache[this.getZipCacheKey(id, { category: 'adas' })], defect);
		}

		if (this.canDownloadDefectMediaItems(defect)) {
			return this.zipContainsMediaItems(this.zipCache[this.getZipCacheKey(id, { category: 'defects' })], defect);
		}

		return false;
	}

	getZipCacheKey(id: string, options: GetDocumentOptions): string {
		return `${id}-${options.category}`;
	}

	async getPresignedUrl(id: string, options: GetDocumentOptions): Promise<string> {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/zip');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);

		let params = new HttpParams();
		params = params.set('category', options.category);

		const request = this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval/${id}`, {
			params: this.getParams(),
			headers,
			responseType: 'text',
		});

		return await lastValueFrom(request);
	}

	async getBlob(id: string, options: GetDocumentOptions): Promise<Blob> {
		const url = await this.getPresignedUrl(id, options);
		return await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
	}

	async getZip(id: string, options: GetDocumentOptions): Promise<JSZip> {
		const cacheKey = this.getZipCacheKey(id, options);
		const cachedZip = this.zipCache[cacheKey];
		if (cachedZip) return cachedZip;

		const blob = await this.getBlob(id, options);
		const zip = await new JSZip().loadAsync(blob, { base64: true });
		this.zipCache[cacheKey] = zip;

		return zip;
	}

	async getAdasZip(testResultId: string): Promise<JSZip | null> {
		if (!this.featureToggleService.isFeatureEnabled('media-capture-adas')) return null;

		return await this.getZip(testResultId, { category: 'adas' });
	}

	async getDefectZip(testResultId: string): Promise<JSZip> {
		return await this.getZip(testResultId, { category: 'defects' });
	}

	async loadMediaItemAsBase64(
		testResult: TestResultSchema,
		defect: DefectDetailsSchema,
		item: MediaSchema
	): Promise<string> {
		// If media item has already been loaded into the file cache, return it
		const cachedFile = this.fileCache[item.path];
		if (cachedFile) return cachedFile;

		// Otherwise, get the cached zip, and load the file into the cache
		let zip: JSZip | null = null;

		if (this.canDownloadAdasMediaItems(defect)) {
			zip = await this.getAdasZip(testResult.testResultId);
		}

		if (this.canDownloadDefectMediaItems(defect)) {
			zip = await this.getDefectZip(testResult.testResultId);
		}

		// If the zip doesn't exist, return an empty string as a fallback
		if (!zip) return '';

		// The file doesn't exist in the zip, so return an empty string as a fallback
		const file = zip.file(item.path);
		if (!file) return '';

		const blob = await file.async('blob');
		const src = URL.createObjectURL(blob);
		this.fileCache[item.path] = src;

		return src;
	}

	async downloadMedia(testResult: TestResultSchema) {
		try {
			const defectsZip = await this.getDefectZip(testResult.testResultId);
			await this.openDocumentFromZip(defectsZip, `${testResult.testResultId}`);

			const adasZip = await this.getAdasZip(testResult.testResultId);
			if (adasZip) {
				await this.openDocumentFromZip(adasZip, `${testResult.testResultId}`);
			}
		} catch (error) {
			this.handleError(error);
		}
	}

	private async _downloadMediaItems(testResult: TestResultSchema, defect: DefectDetailsSchema, items: MediaSchema[]) {
		try {
			let sourceZip = new JSZip();
			const targetZip = new JSZip();

			if (this.canDownloadDefectMediaItems(defect)) {
				sourceZip = await this.getDefectZip(testResult.testResultId);
			}

			if (this.canDownloadAdasMediaItems(defect)) {
				const zip = await this.getAdasZip(testResult.testResultId);
				if (zip) sourceZip = zip;
			}

			for (const item of items) {
				const file = sourceZip.file(item.path);
				if (!file) continue;

				const content = await file.async('uint8array');
				targetZip.file(item.path, content);
			}

			await this.openDocumentFromZip(targetZip, `${defect.imNumber}-${defect.imDescription}`);
		} catch (error) {
			this.handleError(error);
		}
	}

	async downloadMediaItem(testResult: TestResultSchema, defect: DefectDetailsSchema, item: MediaSchema) {
		if (!Array.isArray(defect.media) || defect.media.length === 0) return;

		const downloadableMedia = defect.media.filter((media) => media.path === item.path);
		return await this._downloadMediaItems(testResult, defect, downloadableMedia);
	}

	async downloadMediaItems(testResult: TestResultSchema, defect: DefectDetailsSchema) {
		if (!Array.isArray(defect.media) || defect.media.length === 0) return;

		const downloadableMedia = defect.media.filter((media) => media.type !== 'failReason');
		return await this._downloadMediaItems(testResult, defect, downloadableMedia);
	}

	//
	//
	// OLD SERVICE METHODS
	//
	//

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

	hasRententionPeriodExpired(testResult: TestResultSchema): boolean {
		return dayjs().diff(testResult.testTypes[0].testTypeEndTimestamp, 'months') >= 15;
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

export interface GetDocumentOptions {
	category: 'defects' | 'adas';
}

export interface DownloadMediaOptions {
	paths?: string[];
}
