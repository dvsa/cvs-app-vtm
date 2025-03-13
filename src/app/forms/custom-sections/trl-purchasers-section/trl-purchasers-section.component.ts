import { Component, input } from '@angular/core';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
	selector: 'app-trl-purchasers-section',
	templateUrl: './trl-purchasers-section.component.html',
	styleUrls: ['./trl-purchasers-section.component.scss'],
})
export class TRLPurchasersSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
