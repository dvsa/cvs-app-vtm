import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { RootRoutes } from '@models/routes.enum';
import { Store } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { selectFeatureFlags } from '@store/feature-flags/feature-flags.selectors';
import { updateFeatureFlags } from '../../store/feature-flags/feature-flags.actions';
import { FeatureConfig } from '../../store/feature-flags/feature-flags.feature';

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
	store = inject(Store);
	featureToggleService = inject(FeatureToggleService);
	featureFlags = this.store.selectSignal(selectFeatureFlags);

	blocklist = ['test-facility', 'test-facility-as-object']; // List of feature toggles to exclude from the UI

	form = this.fb.nonNullable.group<Partial<FeatureConfig>>({});

	ngOnInit(): void {
		const featureFlags = this.featureFlags();
		if (featureFlags) {
			for (const [key, { enabled }] of Object.entries(featureFlags ?? {})) {
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
		this.store.dispatch(updateFeatureFlags({ changes: this.form.value }));
		this.router.navigate([RootRoutes.ROOT]);
	}

	cancel(): void {
		this.router.navigate([RootRoutes.ROOT]);
	}
}
