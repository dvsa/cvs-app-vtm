import { ButtonComponent } from '@/src/app/components/button/button.component';
import { TagComponent } from '@/src/app/components/tag/tag.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { MultiOptions } from '@/src/app/models/options.model';
import { Roles } from '@/src/app/models/roles.enum';
import { selectDefectCategoryFromRoute, selectDefectItemFromRoute } from '@/src/app/store/defects';
import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefectDeficiencyReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-deficiencies-list',
	templateUrl: './defect-deficiencies-list.component.html',
	styleUrls: ['./defect-deficiencies-list.component.scss'],
	imports: [
		RoleRequiredDirective,
		ButtonComponent,
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupSelectComponent,
		UpperCasePipe,
		TagComponent,
	],
})
export class DefectDeficienciesListComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	defectItem = this.store.selectSignal(selectDefectItemFromRoute);
	defectCategory = this.store.selectSignal(selectDefectCategoryFromRoute);

	form = this.fb.group({
		searchTerm: this.fb.control<string>(''),
		searchFilter: this.fb.control<string>(''),
	});

	roles = Roles;
	searchFilterOptions: MultiOptions = [{ label: 'All', value: '' }];

	handleClear() {}

	handleAdd() {
		this.router.navigate(['create'], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'merge',
		});
	}

	handleViewDeletedItems() {
		this.router.navigate(['deleted-items'], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'merge',
		});
	}

	handleSearch() {
		const searchTerm = this.form.controls.searchTerm.value;
		const searchFilter = this.form.controls.searchFilter.value;
	}

	handleAmendDeficiency(deficiency: DefectDeficiencyReferenceDataSchema) {
		this.router.navigate([deficiency.ref, 'amend'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
	}

	handleDeleteDeficiency(deficiency: DefectDeficiencyReferenceDataSchema) {
		this.router.navigate([deficiency.ref, 'delete'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
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
