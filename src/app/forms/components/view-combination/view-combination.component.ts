import { Component, OnInit, computed, model } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { CustomFormControl, FormNode, FormNodeCombinationOptions } from '@services/dynamic-forms/dynamic-form.types';
import { EMPTY, startWith, switchMap } from 'rxjs';

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

	// form is patched from outside our template, so track its value to stay reactive under OnPush
	private readonly formValue = toSignal(
		toObservable(this.formGroup).pipe(
			switchMap((formGroup) =>
				formGroup instanceof FormGroup ? formGroup.valueChanges.pipe(startWith(formGroup.value)) : EMPTY
			)
		)
	);

	readonly leftValue = computed(() => {
		this.formValue();
		return this.leftComponent?.value;
	});

	readonly rightValue = computed(() => {
		this.formValue();
		return this.rightComponent?.value;
	});

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
