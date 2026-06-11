import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [
		DatePipe,
		FormsModule,
		ReactiveFormsModule,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
		DefaultNullOrEmpty,
	],
	styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, OnDestroy {
	store = inject(Store);
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);

	mode = input.required<Modes>();
	initialMode = input.required<Modes>();

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	destroy = new ReplaySubject<boolean>(1);

	readonly FormNodeWidth = FormNodeWidth;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;

	ngOnInit(): void {
		this.addValidators();
		this.handleTestStartTimestampChange();
		this.handleTestEndTimestampChange();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	addValidators(): void {
		const testTypeGroup = this.form.controls.testTypes.at(0);

		this.form.controls.contingencyTestNumber.setValidators([
			this.commonValidators.applyWhen(
				() => this.contingencyTestNumberIsRequired(),
				this.commonValidators.required('Contingency Test Number')
			),
			this.commonValidators.minLength(6, 'Contingency Test Number'),
			this.commonValidators.maxLength(8, 'Contingency Test Number'),
		]);

		testTypeGroup.controls.testTypeStartTimestamp.setValidators([
			this.commonValidators.required('Test start date and time'),
			this.commonValidators.date('Test start date and time'),
			this.commonValidators.pastDate('Test start date and time'),
		]);

		testTypeGroup.controls.testTypeEndTimestamp.setValidators([
			this.commonValidators.required('Test end date and time'),
			this.commonValidators.date('Test end date and time'),
			this.commonValidators.pastDate('Test end date and time'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Test end date and time', 'Test start date and time'),
		]);
	}

	contingencyTestNumberIsRequired(): boolean {
		return this.initialMode() === Modes.EDIT;
	}

	handleTestStartTimestampChange(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.testTypeStartTimestamp.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe((value) => {
				// Hoist value to top level of form
				this.form.patchValue({ testStartTimestamp: value || undefined });
			});
	}

	handleTestEndTimestampChange(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.testTypeEndTimestamp.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe((value) => {
				// Hoist value to top level of form
				this.form.patchValue({ testEndTimestamp: value || undefined });
			});
	}

	protected readonly Modes = Modes;
}
