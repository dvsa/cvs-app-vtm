import { CommonModule, DOCUMENT } from '@angular/common';
import {
	AfterContentInit,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	forwardRef,
	inject,
} from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { SharedModule } from '@shared/shared.module';
import { enhanceSelectElement } from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import {
	Observable,
	ReplaySubject,
	debounceTime,
	distinctUntilChanged,
	fromEvent,
	lastValueFrom,
	takeUntil,
	takeWhile,
} from 'rxjs';
import { CommonValidatorsService } from '../../validators/common-validators.service';

@Component({
	selector: 'govuk-form-group-autocomplete',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
	templateUrl: './govuk-form-group-autocomplete.component.html',
	styleUrls: ['./govuk-form-group-autocomplete.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupAutocompleteComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupAutocompleteComponent
	implements ControlValueAccessor, AfterViewInit, AfterContentInit, OnDestroy
{
	@Output() blur = new EventEmitter<FocusEvent>();
	@Output() focus = new EventEmitter<FocusEvent>();

	@Input()
	value: string | number | boolean | null = null;

	@Input()
	disabled = false;

	@Input()
	tags: CustomTag[] = [];

	@Input({ alias: 'hint' })
	controlHint = '';

	@Input({ alias: 'formControlName', required: true })
	controlName = '';

	@Input({ alias: 'label', required: true })
	controlLabel = '';

	@Input({ alias: 'id' })
	controlId = '';

	@Input()
	allowNull = true;

	@Input()
	width?: FormNodeWidth;

	@Input() noBottomMargin = false;

	@Input() options$!: Observable<any[]>;

	document = inject(DOCUMENT);
	cdr = inject(ChangeDetectorRef);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);

	options: (string | number)[] = [];

	destroy = new ReplaySubject<boolean>(1);

	ngAfterViewInit(): void {
		lastValueFrom(this.options$.pipe(takeWhile((options) => !options || options.length === 0, true)))
			.then((options) => {
				this.options = options;
				this.cdr.detectChanges();

				enhanceSelectElement({
					id: this.labelId,
					selectElement: this.document.querySelector(`#${this.id}`),
					autoselect: false,
					defaultValue: '',
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
				});

				fromEvent(this.document.querySelector(`#${this.id}`)!, 'change')
					.pipe(takeUntil(this.destroy), distinctUntilChanged(), debounceTime(500))
					.subscribe((event) => this.handleChange(event));
			})
			.catch(() => {});
	}

	ngAfterContentInit(): void {
		this.addValidators();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	get control() {
		return this.controlContainer.control?.get(this.controlName);
	}

	get id() {
		return this.controlId || this.controlName;
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
		return `autocomplete__wrapper${this.noBottomMargin ? '' : ' extra-margin'}`;
	}

	get innerStyle(): string {
		return this.width ? ` govuk-input--width-${this.width}` : ' internal-wrapper';
	}

	onChange = (_: any) => {};
	onTouched = () => {};

	writeValue(obj: any): void {
		this.value = obj;
		this.onChange(obj);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	handleChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		this.handleChangeForOption(select.value);
	}

	handleChangeForOption(value: string) {
		const optionValue = this.findOptionValue(value);
		this.onChange(optionValue ?? '[INVALID_OPTION]');
	}

	findOptionValue(label: string) {
		return label ? this.options.find((option) => option === label) : '';
	}

	addValidators() {
		this.control?.addValidators(this.commonValidators.invalidOption(`${this.controlLabel} is invalid`));
	}
}
