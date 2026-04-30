import { Component, OnDestroy, OnInit, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { Modes } from '@models/modes.enum';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-test-visit',
	templateUrl: './visit.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
	styleUrls: ['./visit.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => VisitComponent),
			multi: true,
		},
	],
})
export class VisitComponent extends BaseTestRecordV2Component implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	mode = input.required<Modes>();

	testResult$ = this.testRecordService.editingTestResult$;

	form = this.fb.group({
		testFacilityCombination: this.fb.control('', []),
		testStationName: this.fb.control('', []),
		testStationPNumber: this.fb.control('', []),
		testStationType: this.fb.control('', []),
		testerStaffId: this.fb.control('', []),
		testerName: this.fb.control('', []),
		testerEmailAddress: this.fb.control('', []),
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
