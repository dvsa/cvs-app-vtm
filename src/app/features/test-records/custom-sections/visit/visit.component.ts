import { Component, OnDestroy, OnInit, forwardRef, input, inject } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { ReplaySubject } from 'rxjs';
import {
  GovukFormGroupSelectComponent
} from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { Store } from '@ngrx/store';
import { testStationNames } from '@store/test-stations';
import {
  GovukFormGroupAutocompleteComponent
} from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';

@Component({
	selector: 'app-test-visit',
	templateUrl: './visit.component.html',
  imports: [FormsModule, ReactiveFormsModule, GovukFormGroupSelectComponent, GovukFormGroupAutocompleteComponent],
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
  store = inject(Store);
  testStationNames = this.store.select(testStationNames);

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
