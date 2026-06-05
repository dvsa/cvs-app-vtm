import { ButtonComponent } from '@/src/app/components/button/button.component';
import { DefectMediaDownloadComponent } from '@/src/app/components/defect-media-download/defect-media-download.component';
import { TagComponent } from '@/src/app/components/tag/tag.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TruncatePipe } from '@/src/app/pipes/truncate/truncate.pipe';
import { DefectMediaService } from '@/src/app/services/defect-media-service/defect-media-service.service';
import { DocumentsService } from '@/src/app/services/documents/documents.service';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import JSZip from 'jszip';

@Component({
	selector: 'app-test-defects',
	templateUrl: './defects.component.html',
	imports: [ButtonComponent, RouterLink, TruncatePipe, TagComponent, DefectMediaDownloadComponent],
	styleUrls: ['./defects.component.scss'],
})
export class DefectsComponent {
	http = inject(HttpClient);
	store = inject(Store);
	documentsService = inject(DocumentsService);
	router = inject(Router);
	globalErrorService = inject(GlobalErrorService);
	defectMediaService = inject(DefectMediaService, { optional: true });
	testService = inject(TestService);

	mode = input.required<Modes>();

	testResult = this.store.selectSignal(toEditOrNotToEdit);

	readonly Modes = Modes;

	get defects(): DefectDetailsSchema[] {
		return this.testResult()?.testTypes[0].defects || [];
	}

	hasMediaAvailable(): boolean {
		if (!this.defectMediaService) return false;

		// return true if one of the defects contains media which are images
		for (const defect of this.defects) {
			if (this.defectMediaService.hasImages(defect)) {
				return true;
			}
		}

		return false;
	}

	async downloadAllMedia(): Promise<void> {
		const testResult = this.testResult();
		if (!this.defectMediaService || !testResult) return;

		try {
			if (this.defectMediaService.hasCachedTestResultImages(testResult)) {
				await this.downloadMediaFromCache();
			} else {
				await this.downloadMediaFromHttp();
			}
		} catch (error) {
			console.log(error);
			this.defectMediaService.handleError(error);
		}
	}

	async downloadMediaFromCache(): Promise<void> {
		const testResult = this.testResult();
		if (!testResult || !this.defectMediaService) return;

		// download images from cache
		const testResultId = testResult.testResultId;
		const zip = new JSZip();

		for (const defect of this.defects) {
			const defectMedia = defect.media;
			if (!defectMedia) return;

			for (const image of defectMedia) {
				const file = this.defectMediaService.images[image.path];
				if (file) {
					zip.file(image.path, file, { base64: true });
				}
			}
		}

		await this.defectMediaService.openDocumentFromZip(zip, testResultId);
	}

	async downloadMediaFromHttp(): Promise<void> {
		const testResult = this.testResult();
		if (!testResult || !this.defectMediaService) return;

		const testResultId = testResult.testResultId;
		const zip = await this.defectMediaService.getDefectZip(testResultId);
		const newZip = new JSZip();

		for (const defect of testResult.testTypes[0].defects) {
			const defectMedia = defect.media;
			if (!defectMedia) return;

			for (const image of defectMedia) {
				const file = zip.files[image.path];
				if (file) {
					// if file exists add image to cache
					this.defectMediaService.images[image.path] = await file.async('base64');
					newZip.file(image.path, this.defectMediaService.images[image.path], { base64: true });
				}
			}
		}

		await this.defectMediaService.openDocumentFromZip(newZip, `${testResultId}`);
	}

	categoryColor(category: string): string {
		return categoryColors[category as keyof typeof categoryColors];
	}
}

const categoryColors = {
	major: 'orange',
	minor: 'yellow',
	dangerous: 'red',
	advisory: 'blue',
} as const;
