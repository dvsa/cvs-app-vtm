import { Modes } from '@/src/app/models/modes.enum';
import { TEST_TYPES_GROUP7, TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@/src/app/models/testTypeId.enum';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { LoadStatusService } from '@/src/app/services/load-status/load-status.service';
import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-test-view',
	templateUrl: './test-view.component.html',
	imports: [DefaultNullOrEmpty, DatePipe],
})
export class TestViewComponent {
	readonly loadStatusService = inject(LoadStatusService);

	readonly mode = input<Modes>();
	readonly initialMode = input<Modes>();
	readonly testResult = input<TestResultSchema>();

	readonly Modes = Modes;
	readonly TestResults = TestResults;
	protected readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	protected readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	protected readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	readonly ABANDON_REASONS_REGEX = new RegExp('\\. (?<!\\..\\. )');

	getReasonsList(reasons: string | string[] | null): string[] {
		return Array.isArray(reasons) ? reasons : (reasons?.split(this.ABANDON_REASONS_REGEX) ?? []);
	}

	shouldShowLoadStatus(): boolean {
		return this.loadStatusService.isLoadStatusApplicable(this.testResult());
	}

	shouldShowCentralDocs(): boolean {
		return (
			[...TEST_TYPES_GROUP9_10_CENTRAL_DOCS, ...TEST_TYPES_GROUP7].includes(
				this.testResult()?.testTypes[0].testTypeId ?? ''
			) && this.testResult()?.testTypes[0].testResult !== 'fail'
		);
	}

	isTestTypeGroup7(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}
}
