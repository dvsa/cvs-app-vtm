import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MultiOptions } from '@models/options.model';
import { FormNodeEditTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { Observable, of } from 'rxjs';

@Component({
	selector: 'app-switchable-input[form][type][name][isEditing]',
	templateUrl: './switchable-input.component.html',
})
export class SwitchableInputComponent implements OnInit {
	@Input() type!: FormNodeEditTypes;
	@Input() form!: FormGroup;
	@Input() name!: string;

	@Input() isEditing = true;

	@Input() customId?: string;
	@Input() idExtension?: number;
	@Input() label?: string;
	@Input() prefix?: string;
	@Input() suffix?: string;
	@Input() width?: FormNodeWidth;
	@Input() options?: MultiOptions = [];
	@Input() propOptions$?: Observable<MultiOptions>;
	@Input() hint?: string;
	@Input() approvalType?: string;
	@Input() approvalTypeChange?: boolean | undefined = false;

	@Input() readOnlyDate?: boolean;
	@Input() vehicleType?: string | null;
	delimiter = { regex: '\\. (?<!\\..\\. )', separator: '. ' };

	ngOnInit(): void {
		if (this.requiresOptions && !this.options && !this.propOptions$) {
			throw new Error('Cannot use autocomplete or radio control without providing an options array.');
		}
	}

	get requiresOptions(): boolean {
		return (
			this.type === this.types.AUTOCOMPLETE ||
			this.type === this.types.CHECKBOXGROUP ||
			this.type === this.types.DROPDOWN ||
			this.type === this.types.RADIO
		);
	}

	get options$(): Observable<MultiOptions> {
		return this.propOptions$ ?? of(this.options ?? []);
	}

	get types(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}
}
