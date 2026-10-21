import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '../../../../node_modules/@angular/common/types/_common_module-chunk';
import { MultiOptions } from '../../models/options.model';
import { CustomFormControlDirective } from '../custom-form-control/custom-form-control.directive';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	imports: [FormsModule, NgStyle],
})
export class SelectComponent<T> extends CustomFormControlDirective<T> {
	readonly id = input<string>();
	readonly label = input<string>();
	readonly hint = input<string>();
	readonly placeholder = input<string>();
	readonly showErrors = input<boolean>(true);
	readonly showGroupErrors = input<boolean>(false);
	readonly selectClass = input<string>();
	readonly options = input.required<MultiOptions<T>>();
}
