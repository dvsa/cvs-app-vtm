import { AppRoutingModule } from '@/src/app/app-routing.module';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { MultiOptions } from '@/src/app/models/options.model';
import { Roles } from '@/src/app/models/roles.enum';
import { selectDefectCategoryFromRoute } from '@/src/app/store/defects';
import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DefectItemReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-items-list',
	templateUrl: './defect-items-list.component.html',
	styleUrls: ['./defect-items-list.component.scss'],
	imports: [
		RoleRequiredDirective,
		ButtonComponent,
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupSelectComponent,
		UpperCasePipe,
		AppRoutingModule,
		RouterLink,
	],
})
export class DefectItemsListComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
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
			queryParamsHandling: 'preserve',
		});
	}

	handleView(defectItem: DefectItemReferenceDataSchema) {
		this.router.navigate([defectItem.itemNumber], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'preserve',
		});
	}

	handleViewDeletedItems() {
		this.router.navigate(['deleted-items'], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'preserve',
		});
	}

	handleSearch() {
		const searchTerm = this.form.controls.searchTerm.value;
		const searchFilter = this.form.controls.searchFilter.value;
	}

	handleAmendDefectItem(defectItem: DefectItemReferenceDataSchema) {
		this.router.navigate([defectItem.itemNumber, 'amend'], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'preserve',
		});
	}

	handleDeleteDefectItem(defectItem: DefectItemReferenceDataSchema) {
		this.router.navigate([defectItem.itemNumber, 'delete'], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'preserve',
		});
	}
}
