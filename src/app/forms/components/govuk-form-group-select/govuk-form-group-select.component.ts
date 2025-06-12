import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MultiOptions } from '@models/options.model';

import { TagDirective } from '@directives/tag/tag.directive';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';
import { TagComponent } from '../../../components/tag/tag.component';

@Component({
	selector: 'govuk-form-group-select',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective],
	templateUrl: './govuk-form-group-select.component.html',
	styleUrls: ['./govuk-form-group-select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupSelectComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupSelectComponent extends GovukFormGroupBaseComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | number | boolean | null>(null);

	readonly options = input.required<MultiOptions>();

	readonly allowNull = input(true);

	get style(): string {
		const width = this.width();
		const errorClass = this.hasError ? 'govuk-select--error' : '';
		return `govuk-select ${width ? `govuk-input--width-${width}` : ''} ${errorClass}`.trim();
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
}
