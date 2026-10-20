import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoEmojisDirective } from '../../directives/no-emojis/no-emojis.directive';
import { CustomFormControlDirective } from '../custom-form-control/custom-form-control.directive';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	imports: [FormsModule, NoEmojisDirective],
})
export class InputComponent extends CustomFormControlDirective<string | null> {
	readonly id = input<string>();
	readonly label = input<string>();
	readonly hint = input<string>();
	readonly prefix = input<string>();
	readonly suffix = input<string>();
	readonly showErrors = input<boolean>(true);
	readonly showGroupErrors = input<boolean>(false);
	readonly type = input<HTMLInputElement['type']>('text');
	readonly inputClass = input<string>();
}
