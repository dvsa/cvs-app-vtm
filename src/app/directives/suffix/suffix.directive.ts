import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[appSuffix]' })
export class SuffixDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
