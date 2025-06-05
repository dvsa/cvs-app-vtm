import { Directive, OnInit, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';

@Directive({ selector: '[featureToggleName]' })
export class FeatureToggleDirective implements OnInit {
	templateRef = inject(TemplateRef<HTMLElement>);
	featureToggleService = inject(FeatureToggleService);
	viewContainer = inject(ViewContainerRef);

	readonly featureToggleName = input.required<string>();

	ngOnInit() {
		const isEnabled = this.featureToggleService.isFeatureEnabled(this.featureToggleName());
		if (isEnabled) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		}
	}
}
