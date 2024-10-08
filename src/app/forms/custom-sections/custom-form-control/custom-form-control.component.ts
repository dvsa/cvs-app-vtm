import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { CustomControl } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'app-custom-form-control',
	templateUrl: './custom-form-control.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: CustomFormControlComponent,
			multi: true,
		},
	],
})
export class CustomFormControlComponent extends BaseControlComponent {
	protected form?: FormGroup;

	override ngAfterContentInit(): void {
		const injectedControl = this.injector.get(NgControl, null);
		if (injectedControl) {
			const ngControl = injectedControl.control as unknown as KeyValue<string, CustomControl>;
			if (ngControl.value) {
				this.name = ngControl.key;
				this.control = ngControl.value;
				this.form = this.injector.get(FORM_INJECTION_TOKEN) as FormGroup;
			}
		}
	}
}
