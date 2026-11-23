import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
export class SeatbeltsComponent {
	store = inject(Store);
	testService = inject(TestService);

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);

	readonly FormNodeWidth = FormNodeWidth;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;

	protected readonly Modes = Modes;
}
