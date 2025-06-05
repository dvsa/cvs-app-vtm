import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

@Component({
	selector: 'app-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: TextInputComponent,
			multi: true,
		},
	],
	imports: [
		NgClass,
		TagComponent,
		FieldErrorMessageComponent,
		NgTemplateOutlet,
		FormsModule,
		ToUppercaseDirective,
		NumberOnlyDirective,
		NoEmojisDirective,
	],
})
export class TextInputComponent extends BaseControlComponent {
	readonly numeric = input(false);
	readonly uppercase = input<boolean | undefined>(false);
	readonly blur = output<FocusEvent>();

	get style(): string {
		const width = this.width();
		return `govuk-input ${width ? `govuk-input--width-${width}` : ''}`;
	}
}
