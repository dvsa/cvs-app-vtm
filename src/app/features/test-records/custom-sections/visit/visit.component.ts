import { Component, OnDestroy, OnInit, forwardRef, inject, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { Modes } from '@models/modes.enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { selectAllReferenceDataByResourceType } from '@store/reference-data';
import { testStationNames } from '@store/test-stations';
import { Observable, ReplaySubject, map, of, takeUntil } from 'rxjs';

@Component({
	selector: 'app-test-visit',
	templateUrl: './visit.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupAutocompleteComponent, GovukFormGroupInputComponent],
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
	optionsService = inject(MultiOptionsService);
	testStationNames = this.store.select(testStationNames);
	users$: Observable<(string | boolean | number)[]> = of();
	users = this.store.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.User));

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
		this.handleTesterDetailChanges();
		this.loadOptions();
		this.getOptions();

		// Prepopulate form with current test record
		this.form.patchValue(this.testResult$ as any);
	}

	loadOptions(): void {
		this.optionsService.loadOptions(ReferenceDataResourceType.User);
	}

	getOptions(): void {
		this.users$ = this.optionsService
			.getOptions(ReferenceDataResourceType.User)
			.pipe(map((options) => options?.map((option) => option.label) ?? []));
	}

	private handleTesterDetailChanges(): void {
		const testerName = this.form.get('testerName');
		testerName?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			// patch the rest of the tester details into the form
			console.log('foo');
		});
	}

	ngOnDestroy() {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
