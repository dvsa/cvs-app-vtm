import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';

@Directive({ selector: '[featureToggleName]' })
export class FeatureToggleDirective implements OnInit {
	@Input() featureToggleName!: string;

	constructor(
		private templateRef: TemplateRef<HTMLElement>,
		private featureToggleService: FeatureToggleService,
		private viewContainer: ViewContainerRef
	) {}

	ngOnInit() {
		const isEnabled = this.featureToggleService.isFeatureEnabled(this.featureToggleName);
		if (isEnabled) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		}
	}
}
