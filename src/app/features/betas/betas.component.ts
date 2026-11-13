import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { RootRoutes } from '@models/routes.enum';
import { Store } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { selectFeatureFlags } from '@store/feature-flags/feature-flags.selectors';
import { updateFeatureFlags } from '../../store/feature-flags/feature-flags.actions';
import { FeatureFlags, isFeatureFlag } from '../../store/feature-flags/feature-flags.feature';

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

	blocklist: FeatureFlags[] = [FeatureFlags.TEST_FACILITY, FeatureFlags.TEST_FACILITY_AS_OBJECT];

	form = this.fb.nonNullable.record<FormGroup<{ enabled: FormControl<boolean> }>>({});

	ngOnInit(): void {
		const featureFlags = this.featureFlags();
		if (featureFlags) {
			for (const key of Object.keys(featureFlags)) {
				if (!isFeatureFlag(key) || this.blocklist.includes(key)) continue;
				const flag = featureFlags[key];
				if (!flag) continue;
				this.form.addControl(key, this.fb.nonNullable.group({ enabled: flag.enabled }), { emitEvent: false });
			}
		}
	}

	save(): void {
		this.store.dispatch(updateFeatureFlags({ changes: this.form.getRawValue() }));
		this.router.navigate([RootRoutes.ROOT]);
	}

	cancel(): void {
		this.router.navigate([RootRoutes.ROOT]);
	}
}
