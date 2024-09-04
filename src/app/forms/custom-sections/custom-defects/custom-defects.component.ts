import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CustomDefect, CustomDefects } from '@api/test-results';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-custom-defects[template]',
	templateUrl: './custom-defects.component.html',
	styleUrls: [],
})
export class CustomDefectsComponent implements OnInit, OnDestroy {
	@Input() isEditing = false;
	@Input() template!: FormNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Input() data: any = {};

	@Output() formChange = new EventEmitter();
	form!: CustomFormGroup;

	private formSubscription = new Subscription();
	defectNameType?: string;

	constructor(private dfs: DynamicFormService) {}

	ngOnInit(): void {
		this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges.subscribe((event) => {
			this.formChange.emit(event);
		});
		this.defectNameType = this.template.name === 'additionalDefectsSection' ? 'Additional Defect' : 'Custom Defect';
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

	trackByFn(index: number): number {
		return index;
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
