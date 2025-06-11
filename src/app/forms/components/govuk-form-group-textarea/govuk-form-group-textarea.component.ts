import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

import { TagDirective } from '@directives/tag/tag.directive';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';

@Component({
	selector: 'govuk-form-group-textarea',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective, NoEmojisDirective],
	templateUrl: './govuk-form-group-textarea.component.html',
	styleUrls: ['./govuk-form-group-textarea.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupTextareaComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupTextareaComponent extends GovukFormGroupBaseComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | null | undefined>(null);

	readonly maxLength = input<number | null>(null);

	get style(): string {
		const width = this.width();
		const errorClass = this.hasError ? 'govuk-textarea--error' : '';
		return `govuk-textarea ${width ? `govuk-textarea--width-${width}` : ''} ${errorClass}`.trim();
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
