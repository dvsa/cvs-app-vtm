import { Component, input } from '@angular/core';
import { ManufacturerSectionEditComponent } from '@forms/custom-sections/manufacturer-section/manufacturer-section-edit/manufacturer-section-edit.component';
import { ManufacturerSectionSummaryComponent } from '@forms/custom-sections/manufacturer-section/manufacturer-section-summary/manufacturer-section-summary.component';
import { ManufacturerSectionViewComponent } from '@forms/custom-sections/manufacturer-section/manufacturer-section-view/manufacturer-section-view.component';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
	selector: 'app-manufacturer-section',
	templateUrl: './manufacturer-section.component.html',
	styleUrls: ['./manufacturer-section.component.scss'],
	imports: [ManufacturerSectionEditComponent, ManufacturerSectionSummaryComponent, ManufacturerSectionViewComponent],
})
export class ManufacturerSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
