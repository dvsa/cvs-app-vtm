import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { TagComponent } from '@components/tag/tag.component';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TruncatePipe } from '@pipes/truncate/truncate.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { Subscription, debounceTime } from 'rxjs';

@Component({
	selector: 'app-defects[defects][template]',
	templateUrl: './defects.component.html',
	imports: [FormsModule, ReactiveFormsModule, RouterLink, TagComponent, ButtonComponent, TruncatePipe],
})
export class DefectsComponent implements OnInit, OnDestroy {
	dfs = inject(DynamicFormService);

	readonly isEditing = input(false);
	readonly defects = input.required<DefectCategoryReferenceDataSchema[] | null>();
	readonly template = input.required<FormNode>();
	readonly data = input<Partial<TestResultSchema>>({});

	readonly formChange = output<Record<string, any> | [][]>();

	public form!: CustomFormGroup;
	private formSubscription = new Subscription();
	private defectsFormArray?: CustomFormArray;

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

	get testDefects(): DefectDetailsSchema[] {
		return this.defectsForm.controls.map((control) => {
			const formGroup = control as CustomFormGroup;
			return formGroup.getCleanValue(formGroup) as DefectDetailsSchema;
		});
	}

	categoryColor(category: string): string {
		return categoryColors[category as keyof typeof categoryColors];
	}
}

const categoryColors = {
	major: 'orange',
	minor: 'yellow',
	dangerous: 'red',
	advisory: 'blue',
} as const;
