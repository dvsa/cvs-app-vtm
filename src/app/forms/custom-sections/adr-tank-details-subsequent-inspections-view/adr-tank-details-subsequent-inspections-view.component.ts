import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { DefaultNullOrEmpty } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-adr-tank-details-subsequent-inspections-view',
	templateUrl: './adr-tank-details-subsequent-inspections-view.component.html',
	styleUrls: ['./adr-tank-details-subsequent-inspections-view.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: AdrTankDetailsSubsequentInspectionsViewComponent,
			multi: true,
		},
	],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class AdrTankDetailsSubsequentInspectionsViewComponent extends BaseControlComponent {}
