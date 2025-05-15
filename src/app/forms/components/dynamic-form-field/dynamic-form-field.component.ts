import { AsyncPipe, KeyValue, NgComponentOutlet } from '@angular/common';
import { AfterContentInit, Component, InjectionToken, Injector, OnInit, input } from '@angular/core';
import { FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
// eslint-disable-next-line import/no-cycle
import {
	CustomFormControl,
	CustomFormGroup,
	FormNodeEditTypes,
	FormNodeOption,
} from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { Observable, map, of } from 'rxjs';
import { SuffixDirective } from '../../../directives/suffix/suffix.directive';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { CheckboxGroupComponent } from '../checkbox-group/checkbox-group.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { DateComponent } from '../date/date.component';
import { NumberInputComponent } from '../number-input/number-input.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { SelectComponent } from '../select/select.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
	selector: 'app-dynamic-form-field',
	templateUrl: './dynamic-form-field.component.html',
	providers: [MultiOptionsService],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		AutocompleteComponent,
		DateComponent,
		NumberInputComponent,
		SuffixDirective,
		RadioGroupComponent,
		SelectComponent,
		TextAreaComponent,
		CheckboxComponent,
		CheckboxGroupComponent,
		TextInputComponent,
		NgComponentOutlet,
		AsyncPipe,
	],
})
export class DynamicFormFieldComponent implements OnInit, AfterContentInit {
	readonly control = input<KeyValue<string, CustomFormControl>>();
	readonly form = input<FormGroup>();
	readonly parentForm = input<CustomFormGroup>();
	readonly customId = input<string>();

	customFormControlInjector?: Injector;
	customFormControlInputs?: Record<string, unknown>;

	constructor(
		private optionsService: MultiOptionsService,
		private injector: Injector
	) {}

	get formNodeEditTypes(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get options$(): Observable<FormNodeOption<string | number | boolean>[]> {
		const meta = this.control()?.value.meta;

		return meta?.referenceData
			? this.optionsService.getOptions(meta.referenceData).pipe(map((l) => l || []))
			: of((meta?.options as FormNodeOption<string | number | boolean>[]) ?? []);
	}

	ngOnInit(): void {
		this.createCustomFormControlInjector();
		this.customFormControlInputs = { parentForm: this.parentForm() };
	}

	ngAfterContentInit(): void {
		const referenceData = this.control()?.value.meta?.referenceData;

		if (referenceData) {
			this.optionsService.loadOptions(referenceData);
		}
	}

	createCustomFormControlInjector() {
		this.customFormControlInjector = Injector.create({
			providers: [
				{ provide: FORM_INJECTION_TOKEN, useValue: this.form() },
				{ provide: NgControl, useValue: { control: this.control() } },
			],
			parent: this.injector,
		});
	}
}
export const FORM_INJECTION_TOKEN = new InjectionToken('form');
