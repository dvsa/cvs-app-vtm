import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DefectDetailsSchema, MediaSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
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

	getPresignedUrlValue(testResultId: string): Observable<string> {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/zip');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);
		const fileName = `${testResultId}`;

		let localParams = new HttpParams();
		this.params.forEach((value, key) => (localParams = localParams.set(key, value)));
		return this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval/${fileName}`, {
			params: localParams,
			headers,
			responseType: 'text',
		});
	}

	getPresignedUrlObserveValue(testResultId: string, observe?: boolean) {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/zip');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);
		const fileName = `${testResultId}`;

		let localParams = new HttpParams();
		this.params.forEach((value, key) => (localParams = localParams.set(key, value)));
		return this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval/${fileName}`, {
			params: localParams,
			headers,
			responseType: 'text',
			observe: 'events',
		});
	}

	async loadImages(images: MediaSchema[], testResultId: string) {
		if (!isEqual(this.images, {})) {
			return;
		}

		const url = await lastValueFrom(this.getPresignedUrlValue(testResultId));
		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
		const zip = new JSZip();
		await zip.loadAsync(blob, { base64: true });

		for (const image of images) {
			const file = zip.files[image.path];
			if (file) {
				this.images[image.path] = await file.async('base64');
			}
		}
	}

	async openDocumentFromZip(zip: JSZip, defect: DefectDetailsSchema) {
		const base64 = await zip.generateAsync({ type: 'base64' });

		this.documentsService.openDocumentFromResponse(
			`${defect.imNumber}-${defect.imDescription}`,
			`data:application/zip;base64, ${base64}`,
			'zip'
		);
	}

	get params(): Map<string, string> {
		return new Map([['category', 'defects']]);
	}

	getImages(): Record<string, string> {
		return this.images;
	}
}
