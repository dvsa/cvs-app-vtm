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
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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

	startTimeDisplay = new FormControl({ value: '', disabled: true });
	endTimeDisplay = new FormControl({ value: '', disabled: true });

	readonly FormNodeWidth = FormNodeWidth;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;

	ngOnInit(): void {
		this.addValidators();
		this.disableFields();
		this.handleTestStartTimestampChange();
		this.handleTestEndTimestampChange();
		this.initTimeDisplayControls();
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

		testTypeGroup.controls.testExpiryDate.setValidators([
			this.commonValidators.applyWhen(
				() => this.mode() === Modes.AMEND && testTypeGroup.controls.testResult.value === TestResults.PASS,
				this.commonValidators.required('Expiry Date')
			),
			this.commonValidators.date('Expiry Date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Expiry Date', 'Start Time'),
		]);

		testTypeGroup.controls.testAnniversaryDate.setValidators([
			this.commonValidators.applyWhen(
				() => this.mode() === Modes.AMEND && testTypeGroup.controls.testResult.value === TestResults.PASS,
				this.commonValidators.required('Anniversary date')
			),
			this.commonValidators.date('Anniversary date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Anniversary date', 'Start Time'),
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

	disableFields(): void {
		// Initially enable all controls
		this.form.enable();

		if (this.initialMode() === Modes.AMEND) {
			this.form.controls.testTypes.at(0).controls.createdAt.disable();
			this.form.controls.testTypes.at(0).controls.testCode.disable();
			this.form.controls.testTypes.at(0).controls.testTypeName.disable();
			this.form.controls.testTypes.at(0).controls.testNumber.disable();
			this.form.controls.testTypes.at(0).controls.testTypeEndTimestamp.disable();
			this.form.controls.testTypes.at(0).controls.testTypeStartTimestamp.disable();
		}
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

	private formatDateTimeLocal(isoString: string | null | undefined): string {
		if (!isoString) return '';
		const date = new Date(isoString);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const ms = date.getMilliseconds().toString().padStart(3, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
	}

	private initTimeDisplayControls(): void {
		if (this.initialMode() !== Modes.AMEND) return;

		const testTypeGroup = this.form.controls.testTypes.at(0);

		this.startTimeDisplay.setValue(this.formatDateTimeLocal(testTypeGroup.controls.testTypeStartTimestamp.value));
		this.endTimeDisplay.setValue(this.formatDateTimeLocal(testTypeGroup.controls.testTypeEndTimestamp.value));
	}

	protected readonly Modes = Modes;
}
