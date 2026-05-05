import { Component, OnDestroy, OnInit, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [FormsModule, ReactiveFormsModule],
	styleUrls: ['./test.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TestComponent),
			multi: true,
		},
	],
})
export class TestComponent extends BaseTestRecordV2Component implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	mode = input.required<Modes>();

	testResult$ = this.testRecordService.editingTestResult$;

	form = this.fb.group({
		createdAt: this.fb.control('', []),
		testStartTimestamp: this.fb.control('', []),
		recalls: this.fb.group({
			hasRecall: this.fb.control('', []),
			manufacturer: this.fb.control('', []),
		}),
		testTypes: this.fb.group({
			0: this.fb.record({
				testCode: this.fb.control('', []),
				testResult: this.fb.control('', []),
				centralDocs: this.fb.group({
					issueRequired: this.fb.control('', []),
					reasonsForIssue: this.fb.control('', []),
				}),
				testTypeName: this.fb.control('', []),
				certificateNumber: this.fb.control('', []),
				testNumber: this.fb.control('', []),
				testExpiryDate: this.fb.control('', []),
				testAnniversaryDate: this.fb.control('', []),
				reasonsForAbandoning: this.fb.control('', []),
				additionalCommentsForAbandon: this.fb.control('', []),
				testTypeStartTimestamp: this.fb.control('', []),
				testTypeEndTimestamp: this.fb.control('', []),
			}),
		}),
	});

	ngOnInit(): void {
		this.init(this.form);

		// Prepopulate form with current test record
		this.form.patchValue(this.testResult$ as any);
	}

	ngOnDestroy() {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
