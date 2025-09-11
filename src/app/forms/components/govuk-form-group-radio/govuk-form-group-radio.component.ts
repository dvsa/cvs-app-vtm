import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { TagDirective } from '@directives/tag/tag.directive';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';
import { MultiOption } from '@models/options.model';
import { GOVUK_RADIOS } from './govuk-form-group-radio.model';

@Component({
	selector: 'govuk-form-group-radio',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective],
	templateUrl: './govuk-form-group-radio.component.html',
	styleUrls: ['./govuk-form-group-radio.component.scss'],
	providers: [
		{
			provide: GOVUK_RADIOS,
			useExisting: forwardRef(() => GovukFormGroupRadioComponent),
		},
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupRadioComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupRadioComponent extends GovukFormGroupBaseComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	orientation = input<RadioGroupOrientation>('vertical');
	value = model<string | number | boolean | null>(null);

	readonly options = input<MultiOption<unknown>[]>([]);

	writeValue(obj: any): void {
		this.value.set(obj);
		this.onChange(obj);
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}
}

export type RadioGroupOrientation = 'horizontal' | 'vertical';
