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
	fileCache: Record<string, string> = {};

	hasMedia(defect: DefectDetailsSchema): boolean {
		if (!Array.isArray(defect.media) || defect.media.length === 0) return false;
		return defect.media.some((media) => media.type !== 'failReason');
	}

	canDownloadAdasMediaItems(defect: DefectDetailsSchema): boolean {
		if (!this.featureToggleService.isFeatureEnabled('adas-images-on-defects')) return false;

		return defect.imNumber === 29 && this.hasMedia(defect);
	}

	canDownloadAdasMedia(testResult: TestResultSchema): boolean {
		if (!this.featureToggleService.isFeatureEnabled('adas-images-on-defects')) return false;

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

		const blob = await this.getBlob(id, options);
		const zip = await new JSZip().loadAsync(blob, { base64: true });
		this.zipCache[cacheKey] = zip;

		return zip;
	}

	async getAdasZip(testResultId: string): Promise<JSZip | null> {
		if (!this.featureToggleService.isFeatureEnabled('adas-images-on-defects')) return null;

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

	handleError(error: unknown) {
		if (error instanceof HttpErrorResponse) {
			switch (error.status) {
				case HttpStatusCode.NotFound:
					this.globalErrorService.setErrors([
						{
							error:
								'Media could not be found. <br>' +
								'Try again later or contact the service desk if this issue keeps happening.',
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
