import { DOCUMENT } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { enhanceSelectElement } from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { Observable, lastValueFrom, takeWhile } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
	selector: 'app-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: AutocompleteComponent,
			multi: true,
		},
	],
})
export class AutocompleteComponent extends BaseControlComponent implements AfterViewInit, AfterContentInit {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Input() options$!: Observable<any[]>;
	@Input() defaultValue = '';

	// eslint-disable-next-line max-len
	DROP_DOWN_ARROW =
		'<svg class="autocomplete__dropdown-arrow-down" style="height: 17px;" viewBox="0 0 512 512"  ><path d="M256,298.3L256,298.3L256,298.3l174.2-167.2c4.3-4.2,11.4-4.1,15.8,0.2l30.6,29.9c4.4,4.3,4.5,11.3,0.2,15.5L264.1,380.9  c-2.2,2.2-5.2,3.2-8.1,3c-3,0.1-5.9-0.9-8.1-3L35.2,176.7c-4.3-4.2-4.2-11.2,0.2-15.5L66,131.3c4.4-4.3,11.5-4.4,15.8-0.2L256,298.3  z"/></svg>';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options: any[] = [];

	constructor(
		injector: Injector,
		@Inject(DOCUMENT) private document: Document,
		changeDetectorRef: ChangeDetectorRef
	) {
		super(injector, changeDetectorRef);
	}

	ngAfterViewInit(): void {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		lastValueFrom(this.options$.pipe(takeWhile((options) => !options || options.length === 0, true)))
			.then((options) => {
				this.options = options;
				this.cdr.detectChanges();

				enhanceSelectElement({
					selectElement: this.document.querySelector(`#${this.name}`),
					autoselect: false,
					defaultValue: '',
					showAllValues: true,
					confirmOnBlur: false,
					dropdownArrow: () => this.DROP_DOWN_ARROW,
					onConfirm(selected) {
						self.handleChangeForOption(selected);
					},
				});

				window.document.querySelector(`#${this.name}`)?.addEventListener('change', (event) => this.handleChange(event));
			})
			.catch(() => {});
	}

	override ngAfterContentInit(): void {
		super.ngAfterContentInit();
		this.addValidators();
	}

	get style(): string {
		return `autocomplete__wrapper${this.noBottomMargin ? '' : ' extra-margin'}`;
	}

	get innerStyle(): string {
		return this.width ? ` govuk-input--width-${this.width}` : ' internal-wrapper';
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleChange(event: any) {
		const {
			target: { value },
		} = event;

		this.handleChangeForOption(value);
	}

	handleChangeForOption(value: string) {
		const optionValue = this.findOptionValue(value);

		this.control?.patchValue(optionValue ?? '[INVALID_OPTION]');
		this.control?.markAsTouched();
		this.control?.updateValueAndValidity();
		this.cdr.detectChanges();
	}

	/**
	 * Takes the value from the autocomplete element and looks for a matching option in the options array.
	 * Returns the found value or undefined if no match.
	 * If value is empty, returns `''`.
	 * @param value - value to get option for
	 * @returns `string | undefined`
	 */
	findOptionValue(label: string) {
		return label ? this.options.find((option) => option.label === label)?.value : '';
	}

	addValidators() {
		this.control?.addValidators([CustomValidators.invalidOption]);
	}
}
