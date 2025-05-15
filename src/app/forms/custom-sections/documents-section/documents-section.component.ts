import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DocumentsSectionEditComponent } from '@forms/custom-sections/documents-section/documents-section-edit/documents-section-edit.component';
import { DocumentsSectionSummaryComponent } from '@forms/custom-sections/documents-section/documents-section-summary/documents-section-summary.component';
import { DocumentsSectionViewComponent } from '@forms/custom-sections/documents-section/documents-section-view/documents-section-view.component';

@Component({
	selector: 'app-documents-section',
	templateUrl: './documents-section.component.html',
	styleUrls: ['./documents-section.component.scss'],
	imports: [DocumentsSectionViewComponent, DocumentsSectionEditComponent, DocumentsSectionSummaryComponent],
})
export class DocumentsSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'psv' | 'trl'>>();
}

type Mode = 'view' | 'edit' | 'summary';
