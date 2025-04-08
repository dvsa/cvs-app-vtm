import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';

import { DefaultNullOrEmpty } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-adr-tank-details-m145-view',
	templateUrl: './adr-tank-details-m145-view.component.html',
	styleUrls: ['./adr-tank-details-m145-view.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: AdrTankDetailsM145ViewComponent,
			multi: true,
		},
	],
	imports: [DefaultNullOrEmpty],
})
export class AdrTankDetailsM145ViewComponent extends BaseControlComponent {}
