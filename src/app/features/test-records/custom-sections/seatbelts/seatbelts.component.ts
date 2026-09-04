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
import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-seatbelts',
	templateUrl: './seatbelts.component.html',
	imports: [
		DatePipe,
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
		DefaultNullOrEmpty,
	],
	styleUrls: ['./seatbelts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatbeltsComponent implements OnInit {
	store = inject(Store);
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);

	mode = input.required<Modes>();

	readonly FormNodeWidth = FormNodeWidth;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;

	ngOnInit(): void {
		this.addValidators();
	}

	addValidators(): void {
		const testTypeGroup = this.form.controls.testTypes.at(0);

		// `required` treats a falsy value as empty, so a legitimate "No" answer would fail it.
		// Only apply it while the question is genuinely unanswered.
		testTypeGroup.controls.seatbeltInstallationCheckDate.setValidators([
			this.commonValidators.applyWhen(
				() => !this.hasAnsweredSeatbeltCheck(),
				this.commonValidators.required('Carried out during test')
			),
		]);

		testTypeGroup.controls.numberOfSeatbeltsFitted.setValidators([
			this.commonValidators.applyWhen(
				() => this.isSeatbeltCheckCarriedOut(),
				this.commonValidators.required(() => ({
					error: 'Number of seatbelts fitted is required with Carried out during test',
				}))
			),
			this.commonValidators.max(150, 'Number of seatbelts fitted'),
		]);

		testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValidators([
			this.commonValidators.applyWhen(
				() => this.isSeatbeltCheckCarriedOut(),
				this.commonValidators.required(() => ({
					error: 'Most recent installation check is required with Carried out during test',
				}))
			),
			this.commonValidators.date('Most recent installation check'),
			this.commonValidators.pastDate('Most recent installation check'),
		]);
	}

	hasAnsweredSeatbeltCheck(): boolean {
		return typeof this.seatbeltCheckValue() === 'boolean';
	}

	isSeatbeltCheckCarriedOut(): boolean {
		return this.seatbeltCheckValue() === true;
	}

	private seatbeltCheckValue(): boolean | null | undefined {
		return this.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate.getRawValue();
	}

	protected readonly Modes = Modes;
}
