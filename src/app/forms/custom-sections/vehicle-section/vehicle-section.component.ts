import { Component, input } from '@angular/core';

@Component({
	selector: 'app-vehicle-section',
	templateUrl: './vehicle-section.component.html',
	styleUrls: ['./vehicle-section.component.scss'],
})
export class VehicleSectionComponent {
	mode = input<Mode>('edit');
}

type Mode = 'view' | 'edit' | 'summary';
