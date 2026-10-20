import { Component, Input, Signal, inject } from '@angular/core';
import type { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Store } from '@ngrx/store';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { selectedTestResultState } from '@store/test-records';

@Component({
	selector: 'app-defect-media-download',
	templateUrl: './defect-media-download.component.html',
	styleUrls: ['./defect-media-download.component.scss'],
	host: {
		class: 'govuk-table__row',
	},
})
export class DefectMediaDownloadComponent extends CustomFormControlComponent {
	store = inject(Store);
	defectMediaService = inject(DefectMediaService, { optional: true });

	testResult = this.store.selectSignal(selectedTestResultState) as Signal<TestResultSchema | undefined>;
	@Input() defect!: DefectDetailsSchema;

	getFailureToCaptureDefectMediaReason(): string {
		if (!this.defectMediaService?.canDownloadMediaItems(this.defect)) return 'No media available';
		return 'Reason for failure to capture media not available';
	}
}
