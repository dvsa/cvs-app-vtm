import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, OnInit, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { MultiOption } from '@models/options.model';
import { Observable, firstValueFrom, skipWhile, take } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

@Component({
	selector: 'app-suggestive-input',
	templateUrl: './suggestive-input.component.html',
	styleUrls: ['./suggestive-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: SuggestiveInputComponent,
			multi: true,
		},
	],
	imports: [NgClass, FieldErrorMessageComponent, NgTemplateOutlet, FormsModule, AsyncPipe],
})
export class SuggestiveInputComponent extends BaseControlComponent implements AfterContentInit, OnInit {
	readonly options$ = input.required<Observable<MultiOption[]>>();
	readonly defaultValue = input('');

	field_value = '';

	ngOnInit(): void {
		this.options$()
			.pipe(
				skipWhile((options) => !options.length),
				take(1)
			)
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			.subscribe(async () => {
				this.field_value = (await this.findOption(this.value, 'value'))?.label ?? '';
			});
	}

	override ngAfterContentInit() {
		super.ngAfterContentInit();
		this.addValidators();
	}

	get style(): string {
		const width = this.width();
		return `govuk-input${width ? ` govuk-input--width-${width}` : ''}`;
	}

	async handleChangeForOption(value: string) {
		const option = await this.findOption(value);

		this.field_value = option?.label ?? value;
		// if option found, patch option value else if value patch `[INVALID_OPTION]` else value (empty string)
		// eslint-disable-next-line no-nested-ternary
		this.control?.patchValue(option ? option.value : value ? '[INVALID_OPTION]' : value);
		this.cdr.markForCheck();
	}

	/**
	 * Takes the value from the autocomplete element and looks for a matching option in the options array.
	 * Returns a promise of the found option or undefined if no match.
	 * @param {string} value - value to get option for
	 * @param {string} key - option search key. Defaults to `label`
	 * @returns `MultiOption | undefined`
	 */
	async findOption(val: string, key = 'label'): Promise<MultiOption | undefined> {
		return firstValueFrom(this.options$()).then((options) =>
			options.find((option) => option[key as keyof MultiOption] === val)
		);
	}

	addValidators() {
		this.control?.addValidators([CustomValidators.invalidOption]);
	}
}
