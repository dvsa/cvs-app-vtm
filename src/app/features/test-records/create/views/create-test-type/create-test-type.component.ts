import { AfterContentInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TestType } from '@models/test-types/testType';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/.';
import { clearAllSectionStates } from '@store/technical-records';
import { contingencyTestTypeSelected } from '@store/test-records';
import { take } from 'rxjs';
import { TestTypeSelectComponent } from '../../../components/test-type-select/test-type-select.component';

@Component({
	selector: 'app-create-test-type',
	templateUrl: './create-test-type.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TestTypeSelectComponent],
})
export class CreateTestTypeComponent implements AfterContentInit {
	store = inject<Store<State>>(Store<State>);
	router = inject(Router);
	route = inject(ActivatedRoute);
	technicalRecordService = inject(TechnicalRecordService);

	ngAfterContentInit(): void {
		this.technicalRecordService.techRecord$.pipe(take(1)).subscribe((techRecord) => {
			if (techRecord?.techRecord_hiddenInVta) {
				// eslint-disable-next-line no-alert
				alert(
					'Vehicle record is hidden in VTA.\n\nShow the vehicle record in VTA to start recording tests against it.'
				);

				void this.router.navigate(['../../..'], { relativeTo: this.route });
			} else if (
				(techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness !== 'complete' &&
				(techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness !== 'testable'
			) {
				// eslint-disable-next-line no-alert
				alert(
					'Incomplete vehicle record.\n\n' +
						'This vehicle does not have enough data to be tested. ' +
						'Call Technical Support to correct this record and use SAR to test this vehicle.'
				);

				void this.router.navigate(['../../..'], { relativeTo: this.route });
			}
		});
	}

	handleSelectedTestType(testType: TestType) {
		this.store.dispatch(contingencyTestTypeSelected({ testType: testType.id }));
		this.store.dispatch(clearAllSectionStates());

		void this.router.navigate(['..', 'test-details'], {
			queryParams: { testType: testType.id },
			queryParamsHandling: 'merge',
			relativeTo: this.route,
		});
	}
}
