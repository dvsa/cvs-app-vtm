import { NoEmojisDirective } from '@/src/app/directives/no-emojis/no-emojis.directive';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValidatorNames } from '@models/validators.enum';
import { TagComponent } from '../../../components/tag/tag.component';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

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
	imports: [TagComponent, FieldErrorMessageComponent, FormsModule, NgClass, NoEmojisDirective],
})
export class TextAreaComponent extends BaseControlComponent {
	get maxLength(): number | undefined {
		return this.control?.meta.validators?.find((v) => v.name === ValidatorNames.MaxLength)?.args as number | undefined;
	}
}
