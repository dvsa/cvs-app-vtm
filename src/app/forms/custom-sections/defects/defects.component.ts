import { Component, OnDestroy, OnInit, input, output } from '@angular/core';
import { Defect } from '@models/defects/defect.model';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { Subscription, debounceTime } from 'rxjs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '@pipes/truncate/truncate.pipe';
import { ButtonComponent } from '../../../components/button/button.component';
import { TagComponent } from '../../../components/tag/tag.component';

@Component({
	selector: 'app-defects[defects][template]',
	templateUrl: './defects.component.html',
	imports: [FormsModule, ReactiveFormsModule, RouterLink, TagComponent, ButtonComponent, TruncatePipe],
})
export class DefectsComponent implements OnInit, OnDestroy {
	readonly isEditing = input(false);
	readonly defects = input.required<Defect[] | null>();
	readonly template = input.required<FormNode>();
	readonly data = input<Partial<TestResultModel>>({});

	readonly formChange = output<Record<string, any> | [][]>();

	public form!: CustomFormGroup;
	private formSubscription = new Subscription();
	private defectsFormArray?: CustomFormArray;

	constructor(private dfs: DynamicFormService) {}

	ngOnInit(): void {
		this.form = this.dfs.createForm(this.template(), this.data()) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => {
			this.formChange.emit(event);
		});
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
	}

	get defectsForm(): CustomFormArray {
		if (!this.defectsFormArray) {
			this.defectsFormArray = this.form?.get(['testTypes', '0', 'defects']) as CustomFormArray;
		}
		return this.defectsFormArray;
	}

	get defectCount(): number {
		return this.defectsForm?.controls.length;
	}

	get testDefects(): TestResultDefect[] {
		return this.defectsForm.controls.map((control) => {
			const formGroup = control as CustomFormGroup;
			return formGroup.getCleanValue(formGroup) as TestResultDefect;
		});
	}

	categoryColor(category: CategoryColorKey): CategoryColor {
		return categoryColors[`${category}`];
	}
}

const categoryColors = {
	major: 'orange',
	minor: 'yellow',
	dangerous: 'red',
	advisory: 'blue',
} as const;

type CategoryColors = typeof categoryColors;
type CategoryColorKey = keyof CategoryColors;
type CategoryColor = CategoryColors[CategoryColorKey];
