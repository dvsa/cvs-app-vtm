import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { selectFeatureFlags } from '@store/feature-flags/feature-flags.selectors';

@Directive({ selector: '[featureToggleName]' })
export class FeatureToggleDirective {
	store = inject(Store);
	templateRef = inject(TemplateRef<HTMLElement>);
	featureToggleService = inject(FeatureToggleService);
	viewContainer = inject(ViewContainerRef);

	readonly featureToggleName = input.required<string>();

	featureFlags = this.store.selectSignal(selectFeatureFlags);

	constructor() {
		effect(() => {
			this.viewContainer.clear();

			if (this.featureFlags()) {
				const isEnabled = this.featureToggleService.isFeatureEnabled(this.featureToggleName());
				if (isEnabled) {
					this.viewContainer.createEmbeddedView(this.templateRef);
				}
			}
		});
	}
}
