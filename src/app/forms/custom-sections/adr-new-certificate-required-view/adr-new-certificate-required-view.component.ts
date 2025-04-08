import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';

import { DefaultNullOrEmpty } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

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
	imports: [DefaultNullOrEmpty],
})
export class AdrNewCertificateRequiredViewComponent extends BaseControlComponent {}
