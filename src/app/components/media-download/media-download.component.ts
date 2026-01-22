import { HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { GlobalErrorService } from '../../core/components/global-error/global-error.service';
import { CustomFormControlComponent } from '../../forms/custom-sections/custom-form-control/custom-form-control.component';
import { RootRoutes } from '../../models/routes.enum';
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
export class MediaDownloadComponent extends CustomFormControlComponent implements OnDestroy {
	store = inject(Store);
	router = inject(Router);
	httpService = inject(HttpService);
	documentsService = inject(DocumentsService);
	globalErrorService = inject(GlobalErrorService);

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

		console.log(test.media);

		for (const reason of test.media) {
			if (reason.type === 'failReason') {
				return `No media available - ${reason.reason}`;
			}
		}

		return 'Reason for failure to capture media not available';
	}

	ngOnDestroy(): void {
		this.globalErrorService.clearErrors();
	}

	get params(): Map<string, string> {
		return new Map([['category', 'approvals']]);
	}

	downloadMedia(test: TestResultSchema) {
		const fileType = 'zip';
		const fileName = `${test.testResultId}.zip`;

		this.httpService.getTestResultMedia(test.testResultId, this.params).subscribe({
			next: (response) => {
				switch (response.type) {
					case HttpEventType.DownloadProgress:
						break;
					case HttpEventType.Response:
						this.documentsService.openDocumentFromResponse(fileName, response.body, fileType);
						break;
					default:
						break;
				}
			},
			error: (error) => {
				if (error instanceof HttpErrorResponse) {
					switch (error.status) {
						case HttpStatusCode.NotFound:
							this.globalErrorService.setErrors([
								{
									error:
										'Media could not be found. &#10;&#13;Try again later or contact the service desk if this issue keeps happening.',
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
			},
		});
	}
}
