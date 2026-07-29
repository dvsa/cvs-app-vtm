import { AppRoutingModule } from '@/src/app/app-routing.module';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { MultiOptions } from '@/src/app/models/options.model';
import { Roles } from '@/src/app/models/roles.enum';
import { defects } from '@/src/app/store/defects';
import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-categories-list',
	templateUrl: './defect-categories-list.component.html',
	styleUrls: ['./defect-categories-list.component.scss'],
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
export class DefectsListComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	defects = this.store.selectSignal(defects);

	form = this.fb.group({
		searchTerm: this.fb.control<string>(''),
		searchFilter: this.fb.control<string>(''),
	});

	roles = Roles;
	searchFilterOptions: MultiOptions = [{ label: 'All', value: '' }];

	handleClear() {}

	handleAdd() {
		this.router.navigate(['create'], {
			queryParamsHandling: 'merge',
			relativeTo: this.activatedRoute,
		});
	}

	handleView(defect: DefectCategoryReferenceDataSchema) {
		this.router.navigate([defect.imNumber], {
			queryParams: { forVehicleType: defect.forVehicleType.join(',') },
			queryParamsHandling: 'merge',
			relativeTo: this.activatedRoute,
		});
	}

	handleViewDeletedItems() {
		this.router.navigate(['deleted-items'], {
			queryParamsHandling: 'merge',
			relativeTo: this.activatedRoute,
		});
	}

	handleSearch() {
		const searchTerm = this.form.controls.searchTerm.value;
		const searchFilter = this.form.controls.searchFilter.value;
	}

	handleAmendDefect(defect: DefectCategoryReferenceDataSchema) {
		this.router.navigate([defect.imNumber, 'amend'], {
			queryParams: { forVehicleType: defect.forVehicleType.join(',') },
			queryParamsHandling: 'merge',
			relativeTo: this.activatedRoute,
		});
	}

	handleDeleteDefect(defect: DefectCategoryReferenceDataSchema) {
		this.router.navigate([defect.imNumber, 'delete'], {
			queryParams: { forVehicleType: defect.forVehicleType.join(',') },
			queryParamsHandling: 'merge',
			relativeTo: this.activatedRoute,
		});
	}
}
