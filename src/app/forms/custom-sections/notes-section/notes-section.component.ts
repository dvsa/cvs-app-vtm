import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, input } from '@angular/core';

@Component({
	selector: 'app-notes-section',
	templateUrl: './notes-section.component.html',
	styleUrls: ['./notes-section.component.scss'],
})
export class NotesSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
