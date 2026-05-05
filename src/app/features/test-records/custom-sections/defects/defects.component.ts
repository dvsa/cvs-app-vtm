import { Component, OnDestroy, OnInit, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-test-defects',
	templateUrl: './defects.component.html',
	imports: [FormsModule, ReactiveFormsModule],
	styleUrls: ['./defects.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DefectsComponent),
			multi: true,
		},
	],
})
export class DefectsComponent extends BaseTestRecordV2Component implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	mode = input.required<Modes>();

	testResult$ = this.testRecordService.editingTestResult$;

	form = this.fb.group({
		testTypes: this.fb.group({
			0: this.fb.record({
				defects: this.fb.group({
					0: this.fb.record({
						deficiencyRef: this.fb.control('', []),
						imNumber: this.fb.control('', []),
						imDescription: this.fb.control('', []),
						itemNumber: this.fb.control('', []),
						itemDescription: this.fb.control('', []),
						deficiencyId: this.fb.control('', []),
						deficiencySubId: this.fb.control('', []),
						deficiencyText: this.fb.control('', []),
						additionalInformation: this.fb.group({
							location: this.fb.group({
								vertical: this.fb.control('', []),
								horizontal: this.fb.control('', []),
								lateral: this.fb.control('', []),
								longitudinal: this.fb.control('', []),
								rowNumber: this.fb.control('', []),
								seatNumber: this.fb.control('', []),
								axleNumber: this.fb.control('', []),
							}),
							notes: this.fb.control('', []),
						}),
						prs: this.fb.control('', []),
						prohibitionIssued: this.fb.control('', []),
						stdForProhibition: this.fb.control('', []),
						media: this.fb.control('', []),
					}),
				}),
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
