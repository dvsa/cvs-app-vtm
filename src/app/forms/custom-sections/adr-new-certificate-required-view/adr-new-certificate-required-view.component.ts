import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';

@Component({
	selector: 'app-adr-new-certificate-required-view',
	templateUrl: './adr-new-certificate-required-view.component.html',
	styleUrl: './adr-new-certificate-required-view.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: AdrNewCertificateRequiredViewComponent,
			multi: true,
		},
	],
})
export class AdrNewCertificateRequiredViewComponent extends BaseControlComponent {}
