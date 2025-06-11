import { Component, OnInit, model } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { CustomFormControl, FormNode, FormNodeCombinationOptions } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: '[app-view-combination]',
	templateUrl: './view-combination.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ViewCombinationComponent,
			multi: true,
		},
	],
	imports: [DefaultNullOrEmpty],
})
export class ViewCombinationComponent implements OnInit {
	formNode = model<FormNode>();
	formGroup = model<FormGroup>();

	leftComponent?: CustomFormControl;
	rightComponent?: CustomFormControl;
	separator = ' ';
	label?: string;

	constructor() {
		if (!this.formNode()) {
			this.formNode.set(<FormNode>{});
		}
		if (!this.formGroup()) {
			this.formGroup.set(<FormGroup>{});
		}
	}
	ngOnInit(): void {
		const formNode = this.formNode();
		const formGroup = this.formGroup();
		if (!formNode || !formGroup) return;
		const options = <FormNodeCombinationOptions>formNode.options;
		this.leftComponent = this.findComponentByName(options.leftComponentName, formGroup);
		this.rightComponent = this.findComponentByName(options.rightComponentName, formGroup);
		this.separator = options.separator;
		this.label = formNode.label;
	}

	private findComponentByName(nodeName: string, formGroup: FormGroup): CustomFormControl {
		return formGroup.get(nodeName) as CustomFormControl;
	}
}
