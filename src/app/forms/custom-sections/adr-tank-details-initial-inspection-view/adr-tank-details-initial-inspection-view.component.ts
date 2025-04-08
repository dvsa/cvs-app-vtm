import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { DefaultNullOrEmpty } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-adr-tank-details-initial-inspection-view',
	templateUrl: './adr-tank-details-initial-inspection-view.component.html',
	styleUrls: ['./adr-tank-details-initial-inspection-view.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class AdrTankDetailsInitialInspectionViewComponent extends BaseControlComponent {}
