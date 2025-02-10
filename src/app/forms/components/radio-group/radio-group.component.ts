import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
	selector: 'app-radio-group',
	templateUrl: './radio-group.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: RadioGroupComponent,
			multi: true,
		},
	],
	styleUrls: ['./radio-group.component.scss'],
})
export class RadioGroupComponent extends BaseControlComponent {
	@Input() options: FormNodeOption<string | number | boolean | null>[] = [];
	@Input() inline = false;

	getLabel(value: string | number | boolean | null): string | undefined {
		return this.options.find((option) => option.value === value)?.label;
	}

	trackByFn = (index: number): number => index;

	getId(value: string | number | boolean | null, name: string) {
		const id = `${name}-${value}-radio`;
		if (this.control?.meta) {
			this.control.meta.customId = id;
		}
		return id;
	}
}
