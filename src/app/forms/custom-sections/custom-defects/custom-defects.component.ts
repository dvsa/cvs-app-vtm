import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@components/button/button.component';
import { CustomDefect } from '@models/test-results/customDefect';
import { CustomDefects } from '@models/test-results/customDefects';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { Subscription } from 'rxjs';
import { CustomDefectComponent } from '../custom-defect/custom-defect.component';

@Component({
	selector: 'app-custom-defects[template]',
	templateUrl: './custom-defects.component.html',
	styleUrls: [],
	imports: [FormsModule, ReactiveFormsModule, CustomDefectComponent, ButtonComponent],
})
export class CustomDefectsComponent implements OnInit, OnDestroy {
	dfs = inject(DynamicFormService);

	readonly isEditing = input(false);
	readonly template = input.required<FormNode>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly data = input<any>({});

	readonly formChange = output<Record<string, any> | [][]>();
	form!: CustomFormGroup;

	private formSubscription = new Subscription();
	defectNameType?: string;

	ngOnInit(): void {
		this.form = this.dfs.createForm(this.template(), this.data()) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges.subscribe((event) => {
			this.formChange.emit(event);
		});
		this.defectNameType = this.template().name === 'additionalDefectsSection' ? 'Additional Defect' : 'Custom Defect';
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
	}

	get customDefectsForm() {
		return this.form?.get(['testTypes', '0', 'customDefects']) as CustomFormArray;
	}

	getCustomDefectForm(i: number) {
		return this.customDefectsForm?.controls[`${i}`] as CustomFormGroup;
	}

	get defectCount() {
		return this.customDefectsForm?.controls.length;
	}

	get customDefects(): CustomDefects {
		return this.customDefectsForm.controls.map(
			(control) => (control as CustomFormGroup).getCleanValue(control as CustomFormGroup) as CustomDefect
		);
	}

	handleRemoveDefect(index: number): void {
		this.customDefectsForm.removeAt(index);
	}

	handleAddCustomDefect() {
		this.customDefectsForm.addControl();
	}
}
