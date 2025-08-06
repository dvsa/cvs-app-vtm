import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '../../components/button-group/button-group.component';
import { ButtonComponent } from '../../components/button/button.component';
import { GovukFormGroupCheckboxComponent } from '../../forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { RootRoutes } from '../../models/routes.enum';
import { FeatureToggleService } from '../../services/feature-toggle-service/feature-toggle-service';

@Component({
	selector: 'app-betas',
	templateUrl: './betas.component.html',
	imports: [GovukFormGroupCheckboxComponent, FormsModule, ReactiveFormsModule, ButtonGroupComponent, ButtonComponent],
})
export class BetasComponent {
	fb = inject(FormBuilder);
	route = inject(ActivatedRoute);
	router = inject(Router);
	featureToggleService = inject(FeatureToggleService);

	form = this.fb.group({
		TechRecordRedesign: this.fb.nonNullable.control<boolean>(false),
		TechRecordRedesignCreate: this.fb.nonNullable.control<boolean>(false),
	});

	ngOnInit(): void {
		if (this.featureToggleService.config) {
			this.form.patchValue(this.featureToggleService.config);
		}
	}

	save(): void {
		this.featureToggleService.setConfig({ ...this.featureToggleService.config, ...this.form.value });
		this.router.navigate([RootRoutes.ROOT]);
	}

	cancel(): void {
		this.router.navigate([RootRoutes.ROOT]);
	}
}
