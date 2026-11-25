import { HttpClient, HttpContext, HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import JSZip from 'jszip';
import { defer, filter, from, lastValueFrom, map, tap } from 'rxjs';
import { HANDLE_MEDIA_DOWNLOAD_ERRORS } from '../../interceptors/error-handling/error-handling.interceptor';
import { DocumentsService } from './documents.service';

export type CertificatePhotoCategory = 'iac' | 'mac';
type MediaCategory = 'approvals' | CertificatePhotoCategory | 'vtg15';

@Injectable({ providedIn: 'root' })
export class TestResultMediaService {
	private readonly http = inject(HttpClient);
	private readonly httpService = inject(HttpService);
	private readonly documentsService = inject(DocumentsService);
	private archive?: { testResultId: string; category: CertificatePhotoCategory; zip: Promise<JSZip> };

	download(testResultId: string, category: MediaCategory) {
		return defer(() => {
			if (category === 'iac' || category === 'mac') {
				return from(this.downloadFromArchive(testResultId, category, this.getFullArchive(testResultId, category)));
			}
			if (this.archive?.testResultId === testResultId) {
				return from(this.downloadFromArchive(testResultId, category, this.archive.zip));
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

	private getFullArchive(testResultId: string, category: CertificatePhotoCategory): Promise<JSZip> {
		if (this.archive?.testResultId === testResultId && this.archive.category === category) return this.archive.zip;

		// Keep only the most recently requested full archive; all media links on that record share it.
		const zip = this.loadFullArchive(testResultId, category).catch((error: unknown) => {
			if (this.archive?.zip === zip) this.archive = undefined;
			throw error;
		});
		this.archive = { testResultId, category, zip };
		return zip;
	}

	private async loadFullArchive(testResultId: string, category: CertificatePhotoCategory): Promise<JSZip> {
		const url = await lastValueFrom(this.getArchiveUrl(testResultId, category));
		const data = await lastValueFrom(
			this.http.get(url, {
				responseType: 'arraybuffer',
				context: new HttpContext().set(HANDLE_MEDIA_DOWNLOAD_ERRORS, true),
			})
		);
		return JSZip.loadAsync(data);
	}

	private async downloadFromArchive(testResultId: string, category: MediaCategory, zip: Promise<JSZip>): Promise<void> {
		const archive = await zip;
		const isCertificatePhoto = category === 'iac' || category === 'mac';
		const categoryPath = `${testResultId}/${category}/`;
		const files = archive
			.filter((path) => path.startsWith(categoryPath))
			.filter(
				(file) => !isCertificatePhoto || /\.(avif|bmp|gif|heic|heif|jpe?g|jfif|png|tiff?|webp)$/i.test(file.name)
			);

		if (!files.length) {
			if (isCertificatePhoto) throw new HttpErrorResponse({ status: HttpStatusCode.NotFound });
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
