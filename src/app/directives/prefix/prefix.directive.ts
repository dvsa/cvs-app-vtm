import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({ selector: '[appPrefix]' })
export class PrefixDirective {
	templateRef = inject(TemplateRef);
}
