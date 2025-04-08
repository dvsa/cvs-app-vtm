import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[appPrefix]' })
export class PrefixDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
