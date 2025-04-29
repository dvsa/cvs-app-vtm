import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, input } from '@angular/core';
import { LettersSectionEditComponent } from '@forms/custom-sections/letters-section/letters-section-edit/letters-section-edit.component';
import { LettersSectionViewComponent } from '@forms/custom-sections/letters-section/letters-section-view/letters-section-view.component';

@Component({
	selector: 'app-letters-section',
	templateUrl: './letters-section.component.html',
	styleUrls: ['./letters-section.component.scss'],
	imports: [LettersSectionViewComponent, LettersSectionEditComponent],
})
export class LettersSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit';

// templateUrl: './letters-section.component.html',
