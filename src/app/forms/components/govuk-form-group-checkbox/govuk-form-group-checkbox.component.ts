import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { TagDirective } from '@directives/tag/tag.directive';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';

@Component({
	selector: 'govuk-form-group-checkbox',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective],
	templateUrl: './govuk-form-group-checkbox.component.html',
	styleUrls: ['./govuk-form-group-checkbox.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupCheckboxComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupCheckboxComponent extends GovukFormGroupBaseComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | number | boolean | null | undefined>(null);

	readonly maxlength = input<string | number | null>(null);

	readonly suffix = input<string>();

	writeValue(obj: any): void {
		this.value.set(obj);
		this.onChange(obj);
	}
}
