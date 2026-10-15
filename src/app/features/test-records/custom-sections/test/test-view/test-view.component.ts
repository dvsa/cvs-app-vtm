import { Modes } from '@/src/app/models/modes.enum';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { LoadStatusService } from '@/src/app/services/load-status/load-status.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
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
	readonly testTypeService = inject(TestTypeService);

	readonly mode = input<Modes>();
	readonly initialMode = input<Modes>();
	readonly testResult = input<TestResultSchema>();

	readonly Modes = Modes;
	readonly TestResults = TestResults;
	readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	readonly ABANDON_REASONS_REGEX = new RegExp('\\. (?<!\\..\\. )');

	getReasonsList(reasons: string | string[] | null): string[] {
		return Array.isArray(reasons) ? reasons : (reasons?.split(this.ABANDON_REASONS_REGEX) ?? []);
	}
}
