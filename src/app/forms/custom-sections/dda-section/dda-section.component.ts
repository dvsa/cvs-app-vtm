import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DDASectionEditComponent } from '@forms/custom-sections/dda-section/dda-section-edit/dda-section-edit.component';
import { DDASectionSummaryComponent } from '@forms/custom-sections/dda-section/dda-section-summary/dda-section-summary.component';
import { DDASectionViewComponent } from '@forms/custom-sections/dda-section/dda-section-view/dda-section-view.component';

@Component({
	selector: 'app-dda-section',
	templateUrl: './dda-section.component.html',
	styleUrls: ['./dda-section.component.scss'],
	imports: [DDASectionViewComponent, DDASectionEditComponent, DDASectionSummaryComponent],
})
export class DDASectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'psv' | 'trl'>>();
}

type Mode = 'view' | 'edit' | 'summary';
