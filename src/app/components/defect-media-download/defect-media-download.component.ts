import { Component, Input, OnDestroy, Signal, inject } from '@angular/core';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Store } from '@ngrx/store';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { selectedTestResultState } from '@store/test-records';
import JSZip from 'jszip';

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
	globalErrorService = inject(GlobalErrorService);
	defectMediaService = inject(DefectMediaService, { optional: true });

	testResult = this.store.selectSignal(selectedTestResultState) as Signal<TestResultSchema | undefined>;
	@Input() defect!: DefectDetailsSchema;

	ngOnDestroy(): void {
		this.globalErrorService.clearErrors();
	}

	canDownloadMedia(): boolean {
		if (!this.defect.media) return false;
		if (!this.defectMediaService) {
			return false;
		}
		return this.defectMediaService.hasImages(this.defect);
	}

	getFailureToCaptureDefectMediaReason(): string {
		if (!this.defect.media) return 'No media available';
		if (this.defect.deficiencyCategory !== 'dangerous') return 'No media available';

		for (const reason of this.defect.media) {
			if (reason.type === 'failReason') {
				return 'No media available';
			}
		}

		return 'Reason for failure to capture media not available';
	}

	async downloadMedia() {
		const testResultId = this.testResult()?.testResultId;
		if (!testResultId || !this.defectMediaService) {
			return;
		}

		try {
			if (this.defectMediaService.hasCachedImages(this.defect)) {
				await this.downloadDefectMediaFromCache();
			} else {
				await this.downloadDefectMediaFromHttp(testResultId);
			}
		} catch (error) {
			this.defectMediaService.handleError(error);
			console.error(error);
		}
	}

	private async downloadDefectMediaFromHttp(testResultId: string) {
		if (!this.defectMediaService) {
			return;
		}

		const zip = await this.defectMediaService.getDefectZip(testResultId);
		const testResult = this.testResult();
		const defects = testResult?.testTypes?.[0]?.defects;
		if (!defects) {
			return;
		}

		for (const defect of defects) {
			if (!defect.media) {
				continue;
			}
			for (const media of defect.media) {
				if (media.type === 'failReason') {
					continue;
				}
				const file = zip.files[media.path];
				if (file) {
					this.defectMediaService.images[media.path] = await file.async('base64');
				}
			}
		}

		await this.downloadDefectMediaFromCache();
	}

	private async downloadDefectMediaFromCache() {
		if (!this.defectMediaService || !this.defect.media) {
			return;
		}

		const newZip = new JSZip();
		for (const media of this.defect.media) {
			if (media.type === 'failReason') {
				continue;
			}

			const file = this.defectMediaService.images[media.path];
			if (file) {
				newZip.file(media.path, file, { base64: true });
			}
		}

		await this.defectMediaService.openDocumentFromZip(newZip, `${this.defect.imNumber}-${this.defect.imDescription}`);
	}
}
