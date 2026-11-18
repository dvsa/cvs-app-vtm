import { HttpClient, HttpContext, HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import JSZip from 'jszip';
import { defer, filter, from, lastValueFrom, map, tap } from 'rxjs';
import { HANDLE_MEDIA_DOWNLOAD_ERRORS } from '../../interceptors/error-handling/error-handling.interceptor';
import { DocumentsService } from './documents.service';

type MediaCategory = 'approvals' | 'iac' | 'vtg15';

@Injectable({ providedIn: 'root' })
export class TestResultMediaService {
	private readonly http = inject(HttpClient);
	private readonly httpService = inject(HttpService);
	private readonly documentsService = inject(DocumentsService);
	private archive?: { testResultId: string; zip: Promise<JSZip> };

	download(testResultId: string, category: MediaCategory) {
		return defer(() => {
			if (category === 'iac' || (this.archive && this.archive.testResultId === testResultId)) {
				return from(this.downloadFromArchive(testResultId, category));
			}
			return this.downloadCategory(testResultId, category);
		});
	}

	private getArchiveUrl(testResultId: string, category: MediaCategory) {
		return this.httpService.getTestResultMedia(testResultId, new Map([['category', category]])).pipe(
			filter((event) => event.type === HttpEventType.Response),
			map(({ body }) => {
				if (!body) throw new HttpErrorResponse({ status: HttpStatusCode.NotFound });
				return body;
			})
		);
	}

	private downloadCategory(testResultId: string, category: MediaCategory) {
		return this.getArchiveUrl(testResultId, category).pipe(
			tap((url) => this.documentsService.openDocumentFromResponse(testResultId, url, 'zip')),
			map(() => undefined)
		);
	}

	private getFullArchive(testResultId: string): Promise<JSZip> {
		if (this.archive && this.archive.testResultId === testResultId) return this.archive.zip;

		// Keep only the most recently requested full archive; all media links on that record share it.
		const zip = this.loadFullArchive(testResultId).catch((error: unknown) => {
			if (this.archive?.zip === zip) this.archive = undefined;
			throw error;
		});
		this.archive = { testResultId, zip };
		return zip;
	}

	private async loadFullArchive(testResultId: string): Promise<JSZip> {
		const url = await lastValueFrom(this.getArchiveUrl(testResultId, 'iac'));
		const data = await lastValueFrom(
			this.http.get(url, {
				responseType: 'arraybuffer',
				context: new HttpContext().set(HANDLE_MEDIA_DOWNLOAD_ERRORS, true),
			})
		);
		return JSZip.loadAsync(data);
	}

	private async downloadFromArchive(testResultId: string, category: MediaCategory): Promise<void> {
		const archive = await this.getFullArchive(testResultId);
		const files = archive
			.file(new RegExp(`^${category}/`))
			.filter((file) => category !== 'iac' || /\.(avif|bmp|gif|heic|heif|jpe?g|jfif|png|tiff?|webp)$/i.test(file.name));

		if (!files.length) {
			if (category === 'iac') throw new HttpErrorResponse({ status: HttpStatusCode.NotFound });
			await lastValueFrom(this.downloadCategory(testResultId, category));
			return;
		}

		const filteredZip = new JSZip();
		for (const file of files) {
			filteredZip.file(file.name, file.async('uint8array'));
		}
		const blob = await filteredZip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
		const link = this.documentsService.createFileLink(`${testResultId}-${category}`, blob, 'zip');
		this.documentsService.simulateClick(link);
		setTimeout(() => URL.revokeObjectURL(link.href), 0);
	}
}
