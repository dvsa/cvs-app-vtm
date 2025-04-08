import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, input } from '@angular/core';

import { NotesSectionEditComponent } from './notes-section-edit/notes-section-edit.component';
import { NotesSectionSummaryComponent } from './notes-section-summary/notes-section-summary.component';
import { NotesSectionViewComponent } from './notes-section-view/notes-section-view.component';

@Component({
	selector: 'app-notes-section',
	templateUrl: './notes-section.component.html',
	styleUrls: ['./notes-section.component.scss'],
	imports: [NotesSectionViewComponent, NotesSectionEditComponent, NotesSectionSummaryComponent],
})
export class NotesSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
