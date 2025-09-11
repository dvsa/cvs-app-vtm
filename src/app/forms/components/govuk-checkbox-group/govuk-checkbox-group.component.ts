import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { TagDirective } from '@directives/tag/tag.directive';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';

@Component({
	selector: 'govuk-checkbox-group',
	imports: [CommonModule, FormsModule, TagComponent, TagDirective],
	templateUrl: './govuk-checkbox-group.component.html',
	styleUrls: ['./govuk-checkbox-group.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukCheckboxGroupComponent),
			multi: true,
		},
	],
})
export class GovukCheckboxGroupComponent extends GovukFormGroupBaseComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<unknown[] | null>(null);
	size = input<'small' | 'regular'>('regular');

	readonly options =
		input.required<
			{
				value: any;
				label: string;
			}[]
		>();

	writeValue(obj: any): void {
		this.value.set(obj);
		this.onChange(obj);
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	toggle(option: any) {
		const value = this.value();

		if (!value) {
			this.value.set([option]);
			this.onChange(this.value());
			return;
		}

		const arr = [...value];
		arr.includes(option) ? arr.splice(arr.indexOf(option), 1) : arr.push(option);
		this.value.set(arr);
		this.onChange(this.value());
	}

	isChecked(value: unknown) {
		return this.value()?.includes(value?.toString());
	}
}
