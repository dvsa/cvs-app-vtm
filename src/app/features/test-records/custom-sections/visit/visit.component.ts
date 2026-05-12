import { Component, OnDestroy, OnInit, forwardRef, inject, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { Modes } from '@models/modes.enum';
import { ReferenceDataResourceType, User } from '@models/reference-data.model';
import { Store, select } from '@ngrx/store';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { selectAllReferenceDataByResourceType, selectUserByResourceKey } from '@store/reference-data';
import { testStationNames } from '@store/test-stations';
import { ReplaySubject, catchError, take, takeUntil, tap } from 'rxjs';

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
	users$ = this.optionsService.getOptions(ReferenceDataResourceType.User);
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

		// Prepopulate form with current test record
		this.form.patchValue(this.testResult$ as any);
	}

	loadOptions(): void {
		this.optionsService.loadOptions(ReferenceDataResourceType.User);
	}

	private handleTesterDetailChanges(): void {
		const testerStaffId = this.form.get('testerStaffId');
		testerStaffId?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			// patch the rest of the tester details into the form
			if (!value) return;
			this.store.pipe(
				select(selectUserByResourceKey(value)),
				take(1),
				tap((user) => {
					const testerName = this.form?.get('testerName');
					const testerEmail = this.form?.get('testerEmailAddress');
					if (user && testerName && testerEmail) {
						testerName.setValue((user as User).name, { emitEvent: false, onlySelf: true });
						testerEmail.setValue((user as User).email, { emitEvent: false, onlySelf: true });
					}
				}),
				catchError(async (error) => console.log(error))
			);
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
