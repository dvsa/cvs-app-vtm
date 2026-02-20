import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DefectDetailsSchema, MediaSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { environment } from '@environments/environment';
import { DocumentsService } from '@services/documents/documents.service';
import JSZip from 'jszip';
import { isEqual } from 'lodash';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class DefectMediaService {
	http = inject(HttpClient);
	images: Record<string, string> = {};
	documentsService = inject(DocumentsService);

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

	getPresignedUrlObserveValue(testResultId: string) {
		return this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval/${testResultId}`, {
			params: this.getParams(),
			headers: this.getHeaders(),
			responseType: 'text',
			observe: 'events',
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
			const images = defectMedia.filter((media) => media.type !== 'failReason');
			for (const image of images) {
				if (this.images[image.path]) {
					return true;
				}
			}
		}
		return false;
	}

	hasCachedTestResultImages(testResult: TestResultSchema) {
		console.log('test');
		const testType = testResult.testTypes[0];
		if (!testType) {
			return;
		}
		console.log('test 2');
		let isTestResultCached = true;
		for (const defect of testType.defects) {
			if (!this.hasCachedImages(defect)) {
				console.log('test 3');
				isTestResultCached = false;
			}
		}
		return isTestResultCached;
	}

	async loadImages(testResult: TestResultSchema) {
		const testType = testResult.testTypes[0];
		const testResultId = testResult.testResultId;

		if (this.hasCachedTestResultImages(testResult) || !testType) {
			return;
		}

		const url = await lastValueFrom(this.getPresignedUrlValue(testResultId));
		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
		const zip = new JSZip();
		await zip.loadAsync(blob, { base64: true });

		for (const defect of testResult.testTypes[0].defects) {
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
	}

	async openDocumentFromZip(zip: JSZip, fileName: string) {
		const base64 = await zip.generateAsync({ type: 'base64' });

		this.documentsService.openDocumentFromResponse(fileName, `data:application/zip;base64, ${base64}`, 'zip');
	}

	get params(): Map<string, string> {
		return new Map([['category', 'defects']]);
	}

	getImages(): Record<string, string> {
		return this.images;
	}

	hasImages(defect: DefectDetailsSchema): boolean {
		if (!defect.media) return false;
		return defect.media.some((media) => media.type !== 'failReason');
	}
}
