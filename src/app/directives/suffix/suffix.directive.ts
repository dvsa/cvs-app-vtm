import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({ selector: '[appSuffix]' })
export class SuffixDirective {
	templateRef = inject(TemplateRef);
}
