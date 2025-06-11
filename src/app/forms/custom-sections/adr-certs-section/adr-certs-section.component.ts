import { Component, input } from '@angular/core';
import { AdrCertsSectionEditComponent } from '@forms/custom-sections/adr-certs-section/adr-certs-section-edit/adr-certs-section-edit.component';
import { AdrCertsSectionViewComponent } from '@forms/custom-sections/adr-certs-section/adr-certs-section-view/adr-certs-section-view.component';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
	selector: 'app-adr-certs-section',
	templateUrl: './adr-certs-section.component.html',
	styleUrls: ['./adr-certs-section.component.scss'],
	imports: [AdrCertsSectionEditComponent, AdrCertsSectionViewComponent],
})
export class AdrCertsSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit';
