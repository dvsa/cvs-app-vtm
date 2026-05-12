import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { Component, OnDestroy, OnInit, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
	],
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
		testTypes: this.fb.array([
			this.fb.group({
				testCode: this.fb.control('', []),
				testResult: this.fb.control('', []),
				contingencyTestNumber: this.fb.control('', [
					this.commonValidators.required('Contingency Test Number'),
					this.commonValidators.minLength(6, 'Contingency Test Number'),
					this.commonValidators.maxLength(8, 'Contingency Test Number'),
				]),
				centralDocs: this.fb.group({
					issueRequired: this.fb.control<boolean>(false, []),
					reasonsForIssue: this.fb.control('', []),
				}),
				defects: this.fb.array([]),
				testTypeName: this.fb.control('', []),
				certificateNumber: this.fb.control('', []),
				testNumber: this.fb.control('', []),
				testExpiryDate: this.fb.control('', []),
				testAnniversaryDate: this.fb.control('', []),
				reasonsForAbandoning: this.fb.control('', []),
				additionalCommentsForAbandon: this.fb.control('', []),
				testTypeStartTimestamp: this.fb.control('', [
					this.commonValidators.required('Test start date and time'),
					this.commonValidators.date('Test end date and time'),
					this.commonValidators.pastDate('Test start date and time'),
					this.commonValidators.isBeforeDate(
						'testTypeEndTimestamp',
						'Test start date and time',
						'Test end date and time'
					),
				]),
				testTypeEndTimestamp: this.fb.control('', [
					this.commonValidators.required('Test end date and time'),
					this.commonValidators.date('Test end date and time'),
					this.commonValidators.pastDate('Test end date and time'),
					this.commonValidators.isAfterDate(
						'testTypeStartTimestamp',
						'Test end date and time',
						'Test start date and time'
					),
				]),
			}),
		]),
	});

	readonly FormNodeWidth = FormNodeWidth;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;

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
