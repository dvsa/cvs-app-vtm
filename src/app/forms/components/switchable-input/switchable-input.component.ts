import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrefixDirective } from '@directives/prefix/prefix.directive';
import { SuffixDirective } from '@directives/suffix/suffix.directive';
import { MultiOptions } from '@models/options.model';
import { FormNodeEditTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { Observable, of } from 'rxjs';
import { ApprovalTypeInputComponent } from '../approval-type/approval-type.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { CheckboxGroupComponent } from '../checkbox-group/checkbox-group.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { DateComponent } from '../date/date.component';
import { NumberInputComponent } from '../number-input/number-input.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { ReadOnlyComponent } from '../read-only/read-only.component';
import { SelectComponent } from '../select/select.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
	selector: 'app-switchable-input[form][type][name][isEditing]',
	templateUrl: './switchable-input.component.html',
	imports: [
		NgIf,
		NgSwitch,
		FormsModule,
		ReactiveFormsModule,
		NgSwitchCase,
		AutocompleteComponent,
		PrefixDirective,
		CheckboxComponent,
		CheckboxGroupComponent,
		NgTemplateOutlet,
		DateComponent,
		ApprovalTypeInputComponent,
		NumberInputComponent,
		SuffixDirective,
		RadioGroupComponent,
		SelectComponent,
		TextAreaComponent,
		NgSwitchDefault,
		TextInputComponent,
		ReadOnlyComponent,
	],
})
export class SwitchableInputComponent implements OnInit {
	readonly type = input.required<FormNodeEditTypes>();
	readonly form = input.required<FormGroup>();
	readonly name = input.required<string>();

	readonly isEditing = input(true);

	readonly customId = input<string>();
	readonly idExtension = input<number>();
	readonly label = input<string>();
	readonly prefix = input<string>();
	readonly suffix = input<string>();
	readonly width = input<FormNodeWidth>();
	readonly options = input<MultiOptions | undefined>([]);
	readonly propOptions$ = input<Observable<MultiOptions>>();
	readonly hint = input<string>();
	readonly approvalType = input<string>();
	readonly approvalTypeChange = input<boolean | undefined>(false);

	readonly readOnlyDate = input<boolean>();
	readonly vehicleType = input<string | null>();
	delimiter = { regex: '\\. (?<!\\..\\. )', separator: '. ' };

	ngOnInit(): void {
		if (this.requiresOptions && !this.options() && !this.propOptions$()) {
			throw new Error('Cannot use autocomplete or radio control without providing an options array.');
		}
	}

	get requiresOptions(): boolean {
		const type = this.type();
		return (
			type === this.types.AUTOCOMPLETE ||
			type === this.types.CHECKBOXGROUP ||
			type === this.types.DROPDOWN ||
			type === this.types.RADIO
		);
	}

	get options$(): Observable<MultiOptions> {
		return this.propOptions$() ?? of(this.options() ?? []);
	}

	get types(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}
}
