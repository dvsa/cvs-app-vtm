import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectDetailsSchema, MediaSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { environment } from '@environments/environment';
import { RootRoutes } from '@models/routes.enum';
import { DocumentsService } from '@services/documents/documents.service';
import { FeatureFlags } from '@services/feature-toggle-service/feature-toggle-service';
import dayjs from 'dayjs';
import JSZip from 'jszip';
import { lastValueFrom } from 'rxjs';
import { FeatureToggleService } from '../feature-toggle-service/feature-toggle-service';

@Injectable()
export class DefectMediaService {
	http = inject(HttpClient);
	images: Record<string, string> = {};
	documentsService = inject(DocumentsService);
	globalErrorService = inject(GlobalErrorService);
	featureToggleService = inject(FeatureToggleService);
	router = inject(Router);

	zipCache: Record<string, JSZip> = {};
	private zipRequests: Record<string, Promise<JSZip>> = {};
	fileCache: Record<string, string> = {};
	mediaFetchErrors = signal<Record<string, { status: number; message: string }>>({});

	hasMedia(defect: DefectDetailsSchema): boolean {
		if (!Array.isArray(defect.media) || defect.media.length === 0) return false;
		return defect.media.some((media) => media.type !== 'failReason');
	}

	hasMediaInCache(defect: DefectDetailsSchema): boolean {
		if (!Array.isArray(defect.media) || defect.media.length === 0) return false;
		return defect.media.some((media) => this.fileCache[media.path]);
	}

	getImages(defect: DefectDetailsSchema) {
		return defect.media?.filter((media) => media.type === 'image') ?? [];
	}

	getVideos(defect: DefectDetailsSchema) {
		return defect.media?.filter((media) => media.type === 'video') ?? [];
	}

	canDownloadAdasMediaItems(defect: DefectDetailsSchema): boolean {
		if (!this.featureToggleService.isFeatureEnabled(FeatureFlags.ADAS_IMAGES_ON_DEFECTS)) return false;

		return defect.imNumber === 29 && this.hasMedia(defect);
	}

	canDownloadAdasMedia(testResult: TestResultSchema): boolean {
		if (!this.featureToggleService.isFeatureEnabled(FeatureFlags.ADAS_IMAGES_ON_DEFECTS)) return false;

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

	getMediaFetchError(testResultId: string): { status: number; message: string } | undefined {
		return this.mediaFetchErrors()[testResultId];
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
			const zip = this.zipCache[this.getZipCacheKey(id, { category: 'adas' })];
			if (!zip) return false;

			return this.zipContainsMediaItems(zip, defect);
		}

		if (this.canDownloadDefectMediaItems(defect)) {
			const zip = this.zipCache[this.getZipCacheKey(id, { category: 'defects' })];
			if (!zip) return false;

			return this.zipContainsMediaItems(zip, defect);
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
			params,
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

		// Several defect components can request the same archive before it reaches the cache.
		if (!this.zipRequests[cacheKey]) {
			this.zipRequests[cacheKey] = this.getBlob(id, options)
				.then((blob) => new JSZip().loadAsync(blob, { base64: true }))
				.then((zip) => {
					this.zipCache[cacheKey] = zip;
					return zip;
				})
				.finally(() => {
					delete this.zipRequests[cacheKey];
				});
		}

		return this.zipRequests[cacheKey];
	}

	async getAdasZip(testResultId: string): Promise<JSZip | null> {
		if (!this.featureToggleService.isFeatureEnabled(FeatureFlags.ADAS_IMAGES_ON_DEFECTS)) return null;

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
		const [adasZip, defectsZip] = await Promise.all([
			this.canDownloadAdasMediaItems(defect) ? this.getAdasZip(testResult.testResultId) : null,
			this.canDownloadDefectMediaItems(defect) ? this.getDefectZip(testResult.testResultId) : null,
		]);
		const zip = defectsZip ?? adasZip;

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
			await Promise.all([
				this.canDownloadDefectMedia(testResult)
					? this.getDefectZip(testResult.testResultId).then((zip) =>
							this.openDocumentFromZip(zip, testResult.testResultId)
						)
					: undefined,
				this.canDownloadAdasMedia(testResult)
					? this.getAdasZip(testResult.testResultId).then((zip) =>
							zip ? this.openDocumentFromZip(zip, testResult.testResultId) : undefined
						)
					: undefined,
			]);
		} catch (error) {
			this.handleError(error, testResult.testResultId);
		}
	}

	private async _downloadMediaItems(testResult: TestResultSchema, defect: DefectDetailsSchema, items: MediaSchema[]) {
		try {
			const targetZip = new JSZip();
			const [defectsZip, adasZip] = await Promise.all([
				this.canDownloadDefectMediaItems(defect) ? this.getDefectZip(testResult.testResultId) : null,
				this.canDownloadAdasMediaItems(defect) ? this.getAdasZip(testResult.testResultId) : null,
			]);
			const sourceZip = adasZip ?? defectsZip ?? new JSZip();

			for (const item of items) {
				const file = sourceZip.file(item.path);
				if (!file) continue;

				// JSZip accepts promises and waits for their content when generating the archive.
				targetZip.file(item.path, file.async('uint8array'));
			}

			await this.openDocumentFromZip(targetZip, `${defect.imNumber}-${defect.imDescription}`);
		} catch (error) {
			this.handleError(error, testResult.testResultId);
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

	hasRententionPeriodExpired(testResult: TestResultSchema): boolean {
		return dayjs().diff(testResult.testTypes[0].testTypeEndTimestamp, 'months') >= 15;
	}

	async openDocumentFromZip(zip: JSZip, fileName: string) {
		const blob = await zip.generateAsync({ type: 'blob' });
		const link = this.documentsService.createFileLink(fileName, blob, 'zip');
		this.documentsService.simulateClick(link);
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

	handleError(error: unknown, testResultId?: string) {
		if (error instanceof HttpErrorResponse) {
			switch (error.status) {
				case HttpStatusCode.NotFound:
					if (testResultId) {
						this.mediaFetchErrors.update((errors) => ({
							...errors,
							[testResultId]: {
								status: HttpStatusCode.NotFound,
								message: 'Media could not be found',
							},
						}));
					}
					this.globalErrorService.setErrors([
						{
							error:
								'Media could not be found <br>' +
								'Try again later or contact the Service Desk if this issue keeps happening.',
							anchorLink: '',
						},
					]);
					break;
				case HttpStatusCode.InternalServerError:
					if (testResultId) {
						this.mediaFetchErrors.update((errors) => ({
							...errors,
							[testResultId]: {
								status: HttpStatusCode.InternalServerError,
								message: 'Media could not be downloaded',
							},
						}));
					}
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
