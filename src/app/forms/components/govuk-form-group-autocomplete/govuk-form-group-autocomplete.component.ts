import { CommonModule, DOCUMENT } from '@angular/common';
import {
	AfterContentInit,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	forwardRef,
	inject,
	input,
	model,
	output,
} from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

import { TagDirective } from '@directives/tag/tag.directive';
import {
	AutocompleteEnhanceParams,
	enhanceSelectElement,
} from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest, takeUntil, takeWhile } from 'rxjs';
import { TagComponent } from '../../../components/tag/tag.component';
import { CommonValidatorsService } from '../../validators/common-validators.service';
@Component({
	selector: 'govuk-form-group-autocomplete',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective],
	templateUrl: './govuk-form-group-autocomplete.component.html',
	styleUrls: ['./govuk-form-group-autocomplete.component.scss'],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GovukFormGroupAutocompleteComponent), multi: true },
	],
})
export class GovukFormGroupAutocompleteComponent
	implements ControlValueAccessor, AfterViewInit, AfterContentInit, OnDestroy
{
	readonly blur = output<FocusEvent>();

	readonly focus = output<FocusEvent>();

	readonly isCreateMode = input(false);

	value = model<string | number | boolean | null>(null);

	disabled = model(false);

	readonly tags = input<CustomTag[]>([]);

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input.required<string>({ alias: 'formControlName' });

	readonly controlLabel = input.required<string>({ alias: 'label' });

	readonly controlId = input('', { alias: 'id' });

	readonly allowNull = input(true);

	readonly allowEmpty = input<boolean>(false);

	readonly width = input<FormNodeWidth>();

	readonly noBottomMargin = input(false);

	readonly options$ = input.required<Observable<any[]>>();

	readonly prefix = input<string>();

	document = inject(DOCUMENT);
	cdr = inject(ChangeDetectorRef);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);

	options: (string | number)[] = [];

	destroy = new ReplaySubject<boolean>(1);
	valueSub = new BehaviorSubject<unknown>(null);

	ngAfterViewInit(): void {
		combineLatest([this.options$().pipe(takeWhile((options) => !options || options.length === 0, true)), this.valueSub])
			.pipe(takeUntil(this.destroy))
			.subscribe(([options, latest]) => {
				this.options = options;

				const enhanceParams: AutocompleteEnhanceParams = {
					id: this.id,
					defaultValue: '',
					selectElement: this.document.querySelector(`#${this.id}`),
					autoselect: false,
					showAllValues: true,
					confirmOnBlur: false,
					source: this.options,
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

				this.document.querySelector(`#${this.id}`)?.addEventListener('change', (event) => this.handleChange(event));
			});
	}

	ngAfterContentInit(): void {
		this.addValidators();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	get control() {
		return this.controlContainer.control?.get(this.controlName());
	}

	get id() {
		return this.controlId() || this.controlName();
	}

	get hintId() {
		return `${this.id}-hint`;
	}

	get labelId() {
		return `${this.id}-label`;
	}

	get errorId() {
		return `${this.id}-error`;
	}

	get hasError() {
		return this.control?.invalid && this.control?.touched && this.control?.errors;
	}

	get style(): string {
		return `autocomplete__wrapper${this.noBottomMargin() ? '' : ' extra-margin'}`;
	}

	onChange = (_: any) => {};
	onTouched = () => {};

	writeValue(obj: any): void {
		this.value.set(obj);
		this.valueSub.next(obj);
		this.onChange(obj);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
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
		return label ? this.options.find((option) => option === label) : '';
	}

	addValidators() {
		this.control?.addValidators(this.commonValidators.invalidOption(`${this.controlLabel()} is invalid`));
	}
}
