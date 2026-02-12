import { HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleType.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { Store } from '@ngrx/store';
import { GlobalErrorService } from '../../core/components/global-error/global-error.service';
import { CustomFormControlComponent } from '../../forms/custom-sections/custom-form-control/custom-form-control.component';
import { RootRoutes } from '../../models/routes.enum';
import { TEST_TYPES_GROUP1_SPEC_TEST, TEST_TYPES_GROUP5_SPEC_TEST } from '../../models/testTypeId.enum';
import { VehicleSubclass } from '../../models/vehicle-tech-record.model';
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
		// Only show media for approvals tests
		const testTypeId = test.testTypes[0].testTypeId;
		return TEST_TYPES_GROUP1_SPEC_TEST.includes(testTypeId) || TEST_TYPES_GROUP5_SPEC_TEST.includes(testTypeId);
	}

	canDownloadApprovalsMedia(test: TestResultSchema): boolean {
		if (!test.media) return false;
		return test.media.some((media) => media.type !== 'failReason');
	}

	getMediaRetentionPeriod(test: TestResultSchema): number {
		// Motorcycles
		if (test.vehicleType === VehicleType.MOTORCYCLE) {
			return 5;
		}

		// O1-O4 (heavy and small TRLs)
		if (test.vehicleType === VehicleType.TRL) {
			return 5;
		}

		// N2/N3 (heavy HGVs)
		if (test.euVehicleCategory === EUVehicleCategory.N2 || test.euVehicleCategory === EUVehicleCategory.N3) {
			return 5;
		}

		// M2/M3 (heavy PSVs)
		if (test.euVehicleCategory === EUVehicleCategory.M2 || test.euVehicleCategory === EUVehicleCategory.M3) {
			return 10;
		}

		const m1 = test.euVehicleCategory === EUVehicleCategory.M1;
		const n1 = test.euVehicleCategory === EUVehicleCategory.N1;
		if (m1 || n1) {
			if (!test.vehicleSubclass || test.vehicleSubclass.length === 0) {
				return 5;
			}

			const category1Subclasses: string[] = [
				VehicleSubclass.A,
				VehicleSubclass.C,
				VehicleSubclass.S,
				VehicleSubclass.L,
			];
			if (test.vehicleSubclass.every((subclass) => category1Subclasses.includes(subclass))) {
				return 20;
			}

			const n1Category2Subclasses: string[] = [VehicleSubclass.P, VehicleSubclass.N];
			if (n1 && test.vehicleSubclass.every((subclass) => n1Category2Subclasses.includes(subclass))) {
				return 10;
			}

			const m1Category2Subclasses: string[] = [VehicleSubclass.P, VehicleSubclass.M, VehicleSubclass.N];
			if (m1 && test.vehicleSubclass.every((subclass) => m1Category2Subclasses.includes(subclass))) {
				return 10;
			}

			const n1Category3Subclasses: string[] = [VehicleSubclass.R];
			if (test.vehicleSubclass.every((subclass) => n1Category3Subclasses.includes(subclass))) {
				return 5;
			}
		}

		return Number.POSITIVE_INFINITY;
	}

	hasMediaRetentionPeriodExpired(test: TestResultSchema): boolean {
		const testEndTimestamp = new Date(test.testEndTimestamp);
		if (Number.isNaN(testEndTimestamp.getTime())) return false;
		const today = new Date();
		const target = new Date(testEndTimestamp);
		const retentionPeriod = this.getMediaRetentionPeriod(test);
		target.setFullYear(testEndTimestamp.getFullYear() + retentionPeriod);

		return today >= target;
	}

	getFailureToDownloadMediaReason(test: TestResultSchema): string {
		if (!test.media) return 'No media available';

		if (this.hasMediaRetentionPeriodExpired(test)) {
			return 'No media available - media was deleted as the retention period had passed';
		}

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
										'Media could not be found. <br>Try again later or contact the service desk if this issue keeps happening.',
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
