import { KeyValue } from '@angular/common';
import { AfterContentInit, Component, InjectionToken, Injector, Input, OnInit } from '@angular/core';
import { FormGroup, NgControl } from '@angular/forms';
// eslint-disable-next-line import/no-cycle
import { CustomFormControl, FormNodeEditTypes, FormNodeOption } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { Observable, map, of } from 'rxjs';

@Component({
	selector: 'app-dynamic-form-field',
	templateUrl: './dynamic-form-field.component.html',
	providers: [MultiOptionsService],
})
export class DynamicFormFieldComponent implements OnInit, AfterContentInit {
	@Input() control?: KeyValue<string, CustomFormControl>;
	@Input() form?: FormGroup;
	@Input() customId?: string;

	customFormControlInjector?: Injector;

	constructor(
		private optionsService: MultiOptionsService,
		private injector: Injector
	) {}

	get formNodeEditTypes(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get options$(): Observable<FormNodeOption<string | number | boolean>[]> {
		const meta = this.control?.value.meta;

		return meta?.referenceData
			? this.optionsService.getOptions(meta.referenceData).pipe(map((l) => l || []))
			: of((meta?.options as FormNodeOption<string | number | boolean>[]) ?? []);
	}

	ngOnInit(): void {
		this.createCustomFormControlInjector();
	}

	ngAfterContentInit(): void {
		const referenceData = this.control?.value.meta?.referenceData;

		if (referenceData) {
			this.optionsService.loadOptions(referenceData);
		}
	}

	createCustomFormControlInjector() {
		this.customFormControlInjector = Injector.create({
			providers: [
				{ provide: FORM_INJECTION_TOKEN, useValue: this.form },
				{ provide: NgControl, useValue: { control: this.control } },
			],
			parent: this.injector,
		});
	}
}
export const FORM_INJECTION_TOKEN = new InjectionToken('form');
