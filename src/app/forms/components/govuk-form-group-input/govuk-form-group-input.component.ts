import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

import { TagDirective } from '@directives/tag/tag.directive';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';

@Component({
	selector: 'govuk-form-group-input',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TagComponent,
		TagDirective,
		NumberOnlyDirective,
		NoEmojisDirective,
	],
	templateUrl: './govuk-form-group-input.component.html',
	styleUrls: ['./govuk-form-group-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupInputComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupInputComponent extends GovukFormGroupBaseComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | number | boolean | null | undefined>(null);

	readonly maxlength = input<string | number | null>(null);

	readonly suffix = input<string>();

	get style(): string {
		const width = this.width();
		const errorClass = this.hasError ? 'govuk-input--error' : '';
		return `govuk-input ${width ? `govuk-input--width-${width}` : ''} ${errorClass}`.trim();
	}

	onBlur(event: FocusEvent) {
		this.onTouched();
		this.blur.emit(event);
	}

	writeValue(obj: any): void {
		this.value.set(obj);
		this.onChange(obj);
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	protected readonly FormNodeWidth = FormNodeWidth;
}
