import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';

@Directive({ selector: '[featureToggleName]' })
export class FeatureToggleDirective {
	templateRef = inject(TemplateRef<HTMLElement>);
	featureToggleService = inject(FeatureToggleService);
	viewContainer = inject(ViewContainerRef);

	readonly featureToggleName = input.required<string>();

	constructor() {
		effect(() => {
			const config = this.featureToggleService.config();
			if (config) {
				const isEnabled = this.featureToggleService.isFeatureEnabled(this.featureToggleName());
				if (isEnabled) {
					this.viewContainer.createEmbeddedView(this.templateRef);
				} else {
					this.viewContainer.clear();
				}
			}
		});
	}
}
