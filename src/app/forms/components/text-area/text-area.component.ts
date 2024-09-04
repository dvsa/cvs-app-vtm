import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValidatorNames } from '@models/validators.enum';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
	selector: 'app-text-area',
	templateUrl: './text-area.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: TextAreaComponent,
			multi: true,
		},
	],
})
export class TextAreaComponent extends BaseControlComponent {
	get maxLength(): number | undefined {
		return this.control?.meta.validators?.find((v) => v.name === ValidatorNames.MaxLength)?.args as number | undefined;
	}
}
