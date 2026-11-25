import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { ReferenceDataRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { defectsLoadingState, deleteDefect, selectDefectCategoryFromRoute } from '@/src/app/store/defects';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-category-delete',
	templateUrl: './defect-category-delete.component.html',
	styleUrls: ['./defect-category-delete.component.scss'],
	imports: [RoleRequiredDirective, ButtonComponent, ButtonGroupComponent],
})
export class DefectCategoryDeleteComponent {
	store = inject(Store);
	router = inject(Router);
	errorService = inject(GlobalErrorService);
	defectCategory = this.store.selectSignal(selectDefectCategoryFromRoute);
	loading = this.store.selectSignal(defectsLoadingState);
	roles = Roles;

	handleSubmit() {
		const category = this.defectCategory();
		if (!category) {
			this.errorService.setErrors([{ error: 'The defect category could not be found.' }]);
			return;
		}
		if (this.loading()) return;

		this.errorService.clearErrors();
		this.store.dispatch(deleteDefect({ id: category.imNumber }));
	}

	handleCancel() {
		this.errorService.clearErrors();
		void this.router.navigate([RootRoutes.REFERENCE_DATA, ReferenceDataRoutes.DEFECTS], {
			queryParamsHandling: 'preserve',
		});
	}
}
