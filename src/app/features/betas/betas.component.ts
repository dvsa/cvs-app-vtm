import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { RootRoutes } from '@models/routes.enum';
import { FeatureConfig, FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';

@Component({
	selector: 'app-betas',
	templateUrl: './betas.component.html',
	imports: [
		GovukFormGroupCheckboxComponent,
		FormsModule,
		ReactiveFormsModule,
		ButtonGroupComponent,
		ButtonComponent,
		KeyValuePipe,
	],
})
export class BetasComponent implements OnInit {
	fb = inject(FormBuilder);
	route = inject(ActivatedRoute);
	router = inject(Router);
	featureToggleService = inject(FeatureToggleService);

	blocklist = ['test-facility', 'test-facility-as-object']; // List of feature toggles to exclude from the UI

	form = this.fb.group<any>({});

	ngOnInit(): void {
		if (this.featureToggleService.config()) {
			for (const [key, { enabled }] of Object.entries(this.featureToggleService.config() ?? {})) {
				if (this.blocklist.includes(key)) continue;
				this.form.addControl(
					key,
					this.fb.group({ enabled: this.fb.nonNullable.control(enabled) }) as unknown as FormControl,
					{ emitEvent: false }
				);
			}
		}
	}

	save(): void {
		this.featureToggleService.setConfig({ ...this.featureToggleService.config(), ...this.form.value } as FeatureConfig);
		this.router.navigate([RootRoutes.ROOT]);
	}

	cancel(): void {
		this.router.navigate([RootRoutes.ROOT]);
	}
}
