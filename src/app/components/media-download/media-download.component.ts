import { HttpEventType } from '@angular/common/http';
import { Component, Signal, inject } from '@angular/core';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { CustomFormControlComponent } from '../../forms/custom-sections/custom-form-control/custom-form-control.component';
import { TEST_TYPES_GROUP1_SPEC_TEST, TEST_TYPES_GROUP5_SPEC_TEST } from '../../models/testTypeId.enum';
import { DocumentsService } from '../../services/documents/documents.service';
import { HttpService } from '../../services/http/http.service';
import { selectedTestResultState } from '../../store/test-records';

@Component({
	selector: 'app-media-download',
	templateUrl: './media-download.component.html',
	styleUrls: ['./media-download.component.scss'],
	host: {
		class: 'govuk-table__row',
	},
})
export class MediaDownloadComponent extends CustomFormControlComponent {
	store = inject(Store);
	httpService = inject(HttpService);
	documentsService = inject(DocumentsService);

	testResult = this.store.selectSignal(selectedTestResultState) as Signal<TestResultSchema | undefined>;

	viewMediaApplicable(test: TestResultSchema): boolean {
		if (!test.media) return false;
		// Only show media for approvals tests
		const testTypeId = test.testTypes[0].testTypeId;
		return TEST_TYPES_GROUP1_SPEC_TEST.includes(testTypeId) || TEST_TYPES_GROUP5_SPEC_TEST.includes(testTypeId);
	}

	canDownloadApprovalsMedia(test: TestResultSchema): boolean {
		if (!test.media) return false;
		return test.media.some((media) => media.type !== 'failReason');
	}

	getFailureToCaptureApprovalsMediaReason(test: TestResultSchema): string {
		if (!test.media) return '';

		for (const reason of test.media) {
			if (reason.type === 'failReason') {
				return reason.reason;
			}
		}

		return 'Reason for failure to capture media not available';
	}

	async downloadMedia(test: TestResultSchema) {
		const fileType = 'zip';
		const fileName = `${test.testResultId}.zip`;
		this.httpService.getTestResultMedia(test.testResultId).subscribe((response) => {
			switch (response.type) {
				case HttpEventType.DownloadProgress:
					break;
				case HttpEventType.Response:
					this.documentsService.openDocumentFromResponse(fileName, response.body, fileType);
					break;
				default:
					break;
			}
		});
	}
}
