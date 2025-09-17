import { CommonModule } from '@angular/common';
import {
	AfterContentInit,
	AfterViewInit,
	Component,
	DOCUMENT,
	OnDestroy,
	forwardRef,
	inject,
	input,
	model,
	output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';
import {
	AutocompleteEnhanceParams,
	enhanceSelectElement,
} from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest, takeUntil, takeWhile } from 'rxjs';
import { TagComponent } from '../../../components/tag/tag.component';
@Component({
	selector: 'govuk-form-group-autocomplete',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent],
	templateUrl: './govuk-form-group-autocomplete.component.html',
	styleUrls: ['./govuk-form-group-autocomplete.component.scss'],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GovukFormGroupAutocompleteComponent), multi: true },
	],
})
export class GovukFormGroupAutocompleteComponent
	extends GovukFormGroupBaseComponent
	implements ControlValueAccessor, AfterViewInit, AfterContentInit, OnDestroy
{
	readonly blur = output<FocusEvent>();

	readonly focus = output<FocusEvent>();

	value = model<string | number | boolean | null>(null);

	readonly allowNull = input(true);

	readonly allowEmpty = input<boolean>(false);

	readonly noBottomMargin = input(false);

	readonly placeholder = input<string>('');

	readonly options$ = input.required<Observable<any[]>>();

	document = inject(DOCUMENT);

	autocompleteOptions: (string | number)[] = [];

	destroy = new ReplaySubject<boolean>(1);
	valueSub = new BehaviorSubject<unknown>(null);

	ngAfterViewInit(): void {
		combineLatest([this.options$().pipe(takeWhile((options) => !options || options.length === 0, true)), this.valueSub])
			.pipe(takeUntil(this.destroy))
			.subscribe(([options, latest]) => {
				this.autocompleteOptions = options;

				const enhanceParams: AutocompleteEnhanceParams = {
					id: this.id,
					defaultValue: '',
					selectElement: this.document.querySelector(`#${this.id}`),
					autoselect: false,
					showAllValues: true,
					confirmOnBlur: false,
					source: this.autocompleteOptions,
					dropdownArrow: () => `
            <svg class="autocomplete__dropdown-arrow-down"style="height: 17px;" viewBox="0 0 512 512">
              <path d="M256,298.3L256,298.3L256,298.3l174.2-167.2c4.3-4.2,11.4-4.1,15.8,0.2l30.6,29.9c4.4,4.3,4.5,11.3,0.2,15.5L264.1,380.9  c-2.2,2.2-5.2,3.2-8.1,3c-3,0.1-5.9-0.9-8.1-3L35.2,176.7c-4.3-4.2-4.2-11.2,0.2-15.5L66,131.3c4.4-4.3,11.5-4.4,15.8-0.2L256,298.3  z"/>
            </svg>
          `,
					onConfirm: (selected) => {
						this.handleChangeForOption(selected);
					},
				};

				if (latest) {
					enhanceParams.defaultValue = latest.toString();
				}

				enhanceSelectElement(enhanceParams);
				const control = this.document.querySelector(`#${this.id}`);
				control?.setAttribute('placeholder', this.placeholder());
				control?.addEventListener('change', (event) => this.handleChange(event));
			});
	}

	ngAfterContentInit(): void {
		this.addValidators();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	get style(): string {
		return `autocomplete__wrapper${this.noBottomMargin() ? '' : ' extra-margin'}`;
	}
	writeValue(obj: any): void {
		this.value.set(obj);
		this.valueSub.next(obj);
		this.onChange(obj);
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	handleChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		this.handleChangeForOption(select.value);
	}

	handleChangeForOption(value: string) {
		const optionValue = this.findOptionValue(value);

		if (this.allowEmpty() && !optionValue) {
			// default empty values to null
			this.onChange(null);
		} else {
			this.onChange(optionValue ?? '[INVALID_OPTION]');
		}

		this.onTouched();
	}

	findOptionValue(label: string) {
		return label ? this.autocompleteOptions.find((option) => option === label) : '';
	}

	addValidators() {
		this.control?.addValidators(this.commonValidators.invalidOption(`${this.controlLabel()} is invalid`));
	}
}
